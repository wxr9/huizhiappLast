import React from 'react';
import { Link } from 'react-router';
import { Card,WhiteSpace,WingBlank,Button,Grid,Icon,Toast,Modal} from 'antd-mobile';
const prompt = Modal.prompt;
import './unbound.less'
import request from '../../../utils/request';
import config from '../../../config';

// const array1 = [
//   {
//     text: '绑定',
//     onPress: cardid => new Promise((resolve) => {
//       //Toast.info('onPress promise', 1);
//       setTimeout(() => {
//         resolve();
//         console.log(`value:${cardid}`);
//         console.log(this);
//         this.boundCard();
//       }, 1000);
//     }),
//   },
//   { text: '取消' },
// ];
class part2 extends React.Component {
  boundCard = (cardid) => {
    // console.log(`value2:`);
    // var cardid = '124513351332';
    //从缓存中读取
    var userInfo = sessionStorage.userInfo;
    //json转换为Object对象
    var userData = JSON.parse(userInfo);
    var params = "cardNo=" + cardid + "&memberNo=" + userData.username + "&type=1";
    //post请求
    request(config.boundUrl,params).then((data) => {//从配置文件中读取url
      var reData = data.msg;
      if(reData.success) {//成功
        console.log("成功！");

        //跳转页面
        //window.location.href="#index/Index";
      }else {
        console.log("绑卡失败!");
      }
    });
  }
  render() {
    const array1 = [
      {
        text: '绑定',
        onPress: cardid => new Promise((resolve) => {
          //Toast.info('onPress promise', 1);
          setTimeout(() => {
            resolve();
            // console.log(`value:${cardid}`);
            // console.log(this);
            this.boundCard(cardid);
          }, 1000);
        }),
      },
      { text: '取消' },
    ];
    return (
      <div>
        <Card  className="Unbound_part2 card_none">
          <div className="Unbound_part2_position" >
            <Button type="" inline size=""
                    onClick={() => prompt('请您输入你要绑定的汇智卡', '', array1)}
                    className="Unbound_bund_card card_none">
              绑定汇智卡
            </Button>
            <Link to="ApplyCard">
              <Button  type="" inline size=""
                       className="Unbound_apply_card card_none " >
                申请汇智卡
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }
}

export default part2;
