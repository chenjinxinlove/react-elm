import { combineReducers } from 'redux'
;
import {
  WXUSERINFO,
  GET_WXINFO_ERR,
  GET_WXINFO_SUCCESS,
  SELECTXZ,
  GET_LIST_SUCCESS,
  GET_LIST_ERR
} from '../actions'

// 微信认证
function wxInfo(state = { }, action) {
  switch (action.type) {
    case GET_WXINFO_SUCCESS:
      return Object.assign({}, state, {
       userInfo: action['payload']
      });
    case  GET_WXINFO_ERR:
      return Object.assign({}, state, {
        error: action['error']
      });

    default:
      return state
  }
}

// 选择中小学
function selectXz(state = "", action) {
  switch (action.type) {
    case SELECTXZ:
          return action.selected
    default:
      return state
  }
}
// 取列表数据
function listData(state = { }, action) {
  switch (action.type) {
    case GET_LIST_SUCCESS:
      return Object.assign({}, state, {
        data: action['payload']
      });
    case  GET_LIST_ERR:
      return Object.assign({}, state, {
        error: action['error']
      });

    default:
      return state
  }
}

const rootReducer = combineReducers({
  wxInfo,
  selectXz,
  listData
});

export default rootReducer
