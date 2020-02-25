import { Question, EmployeeProgress } from "../../repos";
import { produce } from "immer";
import { HRAction, HRActionType } from "../actions";

export interface HRStateType {
  readonly questions?: Question[];
  readonly loading: boolean;
  readonly employeeProgress?: EmployeeProgress;
}

const initialState: HRStateType = { loading: true };

export const HRStateReducer = (
  currentState: HRStateType = initialState,
  action: HRAction
) => {
  return produce(currentState, draft => {
    switch (action.type) {
      case HRActionType.SetQuestions:
        draft.loading = false;
        draft.questions = action.payload.questions;
        break;
      case HRActionType.SetOnBoardingQuestions:
        draft.loading = false;
        break;
      case HRActionType.SetEmployeeProgress:
        draft.employeeProgress = action.payload.employeeProgress;
    }
    return draft;
  });
};
