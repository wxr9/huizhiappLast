import { createForm } from 'rc-form';
import React from 'react';
import TransactionQueryInner from '../../components/card/TransactionQuery/TransactionQueryInner';

// 交易明细
class TransactionQuery extends React.Component {
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
