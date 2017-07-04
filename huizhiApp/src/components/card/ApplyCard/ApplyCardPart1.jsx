import { List, WhiteSpace, WingBlank, Checkbox, Card } from 'antd-mobile';
import { createForm } from 'rc-form';
import React from 'react';

const AgreeItem = Checkbox.AgreeItem;

// 申请汇智卡
class ApplyCardPart1 extends React.Component {
  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <WhiteSpace size="lg" />
        <WingBlank>
          <Card>
            <Card.Body>
              <p>
                <b>个人汇智卡配置须知</b><br />
                1.领取汇智卡时需要提交汇智卡办理证明纸质版并加盖公司公章（个人信息须正确）。<br />
                2.办卡工本费现金人民币20元/张（工本费不退）。
              </p>
            </Card.Body>
          </Card>
          <AgreeItem>同意须知</AgreeItem>
        </WingBlank>
      </div>
    );
  }
}

const ApplyCardPart1Wrapper = createForm()(ApplyCardPart1);
export default ApplyCardPart1Wrapper;
