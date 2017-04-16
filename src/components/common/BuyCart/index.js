/**
 * Created by chenjinxin on 2017/4/16.
 */
import React, { Component } from 'react';

class BuyCart extends Component {
  render() {
    let foods = this.props.foods;
    return(
      <section className="cart_module">
        {
          !foods.specifications.length ?
            <section className="cart_button">
              span
            </section>
            :<section></section>
        }
      </section>
    )
  }
}

export default BuyCart;
