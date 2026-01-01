import { z } from "zod";

export const courseLevels = ["Beginner", "Intermediate", "Advance"] as const;
export const courseStatus = ["Draft", "Published", "Archieve"] as const;
export const courseCategories = [
  "AI",
  "App Development",
  "Cybersecurity",
  "Drones",
  "Game Development",
  "Robotics",
  "Web Development",
  "Python",
  "Machine Learning",
] as const;

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title must be at most 100 characters long" }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters long" }),
  fileKey: z.string().min(1, { message: "File is required" }),
  price: z.number().min(1, { message: "Price must be positive number" }),
  duration: z
    .number()
    .min(1, { message: "Duration must be at least 1hr" })
    .max(500, { message: "Duration must be at most 500hr" }),
  level: z.enum(courseLevels, { message: "Level is required" }),
  category: z.enum(courseCategories, { message: "Category is required" }),
  smallDescription: z
    .string()
    .min(3, { message: "Small Description must be at least 3 characters long" })
    .max(200, {
      message: "Small Description must be at most 200 characters long",
    }),
  slug: z
    .string()
    .min(3, { message: "Slug must be at least 3 characters long" }),
  status: z.enum(courseStatus, { message: "Status is required" }),
});

export const chapterSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  courseId: z.uuid({ message: "Invalid course id" }),
});

export const lessonSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  courseId: z.uuid({ message: "Inavlid course id" }),
  chapterId: z.uuid().min(3, { message: "Invalid chapter id" }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters long" })
    .optional(),
  thumbnailKey: z.string().optional(),
  videoKey: z.string().optional(),
});

export type courseSchemaType = z.infer<typeof courseSchema>;
export type chapterSchemaType = z.infer<typeof chapterSchema>;
export type lessonSchemaType = z.infer<typeof lessonSchema>;
