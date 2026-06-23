import { prisma } from "../../../lib/prisma.js";
import { generateAiTraits } from "../../services/aiTraitService.js";
import { generateCapabilityInsights } from "../../services/capabilityInsightService.js";

export async function POST(request) {
    try {
        console.log("AI TRAITS API STARTED");

        const body = await request.json();
        const { submissionId } = body;

        if (!submissionId || Number.isNaN(Number(submissionId))) {
            return Response.json(
                { success: false, error: "Invalid or missing submissionId" },
                { status: 400 }
            );
        }

        const numericSubmissionId = Number(submissionId);

        // Generate traits using existing service
        const result = await generateAiTraits({ submissionId: numericSubmissionId });

        if (!result.success || !Array.isArray(result.traits)) {
            return Response.json(
                { success: false, stage: "traits", error: "Failed to generate traits" },
                { status: 500 }
            );
        }

        console.log("AI TRAITS GENERATED", {
            submissionId: numericSubmissionId,
            count: result.traits.length,
        });

        // Delete existing CapabilityTrait records for this submission
        const deleteResult = await prisma.capabilityTrait.deleteMany({
            where: { submissionId: numericSubmissionId },
        });

        console.log("AI TRAITS DELETED OLD RECORDS", {
            submissionId: numericSubmissionId,
            deletedCount: deleteResult.count,
        });

        // Save validated traits to database
        const savedTraits = [];

        for (const trait of result.traits) {
            const created = await prisma.capabilityTrait.create({
                data: {
                    submissionId: numericSubmissionId,
                    traitName: trait.traitName,
                    confidence: trait.confidence,
                    evidence: trait.evidence,
                },
            });

            savedTraits.push(created);
        }

        console.log("AI TRAITS SAVED", {
            submissionId: numericSubmissionId,
            savedCount: savedTraits.length,
        });

        let insightResult = null;
        let insightError = null;

        try {
            insightResult = await generateCapabilityInsights(numericSubmissionId);

            const createdInsight = await prisma.capabilityInsight.create({
                data: {
                    submissionId: numericSubmissionId,
                    strengths: insightResult.strengths,
                    improvements: insightResult.improvements,
                    recommendations: insightResult.recommendations,
                },
            });

            console.log("CAPABILITY INSIGHT SAVED", {
                submissionId: numericSubmissionId,
                insightId: createdInsight.id,
            });
        } catch (error) {
            insightError = error.message || "Insight generation failed";
            console.error("CAPABILITY INSIGHT FAILED", {
                submissionId: numericSubmissionId,
                error: insightError,
            });
        }

        console.log("AI TRAITS COMPLETED", {
            submissionId: numericSubmissionId,
            traits: savedTraits.length,
        });

        const responseBody = {
            success: true,
            submissionId: numericSubmissionId,
            traits: result.traits,
        };

        if (insightError) {
            responseBody.insightError = insightError;
        } else {
            responseBody.insights = insightResult;
        }

        return Response.json(responseBody, { status: 200 });
    } catch (error) {
        console.error("AI TRAITS API ERROR", {
            message: error.message,
            stack: error.stack,
        });

        return Response.json(
            {
                success: false,
                stage: "traits",
                error: error.message || "Internal server error",
            },
            { status: 500 }
        );
    }
}
