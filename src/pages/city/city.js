/**
 * Created by chen on 2017/3/27.
 */
import './city.scss';
import React, {Component} from 'react';

import Header from 'components/header/index';
import { currentCity, searchPlace } from '../../service/getData';
import { getStore, setStore } from '../../config/mUtils';

class City extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cityId: '',//当前城市id
      cityName: '',//当前城市名字
      inputValue: '',
      placeList: [],
      placeHistory: [],
      historyTitle: true, //默认显示搜索历史头部，点击搜索后隐藏
      placeNode: false //搜索无结果，显示提示
    };
    this.inputChange = this.inputChange.bind(this);
    this.postPois = this.postPois.bind(this);
    this.nextPage = this.nextPage.bind(this);
  }
  componentDidMount (){
    let cityId = this.props.params.cityid;
    currentCity(cityId).then(res => {
      this.setState({
        cityId: cityId,
        cityName: res.name
      })
    });
    //获取搜索历史记录
    if (getStore('placeHistory')) {
      this.setState({
        placeList: JSON.parse(getStore('placeHistory'))
      })
    }
  }
  inputChange(e) {
    let inputValue = e.target.value;
    this.setState({
      inputValue: inputValue
    })
  }
  postPois(e) {
    e.preventDefault();
    if (this.state.inputValue) {
      searchPlace(this.state.cityId, this.state.inputValue).then(res => {
        this.setState({
          historyTitle: false,
          placeList: res,
          placeNode: res.length ? false : true
        })
      })
    }
  }
  /**
 * 点击搜索结果进入下一页面时进行判断是否已经有一样的历史记录
 * 如果没有则新增，如果有则不做重复储存，判断完成后进入下一页
 */
  nextPage(index, geohash) {
    let history = getStore('placeHistory');
    let choosePlace = this.state.placeList[index];
    if (history) {
      let checkRepeat = false;
      this.state.placeHistory = JSON.parse(history);
      this.state.placeHistory.forEach(item => {
        if (item.geohash == geohash) {
          checkRepeat = true;
        }
      })
      if (!checkRepeat) {
        let placeHistory = this.state.placeHistory;
        placeHistory.push(choosePlace);
        this.setState({
          placeHistory: placeHistory
        })
      }
    } else {
      let placeHistory = this.state.placeHistory;
      placeHistory.push(choosePlace);
      this.setState({
        placeHistory: placeHistory
      })
    }
    setStore('placeHistory', this.state.placeHistory);
    this.props.router.push({pathname:'/msite', query:{geohash}})
  }
  render() {
    return (
      <div className="city_container">
        <Header signinUp='home' headTitle='ddd' goBack='ddd' userInfo="ddd"></Header>
        <form action="" className="city_form">
          <div>
            <input type="search" className="city_input input_style" placeholder="输入学校、商业楼、地址" required onChange={this.inputChange}/>
          </div>
          <div>
            <input type="submit" className="city_submit input_style" value="提交" onClick={ this.postPois }/>
          </div>
        </form>
        {
          this.state.historyTitle ? <header className="pois_search_history">搜索历史</header> : ''
        }
        <ul className="getpois_ul">
          {
            this.state.placeList.map((item, index) =>　{
              return (
                <li key={index} onClick={this.nextPage.bind({},index, item.geohash)} >
                  <h4 className="pois_name ellipsis">{item.name}</h4>
                  <p className="pois_address ellipsis">{ item.address }</p>
                </li>
              )
            })
          }
        </ul>
        {
          this.state.placeNode ? <div className="search_none_palce">很抱歉！无搜索结果</div> : ''
        }
      </div>

    )
  }
}

export default City;
