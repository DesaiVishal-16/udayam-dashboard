"use client";

import { CourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";
import { EnrolledCourseType } from "@/app/data/user/get-enrolled-courses";
import { useMemo } from "react";

interface courseProgressProps {
  courseData: CourseSidebarDataType["course"] | EnrolledCourseType["Course"];
}
interface CourseProgressResult {
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
}
export function CourseProgress({
  courseData,
}: courseProgressProps): CourseProgressResult {
  return useMemo(() => {
    let totalLessons = 0;
    let completedLessons = 0;

    courseData.chapters.forEach((chapter) => {
      chapter.lessons.forEach((lesson) => {
        totalLessons++;

        const isCompleted = lesson.lessonProgress.some(
          (progress) => progress.lessonId && progress.completed,
        );
        if (isCompleted) {
          completedLessons++;
        }
      });
    });
    const progressPercentage =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;
    return {
      totalLessons,
      completedLessons,
      progressPercentage,
    };
  }, [courseData]);
}
