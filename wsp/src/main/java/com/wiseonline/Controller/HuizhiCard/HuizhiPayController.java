package com.wiseonline.Controller.HuizhiCard;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.PayLog;
import com.wiseonline.Domain.RechargeManage;
import com.wiseonline.Domain.User;
import com.wiseonline.Service.Impl.UserServiceImpl;
import com.wiseonline.Service.PayLogService;
import com.wiseonline.Service.RechargeManageService;
import com.wiseonline.Service.UserService;
import com.wiseonline.Utils.PermissionInfo;
import com.wiseonline.Utils.ResultMessage;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.io.output.StringBuilderWriter;
import org.apache.commons.lang.NullArgumentException;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jca.cci.core.InteractionCallback;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.transform.Result;
import java.io.*;
import java.net.*;
import java.text.SimpleDateFormat;
import java.util.*;

import com.chinagpay.mer.bean.DigestUtil;
import com.chinagpay.mer.bean.ProcessMessage;
import com.chinagpay.mer.bean.HmacSHA256Sign;


/**
 * Created by R7tech on 3/24/2016.
 */
@RestController
@RequestMapping("/Payment")
public class HuizhiPayController extends BaseController {
    @Autowired
    UserServiceImpl userService;

    @Autowired
    PayLogService payLogService;

    @Autowired
    RechargeManageService rechargeManageService;

    private enum PAYLOG{
        PAY_PAY,
        PAY_QUERY,
        PAY_BIND
    }

    private class PacketHeader {
        public char[] PackageLength;
        public char[] Transactioncode;
        public char[] Terminalid;
        public char[] Merchantid;
        public char[] Transactiondate;
        public char[] Transactiontime;
        public char[] Serial;
        public char[] Cardno;

        public PacketHeader() {
            PackageLength = new char[4];
            Transactioncode = new char[4];
            Terminalid = new char[8];
            Merchantid = new char[15];
            Transactiondate = new char[8];
            Transactiontime = new char[6];
            Serial = new char[6];
            Cardno = new char[22];
        }
    }

    //余额查询绑定解绑
    private class PacketBindCard {
        public PacketHeader PackageHeader;
        public char[] Password;
        public char[] QueryFlag;

        public PacketBindCard() {
            PackageHeader = new PacketHeader();
            Password = new char[16];
            QueryFlag = new char[1];
        }
    }

    //余额查询绑定解绑
    private class PacketBindCardResponse {
        public PacketHeader PackageHeader;
        public char[] EdBalance;
        public char[] EpBalance;
        public char[] UserName;
        public char[] RespondCode;
        public char[] ExpireDate;

        public PacketBindCardResponse() {
            PackageHeader = new PacketHeader();
            EdBalance = new char[12];
            EpBalance = new char[12];
            UserName = new char[20];
            RespondCode = new char[4];
            ExpireDate = new char[8];
        }
    }

    //交易明细查询
    private class PacketQueryTransaction {
        public PacketHeader PackageHeader;
        public char[] QueryNum;
        public char[] StartDate;
        public char[] StartTime;
        public char[] EndDate;
        public char[] EndTime;
        public char[] Tran_type;

        public PacketQueryTransaction() {
            PackageHeader = new PacketHeader();
            QueryNum = new char[2];
            StartDate = new char[8];
            StartTime = new char[6];
            EndDate = new char[8];
            EndTime = new char[6];
            Tran_type = new char[2];
        }
    }

    //交易明细查询
    private class QueryTransactionEntry {
        public char[] Merchant_id;
        public char[] Merchant_name;
        public char[] Terminal_id;
        public char[] Tran_type;
        public char[] Tran_date;
        public char[] Tran_amount;
        public char[] Host_tran_ls;

        public QueryTransactionEntry() {
            Merchant_id = new char[15];
            Merchant_name = new char[41];
            Terminal_id = new char[9];
            Tran_type = new char[2];
            Tran_date = new char[8];
            Tran_amount = new char[12];
            Host_tran_ls = new char[12];
        }
    }

