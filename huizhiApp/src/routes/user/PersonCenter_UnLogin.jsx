import React from 'react';
import { List, Badge, Flex, WhiteSpace, Icon } from 'antd-mobile';
import { Link } from 'react-router';

import PersonCenter_UnLogin from "../../components/user/PersonCenter/PersonCenter_UnLogin";
import PersonCenter_2 from "../../components/user/PersonCenter/PersonCenter2";
// 个人中心
class PersonCenter extends React.Component {
  render() {
    return (
      <div>
        <PersonCenter_UnLogin/>
        <PersonCenter_2/>
      </div>
    );
  }
}
export default PersonCenter;
