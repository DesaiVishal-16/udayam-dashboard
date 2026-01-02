import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { courseId, userId } = await req.json();

    // Fetch course details
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: course.price * 100, // Amount in paise (multiply by 100)
      currency: "INR",
      receipt: `rcpt_${courseId.slice(-8)}_${Date.now().toString(36)}`,
      notes: {
        courseId,
        userId,
        courseTitle: course.title,
      },
    });

    // Create enrollment with Pending status
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        amount: course.price,
        status: "Pending",
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      enrollmentId: enrollment.id,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}
