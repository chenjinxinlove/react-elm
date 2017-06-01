/**
 * Created by chen on 2017/3/30.
 */
import './index.scss';
import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { findDOMNode } from 'react-dom';

import {shopList} from '../../../service/getData';
import {getImgPath} from '../../../plugins/mixin';

import RatingStar from '../RatingStar';
import Loading from '../Loading';
import {showBack, animate, getStyle} from '../../../config/mUtils'


class ShopList extends Component {
  constructor(props){
    super(props);
    this.state = {
      offset: 0, // 批次加载店铺列表，每次加载20个 limit = 20
      shopListArr:[], // 店铺列表数据
      preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
      showBackStatus: false, //显示返回顶部按钮
      showLoading: true //显示加载动画
    }
    this.backTop = this.backTop.bind(this);
  }


  async componentDidMount() {
    //开始监听scrollTop的值，达到一定程度后显示返回顶部按钮
    showBack(status => {
      this.setState({
        showBackStatus : status
      })
    });
    const latLnt = this.props.res;
    const { restaurantCategoryId, restaurantCategoryIds, sortByType, deliveryMode, supportIds, confirmSelect, geohash } = this.props;
    let res = await shopList(latLnt.latitude, latLnt.longitude, this.state.offset,restaurantCategoryId );
    this.setState({
      shopListArr: [...res],
      showLoading: false
    });
    let el = window.document.getElementById('loaderMore');
    let windowHeight = window.screen.height;
    let height;
    let setTop;
    let paddingBottom;
    let marginBottom;
    let requestFram;
    let oldScrollTop;
    let scrollEl;
    let heightEl;
    let scrollType = el.attributes.type && el.attributes.type.value;
    let scrollReduce = 2;
    if (scrollType == 2) {
      scrollEl = el;
      heightEl = el.children[0];
    } else {
      scrollEl = document.body;
      heightEl = el;
    }

    el.addEventListener('touchstart', () => {
      height = heightEl.clientHeight;
      if (scrollType == 2) {
        height = height
      }
      setTop = el.offsetTop;
      paddingBottom = getStyle(el, 'paddingBottom');
      marginBottom = getStyle(el, 'marginBottom');
    }, false)

    el.addEventListener('touchmove', () => {
      loadMore();
    }, false)

    el.addEventListener('touchend', () => {
      oldScrollTop = scrollEl.scrollTop;
      moveEnd();
    }, false)

    const moveEnd = () => {
      requestFram = requestAnimationFrame(() => {
        if (scrollEl.scrollTop != oldScrollTop) {
          oldScrollTop = scrollEl.scrollTop;
          moveEnd()
        } else {
          cancelAnimationFrame(requestFram);
          height = heightEl.clientHeight;
          loadMore();
        }
      })
    }

    const loadMore = () => {
      if ((scrollEl.scrollTop + windowHeight) >= (height + setTop + paddingBottom + marginBottom - scrollReduce)) {
        this.loaderMore()
      }
    }
  }

  // backTop = () => {
  //   document.body.scrollTop= '0'
  // }

  //到达底部加载更多数据
  async loaderMore (){
    //防止重复请求
    if (this.state.preventRepeatReuqest) {
      return
    }
    let offset = this.state.offset + 20;
    this.setState({
      showLoading: true,
      preventRepeatReuqest:true,
      offset: offset
    });

    const latLnt = this.props.res;
    const { restaurantCategoryId } = this.props;

      let res = await shopList(latLnt.latitude, latLnt.longitude, offset,restaurantCategoryId );
      this.setState({
        shopListArr: [...this.state.shopListArr, ...res],
        showLoading: false
      });
    //当获取数据小于20，说明没有更多数据，不需要再次请求数据
    if (res.length < 20) {
      return
    }
    this.setState({
      preventRepeatReuqest: false
    })
  }

  render () {
    return (
      <div className="shoplist_container">
        {
          this.state.shopListArr.length ?
            <ul id="loaderMore" type="1">
              {
                this.state.shopListArr.map((item) => {
                  return (
                    <Link key={item.id + '1'} to={ {pathname: "shop",query:{geohash:this.props.geohash, id: item.id}}}>
                      <li key={item.id + '2'} className="shop_li">
                        <section>
                          <img src={getImgPath(item.image_path)} alt="" className="shop_img"/>
                        </section>
                        <hgroup className="shop_right">
                          <header className="shop_detail_header">
                            <h4 className={item.is_premium ? 'premium shop_title ellipsis' : 'shop_title ellipsis'} >{item.name}</h4>
                            <ul className="shop_detail_ul">
                              {
                                item.supports.map((item) => {
                                  return (
                                    <li className="supports" key={item.id}>{item.icon_name}</li>
                                  )
                                })
                              }
                            </ul>
                          </header>
                          <h5 className="rating_order_num">
                            <section className="rating_order_num_left">
                              <section className="rating_section">
                                <RatingStar rating={ item.rating }></RatingStar>
                                <span className="rating_num">{ item.rating }</span>
                              </section>
                              <section className="order_section">
                                月售{ item.recent_order_num }单
                              </section>
                            </section>

                            {
                              item.delivery_mode ?
                                <section className="rating_order_num_right">
                                  <span className="delivery_style delivery_left">{item.delivery_mode.text}</span>
                                  <span className="delivery_style delivery_right">准时达</span>
                                </section>: ''
                            }

                          </h5>
                          <h5 className="fee_distance">
                            <section className="fee">
                              ¥{item.float_minimum_order_amount}起送
                              <span className="segmentation">/</span>
                              {item.piecewise_agent_fee.tips}
                            </section>
                            <section className="distance_time">
                              <span>{item.distance > 1000? (item.distance/1000).toFixed(2) + 'km': item.distance + 'm'}
                                <span className="segmentation">/</span>
                              </span>
                              <span className="order_time">{item.order_lead_time}分钟</span>
                            </section>
                          </h5>
                        </hgroup>
                      </li>
                    </Link>
                  )
                })
              }
            </ul>
            : <p className="empty_data">没有更多了</p>
        }
        {
          this.state.showBackStatus ?
            <aside className="return_top"   >
              <i className="fa fa-arrow-up fa-lg" aria-hidden="true"></i>
            </aside> : ''
        }
        {
          this.state.preventRepeatReuqest ? <footer className="loader_more" >正在加载更多商家...</footer> : ''
        }
        {
          this.state.showLoading ? <Loading ></Loading> : ''
        }

      </div>
    )
  }
}



function mapStateToProps(state) {
  let res = state.savelatlnt.res;
  return { res}
}
function mapDispatchToProps(dispatch) {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShopList)