    //交易明细查询
    private class PacketQueryTransactionResponse {
        public PacketHeader PackageHeader;
        public char[] TotalNum;
        public char[] RespondCode;
        public List<QueryTransactionEntry> mList;

        public PacketQueryTransactionResponse() {
            PackageHeader = new PacketHeader();
            TotalNum = new char[4];
            RespondCode = new char[4];
            mList = new ArrayList<QueryTransactionEntry>();
        }
    }

    private final String QUERY_CURRENT_CASH = "0300";
    private final String QUERY_CURRENT_CASH_RETURN = "0310";
    private final String QUERY_TRANS_DETAIL = "0600";
    private final String QUERY_TRANS_DETAIL_RETURN = "0610";
    private final String ACCOUNT_TRANS_IN = "0700";
    private final String ACCOUNT_TRANS_IN_RETURN = "0710";

    private void WritePaylog(PAYLOG logType,String cardNo,String orderNo,String orderAmt,HttpServletRequest request){
        PayLog paylog = new PayLog();
        paylog.setCardNo(cardNo);
        paylog.setOrderNo(orderNo);
        paylog.setOrderAmt(orderAmt);
        paylog.setIpAddr(getRemoteHost(request));
        User user = userService.getbyId(getUserName());
        paylog.setMobile(user.getPhone());
        //1充值支付2绑定3历史查询
        switch (logType){
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
            default:
                break;
        }
    }

