import { Question } from "../../repos";
import { action, ActionType } from "typesafe-actions";
import { FormDataHrQuestions } from "../../containers/HR/HrHome/QuestionForm/QuestionForm";

export enum HrActionType {
  ListenToHrQuestions = "HrActionType/ListenToHrQuestions",
  SetQuestions = "HrActionType/SetQuestion",
  UpdateImportantStatus = "HrActionType/UpdateImportantStatus",
  DeleteQuestion = "HrActionType/DeleteQuestion",
  SetOnBoardingQuestions = "HrActionType/SetOnBoardingQuestions"
}

export const listenToHrQuestions = (orgCode: string) =>
  action(HrActionType.ListenToHrQuestions, { orgCode });

export const setQuestions = (questions: Question[]) =>
  action(HrActionType.SetQuestions, { questions });

export const updateImportantStatus = (checked: boolean, docId: string) =>
  action(HrActionType.UpdateImportantStatus, { checked, docId });

export const deleteQuestion = (docId: string) =>
  action(HrActionType.DeleteQuestion, { docId });

export const setOnBoardingQuestions = (
  values: FormDataHrQuestions,
  orgCode: string,
  options?: string[]
) => action(HrActionType.SetOnBoardingQuestions, { values, orgCode, options });

const hrActions = {
  listenToHrQuestions,
  setQuestions,
  updateImportantStatus,
  deleteQuestion,
  setOnBoardingQuestions
};

export type HrAction = ActionType<typeof hrActions>;
