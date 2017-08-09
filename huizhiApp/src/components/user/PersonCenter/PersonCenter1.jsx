import React from 'react';
import { List, Badge, Flex, WhiteSpace, Icon } from 'antd-mobile';
import { Link } from 'react-router';

import './PersonCenter.less';
import config from '../../../config';

// 个人中心第一部分--头像
class PersonCenter1 extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      userInfo: [],
      display1:'',
      display2:'none',
    };
  }

  componentWillMount () {
    if(localStorage.userInfo != undefined){
      var userInfo = JSON.parse(localStorage.userInfo);
      var userFace = "/web/images/defaultFace.png";
      if(userInfo.userFace != null){
        userFace = userInfo.userFace;
      }
      userFace = config.httpUrl+userFace;
      this.setState({
        userInfo: userInfo,
        userFace:userFace,
      });
      console.log(userInfo);
      var cardid = userInfo.cardid;
      if(cardid !== null && cardid !== "" && cardid !== undefined){
        console.log(cardid);
        this.setState({
          display1:'',
          display2:'none',
        });
      }else{
        console.log("无cardid");
        this.setState({
          display1:'none',
          display2:'',
        });
      }
    }else {
      this.setState({
        display1:'none',
        display2:'none',
      });
    }
  }
  render() {
    // const {userFace,name} = this.props;
    const {userInfo} =this.state;
    let srcMessage;
    if (userInfo.userFace) {
      srcMessage = (
        <img className="personCenter_par1_png"
             src={config.httpUrl+userInfo.userFace}
               alt="图片" />
               )
             } else {
               srcMessage = (
                 <img className="personCenter_par1_png"
                      src={require('../../../assets/user/user-none.png')}
                        alt="图片" />
                        )
                      }
    return (
        <div className="personCenter_par1_div">
          <WhiteSpace size="lg" />
          <Flex  className="personCenter_par1_Flex">
            <Flex.Item>个人中心</Flex.Item>
          </Flex>
          <WhiteSpace size="lg" />
          <Flex className="personCenter_par1_Flex">
            <Flex.Item>
              {srcMessage}
              <div style={{display:this.state.display1}} className="vip1">
                <Icon
                  type={require('../../../assets/user/Member.svg')}
                  className="vip_Icon"
                  alt="认证会员"/>认证会员
              </div>
              <div  style={{display:this.state.display2}}  className="vip2">
                <Icon
                  type={require('../../../assets/user/Member_no.svg')}
                  className="vip_Icon"
                  alt="注册会员"/>注册会员
              </div>
           </Flex.Item>
          </Flex>
          <WhiteSpace size="lg" />

            <Flex className="personCenter_par1_Flex">
              <Flex.Item>{userInfo.name}</Flex.Item>
            </Flex>
          <WhiteSpace size="xl" />
        </div>
    );
  }
}
export default PersonCenter1;
