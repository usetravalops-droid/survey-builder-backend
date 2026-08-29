import type { Request, Response } from "express";
import type { IQuestion, ISurvey } from "./survey.types.js";
import { surveyServices } from "./survey.services.js";

export class SurveyController {
  async createSurvey(req: Request, res: Response) {
    const data: ISurvey = req.body;

    const response = await surveyServices.createSurvey({
      ...data,
      useId: req.user.id,
    });

    return res.status(201).json({
      message: "Survey Created",
      data: response,
    });
  }

  async createQuestion(req: Request, res: Response) {
    const data = req.body;

    const response = await surveyServices.createQuestion(data);
    return res.status(201).json({
      message: "Question Created",
      data: response,
    });
  }

  async findSurvey(req: Request, res: Response) {
    const { id } = req.params;
    console.log(id);
    if (!id)
      return res.status(400).json({
        message: "Required id is missing ",
      });
    const response = await surveyServices.findSurveyById(id as string);
    console.log(response);
    return res.status(200).json({
      message: "Data fetched success",
      data: response,
    });
  }

  async findAllSurveys(req: Request, res: Response) {
    const id = req.user.id;
    console.log(id, "this is also the id");
    const response = await surveyServices.findAllSurveys(id);

    return res.status(200).json({
      message: "data fetched successfully",
      data: response,
    });
  }

  async deleteSurvey(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const survey = await surveyServices.deleteSurvey(id as string, userId);

      return res.status(200).json({
        message: "Survey deleted successfully",
        data: survey,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Failed to delete survey",
      });
    }
  }

  async deleteQuestion(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const question = await surveyServices.deleteSQuestion(Number(id), userId);

      return res.status(200).json({
        message: "Question deleted successfully",
        data: question,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Failed to delete question",
      });
    }
  }

  async getSurveyAnalytics(
    req: Request,
    res: Response,
  ) {
    try {
      const { id } = req.params;

      const analytics =
        await surveyServices.findSurveyAnalytics(
          id! as string,
        );

      return res.status(200).json({
        message: "Analytics fetched successfully",
        data: analytics,
      });
    } catch (error) {
      console.error(error)

      return res.status(500).json({
        message:
          "Unable to fetch survey analytics",
      });
    }
  }

}

export const surveyControlller = new SurveyController();
