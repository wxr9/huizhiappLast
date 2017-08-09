// const commonUrl = 'http://222.73.203.71:8080/';
const commonUrl = 'https://www.hispsp.com/';//正式环境服务器域名

var URLConfig = {
  isFristLogin:'true',//登陆次数
  // httpUrl:'http://222.73.203.71:8080/',//服务器域名
  httpUrl:'https://www.hispsp.com/',//正式环境服务器域名
  loginUrl:commonUrl + 'j_spring_security_check',//登录验证接口
  userInfoUrl:commonUrl + 'Setting/User/MyInfo',//获取个人信息接口
  actCenterUrl:commonUrl + 'ActivityCenter/ActivityMain/List/page/pageSize?isBan=1',//活动中心
  recharge:commonUrl + 'BizPayment/Mobile/CardReCharge',//充值接口
  rechargeDiscount:commonUrl + 'BizPayment/CardReChargeDiscount',//计算折扣金额接口(暂时是这个，也许要改。post方法)
  boatOrder:commonUrl + 'HuizhiBoat/BoatApply/Add',//游船预约接口(暂时是这个，也许要改。post方法)
  getPhoneCode:commonUrl+"Public/Phone/SendCode/",//获取手机验证码
  registerUrl:commonUrl+"Login/register",//注册
  codeImgUrl:commonUrl+"WiseAuth/AuthImageServlet",//图片验证码
  boundUrl:commonUrl+"BizPayment/Mobile/BindUnBindCard",//绑定和解绑
  hangUrl:commonUrl+"BizPayment/Mobile/LostHangCard",//挂失和解挂
  alipayUrl:"alipays://platformapi/startapp?appId=20000056",//扫码支付跳转支付宝链接
  validRedPacketUrl:commonUrl+"RedPacket/User/Valid/List",//可用红包
  invalidRedPAcketUrl:commonUrl+"RedPacket/User/Invalid/List",//过期和已使用红包
  cardBalanceUrl:commonUrl+"BizPayment/QueryCardBalance",//获取账户金额
  myServiceUrl:commonUrl+"workflow/api/processinstances/my_apply/list/page/pageSize",//获取我的服务列表
  myOrderUrl:commonUrl+"HuizhiBoat/BoatApply/Me/List/page/pageSize",//获取我的申请列表
  // myServiceUrl:commonUrl+"workflow/api/processinstances/my_apply/list/0/0",//获取我的服务列表
  // myOrderUrl:commonUrl+"HuizhiBoat/BoatApply/Me/List/0/0",//获取我的申请列表
  changePasswordUrl:commonUrl+"Setting/User/ChangePassword",//修改密码提交
  editUserUrl:commonUrl+"Setting/User/CompleteUserInfo",//用户信息编辑
  eduDicUrl:commonUrl+"Setting/SettingDict/0/0?type=education",//学历数据字典
  nationDicUrl:commonUrl+"Setting/SettingDict/0/0?type=nation",//国籍数据字典
  cityDicUrl:commonUrl+"Setting/SettingCity/ParentId/0/0/{ParentId}",//居住地数据字典
  applyGuideUrl:commonUrl+"Setting/RichText/ByTitle/Edit",//申请汇智卡须知
  applyAddUrl:commonUrl+"CardApply/Person/Add",//申请汇智卡提交
  BannerUrl:commonUrl+"Setting/HomepageAdver/App/List/0/0",//首页轮播图的列表
  changePhoneUrl:commonUrl+"Setting/User/ChangePhone",//修改手机号
  notificationUrl:commonUrl+"Notification/page/pageSize",//消息通知
  // notificationUrl:commonUrl+"Notification/0/0",//消息通知
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
  // SimpleUploadFileUrl:commonUrl+"FileUpload/SimpleUploadFile",//简单文件上传-图片FileUpload/UploadImgComm
  ChangeUserFaceUrl:commonUrl+"Setting/User/ChangeUserFace/",//编辑用户头像
  // SimpleUploadFileUrl:commonUrl+"FileUpload/UploadImgSpecial",//简单文件上传-图片
  SimpleUploadFileUrl:commonUrl+"FileUpload/UploadImgComm",//普通多图片上传
  forgetPwdSendCodeUrl:commonUrl+"Setting/User/SendCode/",//忘记密码页面获取手机验证码
  forgetPasswordStepOneUrl:commonUrl+"Setting/User/ForgetPasswordStepOne",//忘记密码第一步
  forgetPasswordStepTwoUrl:commonUrl+"Setting/User/ForgetPasswordStepTwo",//忘记密码第二步
  getUnReadCountUrl:commonUrl+"Notification/GetUnReadCount",//获取未读消息总数
  loginOutUrl:commonUrl+"j_spring_security_logout",//注销
  loginOutTimeUrl:commonUrl+"Login/LoginOrNot",//是否登录超时
  DelMyOrderUrl:commonUrl+"HuizhiBoat/BoatApply/Del/{objectid}",//取消预约
  WorkflowCreate:commonUrl+"workflow/api/create/",//执行流转1
  newTransferUrl:commonUrl+"workflow/api/newTransfer",//执行流转2
  myServerDetailUrl:commonUrl+"UserRepair/Edit/{objectid}",//我的服务详情1
  myServerDetailUrl2:commonUrl+"UserRepairAssign/0/0?repairId=",//我的服务详情2
  myServerDetailUrl3:commonUrl+"UserRepairRecode/0/0?repairId=",//我的服务详情3
  setReadStatusUrl:commonUrl+"Notification/SetReadStatus/{objectid}",//消息通知已读
  deleteNewsUrl:commonUrl+"Notification/Delete/{objectid}",//删除消息
  onlinePayLogUrl:commonUrl+"Setting/PayLogById/List/0/0",//在线充值订单记录
  BoatTimeUrl:commonUrl+"HuizhiBoat/BoatApply/GetTimeList",//获取游船预约的预约时间
  ApplyCardInfoUrl:commonUrl+"CardApply/Person/Me/List/0/0",//获取用户申请卡的信息
  WinningUrl:commonUrl+"/RedPacket/User/AppTips"//中奖红包
};

export default URLConfig;
