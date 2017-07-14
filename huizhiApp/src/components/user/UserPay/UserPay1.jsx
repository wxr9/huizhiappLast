import React from 'react';
import { List, WingBlank, Badge, Flex } from 'antd-mobile';
import { Link } from 'react-router';

import './UserPay.less';

const Item = List.Item;
const Brief = Item.Brief;
// 支付记录
class UserPay1 extends React.Component {
  render() {
    return (
      <div className="userPay_par1_div">
        <Item className="userPay_par1_Item" >
          <Flex>
            <Flex.Item>
              <Flex>
                <Flex.Item>
                  <Item>
                    今天 <Brief>12:25</Brief>
                  </Item>
                </Flex.Item>
                <Flex.Item className="userPay_par1_Flex">
                  <Item className="userPay_par1_Flex">
                    <img src={require('../../../assets/user/user-test-no.png')} alt="图片" />
                  </Item>
                </Flex.Item>
              </Flex>
            </Flex.Item>
            <Flex.Item>
              <Flex className="userPay_par1_right">
                <Flex.Item>
                  <Item>
                    -16.00 <Brief>吉萨坎大哈健康啥就开始的话</Brief>
                  </Item>
                </Flex.Item>
              </Flex>
            </Flex.Item>
          </Flex>
        </Item>
        <Item className="userPay_par1_Item" >
          <Flex>
            <Flex.Item>
              <Flex >
                <Flex.Item>
                  <Item>
                    今天 <Brief>12:25</Brief>
                  </Item>
                </Flex.Item>
                <Flex.Item className="userPay_par1_Flex">
                  <Item className="userPay_par1_Flex">
                    <img src={require('../../../assets/user/user-test-no.png')} alt="图片" />
                  </Item>
                </Flex.Item>
              </Flex>
            </Flex.Item>
            <Flex.Item>
              <Flex className="userPay_par1_right">
                <Flex.Item >
                  <Item >
                    -16.00 <Brief>吉萨坎大哈健康啥就开始的话</Brief>
                  </Item>
                </Flex.Item>
              </Flex>
            </Flex.Item>
          </Flex>
        </Item>
      </div>
    );
  }
}
export default UserPay1;
