
export const SAVE_GEOHASH_ACTION = 'SAVE_GEOHASH_ACTION';
export const SAVE_LATLNT_ACTION = 'SAVE_LATLNT_ACTION';

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
