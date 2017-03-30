/**
 * Created by chen on 2017/3/30.
 */
import './index.scss';
import React, {Component} from 'react';
import { connect } from 'react-redux';

import {shopList} from '../../../service/getData';
import {getImgPath} from '../../../plugins/mixin';

import RatingStar from '../RatingStar'


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
    this.hideLoading = this.hideLoading.bind()
  }

  componentWillMount() {
    let that = this;
    const latLnt = this.props.res;
    async function getDataInit() {
      let res = await shopList(latLnt.latitude, latLnt.longitude);
      that.setState({
        shopListArr: [...res]
      })
    }
    getDataInit();
  }

  hideLoading() {
    this.setState({
      showLoading: false
    })
  }

  render () {
    return (
      <div className="shoplist_container">
        {
          this.state.shopListArr.length ?
            <ul>
              {
                this.state.shopListArr.map((item) => {
                  return (
                    <li key={item.id} className="shop_li">
                      <section>
                        <img src={getImgPath(item.image_path)} alt="" className="shop_img"/>
                      </section>
                      <hgroup className="shop_right">
                        <header className="shop_detail_header">
                          <h4 className={item.is_premium ? 'premium' : ''} className="shop_title ellipsis">{item.name}</h4>
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
                  )
                })
              }
            </ul>
            : <p className="empty_data">没有更多了</p>
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
