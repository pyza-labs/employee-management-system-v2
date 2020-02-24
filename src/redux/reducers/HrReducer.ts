import { Question } from "../../repos";
import { produce } from "immer";
import { HrAction, HrActionType } from "../actions";

export interface HrStateType {
  readonly questions?: Question[];
  readonly loading: boolean;
}

const initialState: HrStateType = { loading: true };

export const HrStateReducer = (
  currentState: HrStateType = initialState,
  action: HrAction
) => {
  return produce(currentState, draft => {
    switch (action.type) {
      case HrActionType.SetQuestions:
        draft.loading = false;
        draft.questions = action.payload.questions;
        break;
      case HrActionType.SetOnBoardingQuestions:
        draft.loading = false;
        break;
    }
    return draft;
  });
};
