/**
 * Created by chen on 2017/3/8.
 */
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from '../reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import {routerMiddleware} from 'react-router-redux';
import { hashHistory } from 'react-router'

const loggerMiddleware = createLogger();
const reduxRouterMiddleware = routerMiddleware(hashHistory);

export default function configure(preloadedState) {
  return createStore(
    rootReducer,
    preloadedState,
    composeWithDevTools(
      applyMiddleware(
        thunkMiddleware,
        loggerMiddleware,
        reduxRouterMiddleware
      ),
    )
  )
}
