import React from 'react';
import {Link} from 'react-router';
import { Carousel, WhiteSpace, WingBlank } from 'antd-mobile';

import './lead.less'

class lead_1 extends React.Component {
  state = {
    data: ['', '', ''],
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        data: ['lead-p1', 'lead-p2', 'lead-p3'],
      });
    }, 50);
  }

  render() {
    // const hProp = this.state.initialHeight ? { height: this.state.initialHeight } : {};
    return (
      <div>
        <Carousel
          className="my-carousel"
          autoplay={false}
          infinite={false}
          selectedIndex={0}
          swipeSpeed={35}
          beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
          afterChange={index => console.log('slide to', index)}
        >
          {this.state.data.map(ii => (
            <a key={ii} >
              <img
                className="lead_img"
                src={require(`../../../assets/lead/${ii || 'lead-p1'}.jpg`)}
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
        <Link className="index_link" to="index/Index">
          <div className="lead_skip">跳过</div>
        </Link>
      </div>
  );
  }
}

export default lead_1;
