/*
  Warnings:

  - You are about to drop the column `profilePhot` on the `admins` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "UserStatus" ADD VALUE 'DELETED';

-- AlterTable
ALTER TABLE "admins" DROP COLUMN "profilePhot",
ADD COLUMN     "profilePhoto" TEXT;
