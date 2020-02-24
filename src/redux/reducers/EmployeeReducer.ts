import { produce } from "immer";
import { EmployeeActionType, EmployeeAction } from "../actions/EmployeeActions";
import { HrStateType } from "./HrReducer";
import { Question } from "../../repos";

export interface EmployeeStateType extends HrStateType {
  readonly loading: boolean;
  readonly questions?: Question[];
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
    }
    return draft;
  });
};
