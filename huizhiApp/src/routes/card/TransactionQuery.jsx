import { Table, Tabs } from 'antd-mobile';
import { createForm } from 'rc-form';
import React from 'react';

const TabPane = Tabs.TabPane;

// 交易明细
class TransactionQuery extends React.Component {
  render() {
    const { getFieldProps } = this.props.form;
    const columns = [
      { title: '流水号', dataIndex: 'refNo', key: 'refNo', width: 'auto', fixed: 'left' },
      { title: '交易时间', dataIndex: 'transTime', key: 'transTime', width: 'auto' },
      { title: '交易金额', dataIndex: 'transMoney', key: 'transMoney', width: 'auto' },
      { title: '交易类型', dataIndex: 'transType', key: 'transType', width: 'auto' },
      { title: '商户名称', dataIndex: 'shopName', key: 'shopName', width: 'auto' },
    ];
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
    ];
    return (
      <div>
        <Tabs>
          <TabPane tab="主账户记录" key="1">
            <div style={{ display: 'flex' }}>
              <Table
                columns={columns}
                dataSource={data}
              />
            </div>
          </TabPane>
          <TabPane tab="充值记录" key="2">
            <div style={{ display: 'flex' }}>
              <Table
                columns={columns}
                dataSource={data}
              />
            </div>
          </TabPane>
          <TabPane tab="电子钱包记录" key="3">
            <div style={{display: 'flex'}}>
              <Table
                columns={columns}
                dataSource={data}
              />
            </div>
          </TabPane>
          <TabPane tab="在线充值记录" key="4">
            <div style={{ display: 'flex' }}>
              <Table
                columns={columns}
                dataSource={data}
              />
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

const TransactionQueryWrapper = createForm()(TransactionQuery);
export default TransactionQueryWrapper;
