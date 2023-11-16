/*
  Warnings:

  - You are about to drop the column `activity_type` on the `ActivityRecording` table. All the data in the column will be lost.
  - You are about to drop the column `session_name` on the `ActivityRecording` table. All the data in the column will be lost.
  - You are about to drop the column `session_name` on the `SoundData` table. All the data in the column will be lost.
  - You are about to drop the column `session_name` on the `TremorClassification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ActivityRecording" DROP COLUMN "activity_type",
DROP COLUMN "session_name",
ADD COLUMN     "activityType" TEXT,
ADD COLUMN     "sessionName" TEXT;

-- AlterTable
ALTER TABLE "SoundData" DROP COLUMN "session_name",
ADD COLUMN     "sessionName" TEXT;

-- AlterTable
ALTER TABLE "TremorClassification" DROP COLUMN "session_name",
ADD COLUMN     "sessionName" TEXT;
