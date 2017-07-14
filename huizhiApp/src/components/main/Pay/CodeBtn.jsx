import React from 'react';
import { WingBlank, Button } from 'antd-mobile';
import './Pay.less';//引入样式文件
import config from '../../../config';

//扫码支付的按钮
class CodeBtn extends React.Component {
  zhifu = () => {//跳转支付宝
    console.log(1111);
    window.location.href="alipays://platformapi/startapp?appId=20000056";
  }
  zhifu2 = () => {//跳转支付宝
    console.log(1111);
    window.location.href="alipayqr://platformapi/startapp?saId=20000056";
  }
  zhifu3 = () => {//跳转支付宝
    console.log(1111);
    window.location.href=config.alipayUrl;
  }
  zhifu4 = () => {//跳转支付宝
    console.log(1111);
    window.location.href="http://www.baidu.com";
  }
  render() {
    return (
      <div>
        <WingBlank>
          <Button
            className="btn-confirm" type="primary" onClick={()=>this.zhifu()}
          >确认支付1</Button>
          <Button
            className="btn-confirm" type="primary" onClick={()=>this.zhifu2()}
          >确认支付2</Button>
          <Button
            className="btn-confirm" type="primary" onClick={()=>this.zhifu3()}
          >确认支付3</Button>
          <Button
            className="btn-confirm" type="primary" onClick={()=>this.zhifu4()}
          >确认支付4</Button>
          <div style={{marginTop:'30px'}}><a href="alipays://platformapi/startapp?appId=20000056">标签</a></div>
        </WingBlank>
      </div>
    );
  }
}
export default CodeBtn;
