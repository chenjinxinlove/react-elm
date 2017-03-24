/**
 * Created by chen on 2017/3/6.
 */
import configWx from '../config/weixinConfig';
import configApi from '../config/apiConfig';
import axios from 'axios';
import URI from 'urijs';

function generateGetCodeUrl(redirectURL) {

  return new URI("https://open.weixin.qq.com/connect/oauth2/authorize")
    .addQuery("appid", configWx.APP_ID)
    .addQuery("redirect_uri", redirectURL)
    .addQuery("response_type", "code")
    .addQuery("scope", "snsapi_userinfo")
    .addQuery("response_type", "code")
    .hash("wechat_redirect")
    .toString();
};


axios.defaults.baseURL = configApi.base;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.default.timeout = configApi.timeout;

function requstGet (url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    })
      .then(function (response) {
        resolve(response)
      })
      .catch(function (response) {
        reject(response);
      });
    //超时直接返回网络延时
    let timer = setTimeout(function () {
      clearTimeout(timer);
      reject("error");
    }, 10000)
  })
}

function requstPost (url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, {
      params: params
    })
      .then(function (response) {
        resolve(response)
      })
      .catch(function (response) {
        reject(response);
      });
    //超时直接返回网络延时
    let timer = setTimeout(function () {
      clearTimeout(timer);
      reject("error");
    }, 10000)
  })
}



export { generateGetCodeUrl, requstGet, requstPost};