    @RequestMapping(value = "QueryBindCard", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "查询余额兼绑定汇智卡", module = "汇智卡管理")
    public ResultMessage QueryBindCard(HttpServletRequest request, HttpServletResponse response) {
        try {
            String code = request.getParameter("authCode").trim();
            String pwdStr = request.getParameter("password").trim();
            //queryFlag : 0解绑 1绑定 2已绑定
            String qyfStr = request.getParameter("queryFlag").trim();
            String cardNo = request.getParameter("cardNo").trim();
            PacketBindCard pkgBindCard = new PacketBindCard();
            String buf = new String("0094");
            String authCode = (String)request.getSession().getAttribute("rand");
            if (authCode==null || !code.equalsIgnoreCase(authCode)){
                return Msg(false,"验证码不正确!");
            }
            memcpy(buf.toCharArray(), pkgBindCard.PackageHeader.PackageLength, 4);

            buf = QUERY_CURRENT_CASH;
            memcpy(buf.toCharArray(), pkgBindCard.PackageHeader.Transactioncode, 4);

            buf = "88888894";
            memcpy(buf.toCharArray(), pkgBindCard.PackageHeader.Terminalid, 8);

            buf = "046220153110002";
            memcpy(buf.toCharArray(), pkgBindCard.PackageHeader.Merchantid, 15);

            buf = "20160121";
            memcpy(buf.toCharArray(), pkgBindCard.PackageHeader.Transactiondate, 8);

            buf = "175822";
            memcpy(buf.toCharArray(), pkgBindCard.PackageHeader.Transactiontime, 6);

            buf = "000001";
            memcpy(buf.toCharArray(), pkgBindCard.PackageHeader.Serial, 6);

            //buf = "0000019900000146";
            memcpy(cardNo.toCharArray(), pkgBindCard.PackageHeader.Cardno, 22);

            if (qyfStr.equals("2")){
                memcpy("".toCharArray(), pkgBindCard.Password, 16);

                pkgBindCard.QueryFlag = "0".toCharArray();
            }
            else{
                memcpy(pwdStr.toCharArray(), pkgBindCard.Password, 16);

                pkgBindCard.QueryFlag = qyfStr.toCharArray();
            }


            StringBuffer pkgStr = new StringBuffer();
            pkgStr.append(pkgBindCard.PackageHeader.PackageLength, 0, 4)
                    .append(pkgBindCard.PackageHeader.Transactioncode, 0, 4)
                    .append(",")
                    .append(pkgBindCard.PackageHeader.Terminalid, 0, 8)
                    .append(",")
                    .append(pkgBindCard.PackageHeader.Merchantid, 0, 15)
                    .append(",")
                    .append(pkgBindCard.PackageHeader.Transactiondate, 0, 8)
                    .append(",")
                    .append(pkgBindCard.PackageHeader.Transactiontime, 0, 6)
                    .append(",")
                    .append(pkgBindCard.PackageHeader.Serial, 0, 6)
                    .append(",")
                    .append(pkgBindCard.PackageHeader.Cardno, 0, 22)
                    .append(",")
                    .append(pkgBindCard.Password, 0, 16)
                    .append(",")
                    .append(pkgBindCard.QueryFlag, 0, 1);

            PacketBindCardResponse bdr = new PacketBindCardResponse();
            String responseMsg = SendPackage(pkgStr.toString());
            String[] resArray = responseMsg.split(",");
            String jason = "Failure";
            bdr.PackageHeader.PackageLength = resArray[0].substring(0, 4).toCharArray();
            bdr.PackageHeader.Transactioncode = resArray[0].substring(5).toCharArray();
            bdr.PackageHeader.Terminalid = resArray[1].toCharArray();
            bdr.PackageHeader.Merchantid = resArray[2].toCharArray();
            bdr.PackageHeader.Transactiondate = resArray[3].toCharArray();
            bdr.PackageHeader.Transactiontime = resArray[4].toCharArray();
            bdr.PackageHeader.Serial = resArray[5].toCharArray();
            bdr.PackageHeader.Cardno = resArray[6].toCharArray();
            bdr.EdBalance = resArray[7].toCharArray();
            bdr.EpBalance = resArray[8].toCharArray();
            bdr.UserName = resArray[9].toCharArray();
            bdr.RespondCode = resArray[10].toCharArray();

            switch (Integer.valueOf(resArray[10])) {
                //成功
                case 0:
                    bdr.ExpireDate = resArray[11].toCharArray();
                    //写入绑定卡号
                    User ur = userService.getbyId(getUserName());
                    if (qyfStr.equals("1")){
                        ur.setCardid(resArray[6]);
                        userService.update(ur);
                    }
                    else if(qyfStr.equals("0")){
                        ur.setCardid("");
                        userService.update(ur);
                    }

                    jason = "{\"success\":\"true\",\"msg\":[{\"EdBalance\":\"" + resArray[7].trim() + "\",\"EpBalance\":\"" + resArray[8].trim() + "\",\"UserName\":\"" + resArray[9] + "\",\"ExpireDate\":\"" + resArray[11] + "\"}]}";
                    break;
                //卡、终端、商户不对应
                case 1:
                    jason = "{\"success\":\"false\",\"msg\":\"卡、终端、商户不对应\"}";
                    break;
                //无此卡号
                case 2:
                    jason = "{\"success\":\"false\",\"msg\":\"无此卡号\"}";
                    break;
                //密码错误,次数未超限
                case 6:
                    jason = "{\"success\":\"false\",\"msg\":\"密码错误,次数未超限\"}";
                    break;
                //密码错误次数超过3次
                case 7:
                    jason = "{\"success\":\"false\",\"msg\":\"密码错误次数超过3次\"}";
                    break;
                //过期卡
                case 8:
                    jason = "{\"success\":\"false\",\"msg\":\"过期卡\"}";
                    break;
                //交易失败
                default:
                    jason = "{\"success\":\"false\",\"msg\":\"交易失败\"}";
                    break;
            }

            //写日志
            WritePaylog(PAYLOG.PAY_BIND,cardNo,"","",request);

            response.getWriter().write(jason);
            response.getWriter().flush();
            response.getWriter().close();
        } catch (Exception e) {
            System.out.println("fail");
            try {
                response.getWriter().write("{\"success\":\"false\",\"msg\":\"查询绑定异常\"}");
                response.getWriter().flush();
                response.getWriter().close();
            } catch (IOException ee) {

            }
        }
        return Msg(true,"操作成功");
    }

