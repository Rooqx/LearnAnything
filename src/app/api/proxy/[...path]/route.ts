import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import { env } from "@/src/lib/config";
import { decrypt } from "@/src/server/utils/session";

// Safe Helper to get Params
async function getPath(context: any) {
  if (!context || !context.params) {
    console.error("Route Context is missing params:", context);
    return null;
  }

  const params = await context.params;
  return params?.path || null;
}

// The "Universal" Proxy Function
// context automatically provided by Next.js from the url e.g http://localhost:3000/api/proxy/resource the context would be resources. basically any thing after "proxy/"
async function handleProxy(req: NextRequest, context: any) {
  //  Safely extract the path
  // path array would split everyting after "proxy/" and make it into an array
  // e.g. http://localhost:3000/api/proxy/accounts/dashboard would be ["accounts", "dashboard"]
  const pathArray = await getPath(context);
  //  console.log("Path Array:", pathArray);

  if (!pathArray) {
    return NextResponse.json(
      { message: "Bad Request: No path parameters found" },
      { status: 400 },
    );
  }

  const pathString = pathArray.join("/");
  const searchParams = req.nextUrl.search;

  // 3. Build the backend URL
  const backendUrl = `${env.BACKEND_API_URL}/${pathString}${searchParams}`;
  console.log(`📡 Proxying to: ${backendUrl}`); // Debug log to see exactly where it's going

  // 4. Get the Access Token
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get("session")?.value;
  let accessToken = "";

  if (sessionValue) {
    const session = await decrypt(sessionValue);
    if (session?.accessToken) {
      accessToken = session.accessToken;
    }
  }

  try {
    // 5. Forward to Python
    const response = await axios({
      method: req.method,
      url: backendUrl,
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
        "Content-Type": "application/json",
      },
      // Safely forward body only if it's not a GET request
      data:
        req.method !== "GET" ? await req.json().catch(() => ({})) : undefined,
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error(
      `❌ Proxy Error [${req.method} /${pathString}]:`,
      error.message,
    );

    // Check if it's a 404 from the Backend vs a 404 from the network
    const status = error.response?.status || 500;
    const data = error.response?.data || { message: "Proxy Request Failed" };

    return NextResponse.json(data, { status });
  }
}

// 6. Export handlers (Pass the whole context)
export async function GET(req: NextRequest, context: any) {
  return handleProxy(req, context);
}
export async function POST(req: NextRequest, context: any) {
  return handleProxy(req, context);
}
export async function PUT(req: NextRequest, context: any) {
  return handleProxy(req, context);
}
export async function DELETE(req: NextRequest, context: any) {
  return handleProxy(req, context);
}
export async function PATCH(req: NextRequest, context: any) {
  return handleProxy(req, context);
}
