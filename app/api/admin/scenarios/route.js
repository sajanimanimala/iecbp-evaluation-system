import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
    const scenarios = await prisma.scenario.findMany({
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(scenarios);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch scenarios" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const scenario = await prisma.scenario.create({
      data: {
        title: body.name,
        description: body.description,
        category: body.category,

        questions: {
          create: body.questions.map((question) => ({
            questionText: question.text,
            questionType: question.type,
            orderNo: question.number,

            options: {
              create: (question.options || []).map((option) => ({
                optionText: option.text || null,
                imageUrl: option.imageUrl || null,
              })),
            },
          })),
        },
      },

      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    return NextResponse.json(scenario, {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to create scenario",
      },
      {
        status: 500,
      }
    );
  }
}