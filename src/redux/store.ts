import { RootState, combinedReducer, RootAction } from ".";
import { createStore, Store, applyMiddleware } from "redux";
import { createEpicMiddleware } from "redux-observable";
import { composeWithDevTools } from "redux-devtools-extension/logOnlyInProduction";
import epics from "./epics";

const epicMiddleware = createEpicMiddleware<
  RootAction,
  RootAction,
  RootState
>();

const store: Store<RootState, RootAction> = createStore(
  combinedReducer,
  composeWithDevTools({})(applyMiddleware(epicMiddleware))
);

epicMiddleware.run(epics);

export { store };
