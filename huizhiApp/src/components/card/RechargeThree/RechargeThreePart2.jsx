import { Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import React from 'react';
import { Link } from 'react-router';
import './recharge3.less';

// 充值（第3步）
class RechargeThreePart2 extends React.Component {
  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <div className="btn-container">
          <Link to="/index/MyXiaozhi">
            <Button
              className="recharge-next-btn" type="primary" onClick={() => {
              }}
            >确定</Button>
          </Link>
        </div>
      </div>
    );
  }
}

const RechargeThreePart2Wrapper = createForm()(RechargeThreePart2);
export default RechargeThreePart2Wrapper;
