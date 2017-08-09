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
        title:'',
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
    var url2 = url.replace("{title}","汇智卡坏卡换卡业务");//坏卡换卡业务
    var url3 = url.replace("{title}","汇智卡初始密码及重置密码业务");//密码重置业务
    var url4 = url.replace("{title}","汇智卡挂失及解挂业务");//挂失及解挂业务
    this.setState({
      url1: url1,
      url2: url2,
      url3: url3,
      url4: url4,
    })

    if(this.props.location.query.key==1){
      requestGET(url1).then((data) => {
        var applyGuide = data.content;
        var title = data.title;
        console.log(data);
        this.setState({
          applyGuide: applyGuide,
          title:title
        })
      });
    }else if(this.props.location.query.key==2){
      requestGET(url2).then((data) => {
        var applyGuide = data.content;
        var title = data.title;
        console.log(data);
        this.setState({
          applyGuide: applyGuide,
          title:title
        })
      });
    }else if(this.props.location.query.key==3){
      requestGET(url3).then((data) => {
        var applyGuide = data.content;
        var title = data.title;
        console.log(data);
        this.setState({
          applyGuide: applyGuide,
          title:title
        })
      });
    }else if (this.props.location.query.key==4){
      requestGET(url4).then((data) => {
        var applyGuide = data.content;
        var title = data.title;
        console.log(data);
        this.setState({
          applyGuide: applyGuide,
          title:title
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
            src={require('../../../assets/service/service-title.jpg')}/>
        </div>
        <WhiteSpace size="lg"/>
        <WingBlank>
          <Card className="card_none">
              {/*渲染HTML*/}
              <p className="html_notice_title">{this.state.title}</p>
              <div className="html_notice" dangerouslySetInnerHTML={{__html:applyGuide}}/>
          </Card>
        </WingBlank>
      </div>
    );
  }
}

export default Notice;
