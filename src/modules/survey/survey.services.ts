import type { IQuestion, ISurvey } from "./survey.types.js";
import { surveyRepository } from "./survey.repository.js";

export class SurveyServices {
  async createSurvey(data: ISurvey) {
    return await surveyRepository.createSurvey(
      data.title,
      data.description,
      data.useId,
    );
  }

  async createQuestion(data: IQuestion) {
    return await surveyRepository.createQuestion(
      data.surveyId,
      data.type,
      data.label,
      data.position,
      data.clientId,
      data.required,
      data.options as any,
      data.condition as any,
    );
  }

  async findSurveyById(id: string) {
    return await surveyRepository.findSurveyById(id);
  }

  async findAllSurveys(id: string) {
    console.log(id, "this is the id");
    return await surveyRepository.findAllSurveys(id);
  }

  async deleteSurvey(id: string, userId: string) {
    return await surveyRepository.deleteSurvey(id, userId);
  }
  async deleteSQuestion(id: number, userId: string) {
    return await surveyRepository.deleteQuestion(id, userId);
  }

async findSurveyAnalytics(surveyId: string) {
  const survey =
    await surveyRepository.findSurveyAnalytics(
      surveyId,
    );

  if (!survey) {
    throw new Error("Survey not found");
  }

  return survey;
}
}

export const surveyServices = new SurveyServices();
