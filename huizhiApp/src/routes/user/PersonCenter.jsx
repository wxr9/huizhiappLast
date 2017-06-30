import React from 'react';
import { List, Badge, Flex, WhiteSpace, Icon } from 'antd-mobile';
import { Link } from 'react-router';
// 个人信息页面
class PersonInfo extends React.Component {
  render() {
    return (
      <div>
        <div style={{ fontSize: '20px', backgroundColor: '#259DDA', color: 'white', width: '100%' }}>
          <WhiteSpace size="lg" />
          <Flex style={{ width: '100%', textAlign: 'center' }}>
            <Flex.Item>个人中心</Flex.Item>
          </Flex>
          <WhiteSpace size="lg" />
          <Flex style={{ width: '100%', textAlign: 'center' }}>
            <Flex.Item><img src={require('../../assets/user/user-test.png')} alt="图片" /></Flex.Item>
          </Flex>
          <WhiteSpace size="lg" />
          <Flex style={{ width: '100%', textAlign: 'center' }}>
            <Flex.Item>传说秒杀一切</Flex.Item>
          </Flex>
          <WhiteSpace size="xl" />
        </div>
        <WhiteSpace size="sm" />
        <div style={{ fontSize: '20px', height: '100%', paddingBottom: '50px', overflow: 'auto' }}>
          <Link to="index/personinfo">
            <List.Item extra="" arrow="horizontal" style={{ borderBottom: '1px solid #ccc' }}>
              {/* TODO-ICON */}
              <Badge text={0} style={{ marginLeft: 12 }}><img href={'../../assets/user/user-card.svg'} alt="图片" />个人信息 </Badge>
            </List.Item>
          </Link>
          <Link to="index/Unbound">
            <List.Item extra="" arrow="horizontal" style={{ borderBottom: '1px solid #ccc' }}>
              {/* TODO-ICON */}
              <Badge text={0} style={{ marginLeft: 12 }}><Icon type={require('../../assets/user/user-card.svg')} className="tabSelect-icon" />      汇智卡</Badge>
            </List.Item>
          </Link>
          <Link to="index/UserPay">
            <List.Item extra="" arrow="horizontal" style={{ borderBottom: '1px solid #ccc' }}>
              {/* TODO-ICON */}
              <Badge text={0} style={{ marginLeft: 12 }}><Icon type={require('../../assets/user/user-pay.svg')} className="tabSelect-icon" />     支付记录</Badge>
            </List.Item>
          </Link>
          <Link to="index/personnotify">
            <List.Item extra="" arrow="horizontal" style={{ borderBottom: '1px solid #ccc' }}>
              {/* TODO-ICON */}
              <Badge text={0} style={{ marginLeft: 12 }}><Icon type={require('../../assets/user/user-notice.svg')} className="tabSelect-icon" />     通知管理</Badge>
            </List.Item>
          </Link>
        </div>
      </div>
    );
  }
}
export default PersonInfo;
