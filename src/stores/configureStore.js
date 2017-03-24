/**
 * Created by chen on 2017/3/8.
 */
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import rootReducer from '../reducers'
import { composeWithDevTools } from 'redux-devtools-extension';

const loggerMiddleware = createLogger()

export default function configureStore(preloadedState) {
  return createStore(
    rootReducer,
    preloadedState,
    composeWithDevTools(
      applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
      ),
    )
  )
}
