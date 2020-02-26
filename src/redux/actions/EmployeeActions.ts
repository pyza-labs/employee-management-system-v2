import { action, ActionType } from "typesafe-actions";
import { Question, Answer } from "../../repos";

export enum EmployeeActionType {
  ListenToEmployeeQuestions = "EmployeeActionType/ListenToEmployeeQuestions",
  SetEmployeeQuestions = "EmployeeActionType/SetEmployeeQuestion",
  ListenToEmployeeAnswers = "EmployeeActionType/ListenToEmployeeAnswers",
  SetEmployeeAnswersWithQuestion = "EmployeeActionType/SetEmployeeAnswerWithQuestion",
  UpdateEmployeeAnswer = "EmployeeActionType/UpdateEmployeeAnswer",
  UploadDocuments = "EmployeeActionType/UploadDocuments",
  SaveStatus = "EmployeeActionType/SaveStatus"
}

export const listenToEmployeeQuestions = (orgCode: string) =>
  action(EmployeeActionType.ListenToEmployeeQuestions, { orgCode });

export const setEmployeeQuestions = (questions: Question[]) =>
  action(EmployeeActionType.SetEmployeeQuestions, { questions });

export const listenToEmployeeAnswers = (userId: string, questionId: string) =>
  action(EmployeeActionType.ListenToEmployeeAnswers, { userId, questionId });

export const setEmployeeAnswersWithQuestion = (employeeQA: Answer) =>
  action(EmployeeActionType.SetEmployeeAnswersWithQuestion, { employeeQA });

export const uploadDocuments = (
  file: File,
  userId: string,
  questionId: string
) => action(EmployeeActionType.UploadDocuments, { file, userId, questionId });

export const updateEmployeeAnswer = (
  text: string,
  userId: string,
  questionId: string,
  question: string
) =>
  action(EmployeeActionType.UpdateEmployeeAnswer, {
    text,
    userId,
    questionId,
    question
  });

export const saveStatus = (status: boolean) =>
  action(EmployeeActionType.SaveStatus, { status });

const employeeActions = {
  //Removed Export
  listenToEmployeeQuestions,
  setEmployeeQuestions,
  listenToEmployeeAnswers,
  setEmployeeAnswersWithQuestion,
  updateEmployeeAnswer,
  uploadDocuments,
  saveStatus
};

export type EmployeeAction = ActionType<typeof employeeActions>;
