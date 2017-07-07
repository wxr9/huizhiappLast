var commonUrl = 'http://222.73.203.71:8080/';

var URLConfig = {
  loginUrl:commonUrl + 'j_spring_security_check',//登录验证接口
  userInfoUrl:commonUrl + 'Setting/User/MyInfo',//获取个人信息接口
  actCenterUrl:commonUrl + '/ActivityCenter/ActivityMain/List/1/12',//活动中心
  recharge:commonUrl + 'BizPayment/CardReCharge',//充值接口(暂时是这个，也许要改。post方法)
  rechargeDiscount:commonUrl + 'BizPayment/CardReChargeDiscount',//计算折扣金额接口(暂时是这个，也许要改。post方法)
  boatOrder:commonUrl + 'HuizhiBoat/BoatApply/Add',//游船预约接口(暂时是这个，也许要改。post方法)
  userRepairUrl:commonUrl+'UserRepair/Add',//物业报修
  getPhoneCode:commonUrl+"/Public/Phone/SendCode/",//获取手机验证码
  registerUrl:commonUrl+"/Login/register",//注册
  codeImgUrl:commonUrl+"WiseAuth/AuthImageServlet",//图片验证码
};

export default URLConfig;
