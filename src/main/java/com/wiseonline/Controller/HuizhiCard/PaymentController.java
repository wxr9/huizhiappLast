package com.wiseonline.Controller.HuizhiCard;

import com.chinagpay.mer.bean.HmacSHA256Sign;
import com.chinagpay.mer.bean.ProcessMessage;
import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.PayLog;
import com.wiseonline.Domain.RechargeManage;
import com.wiseonline.Domain.RedpacketUser;
import com.wiseonline.Domain.User;
import com.wiseonline.Service.*;
import com.wiseonline.Service.Impl.UserServiceImpl;
import com.wiseonline.Utils.MyException;
import com.wiseonline.Utils.PageResult;
import com.wiseonline.Utils.PermissionInfo;
import com.wiseonline.Utils.ResultMessage;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by R7tech on 6/6/2016.
 */
@RestController
@RequestMapping("/BizPayment")
public class PaymentController extends BaseController {

    private static Logger logger = Logger.getLogger(PaymentController.class);

    @Value("#{configProperties['Merchant.MerchantNO']}")
    private String merchantNo;

    @Value("#{configProperties['Merchant.Server']}")
    private String serverUrl;

    @Value("#{configProperties['Merchant.EncryptKey']}")
    // 加密密钥
    private String HMD5_PASSWORD;

    @Value("#{configProperties['Merchant.HostSchema']}")
    private String HostSchema;

    @Value("#{configProperties['Pay.Discount']}")
    private String PayDiscount;


    @Autowired
    UserServiceImpl userService;

    @Autowired
    PayLogService payLogService;

    @Autowired
    RechargeManageService rechargeManageService;


//    @Autowired
//    RedPacketUtil redPacketUtil;

    @Autowired
    RedpacketUserService redpacketUserService;


    @Autowired
    RedPacketService redPacketService;
//    @Autowired
//    RedpacketUserService redpacketUserService;
//    @Autowired
//    UserServiceImpl userService;
    @Autowired
    NotificationService notificationService;

    @RequestMapping(value = "QueryCardBalance", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "汇智卡余额查询", module = "汇智卡管理")
    public void QueryCardBalance(HttpServletRequest request, HttpServletResponse response) {
        String QueryCardBalance = serverUrl + "/recharge/query.do";
        String paramCardNo = request.getParameter("cardNo").trim();
        String paramMemberNo = request.getParameter("memberNo").trim();
        StringBuffer postStr = new StringBuffer();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String createTime = sdf.format(new Date());
        postStr.append("<?xml version=\"1.0\" encoding=\"GBK\"?><B2CReq>");
        postStr.append("<merchantNo>");
        postStr.append(merchantNo);
        postStr.append("</merchantNo>");
        postStr.append("<cardNo>");
        postStr.append(paramCardNo);
        postStr.append("</cardNo>");
        postStr.append("<memberNo>");
        postStr.append(paramMemberNo);
        postStr.append("</memberNo>");
        postStr.append("<queryDate>");
        postStr.append(createTime);
        postStr.append("</queryDate>");
        postStr.append("</B2CReq>");
        System.out.println("汇智卡余额查询:"+postStr.toString());
        SendHttpPayment(response, QueryCardBalance, postStr.toString());
        //return Msg(true,"test");
    }

    @RequestMapping(value = "QueryTransDetails", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "汇智卡交易明细查询", module = "汇智卡管理")
    public ResultMessage QueryTransDetails(HttpServletRequest request, HttpServletResponse response) {
        String QueryTransDetails = serverUrl + "/recharge/carddetail.do";
        String paramCardNo = request.getParameter("cardNo").trim();
        String paramMemberNo = request.getParameter("memberNo").trim();
        String paramQueryNum = request.getParameter("queryNum");
        if (paramQueryNum == null) {
            paramQueryNum = "";
        } else {
            paramQueryNum.trim();
        }
        String paramStartDate = request.getParameter("startDate");
        if (paramStartDate == null) {
            paramStartDate = "";
        } else {
            paramStartDate.trim();
        }
        String paramEndDate = request.getParameter("endDate");
        if (paramEndDate == null) {
            paramEndDate = "";
        } else {
            paramEndDate.trim();
        }
        String paramTranType = request.getParameter("tranType").trim();
        StringBuffer postStr = new StringBuffer();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String createTime = sdf.format(new Date());
        postStr.append("<?xml version=\"1.0\" encoding=\"GBK\"?><B2CReq>");
        postStr.append("<merchantNo>");
        postStr.append(merchantNo);
        postStr.append("</merchantNo>");
        postStr.append("<cardNo>");
        postStr.append(paramCardNo);
        postStr.append("</cardNo>");
        postStr.append("<memberNo>");
        postStr.append(paramMemberNo);
        postStr.append("</memberNo>");
        postStr.append("<queryNum>");
        postStr.append(paramQueryNum);
        postStr.append("</queryNum>");
        postStr.append("<startDate>");
        postStr.append(paramStartDate);
        postStr.append("</startDate>");
        postStr.append("<endDate>");
        postStr.append(paramEndDate);
        postStr.append("</endDate>");
        postStr.append("<tranType>");
        postStr.append(paramTranType);
        postStr.append("</tranType>");
        postStr.append("</B2CReq>");
        System.out.println("汇智卡交易明细查询:"+postStr.toString());
        SendHttpPayment(response, QueryTransDetails, postStr.toString());
        return Msg(true, "test");
    }

