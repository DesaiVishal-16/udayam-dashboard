"use client";

/* eslint-disable */

import { useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { buttonVariants } from "../ui/button";
import { celebrate } from "@/lib/helpers/celebrate";

interface RazorpayPaymentButtonProps {
  courseId: string;
  userId: string;
  courseName: string;
  amount: number;
  userEmail: string;
  userName: string;
  courseSlug: string;
  isEnrolled?: boolean;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function RazorpayPaymentButton({
  courseId,
  userId,
  courseName,
  amount,
  userEmail,
  userName,
  courseSlug,
  isEnrolled = false
}: RazorpayPaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { triggerConfetti } = celebrate();

  const handlePayment = async () => {
    if (isEnrolled) {
      router.push(`/dashboard/${courseSlug}`);
      return;
    }
    setLoading(true);

    try {
      // Create order
      const orderResponse = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, userId }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.error || "Failed to create order");
      }

      // Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Your Company Name",
        description: courseName,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                enrollmentId: orderData.enrollmentId,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              // Success: Show toast and confetti
              triggerConfetti();
              toast.success("Payment successful! You are now enrolled in the course.", {
                duration: 5000,
              });
              router.push(`/dashboard/${courseSlug}`);
            } else {
              // Verification failed: Redirect to failed page
              router.push(`/payment-failed?reason=failed&courseSlug=${courseSlug}&courseName=${encodeURIComponent(courseName)}`);
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            // Verification error: Redirect to failed page
            router.push(`/payment-failed?reason=failed&courseSlug=${courseSlug}&courseName=${encodeURIComponent(courseName)}`);
          }
        },
        prefill: {
          name: userName,
          email: userEmail,
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            // User cancelled: Redirect to cancelled page
            router.push(`/payment-failed?reason=cancelled&courseSlug=${courseSlug}&courseName=${encodeURIComponent(courseName)}`);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      // Order creation failed: Redirect to failed page
      router.push(`/payment-failed?reason=failed&courseSlug=${courseSlug}&courseName=${encodeURIComponent(courseName)}`);
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <button
        onClick={handlePayment}
        disabled={loading}
        className={buttonVariants({className:"w-full"})}
      >
        {loading ? "Processing..." : isEnrolled ? "Go to Dashboard" : `Enroll Now - ₹${amount}`}
      </button>
    </>
  );
}
