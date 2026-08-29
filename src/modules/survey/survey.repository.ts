import { Prisma } from "@prisma/client";

import { prisma } from "../../lib/prisma.js";

export class SurveyRepository {
  async createSurvey(title: string, description: string, userId: string) {
    return prisma.survey.create({
      data: {
        title,
        description,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async findSurveyById(id: string) {
    return prisma.survey.findUnique({
      where: {
        id,
      },
      include: {
        questions: {
          
          orderBy: {
            position: "asc",
          },
        },
      },
    });
  }

  async findAllSurveys(id: string) {
    const surveys = await prisma.survey.findMany({
      where: {
        userId: id,
      },
      orderBy: {
        id: "desc",
      },
      include: {
        _count: {
          select: {
            responses: true,
          },
        },
      },
    });

    return surveys.map(({ _count, ...survey }) => ({
      ...survey,
      response_count: _count.responses,
    }));
  }

  async updateSurvey(id: string, title: string, description: string) {
    return prisma.survey.update({
      where: {
        id,
      },
      data: {
        title,
        description,
      },
    });
  }

  async deleteSurvey(id: string, userId: string) {
    return prisma.survey.delete({
      where: {
        id,
        userId,
      },
    });
  }

  async createQuestion(
    surveyId: string,
    type: "mcq" | "check_box" | "text" | "rating",
    label: string,
    position: number,
    clientId:string,
    required: boolean = false,
    options?: Prisma.InputJsonValue,
    condition?: Prisma.InputJsonValue,
  ) {
    return prisma.question.create({
      data: {
        surveyId,
        type,
        label,
        position,
        required,
        clientId,
        ...(options && { options }),
        ...(condition && { condition }),
      },
    });
  }

  async updateQuestion(
    id: number,
    data: {
      label?: string;
      type?: "mcq" | "check_box" | "text" | "rating";
      position?: number;
      required?: boolean;
      options?: Prisma.InputJsonValue;
      condition?: Prisma.InputJsonValue;
    },
  ) {
    return prisma.question.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteQuestion(id: number, userId: string) {
    return prisma.question.delete({
      where: {
        id,
        survey: {
          userId,
        },
      },
    });
  }

  async reorderQuestions(
    questions: {
      id: number;
      position: number;
    }[],
  ) {
    return prisma.$transaction(
      questions.map((question) =>
        prisma.question.update({
          where: {
            id: question.id,
          },
          data: {
            position: question.position,
          },
        }),
      ),
    );
  }

async findSurveyAnalytics(surveyId: string) {
  const result = await prisma.survey.findUnique({
    where: {
      id: surveyId,
    },
    select: {
      id: true,
      title: true,
      description: true,

      questions: {
        orderBy: {
          position: "asc",
        },
        select: {
          id: true,
          label: true,
          type: true,
          options: true,
          required: true,
          condition: true,
          position: true,
          surveyId: true,
        },
      },

      responses: {
        select: {
          id: true,
          response: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

 

  return result;
}
}

export const surveyRepository = new SurveyRepository();