    @RequestMapping(value = "BindUnBindCard", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "汇智卡绑定解绑", module = "汇智卡管理")
    public void BindUnBindCard(HttpServletRequest request, HttpServletResponse response) {
        try {
            String basePath = HostSchema + request.getContextPath() + "/";
            String paramReturnUrl = basePath + "web/myWiz.html";
            String bindUnBindCardNotifyURL = "BizPayment/BindCardNotify";
            String BindUnBindCard = serverUrl + "/recharge/bind.do";
            //String paramMerchantNo = request.getParameter("merchantNo").trim();
            String paramCardNo = request.getParameter("cardNo").trim();//0000019900000164

            String paramType = request.getParameter("type").trim();
            if (paramType.equals("1")&&isCardBinded(paramCardNo)){
                JSONObject jo = new JSONObject();
                jo.put("msg", "此卡已被其它帐号绑定!");
                jo.put("success", false);
                response.getWriter().write(jo.toString());
                response.getWriter().flush();
                response.getWriter().close();
                return;
            }


            String ipAddr = getRemoteHost(request);
            String paramMemberNo = request.getParameter("memberNo").trim();

            //String paramReturnUrl = request.getParameter("returnURL").trim();
            //String paramNotifyUrl = request.getParameter("notifyURL").trim();
            StringBuffer postStr = new StringBuffer();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String createTime = sdf.format(new Date());

            postStr.append("<?xml version=\"1.0\" encoding=\"GBK\"?><B2CReq>");
            postStr.append("<merchantNo>");
            postStr.append(merchantNo);
            postStr.append("</merchantNo>");
            postStr.append("<cardNo>");
            postStr.append(paramCardNo);
            postStr.append("</cardNo>");
            postStr.append("<interfaceType>");
            postStr.append("bind");
            postStr.append("</interfaceType>");
            postStr.append("<memberNo>");
            postStr.append(paramMemberNo);
            postStr.append("</memberNo>");
            postStr.append("<type>");
            postStr.append(paramType);
            postStr.append("</type>");
            postStr.append("<ip>");
            postStr.append(ipAddr);
            postStr.append("</ip>");
            postStr.append("<returnURL>");
            postStr.append(paramReturnUrl);
            postStr.append("</returnURL>");
            postStr.append("<notifyURL>");
            postStr.append(basePath + bindUnBindCardNotifyURL);
            postStr.append("</notifyURL>");
            postStr.append("</B2CReq>");

            String merSignMsg = HmacSHA256Sign.hmacSHA256(postStr.toString(), HMD5_PASSWORD);
            String tranDataBase64 = ProcessMessage.Base64Encode(postStr.toString().getBytes());

            JSONObject data = new JSONObject();
            data.put("postUrl", BindUnBindCard.replace(".do", ".jsp"));
            data.put("merSignMsg", merSignMsg);
            data.put("tranData", tranDataBase64);
            JSONObject jo = new JSONObject();
            jo.put("msg", data);
            jo.put("success", "true");

            response.getWriter().write(jo.toString());
            response.getWriter().flush();
            response.getWriter().close();
        } catch (Exception e) {

        }
    }

