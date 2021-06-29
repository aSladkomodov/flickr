import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { composeWithDevTools } from "redux-devtools-extension";
import mainReducer from "../features/main/reducer";
import mainSage from "../features/main/saga";

const sagaMiddleware = createSagaMiddleware();

const composeMethod =
  process.env.NODE_ENV === "development" ? composeWithDevTools : compose;

export const store = createStore(
  combineReducers({
    main: mainReducer,
  }),
  composeMethod(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(mainSage);
