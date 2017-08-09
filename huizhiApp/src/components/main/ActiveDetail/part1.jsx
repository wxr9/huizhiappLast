import React from 'react';
import { List,ImagePicker,Button,Modal,Toast } from 'antd-mobile';
import { Link } from 'react-router';
import './ActiveDetail.less';
import config from '../../../config';
import axios from 'axios';
import Qs from 'qs';
import requestGET from '../../../utils/requestGET';

const alert = Modal.alert;
const data = [];

// 头像设置
class part1 extends React.Component {
  state = {
    files: data,
  }
  onChange = (files, type, index) => {
    console.log(files, type, index);
    this.setState({
      files,
    });
  }

  base64ToBlob = (file) => {
    var base64 = file.url;
    const byteString = atob(base64.split(',')[1]);
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0, len = byteString.length; i < len; i += 1) {
      ia[i] = byteString.charCodeAt(i);
    }

    let blobUrl;
    blobUrl = new Blob([ab], { type: mimeString });

    const fd = new FormData();

    fd.append('file', blobUrl, file.file.name);
    fd.append('x',0);
    fd.append('y',0);
    var img = new Image();
    img.src = file.url;
    fd.append('w',img.width);
    fd.append('h',img.height);

    return fd
  }

  Upload=()=>{
      console.log(this.state.files[0]);
      //文件上传的post请求参数
      var formData = this.base64ToBlob(this.state.files[0]);
      console.log(formData);
      //设置请求头
      var header = {
        'content-type': 'multipart/form-data',
      }
    //轻提示
      Toast.loading('正在上传...', 0);
    //post请求
      axios.post(config.ChangeUserFaceUrl, formData, {headers: header}).then(function (response) {//SimpleUploadFileUrl
        var reData = response.data;
        console.log("reDate--");
        console.log(reData);
        if (reData.success) {//成功
          Toast.hide();
          alert("头像修改成功！");
          //获取用户的个人信息并存入缓存
          requestGET(config.userInfoUrl).then((data) => {//从配置文件中读取url
            var userInfo = JSON.stringify(data);
            localStorage.userInfo = userInfo;//个人信息存入缓存
          });
          // 跳转页面
          window.location.href = "#index/personinfo";
        } else {
          Toast.hide();
          alert(reData.msg);
        }
      });
  }
  render() {
    const { files } = this.state;
    return (
      <div className="user_photo">
        <div>
          <ImagePicker
            files={files}
            onChange={this.onChange}
            onImageClick={(index, fs) => console.log(index, fs)}
            selectable={files.length < 1}
          />
        </div>
        <Button className="btn" type="primary" onClick={this.Upload}>确认上传</Button>
      </div>
    );
  }
}
export default part1;
