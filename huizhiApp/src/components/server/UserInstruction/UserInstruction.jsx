import React from 'react';
import { List, Button } from 'antd-mobile';
import { Link } from 'react-router';

import './instruction.less';

const Item = List.Item;

class UserInstruction extends React.Component {
  state={
    display1: 'none',
    display2: '',
  }
  componentWillMount(){
    if(!sessionStorage.obj){
      console.log("未登录，请登录！");
    }else {
      //从缓存中读取
      var userInfo = sessionStorage.obj;
      //json转换为Object对象
      var reData = JSON.parse(userInfo);

      if (reData.cardid) {
        console.log("有cardID");
        this.state.display1='';
        this.state.display2='none';
      } else {
        this.state.display1='none'
        this.state.display2='';
        console.log("无cardID");
      }
    }
  }
  render() {
    return (
      <List>
        <div className="instruction-binding-warp">
          <Item wrap>
            <div className="instruction-binding-item">
              <span className="instruction-head">用户须知</span></div>
            <span className="instruction-content">
            一,上海浦东软件园,作为公益服务项目,上海浦东软件园,作为公益服务项目,上海浦东软件园,作为公益服务项目<br />
            二,上海浦东软件园,作为公益服务项目,上海浦东软件园,作为公益服务项目,上海浦东软件园,作为公益服务项目<br />
            三,上海浦东软件园,作为公益服务项目,上海浦东软件园,作为公益服务项目,上海浦东软件园,作为公益服务项目<br />
            四,上海浦东软件园,作为公益服务项目,上海浦东软件园,作为公益服务项目,上海浦东软件园,作为公益服务项目<br />
            五,上海浦东软件园,作为公益服务项目,上海浦东软件园,作为公益服务项目,上海浦东软件园,作为公益服务项目<br />
            六,上海浦东软件园,作为公益服务项目,上海浦东软件园,作为公益服务项目,上海浦东软件园,作为公益服务项目<br />
            </span>
            <div className="user-instruction-button" style={{display:this.state.display1}}>
              <Link to="index/service">
                <Button
                  className="btn1" type="default" inline size="small" onClick={() => {
                  }}
                >不同意</Button>
              </Link>
              <Link to="index/boatOrder">
                <Button
                  className="btn2" type="primary" inline size="small" onClick={() => {
                  }}
                >同意协议</Button>
              </Link>
            </div>
            <div className="instruction-binding-btn" style={{display:this.state.display2}}>
              <Link to="index/bunding">
                <Button
                  className="btn" type="primary" inline size="small" onClick={() => {
                }}
                >请先绑定卡</Button>
              </Link>
            </div>
          </Item>
        </div>
      </List>
    );
  }
}
export default UserInstruction;
