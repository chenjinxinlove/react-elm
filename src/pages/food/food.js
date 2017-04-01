/**
 * Created by chen on 2017/4/1.
 */
import './food.scss';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import Header from 'components/header/index.js';

import { saveLatLntActions } from '../../actions';

import {msiteAdress, foodCategory, foodDelivery, foodActivity} from '../../service/getData'
import {getImgPath} from '../../plugins/mixin';

class Food extends Component {
  constructor (props) {
    super(props);
    this.state = {
      headTitle: '',
      sortBy: '',// 筛选的条件
      foodTitle: '', // 排序左侧头部标题
      category: null, // category分类左侧数据,
      categoryDetail: null, // category分类右侧的详细数据
      restaurant_category_ids: null,
      sortByType: null, // 根据何种方式排序,
      Delivery: null, // 配送方式数据
      Activity: null, // 商家支持活动数据
      delivery_mode: null, // 选中的配送方式
      support_ids: [], // 选中的商铺活动列表
    }
    this.chooseType = this.chooseType.bind(this);
    this.selectCategoryName = this.selectCategoryName.bind(this);
    this.getCategoryIds = this.getCategoryIds.bind(this);
  }

  async componentDidMount () {
    let geohash = this.props.location.query.geohash;
    let headTitle = this.props.location.query.title;
    let foodTitle = headTitle;
    let restaurant_category_id = this.props.location.query.restaurant_category_id;
    this.setState({
      geohash, headTitle, restaurant_category_id,foodTitle
    });
    if (!this.props.latlnt.res) {
        let res =  await msiteAdress(geohash);
        this.props.saveLatLnt(res);
    }
    let latitude = this.props.latlnt.res.latitude, longitude = this.props.latlnt.res.longitude
      let category = await foodCategory(latitude, longitude);
      this.setState({
        category
      })
    category.forEach(item => {
      if (this.state.restaurant_category_id == item.id) {
        this.setState({
          categoryDetail: item.sub_categories
        })
      }
    })
    //获取筛选列表的配送方式
    let Delivery = await foodDelivery(latitude, longitude);
    //获取筛选列表的商铺活动
    let Activity = await foodActivity(latitude, longitude);
    //记录support_ids的状态，默认不选中，点击状态取反，status为true时为选中状态
    let support_ids = this.state.support_ids;
    Activity.forEach((item, index) => {
      support_ids[index] = {status: false, id: item.id};
    })
    this.setState({
      Delivery, Activity, support_ids
    })

  }
  selectCategoryName (id, index){
    //第一个选项 -- 全部商家 因为没有自己的列表，所以点击则默认获取选所有数据
    if (index === 0) {
      this.setState({
        restaurant_category_ids: null,
        sortBy : ''
      })
      //不是第一个选项时，右侧展示其子级sub_categories的列表
    }else{
      this.setState({
        restaurant_category_id : id,
        categoryDetail : this.state.category[index].sub_categories
      })

    }
  }
  getCategoryIds() {

  }
  chooseType (type) {
    if (this.state.sortBy !== type) {
      //food选项中头部标题发生改变，需要特殊处理
      let foodTitle;
      if (type == 'food') {
        foodTitle = '分类';
      }else{
        //将foodTitle 和 headTitle 进行同步
        foodTitle = this.state.headTitle;
      }
      this.setState({
        sortBy: type,
        foodTitle: foodTitle
      })
    }else{
      //再次点击相同选项时收回列表
      this.sortBy = '';
      if (type == 'food') {
        //将foodTitle 和 headTitle 进行同步
        this.setState({
          foodTitle : this.state.headTitle
        })
      }
      this.setState({
        sortBy: ''
      })
    }
  }


render() {

    return (
      <div className="food_container">
        <Header signinUp='home' headTitle='ddd' goBack='ddd' userInfo="ddd"></Header>
        <section className ='sort_container' >
          <div className={ this.state.sortBy === 'food' ? 'choose_type sort_item' : 'sort_item' } >
            <div className="sort_item_container" onClick={ this.chooseType.bind({}, 'food') }>
              <div className="sort_item_border">
                <span className={ this.state.sortBy === 'food' ? 'category_title' : ''  }>{ this.state.foodTitle }</span>
              </div>
            </div>
            {
              this.state.category ?
                <section>
                  {
                    this.state.sortBy === 'food' ?
                      <section className="category_container sort_detail_type">
                        <section className="category_left">
                          <ul>
                            {
                              this.state.category.map( (item, index) => {
                                return (
                                  <li key={ index } className={this.state.restaurant_category_id == item.id ? 'category_active category_left_li' : 'category_left_li'} onClick={this.selectCategoryName.bind({},item.id, index)}>
                                    <section>
                                      {
                                        index ? <img className="category_icon" src={ getImgPath(item.imgage_url) } alt=""/> : ''
                                      }
                                      <span>{item.name}</span>
                                    </section>
                                    <section>
                                      <span className="category_count">{item.count}</span>
                                    </section>
                                  </li>
                                )
                              })
                            }
                          </ul>
                        </section>
                        <section className="category_right">
                          <ul>
                            {
                              this.state.categoryDetail.map( (item, index) => {
                                return (
                                  <li className={ this.state.restaurant_category_ids == item.id || (!this.state.restaurant_category_ids)&&index == 0 ?"category_right_choosed category_right_li" :"category_right_li"} key={ item.index } onClick={this.getCategoryIds.bind({},item.id, item.name)}>
                                    <span>{item.name}</span>
                                    <span>{item.count}</span>
                                  </li>
                                  )
                              })
                            }
                          </ul>
                      </section>
                      </section>
                      :''
                  }
                </section>
                :''
            }
          </div>
          <div className={ this.state.sortBy === 'soot' ? 'choose_type sort_item' : 'sort_item' } >
            <div className="sort_item_container" onClick={ this.chooseType.bind({}, 'sort') }>
              <div className="sort_item_border">
                <span className={ this.state.sortBy === 'sort' ? 'category_title' : ''  }>排序</span>
              </div>
            </div>
            <section>
              {
                this.state.sortBy === 'sort' ?
                  <section className="sort_detail_type">
                      <ul className="sort_list_container">
                        <li class="sort_list_li">
                           <p data="0" className={this.state.sortByType == 0 ? 'sort_select': '' }>
                            <span>智能排序</span>
                           </p>
                        </li>
                        <li class="sort_list_li">
                          <p data="5" className={this.state.sortByType == 5 ? 'sort_select': '' }>
                            <span>距离最近</span>
                          </p>
                        </li>
                        <li class="sort_list_li">
                          <p data="6" className={this.state.sortByType == 6 ? 'sort_select': '' }>
                            <span>销量最高</span>
                          </p>
                        </li>
                        <li class="sort_list_li">
                          <p data="1" className={this.state.sortByType == 1 ? 'sort_select': '' }>
                            <span>起送价最低</span>
                          </p>
                        </li>
                        <li class="sort_list_li">
                          <p data="2" className={this.state.sortByType == 2 ? 'sort_select': '' }>
                            <span>配送速度最快</span>
                          </p>
                        </li>
                        <li class="sort_list_li">
                          <p data="3" className={this.state.sortByType == 3 ? 'sort_select': '' }>
                            <span>评分最高</span>
                          </p>
                        </li>
                      </ul>
                  </section>
                  :''
              }
            </section>
          </div>
        </section>
      </div>
    )
  }

}

function mapStateToProps(state) {
  let latlnt = state.savelatlnt;
  return { latlnt}
}
function mapDispatchToProps(dispatch) {
  return {
    saveLatLnt: (res) => dispatch(saveLatLntActions(res))
  }
}

export default connect(mapStateToProps, mapDispatchToProps )(Food);
