import { Question } from "../../repos";
import { produce } from "immer";
import { HrAction, HrActionType } from "../actions";
import { AuthStateType } from "../reducers/AuthReducer";

export interface HrStateType extends AuthStateType {
  readonly questions?: Question[] | null;
}

const initialState: HrStateType = { loading: true };

export const HrStateReducer = (
  currentState: HrStateType = initialState,
  action: HrAction
) => {
  return produce(currentState, draft => {
    switch (action.type) {
      case HrActionType.SetQuestions:
        draft.loading = true;
        draft.questions = action.payload.questions;
        break;
    }
    return draft;
  });
};
