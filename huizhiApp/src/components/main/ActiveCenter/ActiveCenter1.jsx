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
    const {mobileUrl,image,title,startTime,needLogin} = this.props;
    //判断该活动是否需要登录
    var activeDetails;
    var loginInfo = localStorage.loginInfo;
    if(needLogin == 1 ){
      if(loginInfo != undefined){
        activeDetails = mobileUrl;
      }else{
        activeDetails = "#login?url=index/ActiveCenter"
      }
    }else{
      activeDetails = mobileUrl;
    }
    return (
      <div className="activeCenter_par1_div">
        <WingBlank>
                <a href={activeDetails} >
                  <Card className="activeCenter_index_menu" style={{ border:0 }}>
                    <Item
                      thumb={<div><img src={config.httpUrl+image} alt="图片" /></div>}
                    >
                      <span>{title}</span>
                      <Brief>
                        {/* TODO-ICON */}
                        <Icon type={require('../../../assets/active/active-label1.svg')} className="tabSelect-icon" />
                        <span>{startTime}</span>
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
