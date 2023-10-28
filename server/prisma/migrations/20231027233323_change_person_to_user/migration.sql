/*
  Warnings:

  - You are about to drop the column `person_id` on the `ActivityRecording` table. All the data in the column will be lost.
  - You are about to drop the `Person` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user_id` to the `ActivityRecording` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ActivityRecording" DROP CONSTRAINT "ActivityRecording_person_id_fkey";

-- AlterTable
ALTER TABLE "ActivityRecording" DROP COLUMN "person_id",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Person";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ActivityRecording" ADD CONSTRAINT "ActivityRecording_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
