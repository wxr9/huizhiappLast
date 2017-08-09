import React from 'react';
import { Modal } from 'antd-mobile';

import requestPOST from './requestPOST';
import requestGET from './requestGET';
import config from '../config';

const alert = Modal.alert;
var histroyArr = [];

export default function autoLoginUtil() {
  // 获取当前时间戳
  const currentTimestamp = new Date().getTime();
  //判断是否超时(GET)
  var  loginOutTimeUrl = config.loginOutTimeUrl+"?timestamp="+currentTimestamp;
  requestGET(loginOutTimeUrl).then((data) => {//从配置文件中读取url
    // //将历史记录以数组的形式存入缓存
    // var currentUrl = window.location.href;
    // currentUrl = currentUrl.substring(0,currentUrl.indexOf("?"));
    // histroyArr.push(currentUrl);
    // localStorage.histroyArr = histroyArr;
    if(!data.success){//超时
      //判断用户登录信息是否存在
      if(localStorage.loginInfo == undefined || localStorage.loginInfo == null){//用户登录信息不存在，返回
        return ;
      }
      var loginInfo = JSON.parse(localStorage.loginInfo);
      if(loginInfo != undefined && loginInfo != null){
        //用户否记住密码
        var username = loginInfo.username;
        var pwd = loginInfo.pwd;
        if(pwd!=null && pwd!="" && pwd!=undefined && username!=null && username!="" && username!=undefined){
          //注销
          var  loginOutUrl = config.loginOutUrl+"?timestamp="+currentTimestamp;
          requestPOST(loginOutUrl,{}).then(function(data){//从配置文件中读取url，POST请求
            if(data.success){//注销成功
              //超时-用户信息存在-记住密码，自动登录
              var data = {
                j_password: pwd,
                j_username: username,
                lgtp: "front"
              };
              //重新登录,地址添加时间戳,防止浏览器默认已访问，接口返回无数据
              var loginUrl = config.loginUrl+"?timestamp="+currentTimestamp;
              requestPOST(loginUrl,data).then((data) => {//登录
                if(data.success){//登陆成功
                  //获取用户的个人信息并存入缓存
                  requestGET(config.userInfoUrl).then((data) => {//从配置文件中读取url
                    var userInfo = JSON.stringify(data);
                    localStorage.userInfo = userInfo;//个人信息存入缓存
                  });
                }else{
                  alert("登录超时,请重新登录！");
                }
              }).catch(function(error){
                console.log(error);
              });
            }else{
              alert("注销失败！");
            }
          }).catch(function(error){
            console.log(error);
          });
        }else{//将缓存清空
          localStorage.removeItem("userInfo");
          localStorage.removeItem("lastUrl");
          localStorage.removeItem("loginInfo");
          // alert("登录超时，请重新登录！");
          const loginOutAlert = [
            {text: '登录', onPress: () => window.location.href="#login?url=index/Index", style: {fontWeight: 'bold'}},
            {text: '取消', onPress: () => console.log('cancel'), style: 'default'},
          ];
          alert('登录超时，请重新登录！', '确定登录?', loginOutAlert);
        }
      }else{
        alert("登录超时，请重新登录！");
      }
    }
  });

}
