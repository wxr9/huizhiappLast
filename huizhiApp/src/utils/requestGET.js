import axios from 'axios';

export default function requestGet(url) {
  return axios.get(url).then(function(response){//从配置文件中读取url，GET请求
    return response.data;
  }).catch(function (error) {
    console.log(error);
  });
}
