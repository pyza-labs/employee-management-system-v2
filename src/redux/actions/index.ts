import { AuthAction } from "./AuthActions";
import { HrAction } from "./HrActions";

export * from "./HrActions";
export * from "./AuthActions";

export type RootAction = AuthAction | HrAction;
