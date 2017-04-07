
export const SAVE_GEOHASH_ACTION = 'SAVE_GEOHASH_ACTION';
export const SAVE_LATLNT_ACTION = 'SAVE_LATLNT_ACTION';
export const SAVE_USER_INFO = 'SAVE_USER_INFO';

//保存geohash的action
export function saveGeohashAction(geohash) {
  return {
    type: 'SAVE_GEOHASH_ACTION',
    geohash: geohash
  }
}
//保存地理位置信息
export function saveLatLntActions(res) {
  return {
    type: 'SAVE_LATLNT_ACTION',
    res: res
  }
}

export function saveUserInfoActions(userInfo) {
  return {
    type: SAVE_USER_INFO,
    userInfo: userInfo
  }
}
