/**
 * Created by chen on 2017/4/12.
 */
import './shop.scss';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Loading from 'components/common/Loading';
import RatingStar from 'components/common/RatingStar';
import BuyCart from 'components/common/BuyCart';

import {msiteAdress, shopDetails, foodMenu, getRatingList, ratingScores, ratingTags} from '../../service/getData';
import { saveLatLntActions ,addCartActions, removeCartActions} from '../../actions';
import {getImgPath} from '../../plugins/mixin';
import BScroll from 'better-scroll';
import classNames from 'classnames';


class Shop extends Component {
  constructor(props){
    super(props);
    this.state = {
      geohash: '',//geohash位置信息
      shopId: null,//商店id值
      showLoading: true, //显示加载动画
      shopDetailData: null, //商铺详情
      menuList: [], //食品列表
      ratingList: null, //评价列表
      ratingOffset: 0, //评价获取数据offset值
      ratingScoresData: null, //评价总体分数
      ratingTagsList: null, //评价分类列表
      loadRatings: false, //加载更多评论是显示加载组件
      showActivities: false, //是否显示活动详情
      changeShowType: 'food',//切换显示商品或者评价
      categoryNum: [], //商品类型右上角已加入购物车的数量
      menuIndex: 0, //已选菜单索引值，默认为0
      menuIndexChange: true,//解决选中index时，scroll监听事件重复判断设置index的bug
      windowHeight: null, //屏幕的高度
      shopListTop: [], //商品列表的高度集合
      wrapperMenu: null,
      foodScroll: null,  //食品列表scroll
      TitleDetailIndex: null, //点击展示列表头部详情,
      receiveInCart: false,//购物车组件下落的原点是否到达目标位置
      totalPrice: 0,//总共价格
      cartFoodList: [],//购物车商品列表
      showMoveDot: [],//控制下落的小圆点显示隐藏
      choosedFoods: null, //当前选中食品数据
      showDeleteTip: false, //多规格商品点击减按钮，弹出提示框
      showSpecs: false,//控制显示食品规格
      specsIndex: 0, //当前选中的规格索引值
      upDate: false,//更新
      cartList: this.props.cartList,//监听购物车变化
      ratingTageIndex: 0, //评价分类索引

    }
    this.changeTgeIndex = this.changeTgeIndex.bind(this);
  }

  componentWillReceiveProps(){
    this.initCategoryNum()
  }

  componentWillMount() {
    this.setState({
      geohash: this.props.location.query.geohash,
      shopId: this.props.location.query.id
    })

  }


  showChooseList = (foods) => {
    let choosedFoods = null;
    if (foods) {
      choosedFoods = foods
    }
    this.setState({
      choosedFoods : choosedFoods,
      showSpecs: !this.state.showSpecs,
      specsIndex : 0
    })
  }

  totalNum = () => {
    let num = 0;
    this.state.cartFoodList.forEach(item => {
      num += item.num
    })
    return num;
  }

  deliveryFee = () => {
    if (this.state.shopDetailData) {
      return this.state.shopDetailData.float_delivery_fee;
    } else {
      return null
    }
  }

  componentDidMount() {
    this.initData();
    this.setState({
      windowHeight: window.innerHeight
    })
    //初始化购物车
    this.initCategoryNum();
  }

  async initData(){
    if (!this.props.savelatlnt) {
      //获取位置信息
      let res = await msiteAdress(this.state.geohash);
      // 记录当前经度纬度进入vuex
      this.props.saveLatLnt(res)
    }
    let shopId = this.state.shopId;
    //获取商铺信息
    let shopDetailData = await shopDetails(shopId, this.state.latitude, this.state.longitude);
    // //获取商铺食品列表
    let menuList = await foodMenu(shopId);
    // //评论列表
    let ratingList = await getRatingList(this.state.ratingOffset);
    // //商铺评论详情
    let ratingScoresData = await ratingScores(shopId);
    // //评论Tag列表
    let ratingTagsList = await ratingTags(shopId);

    this.setState({
      shopDetailData, menuList, ratingList, ratingScoresData, ratingTagsList
    })

    // this.RECORD_SHOPDETAIL(this.shopDetailData)
    // //隐藏加载动画
    this.hideLoading();
  }

