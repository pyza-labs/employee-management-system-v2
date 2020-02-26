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
  listenToHRQuestionsEpic,
  deleteQuestionEpic,
  updateQuestionEpic,
  setOnBoardingQuestionsEpic,
  listenToEmployeeProgressEpic
} from "./HREpics";

import {
  listenToEmployeeQuestionsEpic,
  listenToEmployeeAnswersEpic,
  updateEmployeeAnswerEpic,
  uploadDocumentsEpic
} from "./EmployeeEpics";

export default combineEpics(
  listenToAuthStateEpic,
  logoutEpic,
  signInEpic,
  resetPasswordEpic,
  signUpEpic,
  listenToHRQuestionsEpic,
  deleteQuestionEpic,
  updateQuestionEpic,
  setOnBoardingQuestionsEpic,
  listenToEmployeeQuestionsEpic,
  listenToEmployeeAnswersEpic,
  updateEmployeeAnswerEpic,
  uploadDocumentsEpic,
  listenToEmployeeProgressEpic
);

export type RootEpic = Epic<RootAction, RootAction, RootState>;
