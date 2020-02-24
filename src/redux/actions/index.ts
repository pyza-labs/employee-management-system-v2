import { AuthAction } from "./AuthActions";
import { HrAction } from "./HrActions";
import { EmployeeAction } from "./EmployeeActions";

export * from "./HrActions";
export * from "./AuthActions";
export * from "./EmployeeActions";

export type RootAction = AuthAction | HrAction | EmployeeAction;
