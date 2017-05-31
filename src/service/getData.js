/**
 * Created by chenjinxin on 2017/3/25.
 */
import fetch from '../config/fetch';
import * as home from './tempdata/home'
import * as city from './tempdata/city'
import * as msite from './tempdata/msite'
import * as search from './tempdata/search'
import * as food from './tempdata/food'
import * as shop from './tempdata/shop'
import * as login from './tempdata/login'
import * as confirm from './tempdata/confirm'
import * as order from './tempdata/order'
import * as service from './tempdata/service'
import * as addDetail from './tempdata/addDetail'
import * as addresspart from './tempdata/address'
import * as vip from './tempdata/vip'
import * as hongbao from './tempdata/hongbao'

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

//获取food页面的 category 种类列表

let foodCategory = (latitude, longitude) => fetch('GET', '/shopping/v2/restaurant/category', {
  latitude,
  longitude
});

//获取food页面的配送方式

let foodDelivery = (latitude, longitude) => fetch('GET', '/shopping/v1/restaurants/delivery_modes', {
  latitude,
  longitude,
  kw: ''
});


//获取food页面的商家属性活动列表


let foodActivity = (latitude, longitude) => fetch('GET', '/shopping/v1/restaurants/activity_attributes', {
  latitude,
  longitude,
  kw: ''
});

//获取短信验证码

let mobileCode = phone => fetch('POST', '/v4/mobile/verify_code/send', {
  mobile: phone,
  scene: 'login',
  type: 'sms'
});

//账号密码登录

let accountLogin = (username, password, captcha_code) => fetch('POST', '/v2/login', {username, password, captcha_code});


let getcaptchas = () => fetch('POST', '/v1/captchas', {});

//检测账号是否存在

let checkExsis = (checkNumber, type) => fetch('GET', '/v1/users/exists', {
  [type]: checkNumber,
  type
});

//手机号登录
let sendLogin = (code, mobile, validate_token) => fetch('POST', '/v1/login/app_mobile', {
	code,
	mobile,
	validate_token
});

/**
 * 发送帐号
 */

let sendMobile = (sendData, captcha_code, type, password) => fetch('POST', '/v1/mobile/verify_code/send', {
  action: "send",
  captcha_code,
  [type]: sendData,
  type: "sms",
  way: type,
  password,
});

/**
 * 获取food页面的商家属性活动列表
 */

let foodMenu = restaurant_id => fetch('GET', '/shopping/v2/menu', {
  restaurant_id
});

/**
 * 获取商铺评价列表
 */

let getRatingList = (offset, tag_name = '') => fetch('GET', '/ugc/v2/restaurants/834828/ratings', {
  has_content: true,
  offset,
  limit: 10,
  tag_name
});

/**
 * 获取商铺评价分数
 */

let ratingScores = shopid => fetch('GET', '/ugc/v2/restaurants/' + shopid + '/ratings/scores', {});


/**
 * 获取商铺评价分类
 */

let ratingTags = shopid => fetch('GET', '/ugc/v2/restaurants/' + shopid + '/ratings/tags', {});


/**
 * 创建临时数据
 */
const setpromise = data => {
  return new Promise((resolve, reject) => {
    resolve(data)
  })
}

let shopDetails = (shopid, latitude, longitude) => fetch('GET', '/shopping/restaurant/' + shopid, {
  'extras[]': 'activities',
  'extras[]': 'albums',
  'extras[]': 'license',
  'extras[]': 'identification',
  'latitude': latitude,
  'longitude': longitude
});

// /**
//  * 获取订单列表
//  */

// var getOrderList = (user_id, offset) => fetch('GET', '/bos/v2/users/' + user_id + '/orders', {
//   limit: 10,
//   offset,
// });
var getOrderList = (user_id, offset) => setpromise(order.orderList);

export {cityGuess,
  hotCity,
  groupCity,
  currentCity,
  searchPlace,
  msiteAdress,
  msiteFoodTypes,
  shopList,
  searchRestaurant,
  foodCategory,
  foodDelivery,
  foodActivity,
  mobileCode,
  getcaptchas,
  accountLogin,
  checkExsis,
  sendLogin,
  sendMobile,
  shopDetails,
  foodMenu,
  getRatingList,
  ratingScores,
  ratingTags,
  getOrderList
}
