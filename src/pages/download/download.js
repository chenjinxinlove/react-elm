/**
 * Created by chen on 2017/4/10.
 */
import './download.scss';
import React, { Component } from 'react';
import Header from 'components/header/index.js';
import AlertTip from '../../components/common/AlertTip';

class Download extends Component {
  constructor(props) {
    super(props);
    this.state = {
      system: null,
      showAlert: false,
      alertText: null
    }
  }

  componentDidMount() {
    let u = navigator.userAgent, system;
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
    let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
      system = 'Android';
    } else if (isIOS) {
      system = 'IOS';
    } else {
      system = 'pc';
    }
    this.setState({
      system: system
    })
  }

  download = () => {
    //如果是ios用户则提示，否则直接下载
    if( this.state.system == 'IOS'){
      this.setState({
        showAlert: true,
        alertText: 'IOS用户请前往AppStore下载'
      })
    }else{
      try {
        let elemIF = document.createElement("iframe");
        elemIF.src = 'http://static10.elemecdn.com/uploads/androidapp/eleme6_4_1476672934695.apk';
        elemIF.style.display = "none";
        document.body.appendChild(elemIF);
      } catch (e) {
        alert('下载失败')
      }
    }
  };
  closeTip = () => {
    this.setState({
      showAlert:false
    })
  }
  render(){
    return(
      <div className="download_page">
        <Header  headTitle='下载' goBack='true' goBackFun={ this.props.router }></Header>
        <section className="dowload_container">
          <img src="../../images/elmlogo.jpeg" className="logo_img" alt=""/>
          <div className="determine" onClick={ this.download }>下载</div>
        </section>
        {
          this.state.showAlert ? <AlertTip alertText={ this.state.alertText } closeTip={ this.closeTip }></AlertTip> : ''
        }
      </div>
    )
  }
}

export default Download;
