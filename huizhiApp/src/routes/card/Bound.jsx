import React from 'react';
import BoundPart1 from '../../components/card/bound/BoundPart1Bar';
import BoundPart2 from '../../components/card/bound/BoundPart2Bar';
import BoundPart3 from '../../components/card/bound/BoundPart3Bar';
import autoLoginUtil from '../../utils/autoLoginUtil';
import getUserInfo from '../../utils/getUserInfo';
import UnboundPart1 from '../../components/card/Unbound/part1';
import UnboundPart2 from '../../components/card/Unbound/part2';
import UnboundPart3 from '../../components/card/Unbound/part3';
import requestGET from '../../utils/requestGET';
import config from '../../config';

var part1;
var part2;

// 汇智卡已绑定
class Bound extends React.Component {
  state={
    userInfo:'',
    isBound:'',
  };
  componentWillMount () {
    //判断登录是否超时
    autoLoginUtil();
    //获取用户的个人信息并存入缓存
    setTimeout(() => {
    requestGET(config.userInfoUrl).then((data) => {//从配置文件中读取url
      // alert("data"+JSON.stringify(data));
      var userInfo = JSON.stringify(data);
      localStorage.userInfo = userInfo;//个人信息存入缓存
      //从缓存中读取用户个人信息
        this.setState({
          userInfo: JSON.parse(userInfo)
        });
    }, 1000);
      // alert("data"+this.state.userInfo.toString());
    });
  }

  render() {
    var part1;
    var part2;
    if( this.state.userInfo.cardid == null|| this.state.userInfo.cardid == "" || this.state.userInfo.cardid == undefined){
      part1 = <div>
        <UnboundPart1/>
        <UnboundPart2/>
      </div>
      part2 = <UnboundPart3/>
    }
    else{
      part1 = <BoundPart1/>
      part2 = <BoundPart2/>
    }
    return (
        <div>
          { part1 }
          { part2 }
          <BoundPart3 />
        </div>
    );
  }
}
export default Bound;
