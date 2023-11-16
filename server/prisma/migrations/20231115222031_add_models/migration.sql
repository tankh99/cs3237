-- AlterTable
ALTER TABLE "ActivityRecording" ADD COLUMN     "name" TEXT;

-- CreateTable
CREATE TABLE "TremorClassification" (
    "id" SERIAL NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "x" DECIMAL(65,30) NOT NULL,
    "y" DECIMAL(65,30) NOT NULL,
    "z" DECIMAL(65,30) NOT NULL,
    "session_name" TEXT,
    "medicationStatus" BOOLEAN NOT NULL,

    CONSTRAINT "TremorClassification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoundData" (
    "id" SERIAL NOT NULL,
    "jitterAbsolute" DECIMAL(65,30) NOT NULL,
    "jitterRap" DECIMAL(65,30) NOT NULL,
    "jitterPPQ5" DECIMAL(65,30) NOT NULL,
    "shimmerLocal" DECIMAL(65,30) NOT NULL,
    "shimmerLocalDB" DECIMAL(65,30) NOT NULL,
    "shimmerAPQ3" DECIMAL(65,30) NOT NULL,
    "shimmerAPQ5" DECIMAL(65,30) NOT NULL,
    "shimmerAPQ11" DECIMAL(65,30) NOT NULL,
    "updrs" DECIMAL(65,30) NOT NULL,
    "severity" INTEGER NOT NULL,
    "session_name" TEXT,

    CONSTRAINT "SoundData_pkey" PRIMARY KEY ("id")
);
