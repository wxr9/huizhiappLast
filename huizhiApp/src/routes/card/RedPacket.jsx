import React from 'react';
import {Link} from 'react-router';
import { Carousel, WhiteSpace, WingBlank,Icon } from 'antd-mobile';

import RedPacket_1 from "../../components/card/RedPacket/part1";
import autoLoginUtil from '../../utils/autoLoginUtil';
class RedPacket extends React.Component {
  componentWillMount () {
    //判断登录是否超时
    autoLoginUtil();
  }
  render() {
    return (
      <div className="RedPacket">
        <RedPacket_1/>
      </div>
    );
  }
}

export default RedPacket;
