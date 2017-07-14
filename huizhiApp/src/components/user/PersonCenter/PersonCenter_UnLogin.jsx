import React from 'react';
import { List, Badge, Flex, WhiteSpace, Icon } from 'antd-mobile';
import { Link } from 'react-router';

import './PersonCenter.less';

// 个人中心第一部分--头像
class PersonCenter1 extends React.Component {
  render() {
    return (
      <div className="personCenter_par1_div">
        <WhiteSpace size="lg" />
        <Flex  className="personCenter_par1_Flex">
          <Flex.Item>个人中心</Flex.Item>
        </Flex>
        <WhiteSpace size="lg" />
        <Flex className="personCenter_par1_Flex">
          <Flex.Item>
            <img
              src={require('../../../assets/user/user-none.png')}
              className="personCenter_par1_png" alt="图片" />
          </Flex.Item>
        </Flex>
        <WhiteSpace size="lg" />

        <Flex className="personCenter_UnLogin_Flex">
            <Link to="login">
              <span className="personCenter_UnLogin_color" >登录</span>
            </Link>
            <Link to="RegisterStepOne">
              <span className="personCenter_UnLogin_re" >注册</span>
            </Link>
          </Flex>
          <WhiteSpace size="xl" />
        </div>
    );
  }
}
export default PersonCenter1;
