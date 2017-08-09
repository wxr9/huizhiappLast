import { List, Picker, InputItem, DatePicker, TextareaItem, Select, Cascader } from 'antd-mobile';
import React from 'react';
import { createForm } from 'rc-form';
import moment from 'moment';
import 'moment/locale/zh-cn';

import UserInfo_1 from "../../components/user/UserInfo/UserInfo1";
import autoLoginUtil from '../../utils/autoLoginUtil';
//用户个人资料
class UserInfo extends React.Component {
  componentWillMount () {
    //判断登录是否超时
    autoLoginUtil();
  }
  render() {
    return (
      <div className="UserInfo_div">
        <UserInfo_1/>
      </div>
    );
  }
}
export default UserInfo;
