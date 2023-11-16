/*
  Warnings:

  - You are about to drop the column `device_id` on the `ActivityRecording` table. All the data in the column will be lost.
  - You are about to drop the column `key` on the `ActivityRecording` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `ActivityRecording` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ActivityRecording" DROP CONSTRAINT "ActivityRecording_user_id_fkey";

-- AlterTable
ALTER TABLE "ActivityRecording" DROP COLUMN "device_id",
DROP COLUMN "key",
DROP COLUMN "user_id";

-- DropTable
DROP TABLE "User";
