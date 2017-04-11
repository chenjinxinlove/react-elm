/**
 * Created by chenjinxin on 2017/3/25.
 */
import './header.scss'
import React from 'react';
import {Link} from 'react-router';
import { connect } from 'react-redux';


class Header extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      userInfo : false,
      signinUp : false

    };
    this.backgo = this.backgo.bind(this);
  }

  backgo () {
    let gobf = this.props.goBackFun;
    if(gobf){
      gobf.go(-1);
    }
  }

  componentWillMount(){
    let userInfo =  this.props.userInfo;
    let us = this.props.signinUp;

    if (us) {
      this.setState({
        signinUp: true
      })
    }

    if (userInfo.user_id) {
      this.setState({
        userInfo : true
      })
    }
  }

  render() {
    const {headTitle, goBack, signinUp, children} = this.props;
    return (
        <header id="head_top">
          {
              Array.isArray(children) ? children.map(child => {
              return (
                child && child.props.name == 'logo' || child.props.name == 'search' ? child : ''
              )
            }) : children && (children.props.name == 'logo' || children.props.name == 'search') ? children : ''

          }
          {
            goBack ?
              <section className="head_goback"  onClick={ this.backgo }>
                <i className="fa fa-angle-left fa-2x" aria-hidden="true"></i>
              </section>:
              ''
          }
          {
            signinUp ?
              <Link to={ this.state.userInfo ? '/profile' : '/login' } className="head_login">
                {
                  this.state.userInfo ? < i className="fa fa-user-circle-o" aria-hidden="true"></i> :<span className="login_span">登录|注册</span>
                }
              </Link>
            : ''
          }
          {
            headTitle ?
              <section className="title_head ellipsis">
                <span className="title_text">{headTitle}</span>
              </section>:
              ''
          }
          {
          Array.isArray(children) ? children.map(child => {
           return (
             child && child.props.name == 'edit' || child.props.name == 'msite-title' || child.props.name == 'changecity' || child.props.name == 'changeLogin'? child : ''
             )
           }) : children && (children.props || children.props.name == 'edit' || children.props.name == 'msite-title' ||  children.props.name == 'changecity' || children.props.name == 'changeLogin' )? children : ''

          }
        </header>
    )
  }
}


function mapStateToProps(state) {
  let userInfo = state.userInfo;
  return {
    userInfo
  }
}

export default connect(mapStateToProps)(Header);
