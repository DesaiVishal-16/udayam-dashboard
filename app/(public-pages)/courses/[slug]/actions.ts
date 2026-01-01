// "use server";

// import { requireUser } from "@/app/data/user/require-user";
// import { prisma } from "@/lib/db";
// import { ApiResponse } from "@/lib/types";

// export async function enrollInCourseAction(
//   courseId: string,
// ): Promise<ApiResponse> {
//   const user = await requireUser();
//   try {
//     const course = await prisma.course.findUnique({
//       where: {
//         id: courseId,
//       },
//       select: {
//         id: true,
//         title: true,
//         price: true,
//         slug: true,
//       },
//     });
//     if (!course) {
//       return {
//         status: "error",
//         message: "Course not found",
//       };
//     }
//     let razorpayCustomerId: string;
//     const userWithRazorpayCustomerId = await prisma.user.findUnique({
//       where: {
//         id: user.id,
//       },
//       select: {
//         razorpayCustomerId: true,
//       },
//     });
//     if (userWithRazorpayCustomerId?.razorpayCustomerId) {
//       razorpayCustomerId = userWithRazorpayCustomerId.razorpayCustomerId;
//     }else{

//     }

//   } catch {
//     return {
//       status: "error",
//       message: "Failed to enroll in course",
//     };
//   }
// }