    @RequestMapping(value = "QueryTransaction", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "查询汇智卡交易明细", module = "汇智卡管理")
    public void QueryTransaction(HttpServletRequest request, HttpServletResponse response) {
        try {
            String cardNo = request.getParameter("cardNo").trim();
            String queryNum = "30";//request.getParameter("queryNum").trim();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
            String endDate = sdf.format(new Date());//request.getParameter("startDate").trim();
            SimpleDateFormat sdf2 = new SimpleDateFormat("HHmmss");
            String endTime = sdf2.format(new Date());//request.getParameter("startTime").trim();
            String startDate = "20150101";//request.getParameter("endDate").trim();
            String startTime = "101010";//request.getParameter("endTime").trim();
            String tranType = request.getParameter("tranType").trim();
            PacketQueryTransaction pkgQueryTransaction = new PacketQueryTransaction();
            String buf = new String("0101");
            memcpy(buf.toCharArray(), pkgQueryTransaction.PackageHeader.PackageLength, 4);

            buf = QUERY_TRANS_DETAIL;
            memcpy(buf.toCharArray(), pkgQueryTransaction.PackageHeader.Transactioncode, 4);

            buf = "88888894";
            memcpy(buf.toCharArray(), pkgQueryTransaction.PackageHeader.Terminalid, 8);

            buf = "046220153110002";
            memcpy(buf.toCharArray(), pkgQueryTransaction.PackageHeader.Merchantid, 15);

            buf = "20160121";
            memcpy(buf.toCharArray(), pkgQueryTransaction.PackageHeader.Transactiondate, 8);

            buf = "175822";
            memcpy(buf.toCharArray(), pkgQueryTransaction.PackageHeader.Transactiontime, 6);

            buf = "000001";
            memcpy(buf.toCharArray(), pkgQueryTransaction.PackageHeader.Serial, 6);

            //buf = "0000019900000146";
            memcpy(cardNo.toCharArray(), pkgQueryTransaction.PackageHeader.Cardno, 22);

            memcpy(queryNum.toCharArray(), pkgQueryTransaction.QueryNum, 2);

            memcpy(startDate.toCharArray(), pkgQueryTransaction.StartDate, 8);

            memcpy(startTime.toCharArray(), pkgQueryTransaction.StartTime, 6);

            memcpy(endDate.toCharArray(), pkgQueryTransaction.EndDate, 8);

            memcpy(endTime.toCharArray(), pkgQueryTransaction.EndTime, 6);

            memcpy(tranType.toCharArray(), pkgQueryTransaction.Tran_type, 2);

            StringBuffer pkgStr = new StringBuffer();
            pkgStr.append(pkgQueryTransaction.PackageHeader.PackageLength, 0, 4)
                    .append(pkgQueryTransaction.PackageHeader.Transactioncode, 0, 4)
                    .append(",")
                    .append(pkgQueryTransaction.PackageHeader.Terminalid, 0, 8)
                    .append(",")
                    .append(pkgQueryTransaction.PackageHeader.Merchantid, 0, 15)
                    .append(",")
                    .append(pkgQueryTransaction.PackageHeader.Transactiondate, 0, 8)
                    .append(",")
                    .append(pkgQueryTransaction.PackageHeader.Transactiontime, 0, 6)
                    .append(",")
                    .append(pkgQueryTransaction.PackageHeader.Serial, 0, 6)
                    .append(",")
                    .append(pkgQueryTransaction.PackageHeader.Cardno, 0, 22)
                    .append(",")
                    .append(pkgQueryTransaction.QueryNum, 0, 2)
                    .append(",")
                    .append(pkgQueryTransaction.StartDate, 0, 8)
                    .append(",")
                    .append(pkgQueryTransaction.StartTime, 0, 6)
                    .append(",")
                    .append(pkgQueryTransaction.EndDate, 0, 8)
                    .append(",")
                    .append(pkgQueryTransaction.EndTime, 0, 6)
                    .append(",")
                    .append(pkgQueryTransaction.Tran_type, 0, 2);

            PacketQueryTransactionResponse bdr = new PacketQueryTransactionResponse();
            String responseMsg = SendPackage(pkgStr.toString());
            String[] resArrayHeader = responseMsg.split(",", 8);
            String jason = "Failure";
            bdr.PackageHeader.PackageLength = resArrayHeader[0].substring(0, 4).toCharArray();
            bdr.PackageHeader.Transactioncode = resArrayHeader[0].substring(5).toCharArray();
            bdr.PackageHeader.Terminalid = resArrayHeader[1].toCharArray();
            bdr.PackageHeader.Merchantid = resArrayHeader[2].toCharArray();
            bdr.PackageHeader.Transactiondate = resArrayHeader[3].toCharArray();
            bdr.PackageHeader.Transactiontime = resArrayHeader[4].toCharArray();
            bdr.PackageHeader.Serial = resArrayHeader[5].toCharArray();
            bdr.PackageHeader.Cardno = resArrayHeader[6].toCharArray();

            String[] resArrayBody = resArrayHeader[7].split(",", 3);
            bdr.TotalNum = resArrayBody[0].toCharArray();
            bdr.RespondCode = resArrayBody[1].toCharArray();

            String[] resArrayTrans = resArrayBody[2].split("\\|");
            JSONObject jsonDetail = new JSONObject();
            jsonDetail.put("total", Integer.valueOf(resArrayBody[0]));

            JSONArray jsonChild = new JSONArray();
            for (int j = 0; j < resArrayTrans.length; j++) {
                QueryTransactionEntry entry = new QueryTransactionEntry();
                String[] entryStr = resArrayTrans[j].split(",");
                entry.Merchant_id = entryStr[0].toCharArray();
                entry.Merchant_name = entryStr[1].toCharArray();
                entry.Terminal_id = entryStr[2].toCharArray();
                entry.Tran_type = entryStr[3].toCharArray();
                entry.Tran_date = entryStr[4].toCharArray();
                entry.Tran_amount = entryStr[5].toCharArray();
                entry.Host_tran_ls = entryStr[6].toCharArray();
                bdr.mList.add(entry);

                JSONObject jo = new JSONObject();
                jo.put("Merchant_id", entryStr[0]);
                jo.put("Merchant_name", entryStr[1]);
                jo.put("Terminal_id", entryStr[2]);
                jo.put("Tran_type", entryStr[3]);
                jo.put("Tran_date", entryStr[4]);
                jo.put("Tran_amount", entryStr[5]);
                jo.put("Host_tran_ls", entryStr[6]);
                jsonChild.put(jo);
            }
            JSONObject jo = new JSONObject();
            switch (Integer.valueOf(resArrayBody[1])) {
                //成功
                case 0:
                    jsonDetail.put("items", jsonChild);
                    jo.put("msg", jsonDetail);
                    jo.put("success", "true");
                    //jason = "{\"success\":\"true\",\"msg\":[{\"主账户余额\":\""+resArray[7].trim()+"\",\"电子钱包余额\":\""+resArray[8].trim()+"\",\"用户姓名\":\""+resArray[9]+"\",\"卡有效期\":\""+resArray[11]+"\"}]}";
                    break;
                //无效商户
                case 3:
                    jo.put("msg", "无效商户");
                    jo.put("success", "false");
                    //jason = "{\"success\":\"false\",\"msg\":\"无效商户\"}";
                    break;
                //找不到原交易
                case 12:
                    jo.put("msg", "找不到原交易");
                    jo.put("success", "false");
                    //jason = "{\"success\":\"false\",\"msg\":\"找不到原交易\"}";
                    break;
                //无效金额
                case 13:
                    jo.put("msg", "无效金额");
                    jo.put("success", "false");
                    //jason = "{\"success\":\"false\",\"msg\":\"无效金额\"}";
                    break;
                //交易报文格式错
                case 30:
                    jo.put("msg", "交易报文格式错");
                    jo.put("success", "false");
                    //jason = "{\"success\":\"false\",\"msg\":\"交易报文格式错\"}";
                    break;
                //交易失败
                default:
                    jo.put("msg", "交易失败");
                    jo.put("success", "false");
                    //jason = "{\"success\":\"false\",\"msg\":\"交易失败\"}";
                    break;
            }
            //写日志
            WritePaylog(PAYLOG.PAY_QUERY,cardNo,"","",request);
            response.getWriter().write(jo.toString());
            response.getWriter().flush();
            response.getWriter().close();
        } catch (Exception e) {
            System.out.println("fail");
            JSONObject jo = new JSONObject();
            jo.put("msg", "查询异常");
            jo.put("success", "false");
            try {
                response.getWriter().write(jo.toString());
                response.getWriter().flush();
                response.getWriter().close();
            } catch (IOException ee) {

            }
        }
    }

