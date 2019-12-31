import { createStore, applyMiddleware  } from "redux";
import { rootReducer } from "./RootReducer";
import createSagaMiddleware from 'redux-saga'

export const sagaMiddleware = createSagaMiddleware();
export const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
