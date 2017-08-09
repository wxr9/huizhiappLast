import React from 'react';
import {Link} from 'react-router';
import {Carousel, WhiteSpace, WingBlank, Icon} from 'antd-mobile';

import requestGET from '../../../utils/requestGET';
import config from '../../../config';
import './index.less'

/**
 * 首页第一部分--轮播图
 */
class part1 extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      banner: [],
    }
  }

  componentWillMount() {
    requestGET(config.BannerUrl).then((data) => {//从配置文件中读取url
      var banner = data.result;
      this.setState({
        banner: banner
      })
    });
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        data: ['home-p2', 'home-p2', 'home-p2'],
      });
    }, 50);
  }

  render() {
    const {banner} = this.state;

    return (
      <div>
      <Carousel
        className="my-carousel index_Carousel"
        autoplay={true}
        infinite
        selectedIndex={0}
        swipeSpeed={35}
      >
        {
          banner.map((li) => (
            <a key={li}>
              <img
                className="index_img_banner"
                src={config.httpUrl+li.imgUrl}
               alt="icon"
               onLoad={() => {
                 window.dispatchEvent(new Event('resize'));
                 this.setState({
                   initialHeight: null,
                 });
               }}
            />
          </a>
          ))}
      </Carousel>
      </div>
    );
  }
}

export default part1;
