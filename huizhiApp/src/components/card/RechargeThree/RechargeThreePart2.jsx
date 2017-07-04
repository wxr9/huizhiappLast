import { Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import React from 'react';
import { Link } from 'react-router';


// 充值（第3步）
class RechargeThreePart2 extends React.Component {
  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <div className="btn-container" style={{ marginTop: '10px' }}>
          <Link to="/index/MyXiaozhi">
            <Button
              className="btn" type="primary" onClick={() => {
              }}
              style={{
                background: '#259dda',
                fontSize: '1em',
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
