import React from 'react';
import { List, WingBlank, Badge, Flex } from 'antd-mobile';
import { Link } from 'react-router';

import UserPay_1 from "../../components/user/UserPay/UserPay1";
import autoLoginUtil from '../../utils/autoLoginUtil';
const Item = List.Item;
const Brief = Item.Brief;
// 支付记录
class UserPay extends React.Component {
  componentWillMount () {
    //判断登录是否超时
    autoLoginUtil();
  }
  render() {
    return (
      <div>
        <UserPay_1/>
      </div>


    );
  }
}
export default UserPay;
