"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Suspense } from "react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const courseName = searchParams.get("courseName");
  const courseSlug = searchParams.get("courseSlug");

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Payment Successful
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          You have successfully enrolled in this course. To see your enrolled
          courses, click below.
        </p>

        {courseName && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Course: <span className="font-medium">{courseName}</span>
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={courseSlug ? `/dashboard/${courseSlug}` : "/dashboard"}
            className={buttonVariants({ variant: "default" })}
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
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

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
