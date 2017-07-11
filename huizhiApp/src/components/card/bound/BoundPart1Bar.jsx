import React from 'react';
import { Link } from 'react-router';
import { List, WingBlank, Card, Flex } from 'antd-mobile';
import '../../main/MyXiaozhi/MayXiaozhi.less';
import requestGET from '../../../utils/requestGET';
import request from '../../../utils/request';
import config from '../../../config';
class BoundBar extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      infoList: [],
      cardId:[]
    };
  }
  componentWillMount () {
    var nowDate = new Date().getTime();
    console.log(nowDate);
    //卡号和会员号要从缓存中读取
    var userInfo = sessionStorage.userInfo;
    //json转换为Object对象
    var  reData = JSON.parse(userInfo);
    var cardid = reData.cardid;
    this.setState({
      cardId : cardid
    })
    // var params ="cardNo=00199000008989"+"&memberNo=814987924531250124";
    var params ='{"cardNo":"00199000008989","memberNo":"814987924531250124"}';
    request(config.cardBalanceUrl,params).then((data) => {//从配置文件中读取url
      console.log(config.cardBalanceUrl);
      var infoList = data;
      this.setState({
        infoList : infoList
      })
      console.log(infoList);
    });
  }
  render() {
    const {infoList} = this.state;
    const {cardId} = this.state;
    return (
      <div>
        <Link to="index/Index">
            <img
              className="MyXiaozhi_img"
              src={require('../../../assets/card/card-p1.jpg')}
              alt="图片" />
        </Link>

            <List className="MyXiaozhi_list">
              <Card>
                <div className="MyXiaozhi_cardNo" >汇智卡号：{cardId}</div>

                <Flex>
                  <Flex.Item>
                    <div className="MyXiaozhi_money" >电子钱包余额</div>
                    <div className="MyXiaozhi_money_bg" >
                      <div className="MyXiaozhi_money_hidden" >***</div>
                    </div>
                  </Flex.Item>
                  <Flex.Item  className="MyXiaozhi_Flex">
                    <div className="MyXiaozhi_money">主账户余额</div>
                    <div className="MyXiaozhi_money_bg" >
                      <div className="MyXiaozhi_money_hidden">***</div>
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
