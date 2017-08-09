import { List, WhiteSpace, WingBlank, Checkbox, Card } from 'antd-mobile';
import { createForm } from 'rc-form';
import React from 'react';

import './ApplyCard.less'

/**
 *  申请汇智卡顶部图片
 */
class ApplyCard_top extends React.Component {
  render() {
    return (
            <img
              className="ApplyCard_img"
              src={require('../../../assets/service/service-title.jpg')}/>
    );
  }
}

export default ApplyCard_top;
