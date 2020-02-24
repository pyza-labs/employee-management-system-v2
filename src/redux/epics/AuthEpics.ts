import { RootEpic } from ".";
import { of, from } from "rxjs";
import { filter, switchMap, map, catchError, mapTo } from "rxjs/operators";
import { isOfType } from "typesafe-actions";
import {
  AuthActionType,
  setCurrentUser,
  setError,
  setMessage
} from "../actions";
import {
  listenToAuthState,
  logout,
  signIn,
  resetPassword,
  signUp,
  uploadProfilePicture
} from "../../repos";
import { auth } from "firebase";

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

export const signInEpic: RootEpic = action$ => {
  return action$.pipe(
    filter(isOfType(AuthActionType.SignIn)),
    switchMap(action => {
      const { email, password, orgCode } = action.payload;
      if (!email || email.trim().length === 0) {
        return of(setError("Please enter your email"));
      }

      if (!password || password.trim().length === 0) {
        return of(setError("Please enter the password"));
      }

      if (!orgCode || orgCode.trim().length === 0) {
        return of(setError("Please enter a valid organisation code"));
      }

      return signIn(email, password, orgCode).pipe(
        mapTo(setMessage("You are now signed in")),
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

export const resetPasswordEpic: RootEpic = action$ => {
  return action$.pipe(
    filter(isOfType(AuthActionType.ResetPassword)),
    switchMap(action =>
      resetPassword(action.payload.email).pipe(
        mapTo(setMessage("Reset Link sent to registered Email ID")),
        catchError(error => of(setError(error.message)))
      )
    )
  );
};

export const signUpEpic: RootEpic = action$ => {
  return action$.pipe(
    filter(isOfType(AuthActionType.SignUp)),
    switchMap(action => {
      const { values, state, region } = action.payload;
      const { email, password } = values;
      return from(auth().createUserWithEmailAndPassword(email, password)).pipe(
        switchMap(credential => {
          return signUp(credential.user!.uid, values, state, region);
        }),
        mapTo(setMessage("Form Submitted Succefully")),
        catchError(error => of(setError(error.message)))
      );
    })
  );
};
