import React from 'react';
import { Card, WingBlank, List, Icon } from 'antd-mobile';
import { Link } from 'react-router';

const Item = List.Item;
const Brief = Item.Brief;

// 工作详情
class ActiveCenter extends React.Component {
  render() {
    return (
      <div style={{ marginTop: '20px' }}>
        <WingBlank>
          <Link to="index/ActiveCenter">
            <Card className="index_menu">
              <Item
                thumb={<div><img src={require('../../assets/active/active-p1.jpg')} alt="图片" /></div>}
                onClick={() => {
                }}
              >
                上海浦东软件园哈登金卡和点卡
                <Brief style={{ fontSize: '25px', lineHeight: '12px' }}>
                  {/* TODO-ICON */}
                  <Icon type={require('../../assets/active/active-p1.jpg')} className="tabSelect-icon" />2017-6-29 10:45:54
                </Brief>
              </Item>
            </Card>
          </Link>
          <Link to="index/personnotify">
            <Card className="index_menu">
              <Item
                thumb={<div><img className="" src={require('../../assets/active/active-p2.jpg')} alt="图片" /></div>}
                onClick={() => {
                  this.handleClick();
                }}
              >
                上海浦东软件园哈登金卡和点卡
                <Brief style={{ fontSize: '25px', lineHeight: '12px' }}>
                  {/* TODO-ICON */}
                  <Icon type={require('../../assets/active/active-p1.jpg')} className="tabSelect-icon" />2017-6-29 10:45:54
                </Brief>
              </Item>
            </Card>
          </Link>
        </WingBlank>
      </div>
    );
  }
}
export default ActiveCenter;
