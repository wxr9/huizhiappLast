import React from 'react';
import {Link} from 'react-router';
import {Card, Icon, Modal} from 'antd-mobile';
import '../Unbound/unbound.less';
import request from '../../../utils/request';
import config from '../../../config';

const alert = Modal.alert;
var cardid = '13213';

// const array1 = [
//   {text: '解绑', onPress: () => console.log('ok'), style: {fontWeight: 'bold'}},
//   {text: '取消', onPress: () => console.log('cancel'), style: 'default'},
// ];
// const array2 = [
//   {text: '解挂', onPress: () => console.log('ok'), style: {fontWeight: 'bold'}},
//   {text: '取消', onPress: () => console.log('cancel'), style: 'default'},
// ];
// const array3 = [
//   {text: '挂失', onPress: () => console.log('ok'), style: {fontWeight: 'bold'}},
//   {text: '取消', onPress: () => console.log('cancel'), style: 'default'},
// ];
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
  // unbundlingClick() {
  //   const card = '123333332321';
  //   // console.log('div clicked!');
  //   alert(`您即将解绑您的汇智卡[${card
  //     }]`, '确定解绑么???', array1);
  // }
  //
  // unhang() {
  //   const card = '123333332321';
  //   // console.log('div clicked!');
  //   alert(`您即将解挂您的汇智卡[${card
  //     }]`, '确定解挂么???', array2);
  // }
  //
  // lose() {
  //   const card = '123333332321';
  //   // console.log('div clicked!');
  //   alert(`您即将挂失您的汇智卡[${card
  //     }]`, '确定挂失么???', array3);
  // }
  unboundCard = () => {
    // console.log(`value2:`);
    //从缓存中读取
    var userInfo = sessionStorage.userInfo;
    //json转换为Object对象
    var userData = JSON.parse(userInfo);
    // cardid = userData.cardid;
    var params = "cardNo=" + userData.cardid + "&memberNo=" + userData.username + "&type=2";
    //post请求
    request(config.boundUrl,params).then((data) => {//从配置文件中读取url
      var reData = data.msg;
      console.log(reData);
      if(reData.success) {//成功
        console.log("成功！");

        //跳转页面
        //window.location.href="#index/Index";
      }else {
        console.log("解绑失败!");
      }
    });
  }
  hangCard = () => {
    // console.log(`value2:`);
    //从缓存中读取
    var userInfo = sessionStorage.userInfo;
    //json转换为Object对象
    var userData = JSON.parse(userInfo);
    // cardid = userData.cardid;
    var params = "cardNo=" + userData.cardid + "&memberNo=" + userData.username + "&type=1";
    //post请求
    request(config.hangUrl,params).then((data) => {//从配置文件中读取url
      var reData = data.msg;
      if(reData.success) {//成功
        console.log("成功！");

        //跳转页面
        //window.location.href="#index/Index";
      }else {
        console.log("挂失失败!");
      }
    });
  }
  unhangCard = () => {
    // console.log(`value2:`);
    //从缓存中读取
    var userInfo = sessionStorage.userInfo;
    //json转换为Object对象
    var userData = JSON.parse(userInfo);
    // cardid = userData.cardid;
    var params = "cardNo=" + userData.cardid + "&memberNo=" + userData.username + "&type=2";
    //post请求
    request(config.hangUrl,params).then((data) => {//从配置文件中读取url
      var reData = data.msg;
      if(reData.success) {//成功
        console.log("成功！");

        //跳转页面
        //window.location.href="#index/Index";
      }else {
        console.log("解挂失败!");
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
                    <div onClick={() => alert('您即将解绑您的汇智卡['+{cardid}+']', '确定解绑么???', array1) }>
                      <Icon
                        type={require('../../../assets/card/card-unbund.svg')}
                        className="tabSelect-icon Unbound_img_svg"/>
                      <p>解绑</p>
                    </div>
                  </li>
                </Link>
                <Link className="Unbound_link">
                  <li>
                    <div onClick={() => alert('您即将挂失您的汇智卡['+{cardid}+']', '确定挂失么???', array2) }>
                      <Icon
                        type={require('../../../assets/card/card-unhang.svg')}
                        className="tabSelect-icon Unbound_img_svg"/>
                      <p>挂失</p>
                    </div>
                  </li>
                </Link>
                <Link className="Unbound_link">
                  <li className="two">
                    <div onClick={() => alert('您即将解挂您的汇智卡['+{cardid}+']', '确定解挂么???', array3) }>
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
