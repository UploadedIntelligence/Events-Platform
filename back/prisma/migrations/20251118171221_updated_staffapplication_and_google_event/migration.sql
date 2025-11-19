/*
  Warnings:

  - The primary key for the `Event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_EventToUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `StaffApplication` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `eventId` to the `UserGoogleEvent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."StaffApplication" DROP CONSTRAINT "StaffApplication_userEmail_fkey";

-- DropForeignKey
ALTER TABLE "public"."_EventToUser" DROP CONSTRAINT "_EventToUser_A_fkey";

-- AlterTable
ALTER TABLE "public"."Event" DROP CONSTRAINT "Event_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Event_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Event_id_seq";

-- AlterTable
ALTER TABLE "public"."UserGoogleEvent" ADD COLUMN     "eventId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."_EventToUser" DROP CONSTRAINT "_EventToUser_AB_pkey",
ALTER COLUMN "A" SET DATA TYPE TEXT,
ADD CONSTRAINT "_EventToUser_AB_pkey" PRIMARY KEY ("A", "B");

-- DropTable
DROP TABLE "public"."StaffApplication";

-- CreateTable
CREATE TABLE "public"."RoleRequest" (
    "id" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "status" "public"."Status" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rejectedAt" TIMESTAMP(3),

    CONSTRAINT "RoleRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoleRequest_userEmail_key" ON "public"."RoleRequest"("userEmail");

-- AddForeignKey
ALTER TABLE "public"."RoleRequest" ADD CONSTRAINT "RoleRequest_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "public"."user"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserGoogleEvent" ADD CONSTRAINT "UserGoogleEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_EventToUser" ADD CONSTRAINT "_EventToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
