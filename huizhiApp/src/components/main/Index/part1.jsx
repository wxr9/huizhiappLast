/**
 * 首页第一部分--轮播图
 */
import React from 'react';
import {Link} from 'react-router';
import { Carousel, WhiteSpace, WingBlank,Icon } from 'antd-mobile';

import './index.less'

class part1 extends React.Component {
  state = {
    data: ['', '', ''],
  }
  componentDidMount() {
    // simulate img loading
    setTimeout(() => {
      this.setState({
        data: ['home-p2', 'home-p2', 'home-p2'],
      });
    }, 50);
  }

  render() {
    // const hProp = this.state.initialHeight ? { height: this.state.initialHeight } : {};
    return (
      <Carousel
        className="my-carousel"
        autoplay={true}
        infinite
        selectedIndex={0}
        swipeSpeed={35}
        beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
        afterChange={index => console.log('slide to', index)}
      >
        {this.state.data.map(ii => (
          <a  key={ii}>
            <img
              className="index_img_banner"
              src={require(`../../../assets/home/${ii || 'home-p2'}.jpg`)}
              alt="icon"
              onLoad={() => {
                // fire window resize event to change height
                window.dispatchEvent(new Event('resize'));
                this.setState({
                  initialHeight: null,
                });
              }}
            />
          </a>
        ))}
      </Carousel>
    );
  }
}

export default part1;
