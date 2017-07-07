import { List, WhiteSpace, WingBlank, Checkbox, Card } from 'antd-mobile';
import { createForm } from 'rc-form';
import React from 'react';

import './ApplyCard.less'

class ApplyCard_top extends React.Component {

  render() {
    return (
          <div>
            <img
              className="ApplyCard_img"
              src={require('../../../assets/card/card-apply.jpg')}/>
          </div>
    );
  }
}

export default ApplyCard_top;
