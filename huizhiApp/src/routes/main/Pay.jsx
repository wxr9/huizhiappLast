import React from 'react';
import CodeBar from '../../components/main/Pay/CodeBar.jsx';
import CodeBtn from '../../components/main/Pay/CodeBtn.jsx';


//扫码支付
class Pay extends React.Component {

  render() {

    return (
      <div className="codeBar_bg">
        {/*条形码*/}
        <CodeBar/>
        {/*确认支付按钮*/}
        <CodeBtn/>
      </div>
    );
  }
}
export default Pay;
