import React from 'react';
import { List, Button , Modal, Toast } from 'antd-mobile';
import { Link } from 'react-router';

import './instruction.less';
import config from '../../../config';
import axios from 'axios';
import Qs from 'qs';

const Item = List.Item;
const prompt = Modal.prompt;
const alert = Modal.alert;

class UserInstruction extends React.Component {
  state={
    display1: 'none',
    display2: '',
  }
  componentWillMount(){
    if(!localStorage.userInfo){
      console.log("未登录，请登录！");
    }else {
      //从缓存中读取
      var userInfo = localStorage.userInfo;
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

  /*不同意，页面跳回*/
  jumpService =()=>{
    window.location.href = "#index/service";
  };
  /*同意，页面跳转*/
  jumpBoatOrder =()=>{
    window.location.href = "#index/boatOrder";
  };
  /*绑卡，页面跳转*/
  jumpBound =()=>{
    window.location.href = "#index/Bound";
  };
  render() {
    return (
      <List className="UserInstruction_list">
        <div className="instruction-binding-warp">
          <Item wrap>
            <div className="instruction-binding-item">
              <span className="instruction-head">用户须知</span></div>
            <span className="instruction-content">
              <p>
                 一、上海浦东软件园汇智湖游船（以下简称“游船”）作为园区公益服务项目，仅
              向上海浦东软件园园内企业及职工免费开放。
              </p>
              <p>
                 二、游船使用接受园区企业及职工提交预约申请，申请人须按照《汇智湖游船预约
              申请规则》进行预约申请。
              </p>
              <p>
                 三、游船开放时间为周一至周五（法定节假日除外）10:00-14:00，开放时间外严禁
              进入码头区域。如遇特殊天气、紧急事故、突发事件则停止运营，游船使用需重新
              预约。
              </p>
              <p>
                  四、预约成功的申请人应于当日提前10分钟到达指定游船码头，依次进行预约信息
              核验及登船准备，预约登记信息应与实际出示汇智卡信息相符。每艘游船开行乘客
              数要求不少于2人，且不超过4人。
              </p>
              <p>
                 五、迟到乘客视为放弃预约权利，过时不候；对于预约成功但无故不到场的乘客，将
              暂停其汇智卡1个月游船预约权利；对于恶意超时使用游船的乘客，亦将暂停该汇智卡
              1个月游船预约权利。
              </p>
              <p>
                六、乘客使用游船全程应服从工作人员的指挥；须穿着救生衣后方可依次登船，并在
              游船全程使用中严禁脱下。乘客应在指定码头上下游船，须在游船稳定后方可上下。
              </p>
              <p>
                七、乘客使用游船不得离开指定水域，严禁在码头以外的区域登岸，如遇特殊情况，
              应配合工作人员，及时靠岸。
              </p>
              <p>
                八、乘客禁止在游船码头及游船上吸烟，严禁在船上站立嬉闹，乱扔杂物。
              </p>
              <p>
                九、严禁将宠物（包括但不限于猫、狗、兔等宠物品种）携带上船。严禁将易燃、
              易爆及具有腐蚀性的危险物品带上游船。
              </p>
              <p>
                十、患有不适宜乘坐游船的各类疾病（包括但不限于高血压、心脏病、高度近视、
              精神疾病等）的乘客、孕妇及醉酒者不得乘坐游船，如果乘客隐瞒上述情况，登船
              出航发生意外的，后果自负。
              </p>

            </span>
            <div className="user-instruction-button" style={{display:this.state.display1}}>
              {/*<Link to="index/service">*/}
                <Button
                  className="btn1" type="default" inline size="small" onClick={this.jumpService}
                >不同意</Button>
              {/*</Link>*/}
              {/*<Link to="index/boatOrder">*/}
                <Button
                  className="btn2" type="primary" inline size="small" onClick={this.jumpBoatOrder}
                >同意协议</Button>
              {/*</Link>*/}
            </div>
            <div className="instruction-binding-btn" style={{display:this.state.display2}}>
                <Button

                  className="btn" type="primary" inline size="small"
                  onClick={this.jumpBound}

                >请先绑定卡</Button>
            </div>
          </Item>
        </div>
      </List>
    );
  }
}
export default UserInstruction;
