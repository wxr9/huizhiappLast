import { createForm } from 'rc-form';
import React from 'react';
import TransactionQueryInner from '../../components/card/TransactionQuery/TransactionQueryInner';
import autoLoginUtil from '../../utils/autoLoginUtil';
// 交易明细
class TransactionQuery extends React.Component {
  componentWillMount () {
    //判断登录是否超时
    autoLoginUtil();
  }
  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <TransactionQueryInner/>
      </div>
    );
  }
}

const TransactionQueryWrapper = createForm()(TransactionQuery);
export default TransactionQueryWrapper;
