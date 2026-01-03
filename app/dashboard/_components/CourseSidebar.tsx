"use client";

import { CourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, Play } from "lucide-react";
import { LessonItem } from "./LessonItem";
import { usePathname } from "next/navigation";
import { CourseProgress } from "@/lib/helpers/course-progress";
import { useState } from "react";
import { CertificateModal } from "./CertificateGenerator";

interface CourseSidebarProps {
  course: CourseSidebarDataType["course"];
  userName: string;
}
export function CourseSidebar({ course, userName }: CourseSidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState<boolean>(false);
  const currentLessonId = pathname.split("/").pop();
  const { completedLessons, totalLessons, progressPercentage } = CourseProgress(
    { courseData: course },
  );
  const isCourseCompleted = completedLessons === totalLessons;
  const isButtonDisabled = !isCourseCompleted || totalLessons === 0;
  return (
    <div className="flex flex-col h-full">
      <div className="pb-4 pr-4 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Play className="size-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-base leading-tight truncate">
              {course.title}
            </h1>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {course.category}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {completedLessons}/{totalLessons} lessons
            </span>
          </div>
          <Progress value={progressPercentage} className="h-1.5" />
          <p className="text-xs text-muted-foreground">
            {progressPercentage}% complete
          </p>
        </div>
      </div>
      <div className="py-4 pr-4 space-y-3">
        {course.chapters.map((chapter, index) => (
          <Collapsible key={chapter.id} defaultOpen={index === 0}>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full p-3 h-auto flex items-center gap-2"
              >
                <div className=" shrink-0">
                  <ChevronDown className="size-4 text-primary" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-semibold text-sm truncate text-foreground">
                    {chapter.position} : {chapter.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {chapter.lessons.length} lessons
                  </p>
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 pl-6 border-l-2 space-y-3">
              {chapter.lessons.map((lesson) => (
                <LessonItem
                  lesson={lesson}
                  key={lesson.id}
                  slug={course.slug}
                  isActive={currentLessonId === lesson.id}
                  completed={
                    lesson.lessonProgress.find(
                      (progress) => progress.lessonId === lesson.id,
                    )?.completed || false
                  }
                />
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
        <Button
          className="w-full mt-4"
          disabled={isButtonDisabled}
          onClick={() => setOpen(true)}
        >
          Generate Certificate
        </Button>

        {!isCourseCompleted && (
          <p className="text-xs text-muted-foreground mt-1 text-center">
            Complete all lessons to unlock certificate
          </p>
        )}
        <CertificateModal
          open={open}
          onClose={() => setOpen(false)}
          userName={userName}
          courseName={course.title}
          courseDuration={course.duration}
        />
      </div>
    </div>
  );
}
