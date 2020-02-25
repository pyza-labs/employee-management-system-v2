import { AuthAction } from "./AuthActions";
import { HRAction } from "./HRActions";
import { EmployeeAction } from "./EmployeeActions";

export * from "./HRActions";
export * from "./AuthActions";
export * from "./EmployeeActions";

export type RootAction = AuthAction | HRAction | EmployeeAction;
