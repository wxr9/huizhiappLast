import React from 'react';
import { Router, Route, IndexRoute } from 'dva/router';
import { Modal } from 'antd-mobile';
import autoLoginUtil from './utils/autoLoginUtil';

import Login from './routes/main/Login';
import ForgetPwdOne from './routes/main/ForgetPwdOne';
import ForgetPwdTwo from './routes/main/ForgetPwdTwo';
import RegisterStepOne from './routes/main/RegisterStepOne';
import ChangePwd from './routes/main/ChangePwd';
import Index from './routes/main/Index';
import ActiveDetail from './routes/main/ActiveDetail';
import ActiveCenter from './routes/main/ActiveCenter';

import MyXiaozhi from './routes/main/MyXiaozhi';
import Detail from './components/main/MyXiaozhi/Detail'

import ApplyCard from './routes/card/ApplyCard';
import TransactionQuery from './routes/card/TransactionQuery';
import Recharge from './routes/card/Recharge';
import RechargeTwo from './routes/card/RechargeTwo';
import RechargeThree from './routes/card/RechargeThree';
import Unbound from './routes/card/Unbound';
import Bound from './routes/card/Bound';

import PersonInfo from './routes/user/PersonInfo';
import ChangePhoneNo from './routes/user/ChangePhoneNo';
import PersonCenter from './routes/user/PersonCenter';
import PersonCenter_UnLogin from './routes/user/PersonCenter_UnLogin';
import PersonNotify from './routes/user/PersonNotify';
import UserPay from './routes/user/UserPay';
import UserInfo from './routes/user/UserInfo';

import PropertyRepair from './routes/server/PropertyRepair';
import UserInstruction from './routes/server/UserInstruction';
import InstructionBinding from './routes/server/InstructionBinding';
import BoatOrder from './routes/server/BoatOrder';
import Service from './routes/server/ServiceCenter';
import ITRepair from './routes/server/ITRepair';

import Wrap from './components/Wrap';
import WrapTab from './components/WrapTab';

import  Lead from './routes/main/Lead'
import RedPacket from './routes/card/RedPacket';

import Pay from './routes/main/Pay';

import Top from './components/Top'
import GoBack from './components/GoBack'
import Wrap_two from './components/Wrap_two'
import Notice from './components/card/Unbound/Notice'

const alert = Modal.alert;
var indexPage;
var HZAppVersion = localStorage.HZAppVersion;
var HZAppCurrentVersion = localStorage.HZAppVersionNEW;
if((HZAppVersion == HZAppCurrentVersion) && HZAppVersion != undefined){//覆盖安装，版本号相同，不是第一次进引导页
  localStorage.isFristLogin = 'false';
}else{//版本号不同，显示引导页
  localStorage.isFristLogin = 'true';
  localStorage.HZAppVersion = HZAppCurrentVersion;
}
if (localStorage.isFristLogin == undefined || localStorage.isFristLogin == 'true') {
  indexPage = <IndexRoute component={Lead} />;
} else {
  //自动登录
  autoLoginUtil();
  //首页跳转
  indexPage =
    <Route component={Top}>
    <Route component={WrapTab}>
    <IndexRoute breadName="首页" component={Index} />
    </Route>
    </Route>
}

// 管理所有页面的路由功能
function RouterConfig({ history }) {
  return (
    <Router history={history}>
      {/*<Route path="index/Active" breadName="活动中心" component={Active} />*/}
      <Route path="/">
        {/*<IndexRoute component={Lead} />*/}
        {indexPage}
        <Route path="/" component={GoBack}>
        <Route path="ApplyCard" breadName="申请汇智卡" component={ApplyCard} />
        <Route path="index/instruction" component={UserInstruction} />
        <Route path="index/instructionBinding" component={InstructionBinding} />
          <Route path="index/itRepair" breadName="IT报修" component={ITRepair} />
          <Route path="index/propertyRepair" breadName="物业报修" component={PropertyRepair} />
          <Route path="index/boatOrder" breadName="游船预约" component={BoatOrder} />
          <Router path="notice" breaName="须知" component={Notice}/>
          <Route path="Detail" breadName="我的服务详情" component={Detail} />
        </Route>
      </Route>

        <Route path="/" component={Top}>
          <Route path="/index" component={WrapTab}>
            <Route path="Index" breadName="首页" component={Index} />
            <Route path="MyXiaozhi" breadName="我的小智" component={MyXiaozhi} />
            <Route path="ActiveCenter" breadName="活动中心" component={ActiveCenter} />
            <Route path="service" breadName="服务中心" component={Service} />
            <Route path="pay" breadName="扫码支付" component={Pay} />
            <Route path="personcenter" breadName="个人中心" component={PersonCenter} />
            <Route path="personcenter_UnLogin" breadName="个人中心" component={PersonCenter_UnLogin} />

          </Route>
        </Route>

      <Route components={Wrap_two}>
        <Route path="login" breadName="登录" component={Login} />
        <Route path="ForgetPwdOne" breadName="忘记密码" component={ForgetPwdOne} />
        <Route path="ForgetPwdTwo" breadName="忘记密码" component={ForgetPwdTwo} />
        <Route path="RegisterStepOne" breadName="注册" component={RegisterStepOne} />
        <Route path="index/userinfo" breadName="个人资料修改" component={UserInfo} />
        <Route path="index/activedetail" breadName="头像修改" component={ActiveDetail} />
        <Route path="ChangePwd" breadName="登录密码修改" component={ChangePwd} />
        <Route path="ChangePhoneNo" breadName="联系方式修改" component={ChangePhoneNo} />
        <Route path="TransactionQuery" breadName="交易明细" component={TransactionQuery} />
        <Route path="Recharge" breadName="充值" component={Recharge} />
        <Route path="RechargeTwo" breadName="充值" component={RechargeTwo} />
        <Route path="RechargeThree" breadName="充值" component={RechargeThree} />

        <Route path="index/personinfo" breadName="个人信息" component={PersonInfo} />
        <Route path="index/personnotify" breadName="通知管理" component={PersonNotify} />
        <Route path="index/UserPay" breadName="支付记录" component={UserPay} />
        <Route path="index/redpacket" breadName="红包管理" component={RedPacket} />
        <Route path="index/unbound" breadName="汇智卡" component={Unbound} />
        <Route path="index/bound" breadName="汇智卡" component={Bound} />
      </Route>

      <Route path="/" component={Wrap}>
        <Route path="/index" component={WrapTab}>
        </Route>
      </Route>
    </Router>
  );
}
export default RouterConfig;
