/**
 * Created by chen on 2017/3/30.
 */
import './index.scss';
import React, { Component } from 'react';

class RatingStar extends Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <div className="rating_container">
        <section className="star_container">
          {
            [1, 2, 3, 4, 5].map(num => {
              return (
                  <i className="fa fa-star-o" aria-hidden="true" key={num}></i>
                )
            })
          }
        </section>
        <div className="star_overflow" style={{ width: this.props.rating*2/5 + 'rem' }}>
          <section className="star_container">
            {
              [1, 2, 3, 4, 5].map(num => {
                return (
                    <i className="fa fa-star" aria-hidden="true" key={num}></i>
                  )
              })
            }
          </section>
        </div>
      </div>
    )
  }
}

export default RatingStar;
