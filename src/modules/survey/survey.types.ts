export interface IQuestion {
  surveyId: string;
  type: "mcq" | "check_box" | "text" | "rating";
  label: string;
  position: number;
  required: boolean;
  options?: JSON;
  condition?: JSON;
  clientId: string;
}

export interface ISurvey {
    title: string;
    description: string;
    useId: string
}