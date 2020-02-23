import { Question } from "../../repos";
import { action, ActionType } from "typesafe-actions";

export enum HrActionType {
  ListenToHrQuestionsState = "HrActionType/ListenToHrQuestionState",
  SetQuestions = "HrActionType/SetQuestion",
  UpdateImportantStatus = "HrActionType/UpdateImportantStatus",
  DeleteQuestion = "HrActionType/DeleteQuestion"
}

export const listenToHrQuestionsState = (orgCode: string) =>
  action(HrActionType.ListenToHrQuestionsState, { orgCode });

export const setQuestions = (questions: Question[] | null) =>
  action(HrActionType.SetQuestions, { questions });

export const updateImportantStatus = (checked: boolean, docId: string) =>
  action(HrActionType.UpdateImportantStatus, { checked, docId });

export const deleteQuestion = (docId: string) =>
  action(HrActionType.DeleteQuestion, { docId });

const hrActions = {
  listenToHrQuestionsState,
  setQuestions,
  updateImportantStatus,
  deleteQuestion
};

export type HrAction = ActionType<typeof hrActions>;
