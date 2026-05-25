/*
  Warnings:

  - The primary key for the `chapters` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `courses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `completed_at` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `courses` table. All the data in the column will be lost.
  - The primary key for the `modules` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `course_progress` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[topic_hash]` on the table `courses` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `topic` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topic_hash` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `streaks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "chapters" DROP CONSTRAINT "chapters_module_id_fkey";

-- DropForeignKey
ALTER TABLE "course_progress" DROP CONSTRAINT "course_progress_course_id_fkey";

-- DropForeignKey
ALTER TABLE "course_progress" DROP CONSTRAINT "course_progress_user_id_fkey";

-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_user_id_fkey";

-- DropForeignKey
ALTER TABLE "modules" DROP CONSTRAINT "modules_course_id_fkey";

-- DropForeignKey
ALTER TABLE "quiz_attempts" DROP CONSTRAINT "quiz_attempts_module_id_fkey";

-- DropIndex
DROP INDEX "courses_user_id_idx";

-- AlterTable
ALTER TABLE "chapters" DROP CONSTRAINT "chapters_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "module_id" SET DATA TYPE TEXT,
ALTER COLUMN "content" DROP NOT NULL,
ADD CONSTRAINT "chapters_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "chapters_id_seq";

-- AlterTable
ALTER TABLE "courses" DROP CONSTRAINT "courses_pkey",
DROP COLUMN "completed_at",
DROP COLUMN "status",
DROP COLUMN "user_id",
ADD COLUMN     "topic" VARCHAR(255) NOT NULL,
ADD COLUMN     "topic_hash" VARCHAR(64) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "courses_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "courses_id_seq";

-- AlterTable
ALTER TABLE "daily_goals" ALTER COLUMN "target_minutes" SET DEFAULT 20;

-- AlterTable
ALTER TABLE "modules" DROP CONSTRAINT "modules_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "course_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "modules_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "modules_id_seq";

-- AlterTable
ALTER TABLE "quiz_attempts" ALTER COLUMN "module_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "streaks" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "user_badges" ADD COLUMN     "earned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "xp_transactions" ALTER COLUMN "course_id" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "course_progress";

-- CreateTable
CREATE TABLE "chat_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_id" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollments" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'in_progress',
    "current_module_id" TEXT,
    "current_chapter_id" TEXT,
    "completion_pct" INTEGER NOT NULL DEFAULT 0,
    "enrolled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "last_accessed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chat_sessions_user_id_idx" ON "chat_sessions"("user_id");

-- CreateIndex
CREATE INDEX "chat_sessions_user_id_status_idx" ON "chat_sessions"("user_id", "status");

-- CreateIndex
CREATE INDEX "enrollments_user_id_idx" ON "enrollments"("user_id");

-- CreateIndex
CREATE INDEX "enrollments_course_id_idx" ON "enrollments"("course_id");

-- CreateIndex
CREATE INDEX "enrollments_user_id_status_idx" ON "enrollments"("user_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_user_id_course_id_key" ON "enrollments"("user_id", "course_id");

-- CreateIndex
CREATE UNIQUE INDEX "courses_topic_hash_key" ON "courses"("topic_hash");

-- CreateIndex
CREATE INDEX "courses_mode_idx" ON "courses"("mode");

-- CreateIndex
CREATE INDEX "credit_transactions_user_id_created_at_idx" ON "credit_transactions"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "subscriptions_user_id_status_idx" ON "subscriptions"("user_id", "status");

-- AddForeignKey
ALTER TABLE "modules" ADD CONSTRAINT "modules_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
