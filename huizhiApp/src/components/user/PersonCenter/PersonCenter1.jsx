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
          <Flex style={{ width: '100%', textAlign: 'center' }}>
            <Flex.Item>个人中心</Flex.Item>
          </Flex>
          <WhiteSpace size="lg" />
          <Flex style={{ width: '100%', textAlign: 'center' }}>
            <Flex.Item><img src={require('../../../assets/user/user-test.png')} style={{width: '20%',
              height: 'auto'}} alt="图片" /></Flex.Item>
          </Flex>
          <WhiteSpace size="lg" />

            <Flex style={{ width: '100%', textAlign: 'center' }}>
              <Flex.Item>传说秒杀一切</Flex.Item>
            </Flex>
          <WhiteSpace size="xl" />
        </div>
    );
  }
}
export default PersonCenter1;
