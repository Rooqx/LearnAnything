# LearnAnything — Backend Context File
> Read this file completely before writing a single line of code.
> This is your source of truth for every backend decision.

---

## PROJECT OVERVIEW

**App:** LearnAnything — AI-powered learning hub
**Type:** Full-stack Next.js application
**Goal:** Users generate AI-powered courses via chat, consume them in
a gamified learning interface, and are rewarded with XP, streaks, and badges.

---

## TECH STACK — BACKEND

| Concern | Technology |
|---|---|
| Framework | Next.js 14+ — App Router |
| Language | TypeScript — strict mode, `any` is forbidden everywhere |
| Database | Neon PostgreSQL (serverless Postgres) |
| ORM | Prisma — schema-first, fully typed |
| Auth | NextAuth v5 (Auth.js) — sessions stored in Neon via Prisma adapter |
| Payments | Paystack — hybrid credit + subscription model |
| HTTP Client | Axios — centralized instance with interceptors |
| Course Generation | n8n self-hosted — standard POST via axios to webhook URL |
| Deployment | Vercel |
| Real-time | Polling only for now — no websockets |

---

## CRITICAL RULES — NON-NEGOTIABLE

1. **Read this file completely before doing anything.**
2. **Check what already exists** before creating any file or folder.
   Never duplicate or overwrite existing code without explicit instruction.
3. **One task at a time** — unless explicitly told otherwise.
4. **Always update `prisma/schema.prisma` first** before writing any
   logic that touches a new or modified database table.
   After schema changes always remind to run:
   `npx prisma migrate dev --name [migration-name]`
   `npx prisma generate`
5. **Never hardcode secrets** — all keys, URLs, and credentials live
   in `.env.local` only. Reference via `process.env.VARIABLE_NAME`.
6. **TypeScript strict mode** — every function, parameter, return type,
   and interface must be explicitly typed. `any` is strictly forbidden.
   Use `unknown` with type guards if the type is truly uncertain.
7. **All output must be complete** — never truncate or produce partial
   files. If a file is long, split cleanly at a logical boundary and
   continue. Never output placeholder comments like `// rest of code here`.
8. **Comment everything non-obvious** — every function gets a JSDoc
   comment explaining what it does, its parameters, return value,
   and any important edge cases or security considerations.
9. **Consistent error handling** — always use the centralized error
   handler pattern defined in this file. Never inconsistent try/catch.
10. **Security first** — follow every security rule defined in this file.
    No exceptions, no shortcuts.

---

## FOLDER STRUCTURE — BACKEND FILES

```
src/
├── app/
│   ├── api/                          # All Route Handlers live here
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts          # NextAuth v5 handler
│   │   ├── courses/
│   │   │   ├── route.ts              # GET all courses, POST create course
│   │   │   └── [courseId]/
│   │   │       ├── route.ts          # GET, PATCH, DELETE single course
│   │   │       └── progress/
│   │   │           └── route.ts      # GET, PATCH course progress
│   │   ├── modules/
│   │   │   ├── route.ts
│   │   │   └── [moduleId]/
│   │   │       └── route.ts
│   │   ├── chapters/
│   │   │   └── [chapterId]/
│   │   │       └── route.ts
│   │   ├── quiz/
│   │   │   └── route.ts              # POST submit quiz attempt
│   │   ├── user/
│   │   │   ├── route.ts              # GET, PATCH user profile
│   │   │   ├── xp/route.ts           # POST award XP
│   │   │   ├── streak/route.ts       # GET, POST update streak
│   │   │   ├── badges/route.ts       # GET user badges
│   │   │   └── daily-goal/route.ts   # GET, PATCH daily goal
│   │   ├── leaderboard/
│   │   │   └── route.ts              # GET weekly leaderboard
│   │   ├── achievements/
│   │   │   └── route.ts              # GET all badges (earned + locked)
│   │   ├── generate/
│   │   │   └── route.ts              # POST trigger n8n course generation
│   │   └── payments/
│   │       ├── initialize/route.ts   # POST initialize Paystack payment
│   │       ├── verify/route.ts       # GET verify Paystack payment
│   │       ├── webhook/route.ts      # POST Paystack webhook handler
│   │       ├── subscription/
│   │       │   └── route.ts          # POST create subscription
│   │       └── credits/
│   │           └── route.ts          # GET credit balance
│
├── lib/
│   ├── axios.ts                      # Centralized axios instance + interceptors
│   ├── prisma.ts                     # Prisma client singleton
│   ├── auth.ts                       # NextAuth v5 config
│   ├── paystack.ts                   # Paystack utility functions
│   ├── n8n.ts                        # n8n axios call wrapper
│   ├── errors.ts                     # Centralized error classes and handler
│   ├── api-response.ts               # Standardized API response helpers
│   └── validators/                   # Zod validation schemas
│       ├── course.schema.ts
│       ├── user.schema.ts
│       ├── quiz.schema.ts
│       └── payment.schema.ts
│
├── middleware.ts                      # NextAuth route protection middleware
│
└── types/
    ├── next-auth.d.ts                 # NextAuth session type extensions
    └── api.ts                         # Shared API response types
```

