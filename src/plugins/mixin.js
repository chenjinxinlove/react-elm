/**
 * Created by chen on 2017/3/30.
 */

 function getImgPath (path) {
  let imgBaseUrl = 'https://fuss10.elemecdn.com';
    let suffix;
    if (!path) {
      return 'http://test.fe.ptdev.cn/elm/elmlogo.jpeg'
    }
    if (path.indexOf('jpeg') !== -1) {
      suffix = '.jpeg'
    } else {
      suffix = '.png'
    }
    let url = '/' + path.substr(0, 1) + '/' + path.substr(1, 2) + '/' + path.substr(3) + suffix;
    return imgBaseUrl + url
}

export {getImgPath }
