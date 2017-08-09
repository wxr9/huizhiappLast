import React from 'react';
import Instruction from '../../components/server/UserInstruction/UserInstruction';
import InstructionTop from '../../components/server/UserInstruction/UserInstructionTop';
import autoLoginUtil from '../../utils/autoLoginUtil';

class UserInstruction extends React.Component {
  componentWillMount () {
    //判断登录是否超时
    autoLoginUtil();
  }

  render() {
    return (
      <div>
        <InstructionTop/>
        <Instruction/>
      </div>
    );
  }
}
export default UserInstruction;
