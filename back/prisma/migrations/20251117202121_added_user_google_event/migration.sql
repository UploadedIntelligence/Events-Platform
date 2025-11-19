-- CreateTable
CREATE TABLE "public"."UserGoogleEvent" (
    "googleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserGoogleEvent_pkey" PRIMARY KEY ("googleId")
);

-- AddForeignKey
ALTER TABLE "public"."UserGoogleEvent" ADD CONSTRAINT "UserGoogleEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
