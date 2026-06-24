-- CreateTable
CREATE TABLE "question_score" (
    "id" SERIAL NOT NULL,
    "submissionId" INTEGER NOT NULL,
    "attemptId" INTEGER,
    "questionId" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "understandingEvidence" JSONB,
    "awarenessEvidence" JSONB,
    "decisionEvidence" JSONB,
    "actionabilityEvidence" JSONB,
    "clarityEvidence" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_score_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIEvidenceAudit" (
    "id" SERIAL NOT NULL,
    "submissionId" INTEGER NOT NULL,
    "audit" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIEvidenceAudit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CapabilityTrait" (
    "id" SERIAL NOT NULL,
    "submissionId" INTEGER NOT NULL,
    "traitName" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "evidence" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CapabilityTrait_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CapabilityInsight" (
    "id" SERIAL NOT NULL,
    "submissionId" INTEGER NOT NULL,
    "strengths" JSONB NOT NULL,
    "improvements" JSONB NOT NULL,
    "recommendations" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CapabilityInsight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIInsight" (
    "id" SERIAL NOT NULL,
    "submissionId" INTEGER NOT NULL,
    "strengths" JSONB NOT NULL,
    "improvements" JSONB NOT NULL,
    "recommendations" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIInsight_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "question_score" ADD CONSTRAINT "question_score_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_score" ADD CONSTRAINT "question_score_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "ExamAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
