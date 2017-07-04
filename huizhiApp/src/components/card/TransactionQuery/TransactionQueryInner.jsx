import { Table, WingBlank, Card, List, Tabs } from 'antd-mobile';
import { createForm } from 'rc-form';
import React from 'react';

const TabPane = Tabs.TabPane;
const Item = List.Item;

// 交易明细
class TransactionQueryInner extends React.Component {
  render() {
    const { getFieldProps } = this.props.form;
    const data = [
      { refNo: '001', transTime: '2017/04/05 14:29', transMoney: '300', transType: '圈存', shopName: '合作商户', key: '1' },
      { refNo: '002', transTime: '2017/04/05 14:29', transMoney: '300', transType: '圈存', shopName: '合作商户', key: '2' },
      { refNo: '003', transTime: '2017/04/05 14:29', transMoney: '300', transType: '圈存', shopName: '合作商户', key: '3' },
      { refNo: '004', transTime: '2017/04/05 14:29', transMoney: '300', transType: '圈存', shopName: '合作商户', key: '4' },
      { refNo: '005', transTime: '2017/04/05 14:29', transMoney: '300', transType: '圈存', shopName: '合作商户', key: '5' },
      { refNo: '006', transTime: '2017/04/05 14:29', transMoney: '300', transType: '圈存', shopName: '合作商户', key: '6' },
      { refNo: '007', transTime: '2017/04/05 14:29', transMoney: '300', transType: '圈存', shopName: '合作商户', key: '7' },
      { refNo: '008', transTime: '2017/04/05 14:29', transMoney: '300', transType: '圈存', shopName: '合作商户', key: '8' },
      { refNo: '009', transTime: '2017/04/05 14:29', transMoney: '300', transType: '圈存', shopName: '合作商户', key: '9' },
      { refNo: '010', transTime: '2017/04/05 14:29', transMoney: '300', transType: '圈存', shopName: '合作商户', key: '10' },
      { refNo: '011', transTime: '2017/04/05 14:29', transMoney: '300', transType: '圈存', shopName: '合作商户', key: '11' },
    ].map((s)=> <Card style={{marginTop:'10px'}}>
      <List>
        <Item>
          流 水 号 : {s.refNo}
        </Item>
        <Item>
          交易时间 : {s.transTime}
        </Item>
        <Item>
          交易金额 : {s.transMoney}
        </Item>
        <Item>
          交易类型 : {s.transType}
        </Item>
        <Item>
          商户名称 : {s.shopName}
        </Item>
      </List>
    </Card>);
    return (
      <div>
        <Tabs>
          <TabPane tab="主账户记录" key="1">
            <div style={{ display: 'flex' }}>
              <WingBlank>
                {data}
              </WingBlank>
            </div>
          </TabPane>
          <TabPane tab="充值记录" key="2">
            <div style={{ display: 'flex' }}>
              <WingBlank>
                {data}
              </WingBlank>
            </div>
          </TabPane>
          <TabPane tab="电子钱包记录" key="3">
            <div style={{display: 'flex'}}>
              <WingBlank>
                {data}
              </WingBlank>
            </div>
          </TabPane>
          <TabPane tab="在线充值记录" key="4">
            <div style={{ display: 'flex' }}>
              <WingBlank>
                {data}
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
