/**
 * Created by chenjinxin on 2017/3/25.
 */
import fetch from '../config/fetch';


// 获取首页默认地址
let cityGuess = () => fetch('GET', '/v1/cities', {
  type: 'guess'
});

// 获取首页热门城市

let hotCity = () => fetch('GET', '/v1/cities', {
  type: 'hot'
});

// 获取首页所有城市

let groupCity = () => fetch('GET', '/v1/cities', {
  type: 'group'
});

//获取当前所在城市

let currentCity = number => fetch('GET', '/v1/cities/' + number, {});

//获取搜索地址

let searchPlace = (cityId, value) => fetch('GET', '/v1/pois', {
  type: 'search',
  city_id: cityId,
  keyword: value
});

export {cityGuess, hotCity, groupCity, currentCity, searchPlace }
