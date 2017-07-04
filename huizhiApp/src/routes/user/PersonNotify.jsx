import React from 'react';
import { List, Badge, Flex, WhiteSpace, Tabs, Card } from 'antd-mobile';
import { Link } from 'react-router';

import PersonNotify_1 from "../../components/user/PersonNotify/PersonNotify1";

// 个人信息页面
class PersonNotify extends React.Component {
  render() {
    return (
      <div>
        <PersonNotify_1/>
      </div>
    );
  }
}
export default PersonNotify;
