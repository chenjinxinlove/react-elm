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

export {cityGuess, hotCity, groupCity }
