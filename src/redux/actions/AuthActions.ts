import { action, ActionType } from "typesafe-actions";
import { User } from "../../repos";
import { FormData } from "../../containers/SignUp/SignUp";

export enum AuthActionType {
  ListenToAuthState = "AuthActionType/ListenToAuthState",
  SignIn = "AuthActionType/SignIn",
  SetCurrentUser = "AuthActionType/SetCurrentUser",
  SetMessage = "SetMessage",
  SetError = "SetError",
  Logout = "AuthActionType/Logout",
  ResetPassword = "AuthActionType/ResetPassword",
  SignUp = "AuthActionType/SignUp",
  UploadProfilePicture = "AuthActionType/UploadProfilePicture",
  CreateUser = "AuthActionType/CreateUser"
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

export const resetPassword = (email: string) =>
  action(AuthActionType.ResetPassword, { email });

export const signUp = (values: FormData, state: string, region: string) =>
  action(AuthActionType.SignUp, { values, state, region });

export const uploadProfilePicture = (file: File) =>
  action(AuthActionType.UploadProfilePicture, { file });

export const createUser = (email: string, password: string) =>
  action(AuthActionType.CreateUser, { email, password });

const authActions = {
  listenToAuthState,
  setCurrentUser,
  signIn,
  setMessage,
  setError,
  logout,
  resetPassword,
  signUp,
  uploadProfilePicture,
  createUser
};

export type AuthAction = ActionType<typeof authActions>;
