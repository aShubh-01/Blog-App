/*
  Warnings:

  - You are about to drop the column `created_date` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `updated_date` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "created_date",
DROP COLUMN "updated_date",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