---

## DATABASE SCHEMA

### Existing Tables — DO NOT MODIFY STRUCTURE, only extend
```prisma
// Courses — already exists
model Course {
  id          BigInt    @id @default(autoincrement())
  createdAt   DateTime  @default(now()) @map("created_at")
  title       String    @db.VarChar(255)
  description String?   @db.Text
  modules     Module[]
  // Extended fields added by backend work:
  userId      String    @map("user_id")   // Link to User
  mode        String    @db.VarChar(20)   // 'beginner' | 'simplified' | 'quick'
  status      String    @default("in_progress") @db.VarChar(20)
  completedAt DateTime? @map("completed_at")
  user        User      @relation(fields: [userId], references: [id])
  progress    CourseProgress?

  @@map("courses")
}

// Modules — already exists
model Module {
  id         BigInt    @id @default(autoincrement())
  courseId   BigInt    @map("course_id")
  title      String    @db.VarChar(255)
  sortNo     Int       @map("sort_no")
  youtubeUrl String?   @map("youtube_url") @db.Text
  createdAt  DateTime  @default(now()) @map("created_at")
  updatedAt  DateTime  @updatedAt @map("updated_at")
  deletedAt  DateTime? @map("deleted_at")
  course     Course    @relation(fields: [courseId], references: [id], onDelete: Cascade)
  chapters   Chapter[]
  quizAttempts QuizAttempt[]

  @@map("modules")
}

// Chapters — already exists
model Chapter {
  id        BigInt   @id @default(autoincrement())
  moduleId  BigInt   @map("module_id")
  title     String   @db.VarChar(255)
  content   String?  @db.Text
  sortNo    Int      @map("sort_no")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  module    Module   @relation(fields: [moduleId], references: [id], onDelete: Cascade)

  @@map("chapters")
}
```

