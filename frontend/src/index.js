import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { reducer as tooltipReducer } from "redux-tooltip";

import validatorReducer from "./store/reducers/validatorReducer";
import AppContainer from "./containers/AppContainer";

const rootReducer = combineReducers({
  validators: validatorReducer,
  tooltip: tooltipReducer
});

let composeEnhancers = compose;
let applyTheseMiddleware = undefined;

if (process.env["NODE_ENV"] === "development") {
  const logger = store => {
    return next => {
      return action => {
        console.log("[Middleware] Dispatching", action);
        const result = next(action);
        console.log("[Middleware] next state", store.getState());
        return result;
      };
    };
  };
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  applyTheseMiddleware = applyMiddleware(logger, thunk);
} else {
  applyTheseMiddleware = applyMiddleware(thunk);
}

const store = createStore(
  rootReducer,
  composeEnhancers(applyTheseMiddleware)
);

ReactDOM.render(
  <Provider store={store}>
    <AppContainer title="Mini Validator List" />
  </Provider>,
  document.querySelector("#app")
);
