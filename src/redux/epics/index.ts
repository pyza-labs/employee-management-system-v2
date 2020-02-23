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

import {
  listenToHrQuestionsStateEpic,
  deleteQuestionEpic,
  updateQuestionEpic
} from "./HrEpics";

export default combineEpics(
  listenToAuthStateEpic,
  logoutEpic,
  signInEpic,
  resetPasswordEpic,
  signUpEpic,
  listenToHrQuestionsStateEpic,
  deleteQuestionEpic,
  updateQuestionEpic
);

export type RootEpic = Epic<RootAction, RootAction, RootState>;
