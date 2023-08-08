-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "lastname" VARCHAR(255) NOT NULL,
    "picture" VARCHAR(255) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "google_id" VARCHAR(255) NOT NULL,
    "facebook_id" VARCHAR(255) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_userId_key" ON "Account"("userId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
