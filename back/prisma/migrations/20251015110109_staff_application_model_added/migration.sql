-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('pending', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "public"."session" ADD COLUMN     "impersonatedBy" TEXT;

-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "banExpires" TIMESTAMP(3),
ADD COLUMN     "banReason" TEXT,
ADD COLUMN     "banned" BOOLEAN DEFAULT false;

-- CreateTable
CREATE TABLE "public"."StaffApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "public"."Status" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rejectedAt" TIMESTAMP(3)
);

-- CreateIndex
CREATE UNIQUE INDEX "StaffApplication_userId_key" ON "public"."StaffApplication"("userId");

-- AddForeignKey
ALTER TABLE "public"."StaffApplication" ADD CONSTRAINT "StaffApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