    @RequestMapping(value = "LostHangCard", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "汇智卡挂失解挂", module = "汇智卡管理")
    public void LostHangCard(HttpServletRequest request, HttpServletResponse response) {
        try {
            String basePath = HostSchema + request.getContextPath() + "/";
            String paramReturnUrl = basePath + "web/myWiz.html";
            String bindUnBindCardNotifyURL = "BizPayment/LostHangNotify";
            String BindUnBindCard = serverUrl + "/recharge/losthang.do";
            //String paramMerchantNo = request.getParameter("merchantNo").trim();
            String paramCardNo = request.getParameter("cardNo").trim();//0000019900000164

            String paramType = request.getParameter("type").trim();


            String ipAddr = getRemoteHost(request);
            String paramMemberNo = request.getParameter("memberNo").trim();

            //String paramReturnUrl = request.getParameter("returnURL").trim();
            //String paramNotifyUrl = request.getParameter("notifyURL").trim();
            StringBuffer postStr = new StringBuffer();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String createTime = sdf.format(new Date());

            postStr.append("<?xml version=\"1.0\" encoding=\"GBK\"?><B2CReq>");
            postStr.append("<merchantNo>");
            postStr.append(merchantNo);
            postStr.append("</merchantNo>");
            postStr.append("<cardNo>");
            postStr.append(paramCardNo);
            postStr.append("</cardNo>");
            postStr.append("<interfaceType>");
            postStr.append("losthang");
            postStr.append("</interfaceType>");
            postStr.append("<memberNo>");
            postStr.append(paramMemberNo);
            postStr.append("</memberNo>");
            postStr.append("<type>");
            postStr.append(paramType);
            postStr.append("</type>");
            postStr.append("<ip>");
            postStr.append(ipAddr);
            postStr.append("</ip>");
            postStr.append("<returnURL>");
            postStr.append(paramReturnUrl);
            postStr.append("</returnURL>");
            postStr.append("<notifyURL>");
            postStr.append(basePath + bindUnBindCardNotifyURL);
            postStr.append("</notifyURL>");
            postStr.append("</B2CReq>");

            String merSignMsg = HmacSHA256Sign.hmacSHA256(postStr.toString(), HMD5_PASSWORD);
            String tranDataBase64 = ProcessMessage.Base64Encode(postStr.toString().getBytes());

            JSONObject data = new JSONObject();
            data.put("postUrl", BindUnBindCard.replace(".do", ".jsp"));
            data.put("merSignMsg", merSignMsg);
            data.put("tranData", tranDataBase64);
            JSONObject jo = new JSONObject();
            jo.put("msg", data);
            jo.put("success", "true");

            response.getWriter().write(jo.toString());
            response.getWriter().flush();
            response.getWriter().close();
        } catch (Exception e) {

        }
    }

    @RequestMapping(value = "CardReCharge", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "汇智卡充值", module = "汇智卡管理")
    public void CardReCharge(HttpServletRequest request, HttpServletResponse response) {
        try {
            String rechargeCardNotifyURL = "BizPayment/RechargeCardNotify";
            String basePath = HostSchema + request.getContextPath() + "/";
            String CardReCharge = serverUrl + "/recharge/placeorder.do";
            //String paramMerchantNo = request.getParameter("merchantNo");
            String paramCardNo = request.getParameter("cardNo").trim();
            String paramMemberNo = request.getParameter("memberNo").trim();
            //String paramOrderNo = request.getParameter("orderNo").trim();
            String paramOrderAmt = request.getParameter("orderAmt").trim();

            String paramReturnUrl = basePath + "web/myWiz.html";//request.getParameter("returnURL").trim();
            String paramNotifyUrl = basePath + rechargeCardNotifyURL;//request.getParameter("notifyURL").trim();
            String paramReserved1 = "";//request.getParameter("reserved1").trim();
            String paramReserved2 = "";//request.getParameter("reserved2").trim();
            StringBuffer postStr = new StringBuffer();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String createTime = sdf.format(new Date());

            float orderAmt = Float.valueOf(paramOrderAmt);
            float paramActualCharge  = 0;
            float paramDiscountAmt = 0;
            if (isDiscount() && orderAmt>50){
                paramActualCharge = orderAmt*0.95f;//request.getParameter("actualCharge").trim();
                paramDiscountAmt = orderAmt*0.05f;//request.getParameter("discountAmt").trim();
            }else {
                paramActualCharge = orderAmt;
            }

            String ipAddr = getRemoteHost(request);

            //订单号
            String orderNo = getOrderNumber();//getUUID();

            if (!isDiscount()){
                String paramRedpacketId = request.getParameter("orderAmtCount");
                if(paramRedpacketId!=null && !paramRedpacketId.equals("")){
                    RedpacketUser rpu = redpacketUserService.getbyId(Integer.valueOf(paramRedpacketId.trim()));
                    if (rpu==null){
                        throw new MyException("未找到充值红包");
                    }
                    rpu.setOrderNo(orderNo);
                    if (!redpacketUserService.update(rpu)){
                        throw new MyException("充值红包异常");
                    }

                    paramActualCharge = orderAmt - rpu.getSum();
                    DecimalFormat decimalFormat=new DecimalFormat(".00");//构造方法的字符格式这里如果小数不足2位,会以0补足.
                    paramActualCharge=Float.valueOf(decimalFormat.format(paramActualCharge));//format 返回的是字符串
                    paramDiscountAmt = rpu.getSum();
                }

            }
            //paramReturnUrl = "http://222.73.203.76:8080/success.jsp";

            postStr.append("<?xml version=\"1.0\" encoding=\"GBK\"?><B2CReq>");
//        postStr.append("<merchantNo>");
//        postStr.append(paramMerchantNo);
//        postStr.append("</merchantNo>");
        postStr.append("<cardNo>");
        postStr.append(paramCardNo);
        postStr.append("</cardNo>");
            postStr.append("<merId>");
            postStr.append(merchantNo);
            postStr.append("</merId>");

            postStr.append("<memberNo>");
            postStr.append(paramMemberNo);
            postStr.append("</memberNo>");
            postStr.append("<orderNo>");
            postStr.append(orderNo);
            postStr.append("</orderNo>");
//            postStr.append("<curType>CNY</curType>");
//            postStr.append("<goodsName>");
//            postStr.append("aaaa");
//            postStr.append("</goodsName>");
//            postStr.append("<goodsDesc>灰色</goodsDesc><mallUserName>test@tes.com</mallUserName><remark>B2C</remark>");
            postStr.append("<orderAmt>");
            postStr.append(orderAmt);
            postStr.append("</orderAmt>");
            postStr.append("<actualCharge>");
            postStr.append(paramActualCharge);
            postStr.append("</actualCharge>");
            postStr.append("<discountAmt>");
            postStr.append(paramDiscountAmt);
            postStr.append("</discountAmt>");
            postStr.append("<ip>");
            postStr.append(ipAddr);
            postStr.append("</ip>");
            postStr.append("<returnURL>");
            postStr.append(paramReturnUrl);
            postStr.append("</returnURL>");
            postStr.append("<notifyURL>");
            postStr.append(paramNotifyUrl);
            postStr.append("</notifyURL>");
            postStr.append("<reserved1>");
            postStr.append(paramReserved1);
            postStr.append("</reserved1>");
            postStr.append("<reserved2>");
            postStr.append(paramReserved2);
            postStr.append("</reserved2>");
            postStr.append("</B2CReq>");
            System.out.println("汇智卡充值 postStr : " + postStr.toString());
            String merSignMsg = HmacSHA256Sign.hmacSHA256(postStr.toString(), HMD5_PASSWORD);
            String tranDataBase64 = ProcessMessage.Base64Encode(postStr.toString().getBytes());

//            JSONObject data = new JSONObject();
//            data.put("postUrl", CardReCharge);
//            data.put("merSignMsg", merSignMsg);
//            data.put("tranData", tranDataBase64);
//            JSONObject jo = new JSONObject();
//            jo.put("msg", data);
//            jo.put("success", "true");

            Map<String, String> message =new HashMap<String, String>();
            message.put("tranData", tranDataBase64);
            message.put("merSignMsg", merSignMsg);
            message.put("cardNo", paramCardNo);

            //String str= HttpUtil.postByParam(message, CardReCharge);
            //String str= postByParam(message, "http://119.90.43.147:28081/recharge/placeorder.do");
            String str= postByParam(message, CardReCharge);
            response.getWriter().write(str);
            response.getWriter().flush();
            //response.getWriter().print(str);
            response.getWriter().close();

        } catch (Exception e) {

        }
    }

