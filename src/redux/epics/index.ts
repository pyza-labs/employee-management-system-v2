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
  listenToHrQuestionsEpic,
  deleteQuestionEpic,
  updateQuestionEpic,
  setOnBoardingQuestionsEpic
} from "./HrEpics";

import { listenToEmployeeQuestionsEpic } from "./EmployeeEpics";

export default combineEpics(
  listenToAuthStateEpic,
  logoutEpic,
  signInEpic,
  resetPasswordEpic,
  signUpEpic,
  listenToHrQuestionsEpic,
  deleteQuestionEpic,
  updateQuestionEpic,
  setOnBoardingQuestionsEpic,
  listenToEmployeeQuestionsEpic
);

export type RootEpic = Epic<RootAction, RootAction, RootState>;
