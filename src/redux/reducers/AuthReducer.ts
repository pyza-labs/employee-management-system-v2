import { User } from "../../repos";
import { produce } from "immer";
import { AuthAction, AuthActionType } from "../actions";
import { act } from "react-dom/test-utils";

export interface AuthStateType {
  readonly loading: boolean;
  readonly currentUser?: User | null;
  readonly message?: string;
  readonly error?: string;
}

const initialState: AuthStateType = { loading: false };

export const AuthStateReducer = (
  currentState: AuthStateType = initialState,
  action: AuthAction
) => {
  return produce(currentState, draft => {
    switch (action.type) {
      case AuthActionType.SignIn:
        draft.loading = true;
        break;
      case AuthActionType.SetCurrentUser:
        draft.currentUser = action.payload.currentUser;
        draft.loading = false;
        break;
      case AuthActionType.SetMessage:
        draft.message = action.payload.message;
        break;
      case AuthActionType.SetError:
        draft.error = action.payload.error;
        draft.loading = false;
        break;
      case AuthActionType.SignUp:
        draft.loading = true;
        break;
    }
    return draft;
  });
};
