import React from 'react';

import requestGET from './requestGET';
import config from '../config';

export default function getUserInfo() {
  //获取用户的个人信息并存入缓存
  requestGET(config.userInfoUrl).then((data) => {//从配置文件中读取url
    var userInfo = JSON.stringify(data);
    localStorage.userInfo = userInfo;//个人信息存入缓存
    // return userInfo;
  });
}
