import "server-only";
import axios from "axios";
import { env } from "@/src/lib/utils/config";

const sendMsg = async ({
  sessionID,
  msg,
}: {
  sessionID: string;
  msg: string;
}) => {
  try {
    const resp = await axios.post(
      env.N8N_URL,
      {
        sessionID,
        msg,
      } /*{
          headers: {
            Authorization: `Bearer ${env.N8N_TOKEN}`,
          },
        }*/,
    );
    console.log(resp.data);
  } catch (error) {
    console.error("Failed to send message:", error);
  }
};

export default sendMsg;
