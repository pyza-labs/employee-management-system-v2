import { RootEpic } from ".";
import { of, from } from "rxjs";
import { filter, switchMap, map, catchError, mapTo } from "rxjs/operators";
import { isOfType } from "typesafe-actions";
import { HrActionType, setError, setMessage, setQuestions } from "../actions";
import {
  listenToHrQuestionsState,
  updateImportantHandler,
  deleteQuestionHandler
} from "../../repos";

export const listenToHrQuestionsStateEpic: RootEpic = action$ => {
  return action$.pipe(
    filter(isOfType(HrActionType.ListenToHrQuestionsState)),
    switchMap(action => {
      const { orgCode } = action.payload;
      return listenToHrQuestionsState(orgCode).pipe(
        map(questions => setQuestions(questions)),
        catchError(error => of(setError(error.message)))
      );
    })
  );
};

export const updateQuestionEpic: RootEpic = action$ => {
  return action$.pipe(
    filter(isOfType(HrActionType.UpdateImportantStatus)),
    switchMap(action => {
      const { checked, docId } = action.payload;
      return updateImportantHandler(checked, docId).pipe(
        mapTo(setMessage("Question Updated Successfully")),
        catchError(error => of(setError(error.message)))
      );
    })
  );
};

export const deleteQuestionEpic: RootEpic = action$ => {
  return action$.pipe(
    filter(isOfType(HrActionType.DeleteQuestion)),
    switchMap(action => {
      const { docId } = action.payload;
      return deleteQuestionHandler(docId).pipe(
        mapTo(setMessage("Question Deleted Succeefully")),
        catchError(error => of(setError(error.message)))
      );
    })
  );
};
// message.success("Question deleted successfully");
