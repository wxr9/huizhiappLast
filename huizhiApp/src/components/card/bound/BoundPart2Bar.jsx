import React from 'react';
import {Link} from 'react-router';
import {Card, Icon, Modal} from 'antd-mobile';
import '../Unbound/unbound.less';

const alert = Modal.alert;

const array1 = [
  {text: '解绑', onPress: () => console.log('ok'), style: {fontWeight: 'bold'}},
  {text: '取消', onPress: () => console.log('cancel'), style: 'default'},
];
const array2 = [
  {text: '解挂', onPress: () => console.log('ok'), style: {fontWeight: 'bold'}},
  {text: '取消', onPress: () => console.log('cancel'), style: 'default'},
];
const array3 = [
  {text: '挂失', onPress: () => console.log('ok'), style: {fontWeight: 'bold'}},
  {text: '取消', onPress: () => console.log('cancel'), style: 'default'},
];
class BoundBar extends React.Component {
  unbundlingClick() {
    const card = '123333332321';
    // console.log('div clicked!');
    alert(`您即将解绑您的汇智卡[${card
      }]`, '确定解绑么???', array1);
  }

  unhang() {
    const card = '123333332321';
    // console.log('div clicked!');
    alert(`您即将解挂您的汇智卡[${card
      }]`, '确定解挂么???', array2);
  }

  lose() {
    const card = '123333332321';
    // console.log('div clicked!');
    alert(`您即将挂失您的汇智卡[${card
      }]`, '确定挂失么???', array3);
  }

  render() {
    return (
      <div>
        <Card className=" Unbound_part2 card_none">
          <div >
            <div className="Unbound_content ">
              <ul className="Unbound_content_ul clearfix">

                <Link className="Unbound_link">
                  <li>
                    <Icon
                      type={require('../../../assets/card/card-recharge.svg')}
                      className="tabSelect-icon Unbound_img_svg"/>
                    <p>充值</p>
                  </li>
                </Link>
                <Link className="Unbound_link" to="TransactionQuery">
                  <li className="two">
                    <Icon
                      type={require('../../../assets/card/card-detail.svg')}
                      className="tabSelect-icon Unbound_img_svg"/>
                    <p>交易明细查询</p>
                  </li>
                </Link>
                <Link className="Unbound_link">
                  <li>
                    <div onClick={this.unbundlingClick}>
                      <Icon
                        type={require('../../../assets/card/card-unbund.svg')}
                        className="tabSelect-icon Unbound_img_svg"/>
                      <p>解绑</p>
                    </div>
                  </li>
                </Link>
                <Link className="Unbound_link">
                  <li>
                    <div onClick={this.lose}>
                      <Icon
                        type={require('../../../assets/card/card-unhang.svg')}
                        className="tabSelect-icon Unbound_img_svg"/>
                      <p>挂失</p>
                    </div>
                  </li>
                </Link>
                <Link className="Unbound_link">
                  <li className="two">
                    <div onClick={this.unhang}>
                      <Icon
                        type={require('../../../assets/card/card-lose.svg')}
                        className="tabSelect-icon Unbound_img_svg"/>
                      <p>解挂</p>
                    </div>
                  </li>
                </Link>
                <Link className="Unbound_link" to="index/redpacket">
                  <li>
                    <Icon
                      type={require('../../../assets/card/card-red.svg')}
                      className="tabSelect-icon Unbound_img_svg"/>
                    <p>红包管理</p>
                  </li>
                </Link>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    );
  }
}
export default BoundBar;
