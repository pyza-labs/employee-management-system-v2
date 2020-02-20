import { Epic, combineEpics } from "redux-observable";
import { RootAction } from "../actions";
import { RootState } from "../reducers";

import {
  listenToAuthStateEpic,
  logoutEpic,
  signInEpic,
  resetPasswordEpic,
  signUpEpic
} from "./AuthEpics";

export default combineEpics(
  listenToAuthStateEpic,
  logoutEpic,
  signInEpic,
  resetPasswordEpic,
  signUpEpic
);

export type RootEpic = Epic<RootAction, RootAction, RootState>;
