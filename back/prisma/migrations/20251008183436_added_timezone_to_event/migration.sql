/*
  Warnings:

  - Added the required column `timezone` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Event" ADD COLUMN     "imgUrl" TEXT,
ADD COLUMN     "timezone" TEXT NOT NULL;
