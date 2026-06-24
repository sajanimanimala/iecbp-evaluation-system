import { notFound } from 'next/navigation';
import { prisma } from '../../../lib/prisma';
import DynamicAssessmentClient from '../../../components/assessment/DynamicAssessmentClient';

export const dynamic = 'force-dynamic';

async function getScenarioData(scenarioId) {
  const id = Number(scenarioId);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  const scenario = await prisma.scenario.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: {
          orderNo: 'asc',
        },
        include: {
          options: {
            orderBy: {
              id: 'asc',
            },
          },
        },
      },
    },
  });

  if (!scenario) {
    return null;
  }

  return scenario;
}

export default async function AssessmentPage({ params }) {
  const resolvedParams = await params;
  const scenarioId = resolvedParams?.scenarioId;
  const scenario = await getScenarioData(scenarioId);

  if (!scenario) {
    notFound();
  }

  return <DynamicAssessmentClient scenario={scenario} questions={scenario.questions} />;
}
