/*
  Warnings:

  - The primary key for the `_EventToUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."_EventToUser" DROP CONSTRAINT "_EventToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."account" DROP CONSTRAINT "account_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."session" DROP CONSTRAINT "session_userId_fkey";

-- AlterTable
ALTER TABLE "public"."_EventToUser" DROP CONSTRAINT "_EventToUser_AB_pkey",
ALTER COLUMN "B" SET DATA TYPE TEXT,
ADD CONSTRAINT "_EventToUser_AB_pkey" PRIMARY KEY ("A", "B");

-- AlterTable
ALTER TABLE "public"."account" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."session" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."user" DROP CONSTRAINT "user_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "password" DROP NOT NULL,
ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "user_id_seq";

-- AddForeignKey
ALTER TABLE "public"."session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_EventToUser" ADD CONSTRAINT "_EventToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
