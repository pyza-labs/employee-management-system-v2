import { RootEpic } from ".";
import { of } from "rxjs";
import { filter, switchMap, map, catchError, mapTo } from "rxjs/operators";
import { isOfType } from "typesafe-actions";
import {
  AuthActionType,
  setCurrentUser,
  setError,
  setMessage
} from "../actions";
import { listenToAuthState, logout } from "../../repos";

export const listenToAuthStateEpic: RootEpic = action$ => {
  return action$.pipe(
    filter(isOfType(AuthActionType.ListenToAuthState)),
    switchMap(() => {
      return listenToAuthState().pipe(
        map(currentUser => setCurrentUser(currentUser)),
        catchError(error => of(setError(error.message)))
      );
    })
  );
};

export const logoutEpic: RootEpic = action$ => {
  return action$.pipe(
    filter(isOfType(AuthActionType.Logout)),
    switchMap(() =>
      logout().pipe(mapTo(setMessage("You have been logged out")))
    )
  );
};

//Network calls in epic
// rx marbles
//For async use switchMap not map
// no use of observale in map
// of to observable
// from to make promise an observable
