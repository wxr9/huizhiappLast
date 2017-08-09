import React from 'react';
import { List, Badge, Icon } from 'antd-mobile';
import { Link } from 'react-router';

import PersonInfo_1 from "../../components/user/PersonInfo/PersonInfo1";
import autoLoginUtil from '../../utils/autoLoginUtil';
// 个人信息页面
class PersonInfo extends React.Component {
  componentWillMount () {
    //判断登录是否超时
    autoLoginUtil();
  }
  render() {
    return (
      <div>
        <PersonInfo_1/>
      </div>
    );
  }
}
export default PersonInfo;