### New Tables — To Be Added
```prisma
// Users — managed by NextAuth Prisma adapter + extended fields
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime? @map("email_verified")
  image         String?
  displayName   String?   @map("display_name") @db.VarChar(24)
  bio           String?   @db.Text
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  // Relations
  accounts       Account[]
  sessions       Session[]
  courses        Course[]
  xpTransactions XpTransaction[]
  streak         Streak?
  userBadges     UserBadge[]
  quizAttempts   QuizAttempt[]
  dailyGoal      DailyGoal?
  creditBalance  CreditBalance?
  creditTxns     CreditTransaction[]
  subscription   Subscription?
  courseProgress CourseProgress[]
  interests      String[]  // Array of selected interest topics

  @@map("users")
}

// NextAuth required tables
model Account {
  id                String  @id @default(cuid())
  userId            String  @map("user_id")
  type              String
  provider          String
  providerAccountId String  @map("provider_account_id")
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique @map("session_token")
  userId       String   @map("user_id")
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}

// XP System — store every transaction, never just a total
// Total XP is always computed as SUM of all transactions
model XpTransaction {
  id        String   @id @default(cuid())
  userId    String   @map("user_id")
  amount    Int      // XP amount earned (always positive)
  reason    String   @db.VarChar(50) // 'module_complete' | 'quiz_pass' | 'course_complete' | 'streak'
  courseId  BigInt?  @map("course_id")
  createdAt DateTime @default(now()) @map("created_at")
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("xp_transactions")
}

// Streaks
model Streak {
  id             String   @id @default(cuid())
  userId         String   @unique @map("user_id")
  currentStreak  Int      @default(0) @map("current_streak")
  longestStreak  Int      @default(0) @map("longest_streak")
  lastActivityAt DateTime @map("last_activity_at")
  updatedAt      DateTime @updatedAt @map("updated_at")
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("streaks")
}

// Badges — seed data, static list of all possible badges
model Badge {
  id          String      @id @default(cuid())
  name        String      @unique @db.VarChar(100)
  description String      @db.Text
  icon        String      @db.VarChar(50) // lucide icon name
  condition   String      @db.Text        // Human readable: "Complete 5 courses"
  conditionKey String     @map("condition_key") @db.VarChar(50) // Machine: 'courses_completed_5'
  userBadges  UserBadge[]

  @@map("badges")
}

// User earned badges
model UserBadge {
  id       String   @id @default(cuid())
  userId   String   @map("user_id")
  badgeId  String   @map("badge_id")
  earnedAt DateTime @default(now()) @map("earned_at")
  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  badge    Badge    @relation(fields: [badgeId], references: [id])

  @@unique([userId, badgeId])
  @@map("user_badges")
}

// Quiz Attempts
model QuizAttempt {
  id          String   @id @default(cuid())
  userId      String   @map("user_id")
  moduleId    BigInt   @map("module_id")
  score       Int      // 0–100 percentage
  answers     Json     // Array of { questionId, selectedAnswer, correct }
  attemptedAt DateTime @default(now()) @map("attempted_at")
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  module      Module   @relation(fields: [moduleId], references: [id], onDelete: Cascade)

  @@map("quiz_attempts")
}

// Course Progress
model CourseProgress {
  id                  String   @id @default(cuid())
  userId              String   @map("user_id")
  courseId            BigInt   @map("course_id")
  currentModuleId     BigInt?  @map("current_module_id")
  currentChapterId    BigInt?  @map("current_chapter_id")
  completionPct       Int      @default(0) @map("completion_pct") // 0–100
  lastAccessedAt      DateTime @default(now()) @map("last_accessed_at")
  user                User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  course              Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)

  @@unique([userId, courseId])
  @@map("course_progress")
}

// Daily Goal
model DailyGoal {
  id              String   @id @default(cuid())
  userId          String   @unique @map("user_id")
  goalMinutes     Int      @map("goal_minutes") // 10 | 20 | 30 | 60
  progressMinutes Int      @default(0) @map("progress_minutes")
  date            DateTime @default(now())
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("daily_goals")
}

// Credits — current balance snapshot
// Source of truth is always CreditTransaction sum
// This is a cache for fast reads
model CreditBalance {
  id        String   @id @default(cuid())
  userId    String   @unique @map("user_id")
  balance   Int      @default(0)
  updatedAt DateTime @updatedAt @map("updated_at")
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("credit_balances")
}

// Credit Transactions — every purchase and spend
model CreditTransaction {
  id          String   @id @default(cuid())
  userId      String   @map("user_id")
  amount      Int      // positive = purchase, negative = spend
  type        String   @db.VarChar(20) // 'purchase' | 'spend'
  reference   String?  @db.VarChar(100) // Paystack reference or courseId
  description String?  @db.VarChar(255)
  createdAt   DateTime @default(now()) @map("created_at")
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("credit_transactions")
}

// Subscriptions
model Subscription {
  id                    String    @id @default(cuid())
  userId                String    @unique @map("user_id")
  plan                  String    @db.VarChar(20) // 'basic' | 'pro' | 'premium'
  status                String    @db.VarChar(20) // 'active' | 'cancelled' | 'expired'
  paystackSubCode       String?   @map("paystack_sub_code") @db.VarChar(100)
  paystackCustomerCode  String?   @map("paystack_customer_code") @db.VarChar(100)
  currentPeriodStart    DateTime  @map("current_period_start")
  currentPeriodEnd      DateTime  @map("current_period_end")
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("subscriptions")
}
```

### Leaderboard
```sql
-- Postgres materialized view — refreshed weekly via Vercel cron job
-- Do not create a Prisma model for this — query via prisma.$queryRaw
CREATE MATERIALIZED VIEW weekly_leaderboard AS
SELECT
  u.id AS user_id,
  u.display_name,
  u.image,
  SUM(x.amount) AS weekly_xp,
  RANK() OVER (ORDER BY SUM(x.amount) DESC) AS rank
FROM xp_transactions x
JOIN users u ON u.id = x.user_id
WHERE x.created_at >= date_trunc('week', NOW())
GROUP BY u.id, u.display_name, u.image;

-- Refresh weekly via cron:
REFRESH MATERIALIZED VIEW CONCURRENTLY weekly_leaderboard;
```

---

## AXIOS — CENTRALIZED INSTANCE

All HTTP requests — both internal utilities and n8n calls —
go through the centralized axios instance at `lib/axios.ts`.
Never import axios directly in a route handler.

