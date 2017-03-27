/**
 * Created by chenjinxin on 2017/3/27.
 */
import './msite.scss';
import React, {Component} from 'react';

import Header from 'components/header/index';

class Msite extends Component {
  constructor(props){
    super(props);
    this.state = {
      geohash: '',//city页面传递过来的地址geohash
      msietTitle: '请选择地址...',//msiet页面头部标题
      foodTypes: [],//食品分类列表
      hashGetData: false,//是否已经获取地理位置数据，成功之后在获取商铺的列表信息
      imgBaseUrl//图片域名地址
    }
  }

  componentWillMount () {
    let geohash = this.props.query.geohash || 'wtw3sm0q087';

  }

  render() {
    return (
      <div>
        <Header signinUp='home' headTitle='ddd' goBack='ddd' userInfo="ddd"></Header>
        <nav className="msite_nav">
          <div className="swiper-container">

          </div>
        </nav>
      </div>
    )
  }
}

export default Msite;
