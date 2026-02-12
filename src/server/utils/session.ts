import "server-only"; // 🛡️ Security: Build fails if this is imported in client
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { env } from "@/src/lib/config"; // Our type-safe env

const secretKey = env.JWT_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

type SessionPayload = {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
};

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d") // Match your backend token expiry
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function createSession(accessToken: string, refreshToken: string) {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
  const token = (await encrypt({
    accessToken,
    refreshToken,
    expiresAt,
  })) as string;

  (await cookies()).set("session", token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  (await cookies()).delete("session");
}
