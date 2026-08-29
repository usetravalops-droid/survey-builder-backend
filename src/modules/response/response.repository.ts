import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

export class ResponseRepository {
  async createResponse(
    surveyId: string,
    response: Prisma.InputJsonValue,
  ) {
    return prisma.response.create({
      data: {
        response,
        survey: {
            connect: {
                id: surveyId
            }
        }
        },
    });
  }
}