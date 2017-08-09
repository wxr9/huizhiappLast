import React from 'react';
import { WingBlank, Button } from 'antd-mobile';
import './Pay.less';//引入样式文件
import config from '../../../config';

//扫码支付的按钮
class CodeBtn extends React.Component {
  render() {
    return (
      <div>
        <WingBlank>
          <a
            className="btn-confirm" type="primary" href={config.alipayUrl}
          >确认支付</a>
        </WingBlank>
      </div>
    );
  }
}
export default CodeBtn;
