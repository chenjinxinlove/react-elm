/**
 * Created by chen on 2017/4/1.
 */
import './profile.scss';
import React, {Component} from 'react';
import { Link } from 'react-router';
import {connect} from 'react-redux';

import Header from 'components/header/index.js';
import FootGuide from 'components/footer/footGuide.js';


class Profile extends Component {
  constructor(props){
    super(props);
    this.state = {
      profiletitle: '我的',
      resetname: ''
    };
    this.parseInt = this.parseInt.bind(this);
  }
  parseInt(num) {

  }
  imgpath = () => {

  }
  render() {
    let userInfo = this.props.userInfo;
    let {
      avatar,
      username,
      mobile,
      balance,
      gift_amount,
      count,
      pointNumber,
      point} =  userInfo;
    return (
      <div>
        <Header headTitle={this.state.profiletitle} goBack='true' goBackFun={ this.props.router }></Header>
        <section>
          <section className="profile-number">
            {
              <Link className="profile-link" to={  userInfo.user_id ? '/profile/info': '/login' }>
                {
                  avatar ? <img src={ this.imgpath } alt="" className="privateImage"/>:
                    <span className="privateImage">
                      <i className="fa fa-user"  style={{fontSize: '50px',color:'#fff',margin:'5px 1px 15px 10px'}} aria-hidden="true"></i>
                    </span>
                }
                <div className="user-info">
                  <p>{ username }</p>
                  <p>
                    <span className="user-icon">
                      <i className="fa fa-mobile" aria-hidden="true"></i>
                    </span>
                    <span className="icon-mobile-number">{ mobile }</span>
                  </p>
                </div>
                <span className="arrow">
                  <i className="fa fa-angle-right" style={{color:'#fff'}} aria-hidden="true"></i>
                </span>
              </Link>
            }
          </section>
          <section className="info-data">
            <ul className="clear">
              <Link to="/balance">
                <li className="info-data-link">
                <span className="info-data-top">
                  <b> { parseInt(balance).toFixed(2) } </b>元
                </span>
                  <span className="info-data-bottom">我的余额</span>
                </li>
              </Link>
              <Link to="/benefit">
                <li className="info-data-link">
                <span className="info-data-top">
                  <b style={{color:'#ff5f3e'}}> { count } </b>个
                </span>
                  <span className="info-data-bottom">我的优惠</span>
                </li>
              </Link>
              <Link to="/balance">
                <li className="info-data-link">
                <span className="info-data-top">
                  <b style={{color:'#6ac20b'}}> {point} </b>分
                </span>
                  <span className="info-data-bottom">我的积分</span>
                </li>
              </Link>

            </ul>

          </section>
          <section className="profile-1reTe">
            <Link to="/order" className="myorder">
              <div className="myorder-div">
                <span>我的订单</span>
                <span className="myorder-divsvg">
                   <i className="fa fa-angle-right" aria-hidden="true"></i>
                </span>
              </div>
            </Link>
            <a href='https://home.m.duiba.com.cn/#/chome/index' className="myorder">
              <div className="myorder-div">
                <span>会员积分</span>
                <span className="myorder-divsvg">
                   <i className="fa fa-angle-right" aria-hidden="true"></i>
                </span>
              </div>
            </a>
            <Link to="/vipcard" className="myorder">
              <div className="myorder-div">
                <span>饿了吗会员卡</span>
                <span className="myorder-divsvg">
                   <i className="fa fa-angle-right" aria-hidden="true"></i>
                </span>
              </div>
            </Link>
          </section>
          <section className="profile-1reTe">
            <Link to="/service" className="myorder">
              <div className="myorder-div">
                <span>服务中心</span>
                <span className="myorder-divsvg">
                   <i className="fa fa-angle-right" aria-hidden="true"></i>
                </span>
              </div>
            </Link>
            <Link to="/download" className="myorder">
              <div className="myorder-div">
                <span>下载饿了么APP</span>
                <span className="myorder-divsvg">
                   <i className="fa fa-angle-right" aria-hidden="true"></i>
                </span>
              </div>
            </Link>
          </section>
        </section>
        <FootGuide></FootGuide>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    userInfo: state.userInfo
  }
}

export default connect(mapStateToProps)(Profile);
