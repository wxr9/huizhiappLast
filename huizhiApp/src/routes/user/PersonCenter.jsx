import React from 'react';
import { List, Badge, Flex, WhiteSpace, Icon } from 'antd-mobile';
import { Link } from 'react-router';

import PersonCenter_1 from "../../components/user/PersonCenter/PersonCenter1";
import PersonCenter_2 from "../../components/user/PersonCenter/PersonCenter2";
// 个人中心
class PersonCenter extends React.Component {
  render() {
    return (
      <div>
        <PersonCenter_1/>
        <PersonCenter_2/>
      </div>
    );
  }
}
export default PersonCenter;
