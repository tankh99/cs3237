/*
  Warnings:

  - You are about to drop the column `name` on the `ActivityRecording` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ActivityRecording" DROP COLUMN "name",
ADD COLUMN     "session_name" TEXT;
