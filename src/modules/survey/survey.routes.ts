import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { surveyControlller } from "./survey.controller.js";

const router = Router();

router.post("/", authMiddleware, surveyControlller.createSurvey);

router.post(
  "/question",
  authMiddleware,
  surveyControlller.createQuestion,
);

router.get(
  "/analytics/:id",
  authMiddleware,
  surveyControlller.getSurveyAnalytics,
);

router.get(
  "/:id",
  surveyControlller.findSurvey,
);

router.get(
  "/",
  authMiddleware,
  surveyControlller.findAllSurveys,
);

router.delete(
  "/:id",
  authMiddleware,
  surveyControlller.deleteSurvey,
);

router.delete(
  "/question/:id",
  authMiddleware,
  surveyControlller.deleteQuestion,
);

export default router;
