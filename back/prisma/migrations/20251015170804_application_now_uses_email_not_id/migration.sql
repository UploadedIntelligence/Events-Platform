/*
  Warnings:

  - You are about to drop the column `userId` on the `StaffApplication` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userEmail]` on the table `StaffApplication` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userEmail` to the `StaffApplication` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."StaffApplication" DROP CONSTRAINT "StaffApplication_userId_fkey";

-- DropIndex
DROP INDEX "public"."StaffApplication_userId_key";

-- AlterTable
ALTER TABLE "public"."StaffApplication" DROP COLUMN "userId",
ADD COLUMN     "userEmail" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "StaffApplication_userEmail_key" ON "public"."StaffApplication"("userEmail");

-- AddForeignKey
ALTER TABLE "public"."StaffApplication" ADD CONSTRAINT "StaffApplication_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "public"."user"("email") ON DELETE CASCADE ON UPDATE CASCADE;
