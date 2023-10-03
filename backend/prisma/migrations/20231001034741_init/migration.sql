-- CreateTable
CREATE TABLE "ks_users" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ks_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ks_authentication_user_strategies" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "external_id" VARCHAR(255) NOT NULL,
    "user_Id" TEXT NOT NULL,

    CONSTRAINT "ks_authentication_user_strategies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ks_authentication_local" (
    "id" TEXT NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "user_Id" TEXT NOT NULL,

    CONSTRAINT "ks_authentication_local_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ks_profile" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "lastname" VARCHAR(255) NOT NULL,
    "picture" VARCHAR(255) NOT NULL,
    "user_Id" TEXT NOT NULL,

    CONSTRAINT "ks_profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ks_users_email_key" ON "ks_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ks_authentication_user_strategies_name_key" ON "ks_authentication_user_strategies"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ks_authentication_user_strategies_external_id_key" ON "ks_authentication_user_strategies"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "ks_authentication_user_strategies_user_Id_key" ON "ks_authentication_user_strategies"("user_Id");

-- CreateIndex
CREATE UNIQUE INDEX "ks_authentication_local_password_key" ON "ks_authentication_local"("password");

-- CreateIndex
CREATE UNIQUE INDEX "ks_authentication_local_user_Id_key" ON "ks_authentication_local"("user_Id");

-- CreateIndex
CREATE UNIQUE INDEX "ks_profile_user_Id_key" ON "ks_profile"("user_Id");

-- AddForeignKey
ALTER TABLE "ks_authentication_user_strategies" ADD CONSTRAINT "ks_authentication_user_strategies_user_Id_fkey" FOREIGN KEY ("user_Id") REFERENCES "ks_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ks_authentication_local" ADD CONSTRAINT "ks_authentication_local_user_Id_fkey" FOREIGN KEY ("user_Id") REFERENCES "ks_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ks_profile" ADD CONSTRAINT "ks_profile_user_Id_fkey" FOREIGN KEY ("user_Id") REFERENCES "ks_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
