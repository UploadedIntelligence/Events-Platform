-- DropForeignKey
ALTER TABLE "public"."UserGoogleEvent" DROP CONSTRAINT "UserGoogleEvent_eventId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserGoogleEvent" DROP CONSTRAINT "UserGoogleEvent_userId_fkey";

-- AddForeignKey
ALTER TABLE "public"."UserGoogleEvent" ADD CONSTRAINT "UserGoogleEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserGoogleEvent" ADD CONSTRAINT "UserGoogleEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
