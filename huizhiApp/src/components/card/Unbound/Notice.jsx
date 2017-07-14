import React from 'react';
import { createForm } from 'rc-form';
import {List, WhiteSpace, WingBlank, Checkbox, Card} from 'antd-mobile';

import config from '../../../config';
import requestGET from '../../../utils/requestGET';

class Notice extends React.Component {
  constructor (props) {
      super(props);
      this.state = {
        applyGuide: [],
        buttonState:false,
        url1: "",
        url2: "",
        url3: "",
        url4: "",
      };
    console.log(this.props.location.query.key);
  }

  componentWillMount() {
    var url = config.NoticeUrl;
    var url1 = url.replace("{title}","汇智卡办理流程及须知");//汇智卡办理流程及须知
    var url2 = url.replace("{title}","坏卡换卡业务");//坏卡换卡业务
    var url3 = url.replace("{title}","密码重置业务");//密码重置业务
    var url4 = url.replace("{title}","挂失及解挂业务");//挂失及解挂业务
    this.setState({
      url1: url1,
      url2: url2,
      url3: url3,
      url4: url4,
    })

    if(this.props.location.query.key==1){
      requestGET(url1).then((data) => {
        var applyGuide = data.msg.content;
        console.log(data.msg);
        this.setState({
          applyGuide: applyGuide
        })
      });
    }else if(this.props.location.query.key==2){
      requestGET(url2).then((data) => {
        var applyGuide = data.msg.content;
        console.log(data.msg);
        this.setState({
          applyGuide: applyGuide
        })
      });
    }else if(this.props.location.query.key==3){
      requestGET(url3).then((data) => {
        var applyGuide = data.msg.content;
        console.log(data.msg);
        this.setState({
          applyGuide: applyGuide
        })
      });
    }else if (this.props.location.query.key==4){
      requestGET(url4).then((data) => {
        var applyGuide = data.msg.content;
        console.log(data.msg);
        this.setState({
          applyGuide: applyGuide
        })
      });
    }

  }
  render() {
    const {applyGuide} = this.state;

    return (
      <div>
        <div>
          <img
            className="Unbound_img"
            src={require('../../../assets/card/card-apply.jpg')}/>
        </div>
        <WhiteSpace size="lg"/>
        <WingBlank>
          <Card className="card_none">
              {/*渲染HTML*/}
              <div dangerouslySetInnerHTML={{__html:applyGuide}}/>
          </Card>
        </WingBlank>
      </div>
    );
  }
}

export default Notice;
