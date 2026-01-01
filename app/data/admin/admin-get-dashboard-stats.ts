import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetDashboardStats() {
  await requireAdmin();
  const [totalsSignups, totalCustomers, totalCourses, totalLessons] =
    await Promise.all([
      //totalsSignups
      prisma.user.count(),
      //totalCustomers
      prisma.user.count({
        where: {
          enrollment: {
            some: {},
          },
        },
      }),
      //totalCourses
      prisma.course.count(),
      //totalLessons
      prisma.lesson.count(),
    ]);
  return {
    totalsSignups,
    totalCustomers,
    totalCourses,
    totalLessons,
  };
}
