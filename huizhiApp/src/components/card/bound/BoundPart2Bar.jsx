import React from 'react';
import {Link} from 'react-router';
import {Card, Icon, Modal} from 'antd-mobile';
import '../Unbound/unbound.less';
import config from '../../../config';
import request from '../../../utils/requestPOST';
import axios from 'axios';
import Qs from 'qs';

const alert = Modal.alert;
var cardid = '';

class BoundBar extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      code:"",
      warn:"",
    };
  }
  componentWillMount(){
    if(!localStorage.userInfo){
      console.log("未登录，请登录！");
    }else {
      //从缓存中读取
      var userInfo = localStorage.userInfo;
      //json转换为Object对象
      var reData = JSON.parse(userInfo);
      cardid = reData.cardid;
      if (reData.cardid) {
        console.log("有cardID"+cardid);
        console.log(cardid);
      } else {
        console.log("无cardID");
      }
      var data = {
        cardNo:reData.cardid ,
        memberNo: reData.username
      };
      console.log(data);
      request(config.cardBalanceUrl,data).then((data) => {//从配置文件中读取url
        console.log(data.code)
      if(data.code === "2004"){
          this.setState({
            code:data.code,
            warn:data.msg,
          });
        }
      });
    }
  }
  //解绑卡
  unboundCard = () => {
    // console.log(`value2:`);
    //从缓存中读取
    var userInfo = localStorage.userInfo;
    //json转换为Object对象
    var userData = JSON.parse(userInfo);
    //解绑的post请求参数
    var unbinddata = {
      cardNo: userData.cardid,
      memberNo: userData.username,
      merchantNo: "000006666666666",
      type:'2',
      extend:'app'
    };
    //post请求
    axios.post(config.boundUrl,Qs.stringify(unbinddata)).then(function(response){
      var reData = response.data;
      if(reData.success) {//成功
        console.log("成功！");
        //跳转页面
        window.location.href=reData.msg.postUrl+"?merSignMsg="+reData.msg.merSignMsg+"&tranData="+reData.msg.tranData+"&cardNo="+userData.cardid;
      }else {
        alert("解绑失败!");
      }
    });
  }
  //挂失卡
  hangCard = () => {
    // console.log(`value2:`);
    //从缓存中读取
    var userInfo = localStorage.userInfo;
    //json转换为Object对象
    var userData = JSON.parse(userInfo);
    //挂失的post请求参数
    var hangdata = {
      cardNo: userData.cardid,
      memberNo: userData.username,
      merchantNo: "000006666666666",
      type:'1',
      extend:'app'
    };
    //post请求
    axios.post(config.hangUrl,Qs.stringify(hangdata)).then(function(response){
      var reData = response.data;
      if(reData.success) {//成功
        console.log("成功！");
        //跳转页面
        window.location.href=reData.msg.postUrl+"?merSignMsg="+reData.msg.merSignMsg+"&tranData="+reData.msg.tranData+"&cardNo="+userData.cardid;
      }else {
        alert("挂失失败!");
      }
    });
  }
  //解挂卡
  unhangCard = () => {
    // console.log(`value2:`);
    //从缓存中读取
    var userInfo = localStorage.userInfo;
    //json转换为Object对象
    var userData = JSON.parse(userInfo);
    //解挂的post请求参数
    var unhangdata = {
      cardNo: userData.cardid,
      memberNo: userData.username,
      merchantNo: "000006666666666",
      type:'2',
      extend:'app'
    };
    //post请求
    axios.post(config.hangUrl,Qs.stringify(unhangdata)).then(function(response){
      var reData = response.data;
      if(reData.success) {//成功
        console.log("成功！");
        //跳转页面
        window.location.href=reData.msg.postUrl+"?merSignMsg="+reData.msg.merSignMsg+"&tranData="+reData.msg.tranData+"&cardNo="+userData.cardid;
      }else {
        alert("解挂失败!");
      }
    });
  };

  //点击挂失
  isUnHang = () => {
    const array2 = [
      {text: '挂失', onPress: () => this.hangCard(), style: {fontWeight: 'bold'}},
      {text: '取消', onPress: () => console.log('cancel'), style: 'default'},
    ];
    if(this.state.code === '2004'){
      alert("您已挂失！");
    }else{
      alert('您即将挂失您的汇智卡', '确定挂失么?', array2);
    }
  };

  //点击解挂
  isLose = () => {
    const array3 = [
      {text: '解挂', onPress: () => this.unhangCard(), style: {fontWeight: 'bold'}},
      {text: '取消', onPress: () => console.log('cancel'), style: 'default'},
    ];
    if(this.state.code !== '2004'){
      alert("该卡未挂失，无需解挂！");
    }else{
      alert('您即将解挂您的汇智卡', '确定解挂么?', array3)
    }
  };
  render() {
    const array1 = [
      {text: '解绑', onPress: () => this.unboundCard(), style: {fontWeight: 'bold'}},
      {text: '取消', onPress: () => console.log('cancel'), style: 'default'},
    ];
    return (
      <div>
        <Card className=" Unbound_part2 card_none">
          <div >
            <div className="Unbound_content ">
              <ul className="Unbound_content_ul clearfix">

                <Link className="Unbound_link" to="Recharge">
                  <li>
                    <Icon
                      type={require('../../../assets/card/card-recharge.svg')}
                      className="tabSelect-icon Unbound_img_svg"/>
                    <p>充值</p>
                  </li>
                </Link>
                <Link className="Unbound_link" to="TransactionQuery">
                  <li className="two">
                    <Icon
                      type={require('../../../assets/card/card-detail.svg')}
                      className="tabSelect-icon Unbound_img_svg"/>
                    <p>交易明细查询</p>
                  </li>
                </Link>
                <Link className="Unbound_link">
                  <li>
                    <div onClick={() => alert('您即将解绑您的汇智卡', '确定解绑么?', array1) }>
                      <Icon
                        type={require('../../../assets/card/card-unbund.svg')}
                        className="tabSelect-icon Unbound_img_svg"/>
                      <p>解绑</p>
                    </div>
                  </li>
                </Link>
                <Link className="Unbound_link">
                  <li>
                    <div onClick={() => this.isUnHang() }>
                      <Icon
                        type={require('../../../assets/card/card-unhang.svg')}
                        className="tabSelect-icon Unbound_img_svg"/>
                      <p>挂失</p>
                    </div>
                  </li>
                </Link>
                <Link className="Unbound_link">
                  <li className="two">
                    <div onClick={() => this.isLose() }>
                      <Icon
                        type={require('../../../assets/card/card-lose.svg')}
                        className="tabSelect-icon Unbound_img_svg"/>
                      <p>解挂</p>
                    </div>
                  </li>
                </Link>
                <Link className="Unbound_link"to="index/redpacket">
                  <li>
                    <Icon
                      type={require('../../../assets/card/card-red.svg')}
                      className="tabSelect-icon Unbound_img_svg"/>
                    <p>红包管理</p>
                  </li>
                </Link>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    );
  }
}
export default BoundBar;