```typescript
// lib/axios.ts structure (write the full implementation)
// - Base URL from environment variable
// - Request interceptor: attach auth token if available
// - Response interceptor: normalize errors into AppError format
// - Timeout: 30000ms (30 seconds) — matches n8n timeout expectation
// - Content-Type: application/json default header
```

---

## ERROR HANDLING — STANDARD PATTERN

Every Route Handler must follow this exact pattern:
```typescript
// lib/errors.ts defines:
// - AppError class with statusCode, message, code
// - DatabaseError extends AppError
// - ValidationError extends AppError
// - AuthError extends AppError
// - PaymentError extends AppError
// - NotFoundError extends AppError

// lib/api-response.ts defines:
// - successResponse(data, status?) → NextResponse
// - errorResponse(error) → NextResponse
// Catches AppError subclasses and maps to correct HTTP status
// Catches unknown errors and returns 500 with generic message
// Never leaks stack traces or internal details to client

// Every route handler:
export async function GET(request: NextRequest) {
  try {
    // logic here
    return successResponse(data)
  } catch (error) {
    return errorResponse(error)
  }
}
```

---

## AUTHENTICATION — NEXTAUTH V5

```
Config file:        lib/auth.ts
Route handler:      app/api/auth/[...nextauth]/route.ts
Middleware:         middleware.ts — protects all (main) routes
Session strategy:   database (stored in Neon via Prisma adapter)
Providers:          Credentials (email + password) + Google OAuth
Password hashing:   bcryptjs — never store plaintext passwords
Session extension:  next-auth.d.ts extends Session with userId, displayName, xp, level
```

### Protected Routes Pattern
```typescript
// Every Route Handler that requires auth:
import { auth } from '@/lib/auth'

const session = await auth()
if (!session?.user?.id) {
  throw new AuthError('Unauthorized', 401)
}
const userId = session.user.id // always a string, never undefined after this check
```

---

## VALIDATION — ZOD

Every Route Handler validates incoming request body with Zod before
touching the database. Never trust client input.

```typescript
// Pattern:
import { z } from 'zod'
import { ValidationError } from '@/lib/errors'

const schema = z.object({ ... })
const parsed = schema.safeParse(await request.json())
if (!parsed.success) {
  throw new ValidationError(parsed.error.message)
}
const data = parsed.data // fully typed, safe to use
```

---

## N8N INTEGRATION

```typescript
// lib/n8n.ts
// Uses the centralized axios instance — not raw fetch
// Endpoint: process.env.N8N_WEBHOOK_URL
// Method: POST
// Timeout: 30 seconds (handled by axios interceptor)
// Body: { topic: string, mode: string, userId: string }
// On success: returns course structure JSON from n8n
// On timeout: throws AppError with code 'N8N_TIMEOUT'
// On error: throws AppError with code 'N8N_ERROR'
// Never expose n8n URL or internals to the client
```

---

## PAYSTACK INTEGRATION

```typescript
// lib/paystack.ts
// Uses centralized axios instance
// Base URL: https://api.paystack.co
// Auth header: Authorization: Bearer process.env.PAYSTACK_SECRET_KEY

// Key functions to implement:
// initializePayment(email, amount, metadata) → { authorizationUrl, reference }
// verifyPayment(reference) → { status, amount, metadata }
// createSubscription(customerCode, planCode) → { subscriptionCode }
// cancelSubscription(subscriptionCode) → boolean

// Webhook handler (app/api/payments/webhook/route.ts):
// ALWAYS verify Paystack webhook signature before processing
// Use crypto.createHmac('sha512', secret).update(body).digest('hex')
// Compare with x-paystack-signature header
// If mismatch: return 401 immediately, log the attempt
// Events to handle:
//   charge.success     → credit user account or activate subscription
//   subscription.create → update Subscription table
//   subscription.disable → mark subscription cancelled
//   invoice.payment_failed → notify user, mark subscription expired
```

---

## SECURITY RULES — ALWAYS ENFORCE

1. **Never expose internal IDs in URLs where possible** — use cuid() not sequential BigInt for user-facing routes
2. **Always verify resource ownership** — before returning or mutating any resource, verify `userId === session.user.id`
3. **Rate limiting** — add rate limit headers on auth routes and payment routes. Use Vercel's built-in edge rate limiting or `@upstash/ratelimit` if available
4. **SQL injection** — Prisma parameterizes all queries automatically. Never use `prisma.$queryRaw` with string interpolation — always use tagged template literals
5. **Paystack webhooks** — always verify signature. Never process a webhook without verification
6. **Environment variables** — all secrets in `.env.local`. Never in code. Never in comments. `.env.local` is in `.gitignore` always.
7. **CORS** — Next.js Route Handlers are same-origin by default. Do not add permissive CORS headers unless explicitly required
8. **Error messages** — never return stack traces, database errors, or internal details to the client. Log internally, return generic message externally
9. **Password requirements** — minimum 8 chars, bcryptjs rounds: 12
10. **Session tokens** — NextAuth handles rotation automatically. Never manually manage JWT secrets in code

