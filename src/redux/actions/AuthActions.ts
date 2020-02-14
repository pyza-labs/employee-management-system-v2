import { action, ActionType } from "typesafe-actions";
import { User } from "../../repos";

export enum AuthActionType {
  ListenToAuthState = "AuthActionType/ListenToAuthState",
  SignIn = "AuthActionType/SignIn",
  SetCurrentUser = "AuthActionType/SetCurrentUser",
  SetMessage = "SetMessage",
  SetError = "SetError",
  Logout = "AuthActionType/Logout"
}

export const listenToAuthState = () => action(AuthActionType.ListenToAuthState);

export const setCurrentUser = (currentUser: User | null) =>
  action(AuthActionType.SetCurrentUser, { currentUser });

export const signIn = (email?: string, password?: string, orgCode?: string) =>
  action(AuthActionType.SignIn, { email, password, orgCode });

export const setMessage = (message?: string) =>
  action(AuthActionType.SetMessage, { message });

export const setError = (error?: string) =>
  action(AuthActionType.SetError, { error });

export const logout = () => action(AuthActionType.Logout);

const authActions = {
  listenToAuthState,
  setCurrentUser,
  signIn,
  setMessage,
  setError,
  logout
};

export type AuthAction = ActionType<typeof authActions>;