  //显示下落圆球
  showMoveDotFun = (showMoveDot, elLeft, elBottom) => {
    let showM = [...this.state.showMoveDot, ...showMoveDot];
    this.setState({
      showMoveDot: showM, elLeft, elBottom
    })
  }
  //显示提示，无法减去商品
  showReduceTip(){
    this.setState({
      showDeleteTip : true
    })
    clearTimeout(this.state.timer);
    let timer = setTimeout(() => {
      clearTimeout(this.state.timer);
      this.setState({
        showDeleteTip : false
      })
    }, 3000);
    this.setState({
      timer
    })
  }

  mininumOrderAmount = () => {
    if (this.state.shopDetailData) {
      return this.state.shopDetailData.float_minimum_order_amount - this.state.totalPrice;
    } else {
      return null
    }
  }

  //记录当前所选规格的索引值
  chooseSpecs = (index) => {
    this.setState({
      specsIndex : index
    })
  }

  //多规格商品加入购物车
  addSpecs = (category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock) => {
    this.props.addCart({shopid: this.state.shopId, category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock});
    this.showChooseList();
    this.setState({
      upDate: !this.state.upDate
    })
  }

  showActivitiesFun = () => {
    this.setState({
      showActivities : !this.state.showActivities
    })
  }

  hideLoading = () => {
    this.setState({
      showLoading: false
    })
    if (!this.state.showLoading) {
      this.getFoodListHeight();
      // this.initCategoryNum();
    }
  }

  chartUpdate = () => {
    this.initCategoryNum()
  }

  shopCart = () => {
    return Object.assign({},this.state.cartList[this.props.shopId]);
  }

  /**
   * 初始化和shopCart变化时，重新获取购物车改变过的数据，赋值 categoryNum，totalPrice，cartFoodList，整个数据流是自上而下的形式，所有的购物车数据都交给vuex统一管理，包括购物车组件中自身的商品数量，使整个数据流更加清晰
   */
  initCategoryNum(){
    let newArr = [];
    let cartFoodNum = 0;

    this.setState({
       totalPrice : 0,
       cartFoodList : []
    })

    this.state.menuList.forEach((item, index) => {
      if (this.shopCart()&&this.shopCart()[item.foods[0].category_id]) {
        let num = 0;
        Object.keys(this.shopCart()[item.foods[0].category_id]).forEach(itemid => {
          Object.keys(this.shopCart()[item.foods[0].category_id][itemid]).forEach(foodid => {
            let foodItem = this.shopCart()[item.foods[0].category_id][itemid][foodid];
            num += foodItem.num;
            if (item.type == 1) {
              let totalPrice = this.state.totalPrice +  foodItem.num*foodItem.price;
              let cartFoodList = {};
              if (foodItem.num > 0) {
                cartFoodList[cartFoodNum] = {};
                cartFoodList[cartFoodNum].category_id = item.foods[0].category_id;
                cartFoodList[cartFoodNum].item_id = itemid;
                cartFoodList[cartFoodNum].food_id = foodid;
                cartFoodList[cartFoodNum].num = foodItem.num;
                cartFoodList[cartFoodNum].price = foodItem.price;
                cartFoodList[cartFoodNum].name = foodItem.name;
                cartFoodList[cartFoodNum].specs = foodItem.specs;
                cartFoodNum ++;
              }
              this.setState({
                cartFoodList: cartFoodList
              })
            }
          })
        });
        newArr[index] = num;

      }else{
        newArr[index] = 0;
      }
    })
    this.setState({
      totalPrice: this.state.totalPrice,
      categoryNum : [...newArr]
    })

  }

