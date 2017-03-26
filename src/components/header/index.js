/**
 * Created by chenjinxin on 2017/3/25.
 */
import './header.scss'
import React from 'react';
import {Link} from 'react-redux';


class Header extends React.Component {


  constructor(props) {
    super(props);
    this.backgo = this.backgo.bind(this);
  }

  backgo () {

  }

  render() {
    const {userInfo, headTitle, goBack} = this.props;
    window.console.log(userInfo, headTitle, goBack);
    return (
      <div>
        <header id="head_top">
          {
            goBack ?
              <section className="head_goback"  onClick={ this.backgo() }>
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <polygon points="12, 18 4,9 12, 0 " style={{fill: 'none', stroke: 'rgb(255, 255, 255)', strokeWidth:2}}></polygon>
                </svg>
              </section>:
              ''
          }


          {
            headTitle ?
              <section className="title_head ellipsis">
                <span className="title_text">{headTitle}</span>
              </section>:
              ''
          }
        </header>
      </div>
    )
  }
}

Header.propTypes = {
  signinUp: React.PropTypes.string,
  headTitle: React.PropTypes.string,
  goBack: React.PropTypes.string
};

export default Header;
