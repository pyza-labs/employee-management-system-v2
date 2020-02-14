import { AuthStateType, AuthStateReducer } from "./AuthReducer";
import { combineReducers } from "redux";

export const combinedReducer = combineReducers({
  Auth: AuthStateReducer
});

export interface RootState {
  Auth: AuthStateType;
}
