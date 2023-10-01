-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Authentication_User_Strategies" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "is_external" BOOLEAN NOT NULL,
    "external_id" VARCHAR(255) NOT NULL,
    "payload" VARCHAR(255) NOT NULL,
    "user_Id" TEXT NOT NULL,

    CONSTRAINT "Authentication_User_Strategies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Authentication_Local" (
    "id" TEXT NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "user_Id" TEXT NOT NULL,

    CONSTRAINT "Authentication_Local_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "lastname" VARCHAR(255) NOT NULL,
    "picture" VARCHAR(255) NOT NULL,
    "user_Id" TEXT NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Authentication_User_Strategies_name_key" ON "Authentication_User_Strategies"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Authentication_User_Strategies_external_id_key" ON "Authentication_User_Strategies"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "Authentication_User_Strategies_user_Id_key" ON "Authentication_User_Strategies"("user_Id");

-- CreateIndex
CREATE UNIQUE INDEX "Authentication_Local_password_key" ON "Authentication_Local"("password");

-- CreateIndex
CREATE UNIQUE INDEX "Authentication_Local_user_Id_key" ON "Authentication_Local"("user_Id");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_user_Id_key" ON "Profile"("user_Id");

-- AddForeignKey
ALTER TABLE "Authentication_User_Strategies" ADD CONSTRAINT "Authentication_User_Strategies_user_Id_fkey" FOREIGN KEY ("user_Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Authentication_Local" ADD CONSTRAINT "Authentication_Local_user_Id_fkey" FOREIGN KEY ("user_Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_user_Id_fkey" FOREIGN KEY ("user_Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
