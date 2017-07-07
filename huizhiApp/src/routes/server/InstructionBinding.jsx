import React from 'react';
import Binding from '../../components/server/InstructionBinding/InstructionBinding';
import BindingTop from'../../components/server/InstructionBinding/InstructionBindingTop';

class InstructionBinding extends React.Component {
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
