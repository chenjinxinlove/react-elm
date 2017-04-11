/**
 * Created by chen on 2017/4/10.
 */
import './service.scss';
import React, { Component } from 'react';

import Header from 'components/header/index.js';

class Service extends Component {
  constructor(props){
    super(props);
    this.state = {
      serviceData: null, //服务信息
      questionTitle: [], //问题标题
      questionDetail: [] //问题详情
    }
  }
  render() {
    return (
      <div className="rating_page">
        <Header headTitle='服务中心' goBack='true' goBackFun={ this.props.router }></Header>
        <section className="service_connect">
          <a href="https://ecs-im.ele.me/" className="service_left">
            <span>在线客服</span>
          </a>
          <a href="tel:10105757" className="service_right">
            <span>在线客服</span>
          </a>
        </section>
        {
          this.state.serviceData ?
            <section className="hot_questions">
              <h4 class="qustion_header">热门问题</h4>
            </section>: ''
        }

      </div>
    )
  }
}

export default Service;
