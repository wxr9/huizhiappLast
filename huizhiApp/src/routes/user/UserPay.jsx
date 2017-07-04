import React from 'react';
import { List, WingBlank, Badge, Flex } from 'antd-mobile';
import { Link } from 'react-router';

import UserPay_1 from "../../components/user/UserPay/UserPay1";

const Item = List.Item;
const Brief = Item.Brief;
// 支付记录
class UserPay extends React.Component {
  render() {
    return (
      <div>
        <UserPay_1/>
      </div>


    );
  }
}
export default UserPay;
