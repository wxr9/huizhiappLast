import { Button ,WingBlank} from 'antd-mobile';
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
          <Link to="/index/Bound">
            <WingBlank>
                <Button
                  className="recharge-btn-next" type="primary" onClick={this.onSubmit} inline
                >确定</Button>
            </WingBlank>
          </Link>
      </div>
    );
  }
}

const RechargeThreePart2Wrapper = createForm()(RechargeThreePart2);
export default RechargeThreePart2Wrapper;
