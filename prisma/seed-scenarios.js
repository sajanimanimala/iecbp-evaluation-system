const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const SCENARIOS = require("./scenarios-data");

async function main() {
  console.log("🚀 Seeding scenarios...");

  for (const scenario of SCENARIOS) {
    const exists = await prisma.scenario.findFirst({
      where: {
        title: scenario.title,
      },
    });

    if (exists) {
      console.log(`✓ Already exists: ${scenario.title}`);
      continue;
    }

    await prisma.scenario.create({
      data: {
        title: scenario.title,
        description: scenario.description,
        category: scenario.category,
        icon: scenario.icon,
        level: scenario.level,
        levelColor: scenario.levelColor,

        questions: {
          create: scenario.questions.map((q) => ({
            questionText: q.question,
            questionType: q.type,
            orderNo: q.number,

            options: {
              create: (q.options || []).map((opt) => ({
                optionText: opt,
              })),
            },
          })),
        },
      },
    });

    console.log(`✓ Added: ${scenario.title}`);
  }

  console.log("🎉 Scenario seed completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });