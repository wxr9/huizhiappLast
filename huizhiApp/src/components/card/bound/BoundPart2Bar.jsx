import React from 'react';
import {Link} from 'react-router';
import {Card, Icon, Modal} from 'antd-mobile';
import '../Unbound/unbound.less';
import request from '../../../utils/request';
import config from '../../../config';
import axios from 'axios';
import Qs from 'qs';

const alert = Modal.alert;
var cardid = '13213';

class BoundBar extends React.Component {
  componentWillMount(){
    if(!sessionStorage.userInfo){
      console.log("未登录，请登录！");
    }else {
      //从缓存中读取
      var userInfo = sessionStorage.userInfo;
      //json转换为Object对象
      var reData = JSON.parse(userInfo);
      cardid = reData.cardid;
      if (reData.cardid) {
        console.log("有cardID"+cardid);
        console.log(cardid);
      } else {
        console.log("无cardID");
      }
    }
  }
  //解绑卡
  unboundCard = () => {
    // console.log(`value2:`);
    //从缓存中读取
    var userInfo = sessionStorage.userInfo;
    //json转换为Object对象
    var userData = JSON.parse(userInfo);
    //解绑的post请求参数
    var unbinddata = {
      cardNo: userData.cardid,
      memberNo: userData.username,
      merchantNo: "000006666666666",
      type:'2'
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
    var userInfo = sessionStorage.userInfo;
    //json转换为Object对象
    var userData = JSON.parse(userInfo);
    //挂失的post请求参数
    var hangdata = {
      cardNo: userData.cardid,
      memberNo: userData.username,
      merchantNo: "000006666666666",
      type:'1'
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
  //解绑卡
  unhangCard = () => {
    // console.log(`value2:`);
    //从缓存中读取
    var userInfo = sessionStorage.userInfo;
    //json转换为Object对象
    var userData = JSON.parse(userInfo);
    //解挂的post请求参数
    var unhangdata = {
      cardNo: userData.cardid,
      memberNo: userData.username,
      merchantNo: "000006666666666",
      type:'2'
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
  }

  render() {
    const array1 = [
      {text: '解绑', onPress: () => this.unboundCard(), style: {fontWeight: 'bold'}},
      {text: '取消', onPress: () => console.log('cancel'), style: 'default'},
    ];
    const array2 = [
      {text: '挂失', onPress: () => this.hangCard(), style: {fontWeight: 'bold'}},
      {text: '取消', onPress: () => console.log('cancel'), style: 'default'},
    ];
    const array3 = [
      {text: '解挂', onPress: () => this.unhangCard(), style: {fontWeight: 'bold'}},
      {text: '取消', onPress: () => console.log('cancel'), style: 'default'},
    ];
    return (
      <div>
        <Card className=" Unbound_part2 card_none">
          <div >
            <div className="Unbound_content ">
              <ul className="Unbound_content_ul clearfix">

                <Link className="Unbound_link">
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
                    <div onClick={() => alert('您即将解绑您的汇智卡', '确定解绑么???', array1) }>
                      <Icon
                        type={require('../../../assets/card/card-unbund.svg')}
                        className="tabSelect-icon Unbound_img_svg"/>
                      <p>解绑</p>
                    </div>
                  </li>
                </Link>
                <Link className="Unbound_link">
                  <li>
                    <div onClick={() => alert('您即将挂失您的汇智卡', '确定挂失么???', array2) }>
                      <Icon
                        type={require('../../../assets/card/card-unhang.svg')}
                        className="tabSelect-icon Unbound_img_svg"/>
                      <p>挂失</p>
                    </div>
                  </li>
                </Link>
                <Link className="Unbound_link">
                  <li className="two">
                    <div onClick={() => alert('您即将解挂您的汇智卡', '确定解挂么???', array3) }>
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
