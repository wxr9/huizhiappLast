import React from 'react';
import Binding from '../../components/server/InstructionBinding/InstructionBinding';
import BindingTop from'../../components/server/InstructionBinding/InstructionBindingTop';
import autoLoginUtil from '../../utils/autoLoginUtil';
class InstructionBinding extends React.Component {
  componentWillMount () {
    //判断登录是否超时
    autoLoginUtil();
  }
  render() {
    return (
      <div>
        <BindingTop/>
        <Binding/>
      </div>
    );
  }
}
export default InstructionBinding;
