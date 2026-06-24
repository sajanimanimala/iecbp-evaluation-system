-- CreateTable
CREATE TABLE "EvaluationReport" (
    "id" SERIAL NOT NULL,
    "submissionId" INTEGER NOT NULL,
    "reportData" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "evaluatorComment" TEXT,
    "modifiedReport" JSONB,
    "reviewedBy" INTEGER,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvaluationReport_pkey" PRIMARY KEY ("id")
);
