-- CreateIndex
CREATE UNIQUE INDEX "EventAttendance_userId_eventId_key" ON "public"."EventAttendance"("userId" ASC, "eventId" ASC);