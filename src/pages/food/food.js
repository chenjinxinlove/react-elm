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
import ShopList from 'components/common/ShopList/index.js';

class Food extends Component {
  constructor (props) {
    super(props);
    this.state = {
      geohash: '', // city页面传递过来的地址geohash
      headTitle: '', // msiet页面头部标题
      foodTitle: '', // 排序左侧头部标题
      restaurant_category_id: '', // 食品类型id值
      restaurant_category_ids: '', //筛选类型的id
      sortBy: '', // 筛选的条件
      category: null, // category分类左侧数据
      categoryDetail: null, // category分类右侧的详细数据
      sortByType: null, // 根据何种方式排序
      Delivery: null, // 配送方式数据
      Activity: null, // 商家支持活动数据
      delivery_mode: null, // 选中的配送方式
      support_ids: [], // 选中的商铺活动列表
      filterNum: 0, // 所选中的所有样式的集合
      confirmStatus: false, // 确认选择
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
  getCategoryIds = (id, name) => {
    this.setState({
      restaurant_category_ids: id,
      sortBy: '',
      foodTitle :  name,
      headTitle: name
    })
  }

  sortList = (event) => {
    this.setState({
      sortByType : event.target.getAttribute('data'),
      sortBy : ''
    })
  }

  //筛选选项中的配送方式选择
  selectDeliveryMode = (id) => {
    //delivery_mode为空时，选中当前项，并且filterNum加一
    let filterNum = this.state.filterNum;
    let delivery_mode;
    if (this.state.delivery_mode == null) {
      filterNum++;
      delivery_mode = id;
      //delivery_mode为当前已有值时，清空所选项，并且filterNum减一
    }else if(this.state.delivery_mode == id){
      filterNum--;
      delivery_mode = null;
      //delivery_mode已有值且不等于当前选择值，则赋值delivery_mode为当前所选id
    }else{
      delivery_mode = id;
    }
    this.setState({
      filterNum: filterNum,
      delivery_mode: delivery_mode
    })
  }

  //点击商家活动，状态取反
  selectSupportIds = (index,id) => {
    //数组替换新的值
    let support_ids = this.state.support_ids;
    support_ids.splice(index, 1, {status: !support_ids[index].status, id: id});
    //重新计算filterNum的个数
    let filterNum = this.state.delivery_mode == null? 0 : 1;
    support_ids.forEach(item => {
      if (item.status) {
        filterNum ++ ;
      }
    })
    this.setState({
      filterNum,
      support_ids
    })
  }
  //点击取消或者确认时，需要清空当已选的状态值
  clearAll = () => {
    let support_ids = this.state.support_ids;
    support_ids = support_ids.map(item => item.status = false);
    this.setState({
      delivery_mode : null,
      support_ids,
      filterNum : 0
    })
  }
  //点击确认时，将需要筛选的id值传递给子组
  confirmSelectFun = () => {
    //状态改变时，因为子组件进行了监听，会重新获取数据进行筛选

    this.setState({
      confirmStatus : !this.state.confirmStatus,
      sortBy : ''
    })
  }

  chooseType (type) {
    let foodTitle;
    if (this.state.sortBy !== type) {
      //food选项中头部标题发生改变，需要特殊处理
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
      if (type == 'food') {
        //将foodTitle 和 headTitle 进行同步
        this.setState({
          foodTitle: this.state.headTitle
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
        <Header headTitle={ this.state.headTitle } goBack='true' goBackFun={ this.props.router }></Header>
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
                      <ul className="sort_list_container" onClick={this.sortList}>
                        <li className="sort_list_li">
                           <p data="0" className={this.state.sortByType == 0 ? 'sort_select': '' }>
                            <span>智能排序</span>
                           </p>
                        </li>
                        <li className="sort_list_li">
                          <p data="5" className={this.state.sortByType == 5 ? 'sort_select': '' }>
                            <span>距离最近</span>
                          </p>
                        </li>
                        <li className="sort_list_li">
                          <p data="6" className={this.state.sortByType == 6 ? 'sort_select': '' }>
                            <span>销量最高</span>
                          </p>
                        </li>
                        <li className="sort_list_li">
                          <p data="1" className={this.state.sortByType == 1 ? 'sort_select': '' }>
                            <span>起送价最低</span>
                          </p>
                        </li>
                        <li className="sort_list_li">
                          <p data="2" className={this.state.sortByType == 2 ? 'sort_select': '' }>
                            <span>配送速度最快</span>
                          </p>
                        </li>
                        <li className="sort_list_li">
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
          <div className={ this.state.sortBy === 'activity' ? 'choose_type sort_item' : 'sort_item' } >
            <div className="sort_item_container" onClick={ this.chooseType.bind({}, 'activity') }>
              <div className="sort_item_border">
                <span className={ this.state.sortBy === 'activity' ? 'category_title' : ''  }>筛选</span>
              </div>
            </div>
            <section>
              {
                this.state.sortBy === 'activity' ?
                  <section className="sort_detail_type filter_container">

                    <section style={{width: '100%'}}>
                      <header className="filter_header_style">配送方式</header>
                      <ul className="filter_ul">
                        {
                          this.state.Delivery.map((item) => {
                            return (
                              <li key={item.id} className="filter_li" onClick={this.selectDeliveryMode.bind({},item.id)}>
                                <span className="{this.state.delivery_mode == item.id ? 'selected_filter' : ''}">{item.text}</span>
                              </li>
                            )
                          })
                        }

                      </ul>
                    </section>
                    <section style={{width: '100%'}}>
                      <header className="filter_header_style">商家属性（可以多选）</header>
                      <ul className="filter_ul" style={{paddingBottom: '.5rem'}}>
                        {
                          this.state.Activity.map( (item, index) =>{
                            return(
                              <li key={item.id} className="filter_li" onClick={this.selectSupportIds.bind({}, index, item.id)}>
                                {
                                  !this.state.support_ids[index].status ? <span className="filter_icon" style={{color: '#' + item.icon_color, borderColor: '#' + item.icon_color}} >{item.icon_name}</span> : ''
                                }

                                <span className={this.state.support_ids[index].status ? 'selected_filter' : '' }>{item.name}</span>
                              </li>
                            )
                          } )
                        }
                      </ul>
                    </section>
                    <footer className="confirm_filter">
                      <div className="clear_all filter_button_style" onClick={this.clearAll}>清空</div>
                      <div className="confirm_select filter_button_style" onClick={this.confirmSelectFun}>确定
                        {
                          this.state.filterNum ?  <span>({this.state.filterNum})</span> : ''
                        }
                      </div>
                    </footer>

                  </section>
                  :''
              }
            </section>
          </div>
        </section>
        <section className="shop_list_container">
          <ShopList geohash={this.state.geohash} restaurantCategoryId={this.state.restaurant_category_id} restaurantCategoryIds={this.state.restaurant_category_ids} sortByType={this.state.sortByType} deliveryMode={this.state.delivery_mode} confirmSelect={this.state.confirmStatus} supportIds={this.state.support}_ids  DidConfrim={this.clearAll}></ShopList>
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