    @RequestMapping(value = "BindCardNotify", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "汇智卡绑定通知接口", module = "汇智卡管理")
    public ResultMessage bindCardNotify(HttpServletRequest request, HttpServletResponse response) {
        String tranData = request.getParameter("tranData");
        System.out.println("汇智卡绑定通知接口 tranData : " + tranData);
        String jsonStr = XmlConverUtil.xmltoJson(tranData);
        JSONObject jo = new JSONObject(jsonStr);
            //绑定结果
            String merchantNo = jo.getString("merchantNo");
            String cardNo = jo.getString("cardNo");
            String memberNo = jo.getString("memberNo");
            String code = jo.getString("code");
            String type = jo.getString("type");
        String ipAddr = jo.getString("ip");
            boolean status = false;
            String memo = "";
            if (code.equals("0000")) {
                status = true;
                //绑定或者解绑成功
                User ur = userService.getbyId(memberNo);
                if (ur==null){
                    return Msg(false, "用户名不正确");
                }
                if (type.equals("1")) {
                    memo="汇智卡绑定";
                    ur.setCardid(cardNo);
                    userService.update(ur);
                    WriteBindlog(ipAddr,PAYLOG.PAY_BIND, cardNo, memberNo, status, memo, request);
                } else if (type.equals("2")) {
                    memo="汇智卡解绑";
                    ur.setCardid("");
                    userService.update(ur);
                    WriteBindlog(ipAddr,PAYLOG.PAY_UNBIND, cardNo, memberNo, status, memo, request);
                }
            }
        return Msg(true, tranData);
    }

    @RequestMapping(value = "LostHangNotify", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "汇智卡挂失通知接口", module = "汇智卡管理")
    public ResultMessage lostHangNotify(HttpServletRequest request, HttpServletResponse response) {
        String tranData = request.getParameter("tranData");
        System.out.println("汇智卡挂失通知接口 tranData : " + tranData);
        String jsonStr = XmlConverUtil.xmltoJson(tranData);
        JSONObject jo = new JSONObject(jsonStr);
        //绑定结果
        String merchantNo = jo.getString("merchantNo");
        String cardNo = jo.getString("cardNo");
        String memberNo = jo.getString("memberNo");
        String code = jo.getString("code");
        String type = jo.getString("type");
        String ipAddr = jo.getString("ip");
        boolean status = false;
        String memo = "";
        if (code.equals("0000")) {
            status = true;
            //绑定或者解绑成功
            User ur = userService.getbyId(memberNo);
            if (ur==null){
                return Msg(false, "用户名不正确");
            }
            if (type.equals("1")) {
                memo="汇智卡挂失";
                ur.setCardid(cardNo);
                userService.update(ur);
                WriteBindlog(ipAddr,PAYLOG.PAY_LOST, cardNo, memberNo, status, memo, request);
            } else if (type.equals("2")) {
                memo="汇智卡解挂";
                ur.setCardid("");
                userService.update(ur);
                WriteBindlog(ipAddr,PAYLOG.PAY_RESTORE, cardNo, memberNo, status, memo, request);
            }
        }
        return Msg(true, tranData);
    }

