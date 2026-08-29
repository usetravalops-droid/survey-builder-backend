import { SurveyRepository } from "../survey/survey.repository.js";
import { ResponseRepository } from "./response.repository.js";

interface SurveyAnswer {
  questionId: number;
  answer: string | string[] | null;
}

interface CreateResponseData {
  answers: SurveyAnswer[];
  email?: string;
  sendCopy?: boolean;
}

export class ResponseService {
  private responseRepository: ResponseRepository;
  private surveyRepository: SurveyRepository;

  constructor() {
    this.responseRepository = new ResponseRepository();
    this.surveyRepository = new SurveyRepository();
  }

  async createResponse(
    surveyId: string,
    data: CreateResponseData,
  ) {
    const survey =
      await this.surveyRepository.findSurveyById(
        surveyId,
      );

    if (!survey) {
      throw new Error("Survey not found");
    }

  
    for (const question of survey.questions) {
      if (!question.required) {
        continue;
      }

      const answer = data.answers.find(
        (item) =>
          item.questionId === question.id,
      );

      if (!answer) {
        throw new Error(
          `"${question.label}" is required`,
        );
      }

      if (
        answer.answer === null ||
        answer.answer === undefined
      ) {
        throw new Error(
          `"${question.label}" is required`,
        );
      }

      if (
        typeof answer.answer === "string" &&
        answer.answer.trim() === ""
      ) {
        throw new Error(
          `"${question.label}" is required`,
        );
      }

      if (
        Array.isArray(answer.answer) &&
        answer.answer.length === 0
      ) {
        throw new Error(
          `"${question.label}" is required`,
        );
      }
    }

    const response =
      await this.responseRepository.createResponse(
        surveyId,
        data.answers as any,
      );


    return response;
  }
}