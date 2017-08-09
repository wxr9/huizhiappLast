import React from 'react';
import { Link } from 'react-router';
import { List, WingBlank, Card, Flex } from 'antd-mobile';

import '../../main/MyXiaozhi/MayXiaozhi.less';
import request from '../../../utils/requestPOST';
import config from '../../../config';
let infoList = [];

/**
 *  申请汇智卡表单部分
 */
class BoundBar extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      infoList: [],
      cardId:[],
      code:"",
      warn:"",
    };
  }
  componentWillMount () {
    var nowDate = new Date().getTime();
    console.log(nowDate);
    //卡号和会员号要从缓存中读取
    var userInfo = localStorage.userInfo;
    //json转换为Object对象
    var  reData = JSON.parse(userInfo);
    var cardid = reData.cardid;
    cardid = cardid.substring(4,8)+"***"+cardid.substring(12,cardid.length);
    this.setState({
      cardId : cardid,
    })

    var data = {
      cardNo:reData.cardid ,
      memberNo: reData.username
    };
    console.log(data);
    request(config.cardBalanceUrl,data).then((data) => {//从配置文件中读取url
      console.log("cardBalanceUrl data",data);
      var infoList = data;
      console.log("infoList",infoList);
      if(data.msg==true || data.msg=="查询成功"){
        this.setState({
          infoList: [infoList.epBalance,infoList.edBalance],
        });
      }else if(data.code == "2004"){
        this.setState({
          infoList: ["***","***"],
          code:data.code,
          warn:data.msg,
        });
      }else{
        this.setState({
          infoList: ["***","***"],
        });
      }
    });
  }
  render() {
    const { infoList } = this.state;
    const { cardId } = this.state;
    const { code } = this.state;
    const { warn } = this.state;
    //卡号异常状态提醒
    var warning = "";
    if(code == "2004"){
      warning = "("+warn+"！)"
    }
    return (
      <div>
        <Link to="index/Index">
            <img
              className="Unbound_img"
              src={require('../../../assets/card/card-p1.jpg')}
              alt="图片" />
        </Link>

            <List className="MyXiaozhi_list">
              <Card>
                <div className="MyXiaozhi_cardNo" >汇智卡号：{cardId}<span style = {{color:'red'}}>{warning}</span></div>

                <Flex>
                  <Flex.Item>
                    <div className="MyXiaozhi_money" >电子钱包余额</div>
                    <div className="MyXiaozhi_money_bg" >
                      <div className="MyXiaozhi_money_hidden" >{infoList[0]}</div>
                    </div>
                  </Flex.Item>
                  <Flex.Item  className="MyXiaozhi_Flex">
                    <div className="MyXiaozhi_money">主账户余额</div>
                    <div className="MyXiaozhi_money_bg" >
                      <div className="MyXiaozhi_money_hidden">{infoList[1]}</div>
                    </div>
                  </Flex.Item>
                </Flex>

                <Card.Footer
                  className="MyXiaozhi_money"
                  content={'（以卡内实际金额为准，单位：元）'} />
              </Card>
            </List>

      </div>
    );
  }
}
export default BoundBar;
