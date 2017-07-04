/**
 * 首页第三部分--活动展示‘啤酒节’
 */
import React from 'react';
import {Link} from 'react-router';
import { Carousel, WhiteSpace, WingBlank,Icon } from 'antd-mobile';

import './index.less'

class part3 extends React.Component {

  render() {
    return (
      <div className="index_par3">
        <div className="index_par3_div">
          <li>
            <Link className="index_link" to="TransactionQuery">
              <img src={require('../../../assets/home/home-p3.jpg')} />
              <div className="index_bg_div"></div>
              <div className="index_font">啤酒节活动</div>
            </Link>
          </li>
          <li>
            <img src={require('../../../assets/home/home-p3.jpg')} className="index_part3_position_top"/>
            <div className="index_bg_div index_part3_position" ></div>
            <div className="index_font index_part3_position">梦想启航</div>
          </li>
          <li>
            <img src={require('../../../assets/home/home-p3.jpg')} className="index_part3_position_left"/>
            <div className="index_bg_div"></div>
            <div className="index_font">啤酒节活动</div>
          </li>
          <li>
            <img src={require('../../../assets/home/home-p3.jpg')}  className="index_part3_position_top index_part3_position_left"/>
            <div className="index_bg_div index_part3_position" ></div>
            <div  className="index_font index_part3_position" >梦想启航</div>
          </li>
        </div>
      </div>
  );
}
}

export default part3;
