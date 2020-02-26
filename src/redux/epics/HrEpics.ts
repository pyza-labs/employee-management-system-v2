import { RootEpic } from ".";
import { of } from "rxjs";
import { filter, switchMap, map, catchError, mapTo } from "rxjs/operators";
import { isOfType } from "typesafe-actions";
import {
  HRActionType,
  setError,
  setMessage,
  setQuestions,
  setEmployeeProgress
} from "../actions";
import {
  listenToHRQuestions,
  updateImportant,
  deleteQuestion,
  setOnBoardingQuestions,
  listenToEmployeeProgress
} from "../../repos";

export const listenToHRQuestionsEpic: RootEpic = action$ => {
  return action$.pipe(
    filter(isOfType(HRActionType.ListenToHRQuestions)),
    switchMap(action => {
      const { orgCode } = action.payload;
      return listenToHRQuestions(orgCode).pipe(
        map(questions => setQuestions(questions)),
        catchError(error => of(setError(error.message)))
      );
    })
  );
};

export const updateQuestionEpic: RootEpic = action$ => {
  return action$.pipe(
    filter(isOfType(HRActionType.UpdateImportantStatus)),
    switchMap(action => {
      const { checked, docId } = action.payload;
      return updateImportant(checked, docId).pipe(
        mapTo(setMessage("Question Updated Successfully")),
        catchError(error => of(setError(error.message)))
      );
    })
  );
};

export const deleteQuestionEpic: RootEpic = action$ => {
  return action$.pipe(
    filter(isOfType(HRActionType.DeleteQuestion)),
    switchMap(action => {
      const { docId } = action.payload;
      return deleteQuestion(docId).pipe(
        mapTo(setMessage("Question Deleted Succeefully")),
        catchError(error => of(setError(error.message)))
      );
    })
  );
};

export const setOnBoardingQuestionsEpic: RootEpic = action$ => {
  return action$.pipe(
    filter(isOfType(HRActionType.SetOnBoardingQuestions)),
    switchMap(action => {
      const { values, orgCode, options } = action.payload;
      return setOnBoardingQuestions(values, orgCode, options).pipe(
        mapTo(setMessage("Question Written Successfully")),
        catchError(error => of(setError(error.message)))
      );
    })
  );
};

export const listenToEmployeeProgressEpic: RootEpic = action$ => {
  return action$.pipe(
    filter(isOfType(HRActionType.ListenToEmployeeProgress)),
    switchMap(action => {
      const { orgCode } = action.payload;
      return listenToEmployeeProgress(orgCode).pipe(
        map(employeeProgress => setEmployeeProgress(employeeProgress)),
        catchError(error => of(setError(error.message)))
      );
    })
  );
};
