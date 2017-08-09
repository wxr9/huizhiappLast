import { createForm } from 'rc-form';
import React from 'react';

import ApplyCard_top from '../../components/card/ApplyCard/ApplyCard_top';
import ApplyCardPart1 from '../../components/card/ApplyCard/ApplyCardPart1';
import ApplyCardPart2 from '../../components/card/ApplyCard/ApplyCardPart2';
import '../../components/card/ApplyCard/ApplyCard.less';
import autoLoginUtil from '../../utils/autoLoginUtil';
// 申请汇智卡
class ApplyCard extends React.Component {
  componentWillMount () {
    //判断登录是否超时
    autoLoginUtil();
  }

  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <ApplyCard_top/>
        <div className="ApplyCard_body">
          <ApplyCardPart1/>
          <ApplyCardPart2/>
        </div>
      </div>
    );
  }
}

const ApplyCardWrapper = createForm()(ApplyCard);
export default ApplyCardWrapper;
