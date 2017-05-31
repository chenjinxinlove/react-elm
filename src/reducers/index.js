import { combineReducers } from 'redux';
import {SAVE_GEOHASH_ACTION, SAVE_LATLNT_ACTION, SAVE_USER_INFO, ADD_CART, REMOVE_CART, CLEAR_CART} from '../actions';
import { routerReducer } from 'react-router-redux';
import {
  setStore,
  getStore,
} from '../config/mUtils'


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

let mr = {
  avatar: '',
  username : '登录/注册',
  mobile : '登录后享受更多特权',
  balance : '0',
  gift_amount :  '0',
  point : '0',
  count: '0',
  pointNumber : '0',
  user_id:''
};

function SaveUserInfo(state = mr, action) {
  switch (action.type) {
    case SAVE_USER_INFO:
      let info = action['userInfo'];
      let validity = 30;
      let now = new Date();
      now.setTime(now.getTime() + validity * 24 * 60 * 60 * 1000);
      document.cookie = "USERID=" + info.user_id + ";expires=" + now.toGMTString();
      document.cookie = "SID=huRyTRd9QLij7NkbpHJoj3PQrx1eRiO6bAiw" + ";expires=" + now.toGMTString();
      return Object.assign({}, state, info)
    default:
      return state
  }
}

function Cart(state = {}, action) {
  switch (action.type) {
    case ADD_CART:
    var {
        shopid,
        category_id,
        item_id,
        food_id,
        name,
        price,
        specs,
        packing_fee,
        sku_id,
        stock
      } = action['cartItem'];
        var cart = state|| {};
        var shop = cart[shopid] || {};
        var category = shop[category_id] || {};
        var item = category[item_id] || {};
        if (item[food_id]) {
          item[food_id]['num']++;
        } else {
          item[food_id] = {
            "num" : 1,
            "id" : food_id,
            "name" : name,
            "price" : price,
            "specs" : specs,
            "packing_fee" : packing_fee,
            "sku_id" : sku_id,
            "stock" : stock
          };
          category[item_id] = item;
          shop[category_id] = category;
          cart[shopid] = shop;
      }

      //存入localStorage
      setStore('buyCart', cart);
          return cart;
    case REMOVE_CART:
    var {
        shopid,
        category_id,
        item_id,
        food_id,
        name,
        price,
        specs,
      }= action['cartItem'];
      var cart = state;
      var shop = (cart[shopid] || {});
      var category = (shop[category_id] || {});
      var item = (category[item_id] || {});
      if (item && item[food_id]) {
        if (item[food_id]['num'] > 0) {
          item[food_id]['num']--;
          setStore('buyCart', cart);
        } else {
          //商品数量为0，则清空当前商品的信息
          item[food_id] = null;
        }
      }
      return cart;
    case CLEAR_CART:

      let shopid = action['showId'];
      state[shopid] = null;
      setStore('buyCart', state);
      return state;
    default:
      return state
  }
}

const rootReducer = combineReducers({
  geohash: Geohash,
  routing: routerReducer,
  savelatlnt: SaveLatLen,
  userInfo: SaveUserInfo,
  cartList: Cart
});

export default rootReducer;
