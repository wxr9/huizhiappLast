import React from 'react';
import Instruction from '../../components/server/UserInstruction/UserInstruction';
import InstructionTop from '../../components/server/UserInstruction/UserInstructionTop';


class UserInstruction extends React.Component {
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
