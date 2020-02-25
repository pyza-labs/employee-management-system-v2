import { Question, EmployeeProgress } from "../../repos";
import { action, ActionType } from "typesafe-actions";
import { FormDataHRQuestions } from "../../containers/HR/HRHome/QuestionForm/QuestionForm";

export enum HRActionType {
  ListenToHRQuestions = "HRActionType/ListenToHRQuestions",
  SetQuestions = "HRActionType/SetQuestion",
  UpdateImportantStatus = "HRActionType/UpdateImportantStatus",
  DeleteQuestion = "HRActionType/DeleteQuestion",
  SetOnBoardingQuestions = "HRActionType/SetOnBoardingQuestions",
  ListenToEmployeeProgress = "EmployeeActionType/EmployeeProgress",
  SetEmployeeProgress = "EmployeeActionType/SetEmployeeProgress"
}

export const listenToHRQuestions = (orgCode: string) =>
  action(HRActionType.ListenToHRQuestions, { orgCode });

export const setQuestions = (questions: Question[]) =>
  action(HRActionType.SetQuestions, { questions });

export const updateImportantStatus = (checked: boolean, docId: string) =>
  action(HRActionType.UpdateImportantStatus, { checked, docId });

export const deleteQuestion = (docId: string) =>
  action(HRActionType.DeleteQuestion, { docId });

export const setOnBoardingQuestions = (
  values: FormDataHRQuestions,
  orgCode: string,
  options?: string[]
) => action(HRActionType.SetOnBoardingQuestions, { values, orgCode, options });

export const listenToEmployeeProgress = (orgCode: string) =>
  action(HRActionType.ListenToEmployeeProgress, { orgCode });

export const setEmployeeProgress = (employeeProgress: EmployeeProgress) =>
  action(HRActionType.SetEmployeeProgress, { employeeProgress });

const hrActions = {
  listenToHRQuestions,
  setQuestions,
  updateImportantStatus,
  deleteQuestion,
  setOnBoardingQuestions,
  setEmployeeProgress,
  listenToEmployeeProgress
};

export type HRAction = ActionType<typeof hrActions>;
