import React from 'react';
import { WingBlank, Button } from 'antd-mobile';
import './Pay.less';//引入样式文件
import config from '../../../config';

//扫码支付的按钮
class CodeBtn extends React.Component {
  zhifu = () => {//跳转支付宝
    window.location.href=config.alipayUrl;
  }
  render() {
    return (
      <div>
        <WingBlank>
          <Button
            className="btn-confirm" type="primary" onClick={() => {this.zhifu()}}
          >确认支付</Button>
        </WingBlank>
      </div>
    );
  }
}
export default CodeBtn;
