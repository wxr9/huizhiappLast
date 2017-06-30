import React from 'react';
import { List, Badge, Icon } from 'antd-mobile';
import { Link } from 'react-router';

// 个人信息页面
class PersonInfo extends React.Component {
  render() {
    return (
      <div>
        <div style={{ fontSize: '20px', height: '100%', paddingBottom: '50px', overflow: 'auto', marginTop: '10px' }}>
          <Link to="index/userinfo">
            <List.Item extra="" arrow="horizontal" style={{ borderBottom: '1px solid #ccc' }}>
              {/* TODO-ICON */}
              <Badge text={0} style={{ marginLeft: 12 }}><Icon type={require('../../assets/user/user-info.svg')} className="tabSelect-icon" />个人资料</Badge>
            </List.Item>
          </Link>
          <Link to="index/activedetail">
            <List.Item extra="" arrow="horizontal" style={{ borderBottom: '1px solid #ccc' }}>
              {/* TODO-ICON */}
              <Badge text={0} style={{ marginLeft: 12 }}><Icon type={require('../../assets/user/user-set.svg')} className="tabSelect-icon" />头像设置</Badge>
            </List.Item>
          </Link>
          <Link to="ChangePwd">
            <List.Item extra="" arrow="horizontal" style={{ borderBottom: '1px solid #ccc' }}>
              {/* TODO-ICON */}
              <Badge text={0} style={{ marginLeft: 12 }}><Icon type={require('../../assets/user/user-pwd.svg')} className="tabSelect-icon" />修改密码</Badge>
            </List.Item>
          </Link>
          <Link to="ChangePhoneNo">
            <List.Item extra="" arrow="horizontal" style={{ borderBottom: '1px solid #ccc' }}>
              {/* TODO-ICON */}
              <Badge text={0} style={{ marginLeft: 12 }}><Icon type={require('../../assets/user/user-phone.svg')} className="tabSelect-icon" />修改密码手机号</Badge>
            </List.Item>
          </Link>
        </div>
      </div>
    );
  }
}
export default PersonInfo;
