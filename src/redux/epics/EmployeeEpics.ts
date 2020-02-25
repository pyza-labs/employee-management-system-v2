import { RootEpic } from ".";
import {
  setError,
  setMessage,
  setEmployeeQuestions,
  EmployeeActionType,
  setEmployeeAnswersWithQuestion
} from "../actions";
import { isOfType } from "typesafe-actions";
import { of, from } from "rxjs";
import { filter, switchMap, map, catchError, mapTo } from "rxjs/operators";
import {
  listenToEmployeeQuestions,
  listenToEmployeeAnswers,
  updateEmployeeAnswer,
  uploadDocuments
} from "../../repos";

export const listenToEmployeeQuestionsEpic: RootEpic = action$ => {
  return action$.pipe(
    filter(isOfType(EmployeeActionType.ListenToEmployeeQuestions)),
    switchMap(action => {
      const { orgCode } = action.payload;
      return listenToEmployeeQuestions(orgCode).pipe(
        map(questions => setEmployeeQuestions(questions)),
        catchError(error => of(setError(error.message)))
      );
    })
  );
};

export const listenToEmployeeAnswersEpic: RootEpic = action$ => {
  return action$.pipe(
    filter(isOfType(EmployeeActionType.ListenToEmployeeAnswers)),
    switchMap(action => {
      const { userId, questionId } = action.payload;
      return listenToEmployeeAnswers(userId, questionId).pipe(
        map(employeeQA => setEmployeeAnswersWithQuestion(employeeQA)),
        catchError(error => of(setError(error.message)))
      );
    })
  );
};

export const updateEmployeeAnswerEpic: RootEpic = action$ => {
  return action$.pipe(
    filter(isOfType(EmployeeActionType.UpdateEmployeeAnswer)),
    switchMap(action => {
      const { text, userId, questionId, question } = action.payload;
      return updateEmployeeAnswer(text, userId, questionId, question).pipe(
        mapTo(setMessage("Answer Stored Successfully")),
        catchError(error => of(setError(error.message)))
      );
    })
  );
};

export const uploadDocumentsEpic: RootEpic = action$ => {
  return action$.pipe(
    filter(isOfType(EmployeeActionType.UploadDocuments)),
    switchMap(action => {
      const { file, userId, questionId } = action.payload;
      return uploadDocuments(file, userId, questionId).pipe(
        mapTo(setMessage("Documents Uploaded Successfully")),
        catchError(error => of(setError(error.message)))
      );
    })
  );
};
