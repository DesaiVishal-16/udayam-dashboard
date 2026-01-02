"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, ArrowLeft, RefreshCcw } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Suspense } from "react";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") || "cancelled";
  const courseSlug = searchParams.get("courseSlug");
  const courseName = searchParams.get("courseName");

  const isCancelled = reason === "cancelled";

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {isCancelled ? "Payment Cancelled" : "Payment Failed"}
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {isCancelled
            ? "You cancelled the payment process. No charges were made to your account."
            : "We encountered an issue while processing your payment. Please try again or contact support if the problem persists."}
        </p>

        {courseName && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Course: <span className="font-medium">{courseName}</span>
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {courseSlug ? (
            <Link
              href={`/courses/${courseSlug}`}
              className={buttonVariants({ variant: "default" })}
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Try Again
            </Link>
          ) : (
            <Link
              href="/courses"
              className={buttonVariants({ variant: "default" })}
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Browse Courses
            </Link>
          )}
          <Link
            href="/"
            className={buttonVariants({ variant: "outline" })}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Home
          </Link>
        </div>

        <p className="mt-8 text-xs text-gray-400 dark:text-gray-500">
          Need help? Contact us at{" "}
          <a
            href="mailto:support@udayam.co.in"
            className="text-blue-500 hover:underline"
          >
            support@udayam.co.in
          </a>
        </p>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      }
    >
      <PaymentFailedContent />
    </Suspense>
  );
}
