/**
 * Created by chenjinxin on 2017/3/27.
 */
import './msite.scss';
import '../../plugins/swiper.min.js'
import '../../styles/swiper.min.css'
import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Header from 'components/header/index.js';
import ShopList from 'components/common/ShopList/index.js';
import FootGuide from 'components/footer/footGuide.js';
import { saveGeohashAction, saveLatLntActions } from '../../actions';
import {msiteAdress, msiteFoodTypes, msiteShopList} from '../../service/getData'

class Msite extends Component {
  constructor(props){
    super(props);
    this.state = {
      geohash: '',//city页面传递过来的地址geohash
      msietTitle: '请选择地址...',//msiet页面头部标题
      foodTypes: [],//食品分类列表
      hashGetData: false,//是否已经获取地理位置数据，成功之后在获取商铺的列表信息
      imgBaseUrl:'https://fuss10.elemecdn.com'//图片域名地址
    }
    this.getCategoryId = this.getCategoryId.bind(this);
  }

  componentWillMount () {
    let geohash = this.props.location.query.geohash || 'wtw3sm0q087';
    // 保存geohash到store
    this.props.saveGeohash(geohash);
    let that = this;
    this.setState({
      geohash: geohash
    });
    async function getAddr() {
      let res =  await msiteAdress(geohash);
      that.props.saveLatLnt(res);
      that.setState({
        msietTitle: res.name,
        hashGetData: true
      })
    }
    getAddr()
  }

  componentDidMount () {
      msiteFoodTypes(this.state.geohash).then(res => {
        let resLength = res.length;
        let resArr = res.concat([]);
        let foorArr = [];
        for (let i = 0, j = 0; i < resLength; i += 8, j++) {
          foorArr[j] = resArr.splice(0, 8);
        }
        this.setState({
          foodTypes: foorArr
        })
      }).then(() => {
          new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            loop: true
          })
      })
  }
  getCategoryId(url){
    let urlData = decodeURIComponent(url.split('=')[1].replace('&target_name',''));
    if (/restaurant_category_id/gi.test(urlData)) {
      return JSON.parse(urlData).restaurant_category_id.id
    }else{
      return ''
    }
  }
  render() {
    return (
      <div>
        <Header signinUp='msite'>
          <Link to={'/search/' + this.state.geohash} className="link_search" name="search">
            <i className="fa fa-search" style={{color: '#fff'}} aria-hidden="true"></i>
          </Link>
          <Link to="/home" name="msite-title" className="msite_title">
            <span className="title_text ellipsis">{this.state.msietTitle}</span>
          </Link>
        </Header>
        <nav className="msite_nav">
          <div className="swiper-container">
            <div className="swiper-wrapper">
              {
                this.state.foodTypes.map((item, index) => {
                  return (
                    <div className="swiper-slide food_types_container" key={index} id="slide">
                      {
                        item.map((foodItem) => {
                          return (
                            foodItem.title !== '预订早餐'?
                              <Link key={foodItem.title} className="link_to_food" to={{pathname:'/food', query:{geohash: this.state.geohash, title: foodItem.title, restaurant_category_id: this.getCategoryId(foodItem.link)}}} >
                                <figure>
                                  <img src={this.state.imgBaseUrl + foodItem.image_url} alt=""/>
                                  <figcaption>{foodItem.title}</figcaption>
                                </figure>
                              </Link>:
                              <a href="https://zaocan.ele.me/" className="link_to_food">
                                <figure>
                                  <img src={this.state.imgBaseUrl + foodItem.image_url} alt=""/>
                                  <figcaption>{foodItem.title}</figcaption>
                                </figure>
                              </a>
                          )
                        })
                      }
                    </div>
                  )
                })
              }
            </div>
            <div className="swiper-pagination"></div>
          </div>
        </nav>
        <div className="shop_list_container">
          <header className="shop_header">
            <i className="shop_icon"></i>
            <span className="shop_header_title">附近商家</span>
          </header>
          {
            this.state.hashGetData ? <ShopList geohash={this.state.geohash}></ShopList> : ''
          }
        </div>
        <FootGuide></FootGuide>
      </div>
    )
  }
}

Msite.propTypes = {
  saveGeohash: React.PropTypes.func,
  saveLatLnt: React.PropTypes.func
};
function mapStateToProps() {

}

function mapDispatchToProps(dispatch) {
  return {
    saveGeohash: (geohash) => dispatch(saveGeohashAction(geohash)),
    saveLatLnt: (res) => dispatch(saveLatLntActions(res))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Msite)
