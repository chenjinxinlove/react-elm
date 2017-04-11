/**
 * Created by chenjinxin on 2017/3/25.
 */
import './home.scss';
import React from 'react';
import { Link } from 'react-router';
import { map } from 'underscore';

import Header from 'components/header/index.js';
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
  reload = () => {
    window.location.reload();
  }

  render () {
    let { hotCity, guessCityid, guessCity, groupCity}  = this.state;
    let  sortGroupCity = () => {
      let sortObj = {};
      for (let i = 65; i <= 90; i++) {
        if (groupCity[String.fromCharCode(i)]) {
          sortObj[String.fromCharCode(i)] = groupCity[String.fromCharCode(i)];
        }
      }
      return sortObj;
    };
    return (
      <div>
        <Header signinUp='home'>
          <span name='logo' className="head_logo"  onClick={ this.reload}>ele.me</span>
        </Header>
        <nav className="city_nav">
          <div className="city_tip">
            <span>但前定位城市：</span>
            <span>定位不准时，请在城市列表中选择</span>
          </div>
          <Link to={'/city/' + guessCityid} className='guess_city'>
            <span>{guessCity}</span>
            <i className="fa fa-chevron-right fa-lg" aria-hidden="true" style={{color: '#ccc'}}></i>
          </Link>
        </nav>
        <section id="hot_city_container">
          <h4 className="city_title">热门城市</h4>
          <ul className="citylistul clear">
            {
              hotCity.map((item) => {
                return(
                    <Link to={'/city/' + item.id} key={item.id}>
                      <li>{item.name}</li>
                    </Link>
                  )
              })
            }
          </ul>
        </section>
        <section className="group_city_container">
          <ul className="letter_classify">
            {
              map(sortGroupCity(), (value, key) => {
                return (
                  <li className="letter_classify_li" key={key}>
                    <h4 className="city_title">
                      {key}
                      {key === 'A'? <span>（按字母排序）</span>: ''}
                    </h4>
                    <ul className="groupcity_name_container citylistul clear">
                      {
                        value.map((item) => {
                          return(
                          <Link to={'/city/' + item.id} key={item.id}>
                          <li>{item.name}</li>
                          </Link>
                          )
                        })
                      }
                    </ul>
                  </li>
                )
              })
            }
          </ul>
        </section>

      </div>
    )
  }

}

export default Home;
