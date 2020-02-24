import { RootEpic } from ".";
import {
  HrActionType,
  setError,
  setMessage,
  setEmployeeQuestions
} from "../actions";
import { isOfType } from "typesafe-actions";
import { of, from } from "rxjs";
import { filter, switchMap, map, catchError, mapTo } from "rxjs/operators";
import { listenToEmployeeQuestions } from "../../repos";

export const listenToEmployeeQuestionsEpic: RootEpic = action$ => {
  return action$.pipe(
    filter(isOfType(HrActionType.ListenToHrQuestions)),
    switchMap(action => {
      const { orgCode } = action.payload;
      return listenToEmployeeQuestions(orgCode).pipe(
        map(questions => setEmployeeQuestions(questions)),
        catchError(error => of(setError(error.message)))
      );
    })
  );
};
