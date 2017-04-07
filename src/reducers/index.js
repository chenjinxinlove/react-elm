import { combineReducers } from 'redux';
import {SAVE_GEOHASH_ACTION, SAVE_LATLNT_ACTION, SAVE_USER_INFO} from '../actions';
import { routerReducer } from 'react-router-redux';


function Geohash(state = "wtw3sm0q087", action) {
  switch (action.type) {
    case SAVE_GEOHASH_ACTION:
          return action.geohash;
    default:
      return state
  }
}

function SaveLatLen(state = {}, action) {
  switch (action.type) {
    case SAVE_LATLNT_ACTION:
          return Object.assign({}, state, {
            res: action['res']
          })
    default:
      return state
  }
}

function SaveUserInfo(state = {}, action) {
  switch (action.type) {
    case SAVE_USER_INFO:
      return Object.assign({}, state, {
        res: action['userInfo']
      })
    default:
      return state
  }
}

const rootReducer = combineReducers({
  geohash: Geohash,
  routing: routerReducer,
  savelatlnt: SaveLatLen,
  userInfo: SaveUserInfo
});

export default rootReducer;
