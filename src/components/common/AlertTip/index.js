/**
 * Created by chen on 2017/4/7.
 */
import './index.scss';
import React, { Component } from 'react';

class AlertTip extends Component {
  render () {
    return (
      <div className="alet_container">
        <section className="tip_text_container">
          <div className="tip_icon">
            <span></span>
            <span></span>
          </div>
          <p className="tip_text">{ this.props.alertText }</p>
          <div className="confrim" onClick={ this.props.closeTip }>确定</div>
        </section>
      </div>
    )
  }
}

export default AlertTip;
