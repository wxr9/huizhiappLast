import React from 'react';
import { Card, WingBlank, List, Icon } from 'antd-mobile';
import { Link } from 'react-router';

import './ActiveCenter.less';
import requestGET from '../../../utils/requestGET';
import config from '../../../config';

const Item = List.Item;
const Brief = Item.Brief;
var count = 0;
// 活动中心
class ActiveCenter1 extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      actInfoList: []
    };
  }
  componentWillMount () {
    requestGET(config.actCenterUrl).then((data) => {//从配置文件中读取url
     var actInfoList = data.msg.result;
      this.setState({
        actInfoList : actInfoList
      })
      // console.log(actInfoList);
    });
  }
  render() {
    const {actInfoList} = this.state;
    return (
      <div className="activeCenter_par1_div">
        <WingBlank>
          {
            actInfoList.map((actInfo) => {
              count = count + 1;
              return (
                <a href={actInfo.details} key={count}>
                  <Card className="activeCenter_index_menu">
                    <Item
                      thumb={<div><img src={actInfo.image} alt="图片" /></div>}
                      onClick={() => {
                      }}
                    >
                      <span>{actInfo.title}</span>
                      <Brief>
                        {/* TODO-ICON */}
                        <Icon type={require('../../../assets/active/active-label1.svg')} className="tabSelect-icon" />
                        <span>{actInfo.createTime}</span>
                      </Brief>
                    </Item>
                  </Card>
                </a>
              );
            })
          }
        </WingBlank>
      </div>
    );
  }
}
export default ActiveCenter1;
