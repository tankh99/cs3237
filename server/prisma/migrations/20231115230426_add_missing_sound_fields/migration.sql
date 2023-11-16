/*
  Warnings:

  - Added the required column `jitterDDP` to the `SoundData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shimmerDDA` to the `SoundData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SoundData" ADD COLUMN     "jitterDDP" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "shimmerDDA" DECIMAL(65,30) NOT NULL;
