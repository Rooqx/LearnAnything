//Function to update the session (accessToken)

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { decrypt, encrypt } from "@/src/server/utils/session";
import axios from "axios";
import { env } from "@/src/lib/config";

export async function POST() {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get("session")?.value;

  if (!sessionValue)
    return NextResponse.json({ error: "No session" }, { status: 401 });

  //  Get the Old Session (contains the Refresh Token)
  const session = await decrypt(sessionValue);

  try {
    //  Ask backend for the NEW Access Token
    const { data: newTokens } = await axios.post(
      `${env.BACKEND_API_URL}/auth/refresh`,
      {},
      { headers: { Cookie: `refresh_token=${session.refreshToken}` } },
    );
    console.log("newTokens", newTokens);
    // HERE IS THE UPDATE LOGIC

    // 3. Create a NEW session object
    // We keep the old user info, but SWAP the access token
    const newSessionPayload = {
      ...session, // Keep name, email, id, etc.
      accessToken: newTokens.access_token, // 👈 THE SWAP HAPPENS HERE
      refreshToken: session.refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Extend life
    };

    // 4. Encrypt it back into a string
    const newSessionString = await encrypt(newSessionPayload);

    // 5. OVERWRITE the old cookie in the browser
    cookieStore.set("session", newSessionString, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Refresh failed" }, { status: 401 });
  }
}
