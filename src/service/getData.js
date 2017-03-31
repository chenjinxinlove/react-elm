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

// 获取msite页面地址信息
let msiteAdress = geohash => fetch('GET', '/v2/pois/' + geohash, {});

// 获取msite页面食品分类列表
let msiteFoodTypes = geohash => fetch('GET', '/v2/index_entry', {
  geohash,
  group_type: '1',
  'flags[]': 'F'
});
//获取msite商铺列表

let shopList = (latitude, longitude, offset, restaurant_category_id = '', restaurant_category_ids = '', order_by = '', delivery_mode = '', support_ids = []) => {
  let supportStr = '';
  support_ids.forEach(item => {
    if (item.status) {
      supportStr += '&support_ids[]=' + item.id;
    }
  })
  let data = {
    latitude,
    longitude,
    offset,
    limit: '20',
    'extras[]': 'activities',
    keyword: '',
    restaurant_category_id,
    'restaurant_category_ids[]': restaurant_category_ids,
    order_by,
    'delivery_mode[]': delivery_mode + supportStr
  };
  return fetch('GET', '/shopping/restaurants', data);
};

// 获取search页面搜索结果

let searchRestaurant = (geohash, keyword) => fetch('GET', '/v4/restaurants', {
  'extras[]': 'restaurant_activity',
  geohash,
  keyword,
  type: 'search'
});


export {cityGuess,
  hotCity,
  groupCity,
  currentCity,
  searchPlace,
  msiteAdress,
  msiteFoodTypes,
  shopList,
  searchRestaurant
}
