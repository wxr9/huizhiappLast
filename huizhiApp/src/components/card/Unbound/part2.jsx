import React from 'react';
import { Link } from 'react-router';
import { Card,WhiteSpace,WingBlank,Button,Grid,Icon,Toast,Modal} from 'antd-mobile';

import './unbound.less'
import config from '../../../config';
import axios from 'axios';
import Qs from 'qs';
import requestGET from '../../../utils/requestGET';

const prompt = Modal.prompt;
const alert = Modal.alert;

class part2 extends React.Component {
  state={
    isApplyCard: false,
  }

  componentWillMount () {
    requestGET(config.ApplyCardInfoUrl).then((data) => {//从配置文件中读取url
      console.log(data);
      if(data.total > 0){//已申请卡
        this.setState({
          isApplyCard:true,
        });
        console.log(this.state.applyCardInfo);
      }else {
        this.setState({
          isApplyCard:false,
        });
      }
    });
  }
  //绑定汇智卡
  boundCard = (cardid) => {
    Toast.loading("提交中...",0);
    if(cardid != "" && cardid != null && cardid != undefined){
      //从缓存中读取
      var userInfo = localStorage.userInfo;
      //json转换为Object对象
      var userData = JSON.parse(userInfo);
      //绑定的post请求参数
      var binddata = {
        cardNo: "0000" + cardid,
        memberNo: userData.username,
        merchantNo: "000006666666666",//
        type:'1',
        extend:'app'
      };
      //post请求
      axios.post(config.boundUrl,Qs.stringify(binddata)).then(function(response){
        var reData = response.data;
        if(reData.success) {//成功
          Toast.hide();
          console.log("成功！");
          //跳转页面
          window.location.href=reData.msg.postUrl+"?merSignMsg="+reData.msg.merSignMsg+"&tranData="+reData.msg.tranData+"&cardNo=0000"+cardid;
        }else {
          Toast.hide();
          alert(reData.msg);
        }
      });
    }else{
      Toast.hide();
      alert("请输入卡号！");
    }
  }
  jumpApplyCard=()=>{
    //跳转页面
    window.location.href="#/ApplyCard";
  }

  render() {
    const { isApplyCard } = this.state;
    const array1 = [
      {
        text: '绑定',
        onPress: cardid => new Promise((resolve) => {
          resolve();
          this.boundCard(cardid);
        }),
      },
      { text: '取消' },
    ];
    var applyText = "申请汇智卡";
    if(isApplyCard){
      applyText = "申请详情";
    }
    return (
      <div>
        <Card  className="Unbound_part2 card_none">
          <div className="Unbound_part2_position" >
            <Button type="" inline size=""
                    onClick={() => prompt('请输入您的卡号', '', array1)}
                    className="Unbound_bund_card card_none">
              绑定汇智卡
            </Button>
            {/*<Link to="ApplyCard">*/}
              <Button  type="" inline size=""
                       onClick={this.jumpApplyCard}
                       className="Unbound_apply_card card_none " >
                {applyText}
              </Button>
            {/*</Link>*/}
          </div>
        </Card>
      </div>
    );
  }
}

export default part2;
