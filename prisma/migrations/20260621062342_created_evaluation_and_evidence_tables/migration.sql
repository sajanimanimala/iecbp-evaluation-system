-- CreateTable
CREATE TABLE "Evaluation" (
    "id" SERIAL NOT NULL,
    "responseId" INTEGER NOT NULL,
    "understanding" INTEGER NOT NULL,
    "clarity" INTEGER NOT NULL,
    "awareness" INTEGER NOT NULL,
    "decision" INTEGER NOT NULL,
    "actionability" INTEGER NOT NULL,
    "capabilityIndex" DOUBLE PRECISION NOT NULL,
    "confidenceIndex" DOUBLE PRECISION NOT NULL,
    "coverageIndex" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evidence" (
    "id" SERIAL NOT NULL,
    "responseId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "sentence" TEXT NOT NULL,

    CONSTRAINT "Evidence_pkey" PRIMARY KEY ("id")
);
