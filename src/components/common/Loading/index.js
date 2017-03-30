/**
 * Created by chen on 2017/3/30.
 */
import './index.scss';
import React, { Component } from 'react';

class Loading extends Component {
  constructor(props){
    super(props);
    this.state = {
      positionY: 0,
      timer: null,
    }
  }
  componentDidMount () {
    let timer = setInterval(() => {
      this.state.positionY ++;
    }, 600)
    this.setState({
      timer: timer
    })
  }
  componentWillUnmount() {
    clearInterval(this.state.timer);
  }
  render() {
    return (
        <div className="loading_container">
          <div className="load_img" style={{backgroundPositionY: -(this.state.positionY%7)*2.5 + 'rem'}}></div>
          <svg className="load_ellipse" xmlns="http://www.w3.org/2000/svg" version="1.1">
            <ellipse cx="26" cy="10" rx="26" ry="10" style={{fill:'#ddd',stroke:'none'}}></ellipse>
          </svg>
        </div>
    )
  }
}

export default Loading;
