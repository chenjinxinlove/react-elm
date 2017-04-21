import './order.scss';
import React, { Component } from 'react';

import Header from 'components/header/index.js';
import Loading from 'components/common/Loading';
import {connect} from 'react-redux';

import {getOrderList} from '../../service/getData';

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderList: [], //订单列表
      offset: 0,
      preventRepeat: false,  //防止重复获取
      showLoading: true, //显示加载动画
    }
  }

  async componentDidMount(){
    let userInfo = this.props.userInfo;
    if (userInfo && userInfo.user_id) {
      let res = await getOrderList(userInfo.user_id, this.state.offset);
      let orderList = [...res];
      this.setState({
        orderList: orderList
      })
      this.hideLoading();
    }
  }

  hideLoading = () => {
    this.setState({
      showLoading: false
    })
    // if (!this.state.showLoading) {
    //   this.getFoodListHeight();
    //   // this.initCategoryNum();
    // }
  }

  render(){
    return (

      <div className="order_page">
        {
          this.state.showLoading || this.state.loadRatings ? <Loading></Loading> : ''
        }
        <Header headTitle="订单列表" goBack='true' goBackFun={ this.props.router }></Header>
        <ul className="order_list_ul">
          {
            this.state.orderList.map( item =>{
              return (
                <li className="order_list_li" key={item.id}>
                  <img src={item.restaurant_image_url} alt="" className="restaurant_image"/>
                  <section className="order_item_right">
                    <section >
                    <header className="order_item_right_header">
                      <section className="order_header">
                        <h4 >
                          <span className="ellipsis">{item.restaurant_name} </span>
                        </h4>
                        <p className="order_time">{item.formatted_created_at}</p>
                      </section>
                      <p className="order_status">
                        {item.status_bar.title}
                      </p>
                    </header>
                    <section className="order_basket">
                      <p className="order_name ellipsis">{item.basket.group[0][0].name}{item.basket.group[0].length > 1 ? ' 等' + item.basket.group[0].length + '件商品' : ''}</p>
                      <p className="order_amount">¥{item.total_amount.toFixed(2)}</p>
                    </section>
                  </section>
                  <div className="order_again">

                    
              </div>
              </section>
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    userInfo : state.userInfo
  }
}
export default connect(mapStateToProps)(Order);
