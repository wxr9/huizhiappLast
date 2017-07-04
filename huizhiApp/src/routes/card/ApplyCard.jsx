import { createForm } from 'rc-form';
import React from 'react';
import ApplyCardPart1 from '../../components/card/ApplyCard/ApplyCardPart1';
import ApplyCardPart2 from '../../components/card/ApplyCard/ApplyCardPart2';

// 申请汇智卡
class ApplyCard extends React.Component {
  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <ApplyCardPart1/>
        <ApplyCardPart2/>
      </div>
    );
  }
}

const ApplyCardWrapper = createForm()(ApplyCard);
export default ApplyCardWrapper;