    @RequestMapping(value = "RechargeCardNotify", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "汇智卡充值通知接口", module = "汇智卡管理")
    public ResultMessage rechargeCardNotify(HttpServletRequest request, HttpServletResponse response) {
        System.out.println("到充值通知接口来了=============================================================");
        String tranData = request.getParameter("tranData");
        System.out.println("汇智卡充值通知接口 tranData : " + tranData);
        System.out.println("得到数据了tranData："+tranData);
        tranData = new String(ProcessMessage.Base64Decode(tranData));
        System.out.println("+++++++++++++++++++"+tranData);
        String jsonStr = XmlConverUtil.xmltoJson(tranData);
        System.out.println("jsonStr:---------------------"+jsonStr);
        JSONObject jo = new JSONObject(jsonStr);

            //充值结果
            String memberNo = jo.getString("memberNo");
            String cardNo = jo.getString("cardNo");
            String orderNo = jo.getString("orderNo");
            String orderAmt = jo.getString("orderAmt");
            String tranStat = jo.getString("tranStat");
            String tranDate = jo.getString("tranDate");
            String discountAmt = jo.getString("discountAmt");
            String actualCharge = jo.getString("actualCharge");
            String tranSerialNo = jo.getString("tranSerialNo");
        String rechargeamt = jo.getString("rechargeAmt");
            String ipAddr = jo.getString("ip");
            boolean status = false;
            String memo ="";

            System.out.println("---------memberNo:"+memberNo);
            System.out.println("---------cardNo:"+cardNo);
        System.out.println("---------orderNo:"+orderNo);
        System.out.println("---------orderAmt:"+orderAmt);
        System.out.println("---------tranStat:"+tranStat);
        System.out.println("---------tranDate:"+tranDate);
        System.out.println("---------discountAmt:"+discountAmt);
        System.out.println("---------actualCharge:"+actualCharge);
        System.out.println("---------tranSerialNo:"+tranSerialNo);
        System.out.println("---------ipAddr:"+ipAddr);
        System.out.println("---------rechargeamt:"+rechargeamt);


            /*
            充值成功：00；
            支付失败：01；
            支付成功充值失败：02；
            退款成功03；
            退款失败04；
            系统异常：05
             */
            switch (Integer.valueOf(tranStat)){
                case 0:
                    status = true;
                    memo = "充值成功";

                    if(!isDiscount()){
                        new Thread(new RedPacketUtil(memberNo,redPacketService,redpacketUserService,userService,notificationService)).start();

//                    System.out.println("###############################################3generateRedpacket start##################3###########");
//                    //发红包
//                    try{
//                        redPacketUtil.generateRedpacket(memberNo);
//                    }catch (MyException e){
//                        System.out.println("generateRedpacket exception");
//                    }
//                    System.out.println("###########################3##########generateRedpacket end####################################");

                        //作废红包
                        PageResult<RedpacketUser> rpu = redpacketUserService.findByOneField(0,0,"orderNo",orderNo,true,"createTime");
                        if (rpu.getTotal()>1){
                            System.out.println("Get more than 1 redpacket of order :"+orderNo);
                        }
                        if (rpu.getTotal()>0){
                            RedpacketUser rp = rpu.getResult().get(0);
                            rp.setDidUse(true);
                            if (!redpacketUserService.update(rp)){
                                System.out.println("redpacket disuse fail :"+rp.getId());
                            }
                        }
                    }

                    break;
                case 1:
                    memo = "支付失败";
                    break;
                case 2:
                    memo = "支付成功充值失败";
                    break;
                case 3:
                    memo = "退款成功";
                    break;
                case 4:
                    memo = "退款失败";
                    break;
                case 5:
                    memo = "系统异常";
                    break;
            }
            WritePaylog(ipAddr,rechargeamt,PAYLOG.PAY_PAY, cardNo, orderNo, orderAmt,tranDate,discountAmt,actualCharge,tranSerialNo, memberNo, status, memo, request);
        return Msg(true, tranData);
    }

