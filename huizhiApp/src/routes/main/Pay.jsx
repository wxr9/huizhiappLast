import React from 'react';
import { Modal } from 'antd-mobile';
import CodeBar from '../../components/main/Pay/CodeBar.jsx';
import CodeBtn from '../../components/main/Pay/CodeBtn.jsx';
import autoLoginUtil from '../../utils/autoLoginUtil';
import getUserInfo from '../../utils/getUserInfo';
import requestGET from '../../utils/requestGET';
import config from '../../config';

const alert = Modal.alert;

//扫码支付
class Pay extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount () {
    //判断登录是否超时
    autoLoginUtil();
    //获取用户的个人信息并存入缓存
    requestGET(config.userInfoUrl).then((data) => {//从配置文件中读取url
      var userInfo = JSON.stringify(data);
      localStorage.userInfo = userInfo;//个人信息存入缓存
      if(localStorage.loginInfo === undefined) {
        //跳转登录界面
        window.location.href = "#login"
      }else if(localStorage.userInfo !== undefined){
        let userInfo = JSON.parse(localStorage.userInfo);
        let cardId = userInfo.cardid;
        if( cardId === null|| cardId === "" || cardId === undefined){
          alert("未绑卡，请先绑卡！","要去绑卡吗？", [
            { text: '去绑卡', onPress: () => window.location.href = "#index/Bound" },
            { text: '取消', onPress: () => window.location.href = "#index/Index" },
          ]);
        }
      }
    });
  }

  render() {
    return (
      <div className="codeBar_bg">
        {/*条形码*/}
        <CodeBar/>
        {/*确认支付按钮*/}
        <CodeBtn/>
      </div>
    );
  }
}
export default Pay;