  getFoodListHeight(){
    const baseHeight = this.refs.shopheader.clientHeight;
    const chooseTypeHeight = this.refs.chooseType.clientHeight;
    const listContainer = this.refs.menuFoodList;
    const listArr = Array.from(listContainer.children[0].children);
    let shopListTop = [];
    listArr.forEach((item, index) => {
      shopListTop[index] = item.offsetTop - baseHeight - chooseTypeHeight;
    });
    this.setState({
      shopListTop : shopListTop
    });
    this.listenScroll(listContainer)
  }
  listenScroll(element){
    let oldScrollTop;
    let requestFram;
    let foodScroll = new BScroll(element, {
      probeType: 3,
      deceleration: 0.001,
      bounce: false,
      swipeTime: 2000,
      click: true,
    });

    let wrapperMenu = new BScroll('#wrapper_menu', {
      click: true,
    });

    foodScroll.on('scroll', (pos) => {
      this.state.shopListTop.forEach((item, index) => {
        if (this.state.menuIndexChange && Math.abs(Math.round(pos.y)) >= item) {
          this.setState({
            menuIndex : index
          })
        }
      })
    })
    this.setState({
      foodScroll: foodScroll,
      wrapperMenu: wrapperMenu
    })
  }

  changeShowType = (value) => {
    this.setState({
      changeShowType: value
    })
  }

  chooseMenu = (index) => {
    this.setState({
      menuIndex: index,
      menuIndexChange : false
    })
    this.state.foodScroll.scrollTo(0, -this.state.shopListTop[index], 400);
    this.state.foodScroll.on('scrollEnd', () => {
      this.setState({
        menuIndexChange : true
      })
    })
  }

  //获取不同类型的评论列表
  async changeTgeIndex (index, name){
    this.setState({
      ratingTageIndex : index,
      ratingOffset : 0,
      ratingTagName : name
    });

    let res = await getRatingList(this.state.ratingOffset, name);
    this.setState({
      ratingList : [...res]
    })
    // this.
    // this.$nextTick(() => {
    //   this.ratingScroll.refresh();
    // })
  }

