"use client";
import sendMsg from "@/src/app/create-course/action";
import CreateCourse from "./CreateCourse";

export default function CreateCoursePageSub() {
  return <CreateCourse onSend={sendMsg} />;
}
