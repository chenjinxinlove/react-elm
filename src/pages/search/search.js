/**
 * Created by chen on 2017/4/1.
 */
/**
 * Created by chen on 2017/3/31.
 */
import './search.scss';
import React, { Component } from 'react';

import Header from 'components/header/index.js';
import FootGuide from 'components/footer/footGuide.js';

import {searchRestaurant} from '../../service/getData'
import {getStore, setStore} from '../../config/mUtils'
import { Link } from 'react-router';
import {uniq} from 'underscore'

class Search extends Component {
  constructor(props){
    super(props);
    this.state = {
      geohash: '',
      searchValue: '',
      restaurantList: [],
      imgBaseUrl: 'https://fuss10.elemecdn.com', // 图片域名地址
      searchHistory: [], // 搜索历史记录
      showHistory: true, // 是否显示历史记录，只有在返回搜索结果后隐藏
      emptyResult: false, // 搜索结果为空时显示
    };
    this.checkInput = this.checkInput.bind(this);
    this.submitBtn = this.submitBtn.bind(this);
    this.clearAllHistory = this.clearAllHistory.bind(this);
    this.deleteHistory = this.deleteHistory.bind(this);
  }

  componentDidMount() {
    const geohash = this.props.params.geohash;
    this.setState({
      geohash: geohash
    })
    if (getStore('searchHistory')) {
      this.setState({
        searchHistory : JSON.parse(getStore('searchHistory'))
      })
    }
  }

  checkInput(e) {
    let value = e.target.value;
    if (this.state.searchValue === '') {
      this.setState({
        showHistory: true, //显示历史记录
        restaurantList: [], //清空搜索结果
        emptyResult: false, //隐藏搜索为空提示
        searchValue: value
      })
    } else {
      this.setState({
        searchValue: value
      })
    }

  }
  clearAllHistory() {
    this.setState({
      searchHistory: []
    });
    setStore('searchHistory', [])
  }

  deleteHistory(index) {
    let searchHistory = this.state.searchHistory;
    searchHistory.splice(index, 1);
    this.setState({
      searchHistory: searchHistory
    });
    setStore('searchHistory', searchHistory)
  }

  submitBtn(historyValue = '') {
    let that = this;

    async function searchTarget(historyValue) {
      let serVal;
      if (historyValue) {
        serVal = historyValue;
        that.setState({
          searchValue: historyValue
        })
      } else if (!that.state.searchValue) {
        return
      }
      that.setState({
        showHistory: false
      });
      //获取搜索结果
      if (!historyValue) {
        serVal = that.state.searchValue;
      }


      let restaurantList = await searchRestaurant(that.state.geohash,  serVal);
      that.setState({
        restaurantList: restaurantList,
        emptyResult: !restaurantList.length
      });
      let history = getStore('searchHistory');
      let searchHistory = [];
      if (history) {
        searchHistory = JSON.parse(history);
        searchHistory.push(serVal)
      }
      that.setState({
        searchHistory: uniq(searchHistory)
      });
      setStore('searchHistory',  uniq(searchHistory));

    }
    searchTarget(historyValue)
  }

  render () {
    return (
      <div className="paddingTop">
        <Header  headTitle='搜索' goBack='true' goBackFun={ this.props.router }></Header>
        <form action="" className="search_form">
          <input type="search" name="search" className="search_input" placeholder="请输入商家或美食名称"  onChange={ this.checkInput }/>
          <input type="button" name="submit" value="提交" className="search_submit" onClick={ this.submitBtn.bind({},'') } />
        </form>
        {
          this.state.restaurantList.length ?
            <section>
              <h4 className="title_restaurant">商家</h4>
              <ul className="list_container">
                {
                  this.state.restaurantList.map( item => {
                    return (
                      <Link key={ item.id } to={{ pathname:'/shop', query:{id: item.id} }}>
                        <li  className="list_li">
                          <section className="item_left">
                            <img src={ this.state.imgBaseUrl + item.image_path } alt="" className="restaurant_img"/>
                          </section>
                          <section className="item_right">
                            <div className="item_right_text">
                              <p>
                                <span>{ item.name }</span>
                              </p>
                              <p>月售 { item.month_sales }单</p>
                              <p>{ item.delivery_fee } 元起送 / 距离 { item.distance }</p>
                            </div>
                            <ul className="item_right_detail">
                              {
                                item.restaurant_activity.map( activities => {
                                  return (
                                    <li key={activities.id}>
                                      <span className="activities_icon" style={{ backgroundColor: '#' + activities.icon_color }}>{ activities.icon_name }</span>
                                      <span>{activities.name}</span>
                                      <span className="only_phone">(手机客户端专享)</span>
                                    </li>
                                  )
                                } )
                              }
                            </ul>
                          </section>
                        </li>
                      </Link>
                    )
                  })
                }
              </ul>
            </section>
            : ''
        }
        {
          this.state.searchHistory.length && this.state.showHistory ?

            <section className="search_history">
              <h4 className="title_restaurant">搜索历史</h4>
              <ul>
                {
                  this.state.searchHistory.map( (item, index) => {
                    return (
                      <li className="history_list" key={index}>
                        <span className="history_text ellipsis" onClick={this.submitBtn.bind({}, item)}>{item}</span>
                      <span  onClick={ this.deleteHistory.bind({}, index)} >
                        <i className="fa fa-times " aria-hidden="true" ></i>
                      </span>
                      </li>
                    )
                  })
                }
              </ul>
              <footer className="clear_history" onClick={this.clearAllHistory}>清空搜索历史</footer>
            </section>
            :''
        }
        {
          this.state.emptyResult ? <div className="search_none">很抱歉！无搜索结果</div> : ''
        }
        <FootGuide></FootGuide>
      </div>
    )
  }
}

export default Search;
