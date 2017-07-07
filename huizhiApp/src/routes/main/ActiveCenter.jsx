import React from 'react';
import { Card, WingBlank, List, Icon } from 'antd-mobile';
import { Link } from 'react-router';

import ActiveCenter_1 from "../../components/main/ActiveCenter/ActiveCenter1";
import '../../components/main/ActiveCenter/ActiveCenter.less'

// 工作详情
class ActiveCenter extends React.Component {
  render() {
    return (
      <div>
        <img
          className="activeCenter_img"
          src={require('../../assets/active/active-title.jpg')}/>
        <ActiveCenter_1/>
      </div>
    );
  }
}
export default ActiveCenter;
