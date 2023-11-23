/*
  Warnings:

  - You are about to drop the column `jitterAbsolute` on the `SoundData` table. All the data in the column will be lost.
  - Added the required column `jitterAbs` to the `SoundData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SoundData" DROP COLUMN "jitterAbsolute",
ADD COLUMN     "jitterAbs" DECIMAL(65,30) NOT NULL;
