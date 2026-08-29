import "dotenv/config";

import express from "express";
import cors from "cors";

import authRouter from "./modules/auth/auth.routes.js"
import surveyRouter from "./modules/survey/survey.routes.js"
import responseRouter from "./modules/response/response.route.js"
import { surveyServices } from "./modules/survey/survey.services.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/survey", surveyRouter);
app.use("/api/v1/response", responseRouter);

app.get("/", (_req, res) => {
  res.json({
    message: "API is running",
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});