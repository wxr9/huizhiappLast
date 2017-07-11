import {List, WhiteSpace, WingBlank, Checkbox, Card} from 'antd-mobile';
import {createForm} from 'rc-form';
import React from 'react';

import './ApplyCard.less'
import requestGET from '../../../utils/requestGET';
import config from '../../../config';
var agree_count = 1;
// 申请汇智卡
class ApplyCardPart1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      applyGuide: [],
      buttonState:false,
    };
  }
  /*申请须知*/
  componentWillMount() {
    var params = "?title=汇智卡办理流程及须知";
    var url = config.applyGuideUrl + params;
    //console.log(url);
    requestGET(url).then((data) => {//从配置文件中读取url
      var applyGuide = data.msg.content;
      console.log(data.msg);
      this.setState({
        applyGuide: applyGuide
      })
    });
  }

  AgreeClick (){
    //console.log(click);
    var apply_btn = this.refs.ApplyCard_btn;

  }
  render() {
    const {applyGuide} = this.state;
    const {getFieldProps} = this.props.form;
    return (
      <div className="ApplyCard_div">
        <WhiteSpace size="lg"/>
        <WingBlank>
          <Card className="ApplyCard_card">
            <Card.Body>
              {/*渲染HTML*/}
              <div dangerouslySetInnerHTML={{__html:applyGuide}}/>
              {/*<b>个人汇智卡配置须知</b><br />
              <p className="ApplyCard_pad  ApplyCard_p">
                1.领取汇智卡时需要提交汇智卡办理证明纸质版并加盖公司公章（个人信息须正确）。<br />
              </p>
              <p className="ApplyCard_p">
                2.办卡工本费现金人民币20元/张（工本费不退）。
              </p>*/}
            </Card.Body>
          </Card>
        </WingBlank>
      </div>
    );
  }
}

const ApplyCardPart1Wrapper = createForm()(ApplyCardPart1);
export default ApplyCardPart1Wrapper;
