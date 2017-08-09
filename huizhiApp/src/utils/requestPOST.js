import axios from 'axios';
import Qs from 'qs';

export default function requestPost(url,data) {
  return axios.post(url,Qs.stringify(data)).then(function(response){//从配置文件中读取url，POST请求
    return response.data;
  }).catch(function (error) {
    console.log(error);
  });
}
