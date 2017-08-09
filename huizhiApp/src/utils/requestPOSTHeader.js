import axios from 'axios';

export default function requestPostHeader(url,formData,header) {
  return axios.post(url,formData,{headers:header}).then(function(response){//从配置文件中读取url，POST请求
    return response.data;
  }).catch(function (error) {
    console.log(error);
  });
}
