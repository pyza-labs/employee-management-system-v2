import { AuthStateType, AuthStateReducer } from "./AuthReducer";
import { HRStateType, HRStateReducer } from "./HRReducer";
import { EmployeeStateType, EmployeeStateReducer } from "./EmployeeReducer";
import { combineReducers } from "redux";

export const combinedReducer = combineReducers({
  Auth: AuthStateReducer,
  HR: HRStateReducer,
  Employee: EmployeeStateReducer
});

export interface RootState {
  Auth: AuthStateType;
  HR: HRStateType;
  Employee: EmployeeStateType;
}
