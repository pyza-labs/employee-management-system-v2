import { produce } from "immer";
import { EmployeeActionType, EmployeeAction } from "../actions/EmployeeActions";
import { Question, EmployeeQA } from "../../repos";

export interface EmployeeStateType {
  readonly loading: boolean;
  readonly questions?: Question[];
  readonly employeeQA?: EmployeeQA;
  readonly status?: boolean;
}

const initialState: EmployeeStateType = { loading: true };

export const EmployeeStateReducer = (
  currentState: EmployeeStateType = initialState,
  action: EmployeeAction
) => {
  return produce(currentState, draft => {
    switch (action.type) {
      case EmployeeActionType.SetEmployeeQuestions:
        draft.loading = false;
        draft.questions = action.payload.questions;
        break;
      case EmployeeActionType.SetEmployeeAnswersWithQuestion:
        draft.loading = false;
        draft.employeeQA = action.payload.employeeQA;
        break;
      case EmployeeActionType.SaveStatus:
        draft.status = action.payload.status;
        break;
    }
    return draft;
  });
};
