-- CreateTable
CREATE TABLE "ActivityRecording" (
    "id" SERIAL NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "x" DECIMAL(65,30) NOT NULL,
    "y" DECIMAL(65,30) NOT NULL,
    "z" DECIMAL(65,30) NOT NULL,
    "person_id" INTEGER NOT NULL,
    "activity_type" INTEGER,

    CONSTRAINT "ActivityRecording_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ActivityRecording" ADD CONSTRAINT "ActivityRecording_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
