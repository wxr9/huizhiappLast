import {Table, WingBlank, Card, List, Tabs} from 'antd-mobile';
import {createForm} from 'rc-form';
import React from 'react';
import './TransactionQueryInner.less';
import config from '../../../config';
import axios from 'axios';
import Qs from 'qs';
const TabPane = Tabs.TabPane;
const Item = List.Item;

// 交易明细
class TransactionQueryInner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal1: false,
      perNoList: []
    };
  }
  componentWillMount () {
    var params = "startDate=2017-06-21"+"&cardNo=00199000008989"+"&endDate=2017-07-10"+"&memberNo=ptyh"+"&queryNum=10"+"&tranType=1";
    // request(config.queryTransDetails,params).then((data) => {//从配置文件中读取url
    var data = {
      startDate: '2017-06-21',
      cardNo: '00199000008989',
      endDate:'2017-07-10',
      memberNo:'ptyh',
      queryNum:'10',
      tranType:'1'
    };
    axios.post(config.queryTransDetails,Qs.stringify(data)).then(function(response){//从配置文件中读取url，GET请求
      console.log("queryTransDetails response",response);
      //   var dataList = response.data.result;
      //   console.log("infoList",infoList);
      //   for (var i=0; i<dataList.length; i++){
      //     infoList.push(dataList[i]);
      //   }
    });
  }
  render() {
    const {getFieldProps} = this.props.form;
    return (
      <div>
        <Tabs>
          <TabPane tab="主账户记录" key="1" className="transaction-tabpane">
            <div className="transaction-wingBlank-tab">
              <WingBlank className="transaction-wingBlank">
                <Card>
                  <List className="transaction-list">
                    <Item className="transaction-list-item">
                      流 水 号 : 001
                    </Item>
                    <Item className="transaction-list-item">
                      交易时间 : 2017/04/05 14:29
                    </Item>
                    <Item className="transaction-list-item">
                      交易金额 : 300
                    </Item>
                    <Item className="transaction-list-item">
                      交易类型 : 圈存
                    </Item>
                    <Item className="transaction-list-item">
                      商户名称 : 合作商户
                    </Item>
                  </List>
                </Card>
              </WingBlank>
            </div>
          </TabPane>
          <TabPane tab="充值记录" key="2" className="transaction-tabpane">
            <div className="transaction-table-pan">
              <WingBlank className="transaction-wingBlank">
                <Card>
                  <List className="transaction-list">
                    <Item className="transaction-list-item">
                      流 水 号 : 001
                    </Item>
                    <Item className="transaction-list-item">
                      交易时间 : 2017/04/05 14:29
                    </Item>
                    <Item className="transaction-list-item">
                      交易金额 : 300
                    </Item>
                    <Item className="transaction-list-item">
                      交易类型 : 圈存
                    </Item>
                    <Item className="transaction-list-item">
                      商户名称 : 合作商户
                    </Item>
                  </List>
                </Card>
              </WingBlank>
            </div>
          </TabPane>
          <TabPane tab="电子钱包记录" key="3" className="transaction-tabpane">
            <div className="transaction-table-pan">
              <WingBlank className="transaction-wingBlank">
                <Card>
                  <List className="transaction-list">
                    <Item className="transaction-list-item">
                      流 水 号 : 001
                    </Item>
                    <Item className="transaction-list-item">
                      交易时间 : 2017/04/05 14:29
                    </Item>
                    <Item className="transaction-list-item">
                      交易金额 : 300
                    </Item>
                    <Item className="transaction-list-item">
                      交易类型 : 圈存
                    </Item>
                    <Item className="transaction-list-item">
                      商户名称 : 合作商户
                    </Item>
                  </List>
                </Card>
              </WingBlank>
            </div>
          </TabPane>
          <TabPane tab="在线充值记录" key="4" className="transaction-tabpane">
            <div className="transaction-table-pan">
              <WingBlank className="transaction-wingBlank">
                <Card>
                  <List className="transaction-list">
                    <Item className="transaction-list-item">
                      流 水 号 : 001
                    </Item>
                    <Item className="transaction-list-item">
                      交易时间 : 2017/04/05 14:29
                    </Item>
                    <Item className="transaction-list-item">
                      交易金额 : 300
                    </Item>
                    <Item className="transaction-list-item">
                      交易类型 : 圈存
                    </Item>
                    <Item className="transaction-list-item">
                      商户名称 : 合作商户
                    </Item>
                  </List>
                </Card>
              </WingBlank>
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

const TransactionQueryInnerWrapper = createForm()(TransactionQueryInner);
export default TransactionQueryInnerWrapper;
