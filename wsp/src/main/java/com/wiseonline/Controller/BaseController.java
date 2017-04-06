package com.wiseonline.Controller;

import com.wiseonline.Domain.SettingDict;
import com.wiseonline.Domain.User;
import com.wiseonline.Service.Impl.SettingDictServiceImpl;
import com.wiseonline.Service.Impl.UserServiceImpl;
import com.wiseonline.Utils.*;
import org.apache.axis2.AxisFault;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.UnsupportedEncodingException;
import java.util.*;
import java.util.regex.Pattern;

/**
 * Created by yanwj on 2015/11/5.
 */
public class BaseController {

    @Value("#{configProperties['Message.Url']}")
    private String message_url;
    @Value("#{configProperties['Message.Key']}")
    private String message_key;
    @Autowired
    UserServiceImpl userService;

    @Autowired
    SettingDictServiceImpl settingDictService;

    public ResultMessage Msg(boolean result,String msg){
        ResultMessage r = new ResultMessage();
        r.setSuccess(result);
        r.setMsg(msg);
        return r;
    }



    /**
     * 判断是否为数字
     * @param str
     * @return
     */
    public boolean isNumeric(String str){
        Pattern pattern = Pattern.compile("[0-9]*");
        if (str==null)
            return false;
        else
            return pattern.matcher(str).matches();
    }

    public boolean SendToMessage(String mobileNumbers, String Content) throws UnsupportedEncodingException {
        boolean rst = true;
        StringBuffer params = new StringBuffer();
        params.append("mobileNumbers").append("=").append(mobileNumbers)
                .append("&").append("Content").append("=").append(Content)
                .append("&").append("key").append("=").append(message_key);
        ResponseFromUrl.GetResult(message_url, "POST", params, true);

        return rst;
    }

    public CustomerServiceStub getStub() {
        CustomerServiceStub stub = null;
        try {
            stub = new CustomerServiceStub();
            stub._getServiceClient()
                    .getOptions()
                    .setProperty(
                            org.apache.axis2.transport.http.HTTPConstants.CHUNKED,
                            Boolean.FALSE);
        } catch (AxisFault e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return stub;
    }

    /**
     * 异常处理
     * @param e
     * @return
     */
    @ExceptionHandler({MyException.class})
    public ResultMessage exception(MyException e){
        System.out.println(e.getMessage());
        e.printStackTrace();
        return Msg(false,e.getMessage());
    }

    /**
     * 获取SESSION变量
     * @param request
     * @return
     */
    public String getSessionCode(HttpServletRequest request,String name){
        HttpSession session = request.getSession();
        String sessionCode = (String) session.getAttribute(name);
        System.out.println(sessionCode);
        return sessionCode;
    }

    /**
     * 设置SESSION变量
     * @param request
     * @return
     */
    public void setSessionCode(HttpServletRequest request,String name,String value){
        HttpSession session = request.getSession();
        session.setAttribute(name,value);
    }

    /***
     * 清空SESSION
     * @param request
     * @param name
     */
    public void removeSessionCode(HttpServletRequest request,String name){
        HttpSession session = request.getSession();
        session.removeAttribute(name);
    }

    public String getUserName(){
        Authentication au = SecurityContextHolder.getContext().getAuthentication();
        return au.getName();
    }

    public String isUserInfoComplete(){
        return "ok";
//        String username = this.getUserName();
//        if (!username.equals("anonymousUser")) {
//            User user = userService.getbyId(username);
//            if (user != null){
//                if (user.getName()==null || user.getName() == "" || "".equals(user.getName())){
//                    return "请完善昵称";
//                }
//                if (user.getRealName() == null || user.getRealName() == "" || "".equals(user.getRealName())){
//                    return "请完善真实姓名";
//                }
//                if (user.getBirthday() == null){
//                    return "请完善出生日期";
//                }
//                if (user.getPhone() == null || user.getPhone() == "" || "".equals(user.getPhone())){
//                    return "请绑定手机号码";
//                }
//                /*if (user.getWorkYears() == 0){
//                    return false;
//                }
//                if (user.getApartmentCity() == 0){
//                    return false;
//                }
//                if (user.getNation() == 0){
//                    return false;
//                }
//                if (user.getHometownCity() == 0){
//                    return false;
//                }
//                if (user.getEducation() == 0){
//                    return false;
//                }*/
//                if (user.getEmail() == null || user.getEmail() == "" || "".equals(user.getEmail())){
//                    return "请绑定邮箱";
//                }else {
//                    if (user.getEmailFlag() != 2){
//                        return "请验证绑定邮箱";
//                    }
//                }
//                return "ok";
//            }else {
//                return "登录超时,请重新登录";
//            }
//        }else {
//            return "登录超时,请重新登录";
//        }
    }
    public List<SettingDict> getSettingDict(String type,String order,String adesc){
        String settingDictSql = "select * from setting_dict where type = '"+type+"' order by "+order+" "+adesc;
        return settingDictService.findByDataSQL(settingDictSql);
    }
    public HashMap<String,Object> getHashMap(){
        HashMap<String, Object> variables = new HashMap<String, Object>();
        String username = this.getUserName();
        //当前登录用户信息
        if (!username.equals("anonymousUser")){
            User user = userService.getbyId(username);
            variables.put("user", user);
        }else {
            variables.put("user", "");
        }
        //加载数据字典信息
        String settingDictSql = "select * from setting_dict order by order_flag desc";
        List<SettingDict> settingDictList = settingDictService.findByDataSQL(settingDictSql);
        Map<String, List<SettingDict>> dataMap = new HashMap<String, List<SettingDict>>();
        for (SettingDict settingDict:settingDictList){
            String type = settingDict.getType();
            List<SettingDict> dataList = dataMap.get(type);
            if (null == dataList) {
                dataList = new ArrayList<SettingDict>();
                dataMap.put(type, dataList);
            }
            dataList.add(settingDict);
        }
        Set<String> keys = dataMap.keySet();
        for (String sysDatasetType : keys) {
            List<SettingDict> settingDictListTemp = new ArrayList<SettingDict>();
            for (SettingDict settingDict:settingDictList){
                String type = settingDict.getType();
                List<SettingDict> dataList = dataMap.get(type);
                if (type.equals(sysDatasetType)) {
                    settingDictListTemp.add(settingDict);
                }
            }
            variables.put(sysDatasetType,settingDictListTemp);
        }
        //是否完善个人资料
        variables.put("isUserInfoComplete",isUserInfoComplete()) ;
        return  variables;
    }

    public CustomerServiceStub.MySoapHeaderE GetHeader() {
        CustomerServiceStub.MySoapHeaderE header = new CustomerServiceStub.MySoapHeaderE();
        CustomerServiceStub.MySoapHeader param = new CustomerServiceStub.MySoapHeader();
        param.setUserName("eisp");
        param.setPassWord("eisp.spsp.321");
        header.setMySoapHeader(param);
        return header;
    }
}
