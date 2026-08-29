import type { Request, Response } from "express";
import { ResponseService } from "./response.services.js";

const responseService = new ResponseService();

export class ResponseController {
  async createResponse(
    req: Request,
    res: Response,
  ) {
    try {

      const {
        answers,
        surveyId
      } = req.body;

      if (!surveyId) {
        return res.status(400).json({
          message: "Survey ID is required",
        });
      }

      if (!Array.isArray(answers)) {
        return res.status(400).json({
          message: "Answers must be an array",
        });
      }

      const response =
        await responseService.createResponse(
          surveyId as string,
          {
            answers,
          },
        );

      return res.status(201).json({
        message:
          "Survey response submitted successfully",
        data: response,
      });
    } catch (error) {
      console.error(
        "Create response error:",
        error,
      );

      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "Failed to submit survey response",
      });
    }
  }
}

export const responseController =
  new ResponseController();