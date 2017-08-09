import React from 'react';
import { Link } from 'react-router';
import { Card, WhiteSpace, WingBlank, Button, Grid, Icon, Modal} from 'antd-mobile';

import './unbound.less'

const alert = Modal.alert;

class part3 extends React.Component {
  showAlert(){
    alert("未绑卡，请先绑卡！");
  }

  render() {
    return (
      <div>
        <Card className=" Unbound_part2 card_none">
          <div >
            <div className="Unbound_content " onClick={()=>this.showAlert()}>
              <ul className="Unbound_content_ul clearfix">

                <Link className="Unbound_link">
                  <li>
                    {/*// TODO-ICON*/}
                    <Icon
                      type={require('../../../assets/card/card-recharge.svg')}
                      className="tabSelect-icon Unbound_img_svg"/>
                    {/*<img src={require('../assets/bound2.png')} />*/}
                    <p>充值</p>
                  </li>
                </Link>
                <Link className="Unbound_link">
                  <li className="two">
                    {/*// TODO-ICON*/}
                    <Icon
                      type={require('../../../assets/card/card-detail.svg')}
                      className="tabSelect-icon Unbound_img_svg"/>
                    {/*<img src={require('../assets/bound3.png')} />*/}
                    <p>交易明细查询</p>
                  </li>
                </Link>
                <Link className="Unbound_link">
                  <li>
                    {/*// TODO-ICON*/}
                    <Icon
                      type={require('../../../assets/card/card-unbund.svg')}
                      className="tabSelect-icon Unbound_img_svg"/>
                    {/*<img src={require('../assets/bound4.png')} />*/}
                    <p>解绑</p>
                  </li>
                </Link>
                <Link className="Unbound_link">
                  <li>
                    {/*// TODO-ICON*/}
                    <Icon
                      type={require('../../../assets/card/card-unhang.svg')}
                      className="tabSelect-icon Unbound_img_svg"/>
                    {/*<img src={require('../assets/bound5.png')} />*/}
                    <p>挂失</p>
                  </li>
                </Link>
                <Link className="Unbound_link">
                  <li  className="two">
                    {/*// TODO-ICON*/}
                    <Icon
                      type={require('../../../assets/card/card-lose.svg')}
                      className="tabSelect-icon Unbound_img_svg"/>
                    {/*<img src={require('../assets/bound6.png')} />*/}
                    <p>解挂</p>
                  </li>
                </Link>
                <Link className="Unbound_link">
                  <li>
                    {/*// TODO-ICON*/}
                    <Icon
                      type={require('../../../assets/card/card-red.svg')}
                      className="tabSelect-icon Unbound_img_svg"/>
                    {/*<img src={require('../assets/bound7.png')} />*/}
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

export default part3;
