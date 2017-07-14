const commonUrl = 'http://222.73.203.71:8080/';

var URLConfig = {
  httpUrl:'http://222.73.203.71:8080/',//服务器域名
  loginUrl:commonUrl + 'j_spring_security_check',//登录验证接口
  userInfoUrl:commonUrl + 'Setting/User/MyInfo',//获取个人信息接口
  actCenterUrl:commonUrl + 'ActivityCenter/ActivityMain/List/page/pageSize?isBan=1',//活动中心
  recharge:commonUrl + 'BizPayment/CardReCharge',//充值接口(暂时是这个，也许要改。post方法)
  rechargeDiscount:commonUrl + 'BizPayment/CardReChargeDiscount',//计算折扣金额接口(暂时是这个，也许要改。post方法)
  boatOrder:commonUrl + 'HuizhiBoat/BoatApply/Add',//游船预约接口(暂时是这个，也许要改。post方法)
  getPhoneCode:commonUrl+"Public/Phone/SendCode/",//获取手机验证码
  registerUrl:commonUrl+"Login/register",//注册
  codeImgUrl:commonUrl+"WiseAuth/AuthImageServlet",//图片验证码
  boundUrl:commonUrl+"BizPayment/BindUnBindCard",//绑定和解绑(暂时是这个，也许要改。post方法,无返回值)
  hangUrl:commonUrl+"BizPayment/LostHangCard",//挂失和解挂(暂时是这个，也许要改。post方法,无返回值)
  alipayUrl:"alipays://platformapi/startapp?appId=20000056",//扫码支付跳转支付宝链接
  validRedPacketUrl:commonUrl+"RedPacket/User/Valid/List",//可用红包
  invalidRedPAcketUrl:commonUrl+"RedPacket/User/Invalid/List",//过期和已使用红包
  cardBalanceUrl:commonUrl+"BizPayment/QueryCardBalance",//获取账户金额
  myServiceUrl:commonUrl+"workflow/api/processinstances/my_apply/list/1/10",//获取我的服务列表
  myOrderUrl:commonUrl+"HuizhiBoat/BoatApply/Me/List/1/10",//获取我的服务列表
  changePasswordUrl:commonUrl+"Setting/User/ChangePassword",//修改密码提交
  editUserUrl:commonUrl+"Setting/User/CompleteUserInfo",//用户信息编辑
  eduDicUrl:commonUrl+"Setting/SettingDict/0/0?type=education",//学历数据字典
  nationDicUrl:commonUrl+"Setting/SettingDict/0/0?type=nation",//国籍数据字典
  cityDicUrl:commonUrl+"Setting/SettingCity/ParentId/0/0/{ParentId}",//居住地数据字典
  applyGuideUrl:commonUrl+"Setting/RichText/ByTitle/Edit",//申请汇智卡须知
  applyAddUrl:commonUrl+"CardApply/Person/Add",//申请汇智卡提交
  BannerUrl:commonUrl+"Setting/HomepageAdver/App/List",//首页轮播图的列表
  changePhoneUrl:commonUrl+"Setting/User/ChangePhone",//修改手机号
  notificationUrl:commonUrl+"Notification/1/10",//消息通知
  ITRepairUrl:commonUrl+"ITRepair/Add",//IT报修
  queryTransDetails:commonUrl+"BizPayment/QueryTransDetails",//交易明细
  NoticeUrl:commonUrl+"Setting/RichText/ByTitle/Edit?title={title}",//须知
  editUserInfoUrl:commonUrl+"Setting/User/CompleteUserInfo",//修改用户信息
  parkUrl:commonUrl+"Setting/Park/0/0",//获取园区信息
  buildingUrl:commonUrl+"Setting/Building/BuildingByParkId/0/0/{ParentId}",//获取楼宇信息
  parentIdExceptTopUrl:commonUrl+"Setting/SettingDict/ParentIdExceptTop/List/0/0?type=repairsCommFlag",//获取物业报修父类
  settingDictUrl:commonUrl+"Setting/SettingDict/ParentId/0/0/{ParentId}",//获取报修子类
  ITrepairsUrl:commonUrl+"Setting/SettingDict/ParentIdExceptTop/List/0/0?type=ITrepairsFlag",//获取IT报修父类
  userRepairUrl:commonUrl+"UserRepair/Add",//报修地址
};

export default URLConfig;
