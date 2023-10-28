/*
  Warnings:

  - Added the required column `device_id` to the `ActivityRecording` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ActivityRecording" DROP CONSTRAINT "ActivityRecording_user_id_fkey";

-- AlterTable
ALTER TABLE "ActivityRecording" ADD COLUMN     "device_id" TEXT NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ActivityRecording" ADD CONSTRAINT "ActivityRecording_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