  showTitleDetail = (index) =>{
    let  TitleDetailIndex;
    if (this.state.TitleDetailIndex == index) {
      TitleDetailIndex = null;
    }else{
      TitleDetailIndex = index;
    }
    this.setState({
      TitleDetailIndex:  TitleDetailIndex
    })
  }
  render() {
    let shopDetailData = this.state.shopDetailData;
    let choosedFoods = this.state.choosedFoods;
    let specsIndex = this.state.specsIndex;
    let ratingScoresData = this.state.ratingScoresData;

    return (
    <div>
      {
        this.state.showLoading || this.state.loadRatings ? <Loading></Loading> : ''
      }
      {
        !this.state.showLoading ?
          <section className="shop_container">
            <header className="shop_detail_header" ref="shopheader" style={{ zIndex: this.state.showActivities? '14':'10' }}>
              <img src={ shopDetailData ? getImgPath(shopDetailData.image_path) : '' } alt="" className="header_cover_img"/>
              <section className="description_header">
                <Link to="/shop/shopDetail" className="description_top">
                  <section className="description_left">
                    <img src={ this.state.shopDetailData ? getImgPath(this.state.shopDetailData.image_path) : '' } alt=""/>
                  </section>
                  <section className="description_right">
                    <h4 className="description_title ellipsis">{shopDetailData.name}</h4>
                    <p className="description_text">商家配送／{shopDetailData.order_lead_time}分钟送达／配送费¥{shopDetailData.float_delivery_fee}</p>
                    <p className="description_promotion ellipsis">公告：{shopDetailData.promotion_info || '欢迎光临，用餐高峰期请提前下单，谢谢。'}</p>
                  </section>
                  <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" version="1.1" className="description_arrow" >
                    <path d="M0 0 L8 7 L0 14"  stroke="#fff" strokeWidth="1" fill="none"/>
                  </svg>
                </Link>
                {
                  shopDetailData.activities ?
                    <footer className="description_footer" onClick={ this.showActivitiesFun }>
                      <p className="ellipsis">
                        <span className="tip_icon" style={{backgroundColor: '#' + shopDetailData.activities[0].icon_color, borderColor: '#' + shopDetailData.activities[0].icon_color}}>{shopDetailData.activities[0].icon_name}</span>
                      <span>{shopDetailData.activities[0].description}（APP专享）</span>
                    </p>
                    <p>{shopDetailData.activities.length}个活动</p>
                    </footer> : ''
                }
              </section>
              </header>
            {
              this.state.showActivities ?
                <section className="activities_details animated fadeIn">
                  <h2 className="activities_shoptitle">{shopDetailData.name}</h2>
                  <h3 className="activities_ratingstar">
                    <RatingStar rating={shopDetailData.rating}></RatingStar>
                  </h3>
                  <section className="activities_list">
                    <header className="activities_title_style"><span>优惠信息</span></header>
                    <ul>
                      {
                        shopDetailData.activities.map(item => {
                          return (
                            <li key={item.id}>
                              <span className="activities_icon" style={{backgroundColor: '#' + item.icon_color, borderColor: '#' + item.icon_color}}>{item.icon_name}</span>
                              <span>{item.description}（APP专享）</span>
                            </li>
                          )
                        })
                      }
                    </ul>
                    </section>
                    <section className="activities_shopinfo">
                      <header className="activities_title_style"><span>商家公告</span></header>
                      <p>{shopDetailData.promotion_info || '欢迎光临，用餐高峰期请提前下单，谢谢。'}</p>
                    </section>
                    <svg width="60" height="60" className="close_activities" onClick ={this.showActivitiesFun}>
                      <circle cx="30" cy="30" r="25" stroke="#555" strokeWidth="1" fill="none"/>
                      <line x1="22" y1="38" x2="38" y2="22" style={{stroke:'#999',strokeWidth:2}}/>
                      <line x1="22" y1="22" x2="38" y2="38" style={{stroke:'#999',strokeWidth:2}}/>
                    </svg>
                </section> : ''
            }
            <section className="change_show_type" ref="chooseType">
              <div>
                <span className={ this.state.changeShowType  =="food" ? 'activity_show' : ''} onClick={this.changeShowType.bind({}, 'food')}>商品</span>
              </div>
              <div>
                <span className= {this.state.changeShowType  =="rating" ? 'activity_show' : ''} onClick={this.changeShowType.bind({}, 'rating')}>评价</span>
              </div>
            </section>
            {
              this.state.changeShowType === 'food' ?
                <section className="food_container">
                  <section className="menu_container">
                    <section className="menu_left" id="wrapper_menu">
                      <ul>
                        {
                          this.state.menuList.map((item, index) => {
                            return (
                              <li className={ this.state.menuIndex === index ? 'menu_left_li activity_menu' : 'menu_left_li' } onClick={ this.chooseMenu.bind({},index) } key={index}>
                                {
                                  item.icon_url ?<img src={getImgPath(item.icon_url)}/> : ''
                                }
                                <span>{item.name}</span>
                                { this.state.categoryNum[index]&&item.type == 1 ?  <span className="category_num">{this.state.categoryNum[index]}</span> : ''}
                              </li>
                            )
                          })
                        }
                      </ul>
                    </section>
                    <section className="menu_right" ref="menuFoodList">
                      <ul>
                        {
                          this.state.menuList.map((item, index) => {
                            return (
                              <li key={index}>
                                <header className="menu_detail_header">
                                  <section className="menu_detail_header_left">
                                    <strong className="menu_item_title">{item.name}</strong>
                                    <span className="menu_item_description">{item.description}</span>
                                  </section>
                                  <span className="menu_detail_header_right"></span>
                                  {
                                    this.state.TitleDetailIndex === index ?
                                    <p className="description_tip" >
                                      <span>{item.name}</span>
                                      {item.description}
                                    </p> : ''
                                  }
                                </header>
                                {
                                  item.foods.map((foods, foodindex) => {
                                    return (
                                      <section key={foodindex} className="menu_detail_list">
                                        <div  className="menu_detail_link">
                                          <section className="menu_food_img">
                                            <img src={getImgPath(foods.image_path)}/>
                                          </section>
                                          <section className="menu_food_description">
                                            <h3 className="food_description_head">
                                              <strong className="description_foodname">{foods.name}</strong>
                                              {
                                                foods.attributes.length?
                                                  <ul  className="attributes_ul">
                                                    {
                                                      foods.attributes.map((attribute, foodi) => {
                                                        return (
                                                          <li key={foodi} style={{color: '#' + attribute.icon_color,borderColor:'#' +attribute.icon_color}}  className={ attribute.icon_name == '新' ?  'attribute_new': '' }>
                                                           <p style={{color: attribute.icon_name == '新'? '#fff' : '#' + attribute.icon_color}}>{attribute.icon_name == '新'? '新品':attribute.icon_name}</p>
                                                          </li>
                                                        )
                                                      })
                                                    }
                                                  </ul> : ''
                                              }
                                             </h3>
                                            <p className="food_description_content">{foods.description}</p>
                                            <p className="food_description_sale_rating">
                                              <span>月售{foods.month_sales}份</span>
                                              <span>好评率{foods.satisfy_rate}%</span>
                                             </p>
                                           </section>
                                        </div>
                                        <footer className="menu_detail_footer">
                                          <section className="food_price">
                                            <span>¥</span>
                                            <span>{foods.specfoods[0].price}</span>
                                            {
                                              foods.specifications.length? <span >起</span> : ''
                                            }
                                          </section>
                                          <BuyCart upDate = {this.state.upDate }shopId={this.state.shopId} foods={foods} moveInCart={this.listenInCart} showChooseList={this.showChooseList} showReduceTip={this.showReduceTip} showMoveDot={this.showMoveDotFun}></BuyCart>
                                         </footer>
                                       </section>
                                    )
                                  })
                                }
                              </li>
                            )
                          })
                        }
                      </ul>
                    </section>
                  </section>
                  <section className="buy_cart_container">
                    <section className="cart_icon_num" onClick={this.toggleCartList}>
                      <div className={classNames({"cart_icon_container": true, "cart_icon_activity":this.state.totalPrice > 0,"move_in_cart" : this.state.receiveInCart })} ref="carContainer">
                        {
                          this.state.totalNum ? <span className="cart_list_length">{this.totalNum()}</span> : ''
                        }
                        <i className="fa fa-shopping-cart cart_icon  " style={{color: '#ffffff', fontSize: '29px'}} aria-hidden="true"></i>
                      </div>
                      <div className="cart_num">
                        <div>¥{ this.totalPrice }</div>
                        <div>配送费¥{ this.deliveryFee() }</div>
                      </div>
                    </section>
                    <section className={classNames({gotopay: true, gotopay_acitvity : this.mininumOrderAmount() <= 0})}>
                      {
                        this.mininumOrderAmount() > 0 ? <span className="gotopay_button_style">还差{ this.mininumOrderAmount() }起送</span> :
                          <Link to={{pathname:"/confirmOrder", query: {shopId: this.state.shopId, geohash: this.state.geohash }}} className="gotopay_button_style">去结算</Link>
                      }
                    </section>
                  </section>
                </section>
                :''
            }
            {
              //评价
              this.state.changeShowType === 'rating' ?
                <section className="rating_container" id="ratingContainer" style={{width: '100%'}}>
                  <section>
                    <header className="rating_header">
                      <section className="rating_header_left">
                        <p>{shopDetailData.rating}</p>
                        <p>综合评价</p>
                        <p>高于周边商家{(ratingScoresData.compare_rating*100).toFixed(1)}%</p>
                      </section>
                      <section className="rating_header_right">
                        <p>
                          <span>服务态度</span>
                            <RatingStar rating={ratingScoresData.service_score}></RatingStar>
                          <span className="rating_num">{ratingScoresData.service_score.toFixed(1)}</span>
                        </p>
                        <p>
                          <span>菜品评价</span>
                          <RatingStar rating={ratingScoresData.food_score}></RatingStar>
                          <span className="rating_num">{ratingScoresData.food_score.toFixed(1)}</span>
                        </p>
                        <p>
                          <span>送达时间</span>
                          <span className="delivery_time">{shopDetailData.order_lead_time}分钟</span>
                        </p>
                      </section>
                    </header>
                    <ul className="tag_list_ul">
                      {
                        this.state.ratingTagsList.map((item, index) => {
                          return(
                            <li  key={index} className={ classNames({unsatisfied: item.unsatisfied, tagActivity: this.state.ratingTageIndex == index})} onClick={this.changeTgeIndex.bind({},index, item.name)}>{item.name}({item.count})</li>
                          )
                        })
                      }
                    </ul>
                    <ul className="rating_list_ul">
                      {
                        this.state.ratingList.map(function (item, index) {
                          return(
                            <li key={index} className="rating_list_li">
                            <img src={getImgPath(item.avatar)} className="user_avatar"/>
                            <section className="rating_list_details">
                              <header>
                                <section className="username_star">
                                  <p className="username">{item.username}</p>
                                  <p className="star_desc">
                                    <RatingStar rating={item.rating_star}></RatingStar>
                                    <span className="time_spent_desc">{item.time_spent_desc}</span>
                                  </p>
                                </section>
                              <time className="rated_at">{item.rated_at}</time>
                              </header>
                                <ul className="food_img_ul">
                                  {
                                    item.item_ratings.map((item, index) => {
                                      return(
                                        <li key={index}>
                                          <img src={getImgPath(item.image_hash)} />
                                      　</li>
                                      )
                                 　　})
                                  }
                                </ul>
                              <ul className="food_name_ul">
                                {
                                  item.item_ratings.map((item, index) => {
                                    return(
                                      <li key={index} className="ellipsis">{ item.food_name}</li>
                                    )
                                  })
                                }
                              </ul>
                            </section>
                          </li>
                          )
                        })
                      }
                    </ul>
                  </section>
                </section> : ''
            }

          </section>: ''
      }
      {
        this.state.showSpecs ? <div className="specs_cover" onClick={this.showChooseList} ></div> : ''
      }
      {
        this.state.showSpecs ?
          <div className="specs_list">
            <header className="specs_list_header">
              <h4 className="ellipsis">{choosedFoods.name}</h4>
              <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" version="1.1"className="specs_cancel" onClick={this.showChooseList}>
                <line x1="0" y1="0" x2="16" y2="16"  stroke="#666" strokeWidth="1.2"/>
                <line x1="0" y1="16" x2="16" y2="0"  stroke="#666" strokeWidth="1.2"/>
              </svg>
            </header>
            <section className="specs_details">
             <h5 className="specs_details_title">{choosedFoods.specifications[0].name}</h5>
             <ul>
               {
                 choosedFoods.specifications[0].values.map((item, indexItem) => {
                  return (
                    <li key={indexItem} className={indexItem == this.state.specsIndex ? 'specs_activity' : '' } onClick={this.chooseSpecs.bind({},indexItem)}>
                      {item}
                    </li>
                  )
               })
               }
             </ul>
            </section>
            <footer className="specs_footer">
              <div className="specs_price">
                <span>¥ </span>
                <span>{this.state.choosedFoods.specfoods[specsIndex].price}</span>
              </div>
              <div className="specs_addto_cart" onClick={this.addSpecs.bind({},choosedFoods.category_id, choosedFoods.item_id, choosedFoods.specfoods[specsIndex].food_id, choosedFoods.specfoods[specsIndex].name, choosedFoods.specfoods[specsIndex].price, choosedFoods.specifications[0].values[specsIndex], choosedFoods.specfoods[specsIndex].packing_fee, choosedFoods.specfoods[specsIndex].sku_id, choosedFoods.specfoods[specsIndex].stock)}>加入购物车</div>
            </footer>
          </div> : ''
      }

    </div>

    )
  }
}

function mapStateToProps(state) {
  return {
    savelatlnt : state.savelatlnt,
    cartList : state.cartList
  }
}

function mapDispatchToProps(dispatch) {
  return {
    saveLatLnt: (res) => dispatch(saveLatLntActions(res)),
    addCart: (res) => dispatch(addCartActions(res)),
    removeCart: (res) => dispatch(removeCartActions(res))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Shop);
