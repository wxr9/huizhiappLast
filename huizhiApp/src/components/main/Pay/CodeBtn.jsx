import React from 'react';
import { WingBlank, Button, Drawer, List } from 'antd-mobile';
import './Pay.less';//引入样式文件
import PersonCenter1 from '../../user/PersonCenter/PersonCenter1';
import PersonCenter2 from '../../user/PersonCenter/PersonCenter2';

//扫码支付的按钮
class CodeBtn extends React.Component {
  state = {
    open: true,
  }
  onOpenChange = (...args) => {
    console.log(args);
    this.setState({ open: !this.state.open });
  }
  render() {
    const sidebar = (<div className="div-siderbar">
      <PersonCenter1/>
      <PersonCenter2/>
    </div>);
    return (
      <div>
        <WingBlank>
          <Button
            className="btn-confirm" type="primary" onClick={() => {this.onOpenChange
          }}
          >确认支付</Button>
        </WingBlank>
        <Drawer
          className="my-drawer"
          style={{ minHeight: document.documentElement.clientHeight - 200 }}
          enableDragHandle
          contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 42 }}
          sidebar={sidebar}
          open={this.state.open}
          onOpenChange={this.onOpenChange}
        />
      </div>
    );
  }
}
export default CodeBtn;
