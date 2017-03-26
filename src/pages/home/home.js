/**
 * Created by chenjinxin on 2017/3/25.
 */
import './home.scss';
import React from 'react';
import { Link } from 'react-router';

import Header from 'components/header/index';
import {cityGuess, hotCity, groupCity} from '../../service/getData';

class Home extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      guessCity: '',
      guessCityid: '',
      hotCity: [],
      groupCity: {}
    }
  }

  componentDidMount () {
    cityGuess().then(res => {
      this.setState({
        guessCity: res.name,
        guessCityid: res.id
      })
    });
    hotCity().then(res => {
      this.setState({
        hotCity: res
      })
    });
    groupCity().then(res => {
      this.setState({
        groupCity: res
      })
    })

  }

  render () {
    return (
      <div>
        <Header signinUp='home' headTitle='ddd' goBack='ddd' userInfo="ddd"></Header>
        <nav className="city_nav">
          <div className="city_tip">
            <span>但前定位城市：</span>
            <span>定位不准时，请在城市列表中选择</span>
          </div>
          <Link to='/city/' className='guess_city'>
            <span>{this.state.guessCityid}</span>
            <i className="fa fa-chevron-right fa-lg" aria-hidden="true" style={{color: '#ccc'}}></i>
          </Link>
        </nav>

      </div>
    )
  }

}

export default Home;
