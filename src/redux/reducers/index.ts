import { AuthStateType, AuthStateReducer } from "./AuthReducer";
import { HrStateType, HrStateReducer } from "./HrReducer";
import { EmployeeStateType, EmployeeStateReducer } from "./EmployeeReducer";
import { combineReducers } from "redux";

export const combinedReducer = combineReducers({
  Auth: AuthStateReducer,
  Hr: HrStateReducer,
  Employee: EmployeeStateReducer
});

export interface RootState {
  Auth: AuthStateType;
  Hr: HrStateType;
}