    @RequestMapping(value = "PayTransaction", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "汇智卡支付", module = "汇智卡管理")
    public void PayTransaction(HttpServletRequest request, HttpServletResponse response) {
        try {
            // 交易请求地址
            String    postUrl  = "http://61.149.179.158:20001/recharge/login.jsp";
            // 加密密钥
            String HMD5_PASSWORD = "123456";

            Random random = new Random();
            //订单号
            String orderNo = getUUID();

            /**
             * 订单数据 例如<orderNo>6217443579</orderNo><orderAmt>2.00</orderAmt><remark>B2C</remark>
              */
            String merId = "046220153110002";
            String cardNo = request.getParameter("cardNo").trim();
            String orderAmt = request.getParameter("orderAmt");
            //接口名称
            String    interfaceName 		= "MPayOrder_NS";
            //String bankId=request.getParameter("bankId");
            // 商户编号
            //String    merId 		    	= request.getParameter("merId").trim();
            //币种
            String	  curType    		 	= "CNY";
            // 商户接收支付成功数据的地址
            String 	  returnURL 	        = "payReturn.jsp";
            // 商户接收支付成功消息的地址（后台返回）
            String    notifyURL = "payNotify.jsp";
            //交易数据
            String	  tranData ="<?xml version=\"1.0\" encoding=\"GBK\"?><B2CReq><merId>"+merId+"</merId><curType>"+curType+"</curType><orderNo>"+orderNo+"</orderNo><orderAmt>"+orderAmt+"</orderAmt><remark>B2C</remark><returnURL>"+returnURL+"</returnURL><notifyURL>"+notifyURL+"</notifyURL><reserved1></reserved1><reserved2></reserved2></B2CReq>";

            System.out.println("tranData:"+tranData);
            String merSignMsg = HmacSHA256Sign.hmacSHA256(tranData, HMD5_PASSWORD);
            String tranDataBase64 = ProcessMessage.Base64Encode(tranData.getBytes());

            JSONObject data = new JSONObject();
            data.put("postUrl",postUrl);
            data.put("merSignMsg",merSignMsg);
            data.put("tranDataBase64",tranDataBase64);
            JSONObject jo = new JSONObject();
            jo.put("msg", data);
            jo.put("success", "true");

            //写日志
            WritePaylog(PAYLOG.PAY_PAY,cardNo,orderNo,orderAmt,request);

            response.getWriter().write(jo.toString());
            response.getWriter().flush();
            response.getWriter().close();

//            URL url = new URL(postUrl);
//            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
//            conn.setDoOutput(true);    // 可以发送数据
//            conn.setDoInput(true);    // 可以接收数据
//            conn.setRequestMethod("POST");    // POST方法
//            // 必须注意此处需要设置UserAgent，否则google会返回403
//            conn.setRequestProperty
//                    ("User-Agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0)");
//            conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
//            conn.connect();
//            //    写入的POST数据
//            OutputStreamWriter osw = new OutputStreamWriter(conn.getOutputStream(), "UTF-8");
//            osw.write("tranData="+tranDataBase64+"&merSignMsg="+merSignMsg);
//            osw.flush();
//            osw.close();

//            <form name="pay" action="<%=URL%>" method="post" target="_blank">
//            <input type='hidden' name='tranData' value='<%=tranDataBase64%>'>
//            <input type='hidden' name='merSignMsg' value='<%=merSignMsg%>'>
//            <input type='submit' value='提交支付信息' />
//            </form>

        }catch (Exception e){
            System.out.println("fail");
            try {
                response.getWriter().write("{\"success\":\"false\",\"msg\":\"支付异常\"}");
                response.getWriter().flush();
                response.getWriter().close();
            } catch (IOException ee) {

            }
        }
    }

