import { requireUser } from "@/app/data/user/require-user";
import { CourseSidebar } from "./CourseSidebar";
import { CourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";

interface WrapperProps {
  course: CourseSidebarDataType["course"];
}
export default async function CourseSidebarWrapper(props: WrapperProps) {
  const user = await requireUser();
  const username = user.name;
  return <CourseSidebar {...props} userName={username} />;
}
