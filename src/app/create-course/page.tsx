import ScoopedFrame from "@/src/components/layout/ScoopedFrame";
import CreateCourse from "@/src/components/dashboard/CreateCourse";
import sendMsg from "./action";

export default function CreateCoursePage() {
  // Inline Server Action — wrapping sendMsg with "use server" makes this
  // function serializable so Next.js can safely pass it as a prop to the
  // CreateCourse Client Component across the server/client boundary.
  async function handleSend(params: { sessionID: string; msg: string }) {
    "use server";
    console.log("parmas", params);
    return sendMsg(params);
  }

  return (
    <ScoopedFrame>
      <CreateCourse onSend={handleSend} />
    </ScoopedFrame>
  );
}
