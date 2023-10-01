/*
  Warnings:

  - You are about to drop the column `is_external` on the `Authentication_User_Strategies` table. All the data in the column will be lost.
  - You are about to drop the column `payload` on the `Authentication_User_Strategies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Authentication_User_Strategies" DROP COLUMN "is_external",
DROP COLUMN "payload";
