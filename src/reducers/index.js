import { combineReducers } from 'redux';
import {SAVE_GEOHASH_ACTION, SAVE_LATLNT_ACTION} from '../actions';
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

const rootReducer = combineReducers({
  geohash: Geohash,
  routing: routerReducer,
  savelatlnt: SaveLatLen
});

export default rootReducer;
