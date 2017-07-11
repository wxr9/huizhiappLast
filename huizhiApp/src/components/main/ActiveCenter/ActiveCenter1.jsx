import React from 'react';
import { Card, WingBlank, List, Icon } from 'antd-mobile';
import { Link } from 'react-router';

import './ActiveCenter.less';
import config from  "../../../config";

const Item = List.Item;
const Brief = Item.Brief;
// var count = 0;
// 活动中心
class ActiveCenter1 extends React.Component {
  constructor (props) {
    super(props);
  }
  render() {
    const {details,image,title,createTime} = this.props;
    return (
      <div className="activeCenter_par1_div">
        <WingBlank>
                <a href={details} >
                  <Card className="activeCenter_index_menu">
                    <Item
                      thumb={<div><img src={config.httpUrl+image} alt="图片" /></div>}
                    >
                      <span>{title}</span>
                      <Brief>
                        {/* TODO-ICON */}
                        <Icon type={require('../../../assets/active/active-label1.svg')} className="tabSelect-icon" />
                        <span>{createTime}</span>
                      </Brief>
                    </Item>
                  </Card>
                </a>
        </WingBlank>
      </div>
    );
  }
}
export default ActiveCenter1;
