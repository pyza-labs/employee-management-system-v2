import { Epic, combineEpics } from "redux-observable";
import { RootAction } from "../actions";
import { RootState } from "../reducers";

import { listenToAuthStateEpic } from "./AuthEpics";

export default combineEpics(listenToAuthStateEpic);

export type RootEpic = Epic<RootAction, RootAction, RootState>;