---

## ENVIRONMENT VARIABLES — REQUIRED

```bash
# Database
DATABASE_URL="postgresql://..."            # Neon connection string

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."                      # Generate: openssl rand -base64 32

# Google OAuth (optional but recommended)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Paystack
PAYSTACK_SECRET_KEY="sk_live_..."
PAYSTACK_PUBLIC_KEY="pk_live_..."
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_live_..." # Safe to expose to client

# n8n
N8N_WEBHOOK_URL="https://your-n8n-instance.com/webhook/..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## XP & LEVEL SYSTEM — BUSINESS LOGIC

```
XP Awards:
  Module completed:   +50 XP
  Quiz passed:        +30 XP
  Course completed:   +200 XP
  Streak maintained:  +20 XP per day

Level Thresholds (compute in lib/utils.ts):
  Level 1:    0 XP
  Level 2:    200 XP
  Level 3:    500 XP
  Level 4:    1000 XP
  Level 5:    2000 XP
  Level N:    prev_threshold * 2 (exponential after level 5)

Total XP is always SUM(xp_transactions.amount) for a user.
Never store a running total — always compute from transactions.
CreditBalance is the one exception — it's a cached snapshot for
fast reads, always reconciled against CreditTransaction on write.
```

---

## CREDIT SYSTEM — BUSINESS LOGIC

```
Credit Costs:
  Generate Beginner course:   3 credits
  Generate Simplified course: 2 credits
  Generate Quick course:      1 credit

Credit Bundles (Paystack one-time payments):
  Define in constants — amounts subject to change:
  Bundle 1:  10 credits
  Bundle 2:  25 credits
  Bundle 3:  50 credits
  Bundle 4:  100 credits
  Bundle 5:  200 credits
  (and more up to 10 bundles total)

Always deduct credits atomically:
  1. Check balance >= required credits
  2. Deduct in same Prisma transaction as course creation
  3. If insufficient: throw AppError with code 'INSUFFICIENT_CREDITS'
  Never deduct credits before n8n responds successfully
```

---

## SUBSCRIPTION PLANS — BUSINESS LOGIC

```
Plans (3 tiers):
  Basic:   unlimited Simplified + Quick courses, no Beginner
  Pro:     unlimited all modes, priority generation
  Premium: unlimited all modes, priority generation, early features

Subscription check middleware:
  Before course generation — check if user has active subscription
  OR sufficient credits for the selected mode.
  If neither: return AppError with code 'NO_ACCESS'
```

---

## SOFT DELETES — MODULES ONLY

```
Modules have a deleted_at column.
All module queries must filter: WHERE deleted_at IS NULL
In Prisma: always add { where: { deletedAt: null } } to module queries.
Never hard delete a module — always set deletedAt = new Date()
Chapters are hard deleted via CASCADE when module is hard deleted (admin only)
```

---

## VERCEL CRON JOBS

```
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/refresh-leaderboard",
      "schedule": "0 0 * * 1"  // Every Monday midnight UTC
    },
    {
      "path": "/api/cron/reset-daily-goals",
      "schedule": "0 0 * * *"  // Every day midnight UTC
    },
    {
      "path": "/api/cron/check-streaks",
      "schedule": "0 1 * * *"  // Every day 1am UTC — mark broken streaks
    }
  ]
}

Cron routes are in: app/api/cron/[job]/route.ts
Always verify cron requests with:
  if (request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`)
  throw new AuthError('Unauthorized')
```

---

## PRISMA CLIENT — SINGLETON PATTERN

```typescript
// lib/prisma.ts
// Always use singleton pattern — never instantiate PrismaClient directly in a file
// Prevents connection pool exhaustion in Next.js hot reload dev environment
// globalThis.__prisma is the singleton instance
```

---

## RESPONSE FORMAT — ALWAYS USE THIS SHAPE

```typescript
// Success
{
  success: true,
  data: T,
  message?: string
}

// Error
{
  success: false,
  error: {
    message: string,  // Safe for client — never internal details
    code: string      // Machine readable: 'INSUFFICIENT_CREDITS', 'NOT_FOUND' etc
  }
}
```