    private void memcpy(char[] src, char[] dest, int len) {
        for (int i = 0; i < len; i++) {
            try {
                dest[i] = src[i];
            } catch (ArrayIndexOutOfBoundsException e) {
                dest[i] = ' ';
            }
        }
    }


    private String SendPackage(String pkgStr) throws UnknownHostException, IOException {
        //向服务器端发送请求，服务器IP地址和服务器监听的端口号
        Socket client = new Socket("119.90.43.147", 16929);

        //通过printWriter 来向服务器发送消息
        PrintWriter printWriter = new PrintWriter(client.getOutputStream());
        System.out.println("connected...");

        //发送消息
        //printWriter.print("00940300,88888894,046220153110002,20160121,175822,000001,0000019900000146      ,                ,0");
        printWriter.print(pkgStr);
        printWriter.flush();
        System.out.println("sent: [" + pkgStr + "]");
        //InputStreamReader是低层和高层串流之间的桥梁
        //client.getInputStream()从Socket取得输入串流
        InputStreamReader streamReader = new InputStreamReader(client.getInputStream());

        //链接数据串流，建立BufferedReader来读取，将BufferReader链接到InputStreamReder
        BufferedReader reader = new BufferedReader(streamReader);

        client.shutdownOutput();

        //接收服务器的相应
        StringBuffer sb = new StringBuffer();
        int cnt = 0;
        int step = 100;
        char[] buf = new char[1460];
        try {
            while (true) {
                int len = reader.read(buf, cnt, step);
                if (len < 1)
                    break;
                sb.append(buf, cnt, len);
                System.out.printf("received: [%s] length [%d]\n", sb, len);
                cnt += len;
            }
        } catch (SocketException e) {
            buf = null;
            reader.close();
            printWriter.close();
            client.close();
            return sb.toString();
        }

        buf = null;
        reader.close();
        printWriter.close();
        client.close();
        return sb.toString();
    }

