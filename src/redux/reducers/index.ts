import { AuthStateType, AuthStateReducer } from "./AuthReducer";
import { HrStateType, HrStateReducer } from "./HrReducer";
import { combineReducers } from "redux";

export const combinedReducer = combineReducers({
  Auth: AuthStateReducer,
  Hr: HrStateReducer
});

export interface RootState {
  Auth: AuthStateType;
  Hr: HrStateType;
}
