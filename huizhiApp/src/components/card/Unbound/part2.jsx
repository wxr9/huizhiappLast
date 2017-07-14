import React from 'react';
import { Link } from 'react-router';
import { Card,WhiteSpace,WingBlank,Button,Grid,Icon,Toast,Modal} from 'antd-mobile';
const prompt = Modal.prompt;
import './unbound.less'
import config from '../../../config';
import axios from 'axios';
import Qs from 'qs';

const alert = Modal.alert;

class part2 extends React.Component {
  //绑定汇智卡
  boundCard = (cardid) => {
    //从缓存中读取
    var userInfo = sessionStorage.userInfo;
    //json转换为Object对象
    var userData = JSON.parse(userInfo);
    //绑定的post请求参数
    var binddata = {
      cardNo: cardid,
      memberNo: userData.username,
      merchantNo: "000006666666666",
      type:'1'
    };
    //post请求
    axios.post(config.boundUrl,Qs.stringify(binddata)).then(function(response){
      var reData = response.data;
      if(reData.success) {//成功
        console.log("成功！");
        //跳转页面
        window.location.href=reData.msg.postUrl+"?merSignMsg="+reData.msg.merSignMsg+"&tranData="+reData.msg.tranData+"&cardNo="+cardid;
      }else {
        alert("绑卡失败!");
      }
    });
  }
  jumpApplyCard=()=>{
    //跳转页面
    window.location.href="#/ApplyCard";
  }

  render() {
    const array1 = [
      {
        text: '绑定',
        onPress: cardid => new Promise((resolve) => {
          setTimeout(() => {
            resolve();
            this.boundCard(cardid);
          }, 1000);
        }),
      },
      { text: '取消' },
    ];
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
                申请汇智卡
              </Button>
            {/*</Link>*/}
          </div>
        </Card>
      </div>
    );
  }
}

export default part2;
