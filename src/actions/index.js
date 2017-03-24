/**
 * Created by chen on 2017/3/8.
 */
import { requstGet } from '../libs';
import configApi from '../config/apiConfig'

export const WXUSERINFO= 'WXUSERINFO';
export const GET_WXINFO_SUCCESS ='GET_WXINFO_SUCCESS';
export const GET_WXINFO_ERR = 'GET_WXINFO_ERR';
export const SELECTXZ = 'SELECTXZ';
export const GET_LIST_SUCCESS='GET_LIST_SUCCESS';
export const GET_LIST_ERR='GET_LIST_ERR';

export function fetchWxInfo(subreddit) {
 return (dispatch, getState) => {
   let params = {"code" : subreddit};
   requstGet(configApi['wxInfo'], params)
     .then((data) => {
       let result = data.data;
       if(data.status = "success") {
         dispatch({
           type: 'GET_WXINFO_SUCCESS',
           payload: result.result
         })
       } else {
         dispatch({
           type: 'GET_WXINFO_ERR',
           error: result.errmsg
         })
       }

     })
     .catch((err) =>{
       dispatch({
         type: 'GET_WXINFO_ERR',
         error: err
       })
     })
 }
}

export function selectAction (selected) {
  return { type : 'SELECTXZ',
    selected : selected
  }
}

export function getListDataAction(selected) {
  return (dispatch, getState) => {
    let params = {"t" : selected};
    requstGet(configApi['list'], params)
      .then((data) => {
        let result = data.data;
        if(data.status = "success") {
          dispatch({
            type: 'GET_LIST_SUCCESS',
            payload: result.result
          })
        } else {
          dispatch({
            type: ' GET_LIST_ERR',
            error: result.errmsg
          })
        }

      })
      .catch((err) =>{
        dispatch({
          type: ' GET_LIST_ERR',
          error: err
        })
      })
  }
}
