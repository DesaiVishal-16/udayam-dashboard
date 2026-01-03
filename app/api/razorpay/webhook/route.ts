/*eslint-disable */
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";

// Validate webhook secret is configured
if (!env.RAZORPAY_WEBHOOK_SECRET) {
  throw new Error("RAZORPAY_WEBHOOK_SECRET is not set in environment variables");
}

// Helper function to verify Razorpay signature
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return expectedSignature === signature;
}

// Helper to get raw body from request
async function getRawBody(req: NextRequest): Promise<string> {
  const chunks: Uint8Array[] = [];
  const reader = req.body?.getReader();

  if (!reader) {
    throw new Error("No request body");
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const buffer = Buffer.concat(chunks);
  return buffer.toString("utf8");
}

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Get raw body for signature verification
    const rawBody = await getRawBody(req);

    // Verify webhook signature
    const webhookSecret = env.RAZORPAY_WEBHOOK_SECRET!;
    const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parse the payload
    const payload = JSON.parse(rawBody);
    const event = payload.event;

    console.log("Received Razorpay webhook:", event);

    // Handle different event types
    switch (event) {
      case "payment.captured":
        await handlePaymentCaptured(payload.payload.payment.entity);
        break;

      case "payment.failed":
        await handlePaymentFailed(payload.payload.payment.entity);
        break;

      case "order.paid":
        await handleOrderPaid(payload.payload.order.entity);
        break;

      case "payment.authorized":
        await handlePaymentAuthorized(payload.payload.payment.entity);
        break;

      case "refund.created":
        await handleRefundCreated(payload.payload.refund.entity);
        break;

      default:
        console.log("Unhandled event type:", event);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}

// Handler for payment.captured event
async function handlePaymentCaptured(payment: any) {
  try {
    const { id, order_id, amount, email } = payment;

    console.log("Payment captured:", {
      paymentId: id,
      orderId: order_id,
      amount,
      email,
    });

    // Extract metadata from order notes
    const notes = payment.notes || {};
    const { userId, courseId } = notes;

    if (!userId || !courseId) {
      console.error("Missing userId or courseId in payment notes");
      return;
    }

    // Use upsert for idempotency - handles both new enrollments and webhook retries
    // First try to update any pending enrollment
    const updatedEnrollment = await prisma.enrollment.updateMany({
      where: {
        userId,
        courseId,
        status: "Pending",
      },
      data: {
        status: "Active",
        updatedAt: new Date(),
      },
    });

    if (updatedEnrollment.count === 0) {
      // Check if an active enrollment already exists (idempotency check)
      const existingActiveEnrollment = await prisma.enrollment.findFirst({
        where: {
          userId,
          courseId,
          status: "Active",
        },
      });

      if (existingActiveEnrollment) {
        console.log("Active enrollment already exists for:", { userId, courseId });
        return; // Already processed, skip
      }

      // No pending or active enrollment found - create new active enrollment
      console.warn("No pending enrollment found, creating new active enrollment for:", { userId, courseId });
      
      await prisma.enrollment.create({
        data: {
          userId,
          courseId,
          amount: amount / 100, // Convert from paise to rupees
          status: "Active",
        },
      });
    }

    console.log("Enrollment activated for user:", userId, "course:", courseId);
  } catch (error) {
    console.error("Error handling payment captured:", error);
    throw error;
  }
}

// Handler for payment.failed event
async function handlePaymentFailed(payment: any) {
  try {
    const { id, order_id, error_description } = payment;

    console.log("Payment failed:", {
      paymentId: id,
      orderId: order_id,
      error: error_description,
    });

    const notes = payment.notes || {};
    const { userId, courseId } = notes;

    if (userId && courseId) {
      // Optionally update enrollment status or log the failure
      await prisma.enrollment.updateMany({
        where: {
          userId,
          courseId,
          status: "Pending",
        },
        data: {
          status: "Cancelled",
          updatedAt: new Date(),
        },
      });
    }
  } catch (error) {
    console.error("Error handling payment failed:", error);
    throw error;
  }
}

// Handler for order.paid event
async function handleOrderPaid(order: any) {
  try {
    const { id, amount, amount_paid, status } = order;

    console.log("Order paid:", {
      orderId: id,
      amount,
      amountPaid: amount_paid,
      status,
    });

    // Additional logic if needed
  } catch (error) {
    console.error("Error handling order paid:", error);
    throw error;
  }
}

// Handler for payment.authorized event
async function handlePaymentAuthorized(payment: any) {
  try {
    const { id, order_id, amount, status } = payment;

    console.log("Payment authorized:", {
      paymentId: id,
      orderId: order_id,
      amount,
      status,
    });

    // Handle authorized payments (auto-capture is typically enabled)
  } catch (error) {
    console.error("Error handling payment authorized:", error);
    throw error;
  }
}

// Handler for refund.created event
async function handleRefundCreated(refund: any) {
  try {
    const { id, payment_id, amount, status } = refund;

    console.log("Refund created:", {
      refundId: id,
      paymentId: payment_id,
      amount,
      status,
    });

    // Find the payment and update enrollment if needed
    // You might want to store payment_id in your enrollment table
    // For now, you could cancel the enrollment or add a refund tracking table
  } catch (error) {
    console.error("Error handling refund created:", error);
    throw error;
  }
}

// Optional: GET method to verify webhook is working
export async function GET() {
  return NextResponse.json({
    message: "Razorpay webhook endpoint is active",
  });
}
