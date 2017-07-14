import React from 'react';
import { List, Badge, Flex, WhiteSpace, Icon } from 'antd-mobile';
import { Link } from 'react-router';

import './PersonCenter.less';
import config from '../../../config';

// 个人中心第一部分--头像
class PersonCenter1 extends React.Component {
  render() {
    const {userFace,name} = this.props;
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
                src={config.httpUrl+userFace}
                className="personCenter_par1_png" alt="图片" />
            </Flex.Item>
          </Flex>
          <WhiteSpace size="lg" />

            <Flex className="personCenter_par1_Flex">
              <Flex.Item>{name}</Flex.Item>
            </Flex>
          <WhiteSpace size="xl" />
        </div>
    );
  }
}
export default PersonCenter1;
