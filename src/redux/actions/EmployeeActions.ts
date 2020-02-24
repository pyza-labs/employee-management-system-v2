import { action, ActionType } from "typesafe-actions";
import { Question } from "../../repos";

export enum EmployeeActionType {
  ListenToEmployeeQuestions = "EmployeeActionType/ListenToEmployeeQuestions",
  SetEmployeeQuestions = "EmployeeActionType/SetEmployeeQuestion"
}

export const listenToEmployeeQuestions = (orgCode: string) =>
  action(EmployeeActionType.ListenToEmployeeQuestions, { orgCode });

export const setEmployeeQuestions = (questions: Question[]) =>
  action(EmployeeActionType.SetEmployeeQuestions, { questions });

export const employeeActions = {
  listenToEmployeeQuestions,
  setEmployeeQuestions
};

export type EmployeeAction = ActionType<typeof employeeActions>;
