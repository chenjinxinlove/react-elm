/**
 * Created by chenjinxin on 2017/4/16.
 */

import './index.scss';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from '../../../stores/configureStore';

import { addCartActions, removeCartActions } from './../../../actions';

class BuyCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMoveDot : [] ,//控制下落的小圆点显示隐藏
      foodNum : 0,
      cartList:{}
    }
  }

  showReduceTip = () => {
    this.props.showReduceTip()
  }

  removeOutCart = (category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock) => {
    if (this.state.foodNum > 0) {
      this.props.removeCart({shopid: this.props.shopId, category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock});
    }
    this.sUpdate()
  }
  //加入购物车，计算按钮位置。
  addToCart = (category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock, e) => {
     this.props.addCart({shopid: this.props.shopId, category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock});
    let elLeft = e.target.getBoundingClientRect().left;
    let elBottom = e.target.getBoundingClientRect().bottom;
    let sd = this.state.showMoveDot;
    sd.push(true);
    this.setState({
      showMoveDot :sd
    });
    this.sUpdate();
    this.props.showMoveDot(sd , elLeft, elBottom);

  }

  componentDidMount() {
    store.subscribe(() =>{
      this.sUpdate();
    });
  }

  sUpdate() {
    this.setState({
      cartList: this.props.state.cartList
    });
    let foods = this.props.foods;
    let category_id = foods.category_id;
    let item_id = foods.item_id;
    let num;
    if (this.shopCart()&&this.shopCart()[category_id]&&this.shopCart()[category_id][item_id]) {
      num = 0;
      Object.values(this.shopCart()[category_id][item_id]).forEach((item,index) => {
        num += item.num;
      })
    }else {
      num = 0
    }
    this.setState({
      foodNum:num
    });
  }

  shopCart = () => {
    return Object.assign({},this.state.cartList[this.props.shopId]);
  }

  showChooseList = (foods) => {
    this.props.showChooseList(foods);
  };

  render() {
    let foods = this.props.foods;
    return(
      <section className="cart_module">
        {
          !foods.specifications.length ?
            <section className="cart_button">
              {
                this.state.foodNum ? <span onClick={this.removeOutCart.bind({}, foods.category_id, foods.item_id, foods.specfoods[0].food_id, foods.specfoods[0].name, foods.specfoods[0].price, '', foods.specfoods[0].packing_fee, foods.specfoods[0].sku_id, foods.specfoods[0].stock)} >
                <i className="fa fa-minus-circle" style={{color:'#19C2FF', fontSize: '21px'}} aria-hidden="true"></i>
                </span> : ''
              }
              {
                this.state.foodNum ? <span className="cart_num" >{this.state.foodNum}</span> : ''
              }
              <span className="add_icon" onClick={this.addToCart.bind({},foods.category_id, foods.item_id, foods.specfoods[0].food_id, foods.specfoods[0].name, foods.specfoods[0].price, '', foods.specfoods[0].packing_fee, foods.specfoods[0].sku_id, foods.specfoods[0].stock)}>
                 <i className="fa fa-plus-circle" style={{color:'#19C2FF',fontSize: '21px'}} aria-hidden="true"></i>
              </span>
            </section>
            :<section className="choose_specification">
                <section className="choose_icon_container">
                  {
                    this.state.foodNum ? <span onClick={this.removeOutCart.bind({}, foods.category_id, foods.item_id, foods.specfoods[0].food_id, foods.specfoods[0].name, foods.specfoods[0].price, '', foods.specfoods[0].packing_fee, foods.specfoods[0].sku_id, foods.specfoods[0].stock)} >
                <i className="fa fa-minus-circle" style={{color:'#19C2FF', fontSize: '21px'}} aria-hidden="true" onClick={this.showReduceTip}></i>
                </span> : ''
                  }
                  {
                    this.state.foodNum ? <span className="cart_num" >{this.state.foodNum}</span> : ''
                  }
                <span className="show_chooselist" onClick={this.showChooseList.bind({},foods)}>选规格</span>
                </section>
             </section>
        }
      </section>
    )
  }
}

function mapStateToProps(state) {
  return {
    state
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addCart: (res) => dispatch(addCartActions(res)),
    removeCart: (res) => dispatch(removeCartActions(res))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BuyCart);
