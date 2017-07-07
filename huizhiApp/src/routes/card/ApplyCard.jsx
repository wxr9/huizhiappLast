import { createForm } from 'rc-form';
import React from 'react';

import ApplyCard_top from '../../components/card/ApplyCard/ApplyCard_top';
import ApplyCardPart1 from '../../components/card/ApplyCard/ApplyCardPart1';
import ApplyCardPart2 from '../../components/card/ApplyCard/ApplyCardPart2';
import '../../components/card/ApplyCard/ApplyCard.less'
// 申请汇智卡
class ApplyCard extends React.Component {
  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div className="ApplyCard_body">
        <ApplyCard_top/>
        <ApplyCardPart1/>
        <ApplyCardPart2/>
      </div>
    );
  }
}

const ApplyCardWrapper = createForm()(ApplyCard);
export default ApplyCardWrapper;
