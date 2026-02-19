module.exports = [
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/lib/incremental-cache/tags-manifest.external.js [external] (next/dist/server/lib/incremental-cache/tags-manifest.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/tags-manifest.external.js", () => require("next/dist/server/lib/incremental-cache/tags-manifest.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/Desktop/Main_Projects/LearnAnything/src/lib/config.ts [middleware] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * THIS FILE IS JUS FOR TYPE SAFETY AND PREVENT APP FROM BREAKING LATER IF WE FOROT TO ADD ENV SHA
 * ALSO REMEMBERR TO ADD NEW ENV VARIABLES HERE THO
 */ /*
import { z } from "zod";

const envSchema = z.object({
  // Server-side variables (Secret)
  JWT_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 chars"),
  BACKEND_API_URL: z.string().url(),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  // Client-side variables (Public  start with NEXT_PUBLIC_)
  // NEXT_PUBLIC_BACKEND_API_URL: z.string().optional(),
});

//console.log(process.env);
// Validate process.env
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  throw new Error("Invalid environment variables");
}

export const env = _env.data;
 */ }),
"[project]/Desktop/Main_Projects/LearnAnything/src/server/utils/session.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createSession",
    ()=>createSession,
    "decrypt",
    ()=>decrypt,
    "deleteSession",
    ()=>deleteSession,
    "encrypt",
    ()=>encrypt
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Main_Projects$2f$LearnAnything$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Main_Projects/LearnAnything/node_modules/.pnpm/next@16.1.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/server-only/empty.js [middleware] (ecmascript)"); // 🛡️ Security: Build fails if this is imported in client
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Main_Projects$2f$LearnAnything$2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$3$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Main_Projects/LearnAnything/node_modules/.pnpm/jose@6.1.3/node_modules/jose/dist/webapi/jwt/sign.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Main_Projects$2f$LearnAnything$2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$3$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Main_Projects/LearnAnything/node_modules/.pnpm/jose@6.1.3/node_modules/jose/dist/webapi/jwt/verify.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Main_Projects$2f$LearnAnything$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Main_Projects/LearnAnything/node_modules/.pnpm/next@16.1.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/headers.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Main_Projects$2f$LearnAnything$2f$src$2f$lib$2f$config$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Main_Projects/LearnAnything/src/lib/config.ts [middleware] (ecmascript)"); // Our type-safe env
;
;
;
;
const secretKey = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Main_Projects$2f$LearnAnything$2f$src$2f$lib$2f$config$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["env"].JWT_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);
async function encrypt(payload) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Main_Projects$2f$LearnAnything$2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$3$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SignJWT"](payload).setProtectedHeader({
        alg: "HS256"
    }).setIssuedAt().setExpirationTime("1d") // Match your backend token expiry
    .sign(encodedKey);
}
async function decrypt(session = "") {
    try {
        const { payload } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Main_Projects$2f$LearnAnything$2f$node_modules$2f2e$pnpm$2f$jose$40$6$2e$1$2e$3$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jwtVerify"])(session, encodedKey, {
            algorithms: [
                "HS256"
            ]
        });
        return payload;
    } catch (error) {
        return null;
    }
}
async function createSession(accessToken, refreshToken) {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
    const token = await encrypt({
        accessToken,
        refreshToken,
        expiresAt
    });
    (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Main_Projects$2f$LearnAnything$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["cookies"])()).set("session", token, {
        httpOnly: true,
        secure: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Main_Projects$2f$LearnAnything$2f$src$2f$lib$2f$config$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["env"].NODE_ENV === "production",
        expires: expiresAt,
        sameSite: "lax",
        path: "/"
    });
}
async function deleteSession() {
    (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Main_Projects$2f$LearnAnything$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["cookies"])()).delete("session");
}
}),
"[project]/Desktop/Main_Projects/LearnAnything/src/proxy.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "default",
    ()=>middleware
]);
//Named this proxy.ts instead of middleware.ts because new nextjs version deprecated middleware.ts  so un name middleware.ts as proxy.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Main_Projects$2f$LearnAnything$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Main_Projects/LearnAnything/node_modules/.pnpm/next@16.1.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/server.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Main_Projects$2f$LearnAnything$2f$src$2f$server$2f$utils$2f$session$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Main_Projects/LearnAnything/src/server/utils/session.ts [middleware] (ecmascript)");
;
;
//  Define protected and public routes
const protectedRoutes = [
    "/dashboard",
    "/profile",
    "/settings"
];
const publicRoutes = [
    "/signin",
    "/signup",
    "/"
];
async function middleware(req) {
    //  Check if the current route is protected
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.some((route)=>path.startsWith(route));
    const isPublicRoute = publicRoutes.includes(path);
    //  Decrypt the session from the cookie
    const cookie = req.cookies.get("session")?.value;
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Main_Projects$2f$LearnAnything$2f$src$2f$server$2f$utils$2f$session$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["decrypt"])(cookie); // Decrypt the session from the server folder in the src folder
    //  Redirect Logic
    // in case:  User is NOT logged in and tries to access a protected route
    if (isProtectedRoute && !session?.accessToken) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Main_Projects$2f$LearnAnything$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/signin", req.nextUrl));
    }
    // in Case : User IS logged in and tries to access login/register (it optional UX improvement sha)
    if (isPublicRoute && session?.accessToken && path !== "/") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Main_Projects$2f$LearnAnything$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/dashboard", req.nextUrl));
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Main_Projects$2f$LearnAnything$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|.*\\.png$).*)"
    ]
};
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__dcd98c84._.js.map