    private void SendHttpPayment(HttpServletResponse response, String urlStr, String dataXml) {
        OutputStreamWriter out = null;
        BufferedReader in = null;
        try {
            URL url = new URL(urlStr);
            URLConnection con = url.openConnection();
            con.setDoOutput(true);
            con.setDoInput(true);
            con.setRequestProperty("Pragma:", "no-cache");
            con.setRequestProperty("Cache-Control", "no-cache");
            con.setRequestProperty("Content-Type", "text/xml");

            out = new OutputStreamWriter(con.getOutputStream());
            //String xml = "<?xml version=\"1.0\" encoding=\"GBK\"?><B2CReq><merchantNo>000006666666666</merchantNo><cardNo>0000019900000146</cardNo><memberNo>test</memberNo><queryDate>2016-05-16 14:51:00</queryDate></B2CReq>";

            out.write(dataXml);
            out.flush();
            out.close();
            in = new BufferedReader(new InputStreamReader(con.getInputStream(), "UTF-8"));
            String line = "";
            String retData = "";
            for (line = in.readLine(); line != null; line = in.readLine()) {
                System.out.println(line);
                retData += line;
            }

            String ret = XmlConverUtil.xmltoJson(retData);

            response.getWriter().write(ret);
            response.getWriter().flush();
            response.getWriter().close();

        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                if (out != null) out.close();
                if (in != null) in.close();
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }
    }