    @RequestMapping(value = "TotalCardStatistic", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "汇智卡总数统计", module = "汇智卡管理")
    public String TotalCardStatistic(){
        String url = "http://61.149.179.158:20002/card/cardNum.do";
        HttpClient httpClient = new HttpClient();
        PostMethod mypost = new PostMethod(url);
        try
        {
            int re_code = httpClient.executeMethod(mypost);
            String result="";
            if (re_code == 200) {
                System.out.println("-----------------汇智卡总数统计接口返回数据--BEGIN--------------------");
                result=mypost.getResponseBodyAsString();
                System.out.println("汇智卡总数统计返回的数据："+result);
            }
            return result;
        } catch (HttpException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "PrimeCardStatistic", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "汇智卡主帐户统计", module = "汇智卡管理")
    public String PrimeCardStatistic(HttpServletRequest request){
        String url = "http://61.149.179.158:20002/card/zzhTotal.do";
        HttpClient httpClient = new HttpClient();
        PostMethod mypost = new PostMethod(url);
        mypost.addParameter("startTime",request.getParameter("startTime"));
        mypost.addParameter("endTime",request.getParameter("endTime"));
        try
        {
            int re_code = httpClient.executeMethod(mypost);
            String result="";
            if (re_code == 200) {
                System.out.println("-----------------汇智卡总数统计接口返回数据--BEGIN--------------------");
                result=mypost.getResponseBodyAsString();
                System.out.println("汇智卡总数统计返回的数据："+result);
            }
            return result;
        } catch (HttpException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "EWalletStatistic", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "电子钱包统计", module = "汇智卡管理")
    public String EWalletStatistic(HttpServletRequest request){
        String url = "http://61.149.179.158:20002/card/dzqbTotal.do";
        HttpClient httpClient = new HttpClient();
        PostMethod mypost = new PostMethod(url);
        mypost.addParameter("startTime",request.getParameter("startTime"));
        mypost.addParameter("endTime",request.getParameter("endTime"));
        try
        {
            int re_code = httpClient.executeMethod(mypost);
            String result="";
            if (re_code == 200) {
                System.out.println("-----------------汇智卡总数统计接口返回数据--BEGIN--------------------");
                result=mypost.getResponseBodyAsString();
                System.out.println("汇智卡总数统计返回的数据："+result);
            }
            return result;
        } catch (HttpException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "SleepCardStatistic", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "沉寂卡总数统计", module = "汇智卡管理")
    public String SleepCardStatistic(HttpServletRequest request){
        String url = "http://61.149.179.158:20002/card/cardType.do";
        HttpClient httpClient = new HttpClient();
        PostMethod mypost = new PostMethod(url);
        mypost.addParameter("startTime",request.getParameter("startTime"));
        mypost.addParameter("endTime",request.getParameter("endTime"));
        try
        {
            int re_code = httpClient.executeMethod(mypost);
            String result="";
            if (re_code == 200) {
                System.out.println("-----------------汇智卡总数统计接口返回数据--BEGIN--------------------");
                result=mypost.getResponseBodyAsString();
                System.out.println("汇智卡总数统计返回的数据："+result);
            }
            return result;
        } catch (HttpException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "AlertInfomation", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "金额预警提醒", module = "汇智卡管理")
    public String AlertInfomation(HttpServletRequest request){
        String url = "http://61.149.179.158:20002/card/notify.do";
        HttpClient httpClient = new HttpClient();
        PostMethod mypost = new PostMethod(url);
        mypost.addParameter("dAmount",request.getParameter("dAmount"));
        mypost.addParameter("zAmount",request.getParameter("zAmount"));
        try
        {
            int re_code = httpClient.executeMethod(mypost);
            String result="";
            if (re_code == 200) {
                System.out.println("-----------------汇智卡总数统计接口返回数据--BEGIN--------------------");
                result=mypost.getResponseBodyAsString();
                System.out.println("汇智卡总数统计返回的数据："+result);
            }
            return result;
        } catch (HttpException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private String getRemoteHost(javax.servlet.http.HttpServletRequest request){
        String ip = request.getHeader("x-forwarded-for");
        if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)){
            ip = request.getHeader("Proxy-Client-IP");
        }
        if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)){
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)){
            ip = request.getRemoteAddr();
        }
        return ip.equals("0:0:0:0:0:0:0:1")?"127.0.0.1":ip;
    }

    private String getUUID(){
        String s = UUID.randomUUID().toString();
        //去掉“-”符号
        return s.substring(0,8)+s.substring(9,13)+s.substring(14,18)+s.substring(19,23)+s.substring(24);
    }
}