    public static String postByParam(Map<String, String> message, String url)
    {
        String result = "";
        HttpClient httpClient = new HttpClient();
        PostMethod mypost = new PostMethod(url);
        mypost.addParameter("tranData",message.get("tranData"));
        mypost.addParameter("merSignMsg",message.get("merSignMsg"));
        mypost.addParameter("cardNo",message.get("cardNo"));
        try
        {
            int re_code = httpClient.executeMethod(mypost);
            if (re_code == 200) {
                System.out.println("-----------------汇智卡充值请求--BEGIN--------------------");
                result=mypost.getResponseBodyAsString();
                System.out.println("汇智卡充值请求返回的数据："+result);
            }
            return result;
        } catch (HttpException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    private String getUUID() {
        String s = UUID.randomUUID().toString();
        //去掉“-”符号
        return s.substring(0, 8) + s.substring(9, 13) + s.substring(14, 18) + s.substring(19, 23) + s.substring(24);
    }

    private String getOrderNumber() {
        StringBuilder code = new StringBuilder();
        Random random = new Random();
        //6位验证码
        for(int i = 0;i < 3;i++){
            code.append(String.valueOf(random.nextInt(10)));
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmssSSS");
        String orderNO = code.toString() + sdf.format(new Date());
        return orderNO;
    }

    private enum PAYLOG {
        PAY_PAY,
        PAY_QUERY,
        PAY_BIND,
        PAY_UNBIND,
        PAY_LOST,
        PAY_RESTORE   //解挂
    }

    private void WritePaylog(String ipAddr,String rechargeamt,PAYLOG logType, String cardNo, String orderNo, String orderAmt,String tranTime,String discountAmt,String actualCharge,String tranSerialNo, String member, boolean status, String memo, HttpServletRequest request) {
        String verifyCode = "";
        PayLog paylog = new PayLog();
        paylog.setMember(member);
        paylog.setCardNo(cardNo);
        paylog.setOrderNo(orderNo);
        paylog.setOrderAmt(orderAmt);
        paylog.setTranTime(tranTime);
        paylog.setDiscountAmt(Float.valueOf(discountAmt));
        paylog.setActualCharge(Float.valueOf(actualCharge));
        paylog.setTranSerialNo(tranSerialNo);
        paylog.setStatus(status);
        paylog.setMemo(memo);
        paylog.setRechargeAmt(rechargeamt);
        paylog.setIpAddr(ipAddr);
        User user = userService.getbyId(member);
        paylog.setMobile(user.getPhone());
        //1充值支付2绑定3历史查询
        switch (logType) {
            case PAY_PAY:
                paylog.setType(1);
                break;
            case PAY_QUERY:
                paylog.setType(3);
                break;
            case PAY_BIND:
                paylog.setType(2);
                break;
            case PAY_UNBIND:
                paylog.setType(4);
                break;
            case PAY_LOST:
                paylog.setType(5);
                break;
            case PAY_RESTORE:
                paylog.setType(6);
                break;
            default:
                break;
        }
        if (user.getPhone()!=null){
            verifyCode = sendCode(user.getPhone(),orderAmt);
        }
        paylog.setVerifyCode(verifyCode);
        payLogService.save(paylog);

        RechargeManage rm = new RechargeManage();
        rm.setAccount(member);
        rm.setOrderNo(orderNo);
        rm.setAmount(orderAmt);
        rm.setCardNo(cardNo);
        rm.setCheckCode(verifyCode);
        //未领发票
        rm.setCheckGet(1);
        rechargeManageService.save(rm);
    }

    private void WriteBindlog(String ipAddr,PAYLOG logType, String cardNo,String member, boolean status, String memo, HttpServletRequest request) {
        PayLog paylog = new PayLog();
        paylog.setMember(member);
        paylog.setCardNo(cardNo);
        paylog.setStatus(status);
        paylog.setMemo(memo);
        paylog.setIpAddr(ipAddr);
        User user = userService.getbyId(member);
        paylog.setMobile(user.getPhone());
        //1充值支付2绑定3历史查询
        switch (logType) {
            case PAY_PAY:
                paylog.setType(1);
                payLogService.save(paylog);
                break;
            case PAY_QUERY:
                paylog.setType(3);
                payLogService.save(paylog);
                break;
            case PAY_BIND:
                paylog.setType(2);
                payLogService.save(paylog);
                break;
            case PAY_UNBIND:
                paylog.setType(4);
                payLogService.save(paylog);
                break;
            case PAY_LOST:
                paylog.setType(5);
                payLogService.save(paylog);
                break;
            case PAY_RESTORE:
                paylog.setType(6);
                payLogService.save(paylog);
                break;
            default:
                break;
        }
    }

    private String getRemoteHost(javax.servlet.http.HttpServletRequest request) {
        String ip = request.getHeader("x-forwarded-for");
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        if(request.getRequestURL().indexOf(":8080")<0){
            ip = request.getHeader("X-Real-IP");
        }
        return ip.equals("0:0:0:0:0:0:0:1") ? "127.0.0.1" : ip;
    }

    private String sendCode(String phone,String money){
        StringBuilder code = new StringBuilder();
        Random random = new Random();
        //6位验证码
        for(int i = 0;i < 6;i++){
            code.append(String.valueOf(random.nextInt(10)));
        }
        System.out.println(code.toString());
        String sendMessage = "您本次充值金额为"+money+"元,请凭此验证码:"+code+",在下一个工作日至一卡通中心领取凭据.";
        if (money==""){
            sendMessage = "请凭此验证码:"+code+"领取凭据.";
        }
        try{
            boolean rst = SendToMessage(phone, sendMessage);
            if (rst){
                System.out.println("充值短信发送成功");
                return code.toString();
            }else{
                System.out.println("充值短信发送失败");
            }
        }catch (UnsupportedEncodingException e){
            e.printStackTrace();
            System.out.println("充值短信发送失败");
        }
        return code.toString();
    }


    @RequestMapping(value = "CardReChargeDiscount", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "汇智卡充值折扣", module = "汇智卡管理")
    public ResultMessage CardReChargeDiscount(HttpServletRequest request, HttpServletResponse response) {
        String paramOrderAmt = request.getParameter("orderAmtCount").trim();
        float orderAmt = Float.valueOf(paramOrderAmt);
        int paramActualCharge = 0;
        float paramDiscountAmt = 0;
        if (orderAmt>50){
            paramDiscountAmt = orderAmt*0.05f;
        }

        if (!isDiscount()){
            return Msg(true,"0");
        }

        return Msg(true,String.valueOf(paramDiscountAmt));
    }

    @RequestMapping(value = "SendRechargePhoneMessage", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "汇智卡充值折扣", module = "汇智卡管理")
    public ResultMessage SendRechargePhoneMessage(HttpServletRequest request, HttpServletResponse response) {
        String objectid = request.getParameter("objectid").trim();
        User user = userService.getbyId(getUserName());
        String verifyCode = sendCode(user.getPhone(),"");
        PayLog payLog = payLogService.getbyId(Integer.valueOf(objectid));
        payLog.setVerifyCode(verifyCode);
        payLogService.update(payLog);
        //paramActualCharge = orderAmt - paramDiscountAmt;
        String sql = "select * from recharge_manage where orderNo = '"+payLog.getOrderNo()+"' and cardNo='"+payLog.getCardNo()+"'";
        List<RechargeManage> rm = rechargeManageService.findByDataSQL(sql);
        rm.get(0).setCheckCode(verifyCode);
        rechargeManageService.update(rm.get(0));
        return Msg(true,"发送成功!");
    }

    private boolean isCardBinded(String cardNo){
        String realCardNo = "0000"+cardNo;
        PageResult<User> pUser = userService.findByOneField(0,0,"cardid",realCardNo,false,"username");
        if (pUser.getTotal()>0){
            return true;
        }
        return false;
    }

    @RequestMapping(value = "TotalCardStatistic", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "汇智卡总数统计", module = "汇智卡管理")
    public ResultMessage TotalCardStatistic(HttpServletResponse response){
        String url = serverUrl + "/recharge/cardnum.do";
        SendHttpPayment(response, url, "");
        return Msg(true,url);
    }

    @RequestMapping(value = "PrimeCardStatistic", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "汇智卡主帐户统计", module = "汇智卡管理")
    public ResultMessage PrimeCardStatistic(HttpServletRequest request,HttpServletResponse response){
        String url = serverUrl + "/recharge/accountinfo.do";
        String paramStartDate = request.getParameter("startTime");
        if (paramStartDate == null) {
            paramStartDate = "";
        } else {
            paramStartDate.trim();
        }
        String paramEndDate = request.getParameter("endTime");
        if (paramEndDate == null) {
            paramEndDate = "";
        } else {
            paramEndDate.trim();
        }
        StringBuffer postStr = new StringBuffer();

        postStr.append("<?xml version=\"1.0\" encoding=\"GBK\"?><B2CReq>");
        postStr.append("<startTime>");
        postStr.append(paramStartDate);
        postStr.append("</startTime>");
        postStr.append("<endTime>");
        postStr.append(paramEndDate);
        postStr.append("</endTime>");
        postStr.append("</B2CReq>");
        System.out.println("汇智卡主帐户统计:"+postStr.toString());
        SendHttpPayment(response, url, postStr.toString());
        return Msg(true,postStr.toString());
    }

    @RequestMapping(value = "EWalletStatistic", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "电子钱包统计", module = "汇智卡管理")
    public ResultMessage EWalletStatistic(HttpServletRequest request,HttpServletResponse response){
        String url = serverUrl + "/recharge/ewalletinfo.do";
        String paramStartDate = request.getParameter("startTime");
        if (paramStartDate == null) {
            paramStartDate = "";
        } else {
            paramStartDate.trim();
        }
        String paramEndDate = request.getParameter("endTime");
        if (paramEndDate == null) {
            paramEndDate = "";
        } else {
            paramEndDate.trim();
        }
        StringBuffer postStr = new StringBuffer();

        postStr.append("<?xml version=\"1.0\" encoding=\"GBK\"?><B2CReq>");
        postStr.append("<startTime>");
        postStr.append(paramStartDate);
        postStr.append("</startTime>");
        postStr.append("<endTime>");
        postStr.append(paramEndDate);
        postStr.append("</endTime>");
        postStr.append("</B2CReq>");
        System.out.println("电子钱包统计:"+postStr.toString());
        SendHttpPayment(response, url, postStr.toString());
        return Msg(true,postStr.toString());
    }

    @RequestMapping(value = "SleepCardStatistic", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "沉寂卡总数统计", module = "汇智卡管理")
    public ResultMessage SleepCardStatistic(HttpServletRequest request,HttpServletResponse response){
        String url = serverUrl + "/recharge/cardtype.do";
        String paramStartDate = request.getParameter("startTime");
        if (paramStartDate == null) {
            paramStartDate = "";
        } else {
            paramStartDate.trim();
        }
        String paramEndDate = request.getParameter("endTime");
        if (paramEndDate == null) {
            paramEndDate = "";
        } else {
            paramEndDate.trim();
        }
        StringBuffer postStr = new StringBuffer();

        postStr.append("<?xml version=\"1.0\" encoding=\"GBK\"?><B2CReq>");
        postStr.append("<startTime>");
        postStr.append(paramStartDate);
        postStr.append("</startTime>");
        postStr.append("<endTime>");
        postStr.append(paramEndDate);
        postStr.append("</endTime>");
        postStr.append("</B2CReq>");
        System.out.println("沉寂卡总数统计:"+postStr.toString());
        SendHttpPayment(response, url, postStr.toString());
        return Msg(true,postStr.toString());
    }

    @RequestMapping(value = "AlertInfomation", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "金额预警提醒", module = "汇智卡管理")
    public ResultMessage AlertInfomation(HttpServletRequest request,HttpServletResponse response){
        String url = serverUrl + "/recharge/warning.do";

        String amount = request.getParameter("amount");
        String type = request.getParameter("type");
        String terminalNo = request.getParameter("terminalNo");
        //eg. 2016-05-16 14:51:00
        String queryDate = request.getParameter("queryDate");
        if (queryDate == null) {
            queryDate = "";
        } else {
            queryDate.trim();
        }
        StringBuffer postStr = new StringBuffer();

        postStr.append("<?xml version=\"1.0\" encoding=\"GBK\"?><B2CReq>");
        postStr.append("<queryDate>");
        postStr.append(queryDate);
        postStr.append("</queryDate>");
        postStr.append("<amount>");
        postStr.append(amount);
        postStr.append("</amount>");
        postStr.append("<type>");
        postStr.append(type);
        postStr.append("</type>");
        postStr.append("<merchantNo>");
        postStr.append(merchantNo);
        postStr.append("</merchantNo>");
        postStr.append("<terminalNo>");
        postStr.append(terminalNo);
        postStr.append("</terminalNo>");
        postStr.append("</B2CReq>");
        System.out.println("金额预警提醒:"+postStr.toString());
        SendHttpPayment(response, url, postStr.toString());
        return Msg(true,postStr.toString());
    }

    private boolean isDiscount(){
        if (PayDiscount.equals("on")){
            return true;
        }
        return false;
    }

    @RequestMapping(value = "CardReChargeEnableDiscount", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "汇智卡充值是否打折", module = "汇智卡管理")
    public ResultMessage CardReChargeEnableDiscount(HttpServletRequest request, HttpServletResponse response) {
        return Msg(true,String.valueOf(isDiscount()));
    }
}
