package com.wiseonline.Controller;

import com.wiseonline.Controller.Thirdpart.Sale3rdChildController;
import com.wiseonline.Dao.UserDao;
import com.wiseonline.Domain.Role;
import com.wiseonline.Domain.Sale3rdChild;
import com.wiseonline.Domain.SettingDict;
import com.wiseonline.Domain.User;
import com.wiseonline.Service.Impl.RoleServiceImpl;
import com.wiseonline.Service.Impl.UserServiceImpl;
import com.wiseonline.Service.Sale3rdChildService;
import com.wiseonline.Service.SettingDictService;
import com.wiseonline.Utils.ConstClass;
import com.wiseonline.Utils.PermissionInfo;
import com.wiseonline.Utils.ResultMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.util.*;

import static org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.SPRING_SECURITY_LAST_USERNAME_KEY;

/**
 * Created by yanwj on 2015/11/5.
 */
@RestController
@RequestMapping("/Login")
public class LoginController extends BaseController{
    @Autowired
    UserServiceImpl userService;

    @Autowired
    RoleServiceImpl roleService;

    @Autowired
    private UserDao userDao;

    @Autowired
    private Sale3rdChildController sale3rdChildService;

    @Autowired
    private SettingDictService settingDictService;

    @Autowired
    @Qualifier("org.springframework.security.authenticationManager")//编辑软件会提示错误
    protected AuthenticationManager authenticationManager;

    private static String WSP_SESSION_USERNAME = "WSP_SESSION_USERNAME";
    @RequestMapping(method = RequestMethod.POST, headers = "Accept=application/json")
    public ResultMessage login(User Model,HttpServletRequest request) {
        boolean rst = userService.confirm(Model);
        if (rst) {
            setSessionCode(request,WSP_SESSION_USERNAME,Model.getUsername());
            return Msg(true, "登录成功");
        } else {
            return Msg(false, "登录失败");
        }
    }
    @RequestMapping(value = "register",method = RequestMethod.POST,headers = "Accept=application/json")
    @PermissionInfo(name = "用户注册", module = "公共-用户功能")
    public ResultMessage register(User user, HttpServletRequest request){
        String code = request.getParameter("code");
        String sessionPhone = (String) request.getSession().getAttribute("VALIDATE_PHONE");
        String sessionCode = (String)request.getSession().getAttribute("VALIDATE_PHONE_CODE");

            if (code != null) {
                //TODO  验证码 sessioon操作
                if (sessionCode != code) {
                    if (user.getUsername().equals("")) {
                        return Msg(false, ConstClass.UsernameMust);
                    } else {
                        List<User> users = userService.findByOneField(0, 0,
                                "username", user.getUsername(), true, "username").getResult();
                        List<User> users2 = userService.findByOneField(0, 0,
                                "phone", user.getPhone(), true, "username").getResult();
                        if (0 < users.size()) {
                            return Msg(false, ConstClass.UsernameAlready);
                        }else if(0 < users2.size()){
                            return Msg(false, "手机号已注册");
                        } else {
                            List<User> users3 = userService.findByOneField(0, 0,
                                    "phone", user.getPhone(), true, "phone").getResult();
                            if (0 < users3.size()) {
                                return Msg(false, ConstClass.PhoneAlready);
                            } else {
                                System.out.println("----"+sessionPhone);
                                if (!user.getPhone().equals(sessionPhone)){
                                    return Msg(false,"手机号码不对!");
                                }else {
                                    user.setName(user.getUsername());
                                    user.setRealName(user.getUsername());
                                    if (user.getSex() == 0) {
                                        user.setSex(2);
                                    }
                                    if (user.getMarital() == 0) {
                                        user.setMarital(1);
                                    }
                                    if (user.getDeleteFlag() == 0) {
                                        user.setDeleteFlag(1);
                                    }
                                    if (user.getEnterpriseRoot() == 0) {
                                        user.setEnterpriseRoot(1);
                                    }
                                    if (user.getUserFlag() == 0) {
                                        user.setUserFlag(2);
                                    }
                                    boolean rst = userService.insertNewUser(user);
                                    if (rst) {
                                        try{
                                            int type = findType("asRegist");
                                            sale3rdChildService.GetTicket(type,request,user);
                                        }catch (Exception e){

                                        }

                                        String sql = "insert into role_user (rolename,username) values ('Common','"+user.getUsername()+"')";
                                        roleService.execDataSql(sql);
                                        AutoLogin(user.getUsername(),user.getHpassword(),request);
                                        return Msg(true, ConstClass.ResultSaveSuccess);
                                    } else {
                                        return Msg(false, ConstClass.ResultSaveFault);
                                    }
                                }
                            }
                        }
                    }
                }else {
                    return Msg(false,"验证码失效或过期!");
                }
            } else {
                return Msg(false, "请填写验证码");
            }
    }

    /**
     * 注销
     * @param request
     */
    @RequestMapping(value = "LoginOut",method = RequestMethod.POST, headers = "Accept=application/json")
    public ResultMessage LoginOut(HttpServletRequest request) {
        removeSessionCode(request,WSP_SESSION_USERNAME);
        return Msg(true,"注销成功");
    }


    private void AutoLogin(String username,String password,HttpServletRequest request){
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                username, password);
        try{
            token.setDetails(new WebAuthenticationDetails(request));
            Authentication authenticatedUser = authenticationManager
                    .authenticate(token);

            SecurityContextHolder.getContext().setAuthentication(authenticatedUser);
            request.getSession().setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, SecurityContextHolder.getContext());
        }
        catch( AuthenticationException e ){
            System.out.println("Authentication failed: " + e.getMessage());
        }
    }


    @RequestMapping(value = "WeiXinLogin/{phone}/{authCode}",method = RequestMethod.GET, headers = "Accept=application/json")
    public ResultMessage WeiXinLogin(@PathVariable String phone,@PathVariable String authCode, HttpServletRequest request) {

//        List<User> users = this.userDao.queryUserByMobile(phone);
//        {
//            if (users != null && users.size() > 0) {
//
//
//                User user = users.get(0);
//                AutoLogin(user.getUsername(), user.getHpassword(), request);
//                return Msg(true, "登录成功");
//
//            } else {
//                ResultMessage rm = createUser(phone);
//                if (!rm.getSuccess()) {
//                    return rm;
//                }
//
//                List<User> user = this.userDao.queryUserByMobile(phone);
//                User usr = user.get(0);
//                AutoLogin(usr.getUsername(), usr.getHpassword(), request);
//                return Msg(true, "登录成功");
//
//            }
//        }
        {
            String authCodeS = (String) request.getSession().getAttribute("authCode");
            if (authCodeS == null) {
                return Msg(false, "请先获取验证码!");
            }
            List<User> users = this.userDao.queryUserByMobile(phone);
//            if (getUserName()!=null || getUserName()!=""){
//                return Msg(false, "您已经登录!");
//            }
            if (users != null && users.size() > 0) {

                if (authCodeS.equals(authCode)) {
                    User user = users.get(0);
                    AutoLogin(user.getUsername(), user.getHpassword(), request);
                    return Msg(true, "登录成功");
                } else {
                    return Msg(false, "验证码与手机号不匹配");
                }

            } else {
                //return Msg(false, "登录失败,请先在官网注册!");
                ResultMessage rm = createUser(phone);
                if (!rm.getSuccess()) {
                    return rm;
                }
                if (authCodeS.equals(authCode)) {
                    List<User> user = this.userDao.queryUserByMobile(phone);
                    User usr = user.get(0);
                    AutoLogin(usr.getUsername(), usr.getHpassword(), request);

                    try{
                        int type = findType("asRegist");
                        sale3rdChildService.GetTicket(type,request,usr);
                    }catch (Exception e){

                    }
                    String sendMessage = "尊敬的用户,您好,感谢注册汇智e站,您的登录账号为："+usr.getUsername()+",初始密码为：11111111；请尽快前往汇智e站(www.hispsp.com)修改密码.";
                    try {
                        boolean rst = SendToMessage(phone, sendMessage);
//                        if (rst) {
//                            return Msg(true, "发送成功");
//                        } else {
//                            return Msg(false, "发送失败");
//                        }
                    } catch (UnsupportedEncodingException e) {
                        e.printStackTrace();
                        //return Msg(false, "发送失败");
                    }

                    return Msg(true, "登录成功");
                } else {
                    return Msg(false, "验证码与手机号不匹配");
                }
            }
        }
    }

    @RequestMapping(value = "WeiXinGetCode/{phone}",method = RequestMethod.GET, headers = "Accept=application/json")
    public ResultMessage WeiXinLogin(@PathVariable String phone, HttpServletRequest request) {
        String VALIDATE_PHONE = "VALIDATE_PHONE";
        String SEND_CODE_TIME = "SEND_CODE_TIME";
//        List<User> users = this.userDao.queryUserByMobile(phone);
//        if(users!=null && users.size()>0){
            StringBuilder code = new StringBuilder();
            Random random = new Random();
            //6位验证码
            for (int i = 0; i < 6; i++) {
                code.append(String.valueOf(random.nextInt(10)));
            }
            HttpSession session = request.getSession();
            session.setAttribute("authCode", code.toString());
            System.out.println(code.toString());
//            session.setAttribute(VALIDATE_PHONE_CODE,code.toString());
//            session.setAttribute(SEND_CODE_TIME,new Date().getTime());
            String sendMessage = "验证码为:" + code + "，请在页面中输入以完成登录！";
            try {
                boolean rst = SendToMessage(phone, sendMessage);
                if (rst) {
                    return Msg(true, "发送成功");
                } else {
                    return Msg(false, "发送失败");
                }
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
                return Msg(false, "发送失败");
            }
//        }else {
//            return Msg(false, "手机号未注册!");
//        }
    }

    private ResultMessage createUser(String phone) {
        List<User> users2 = userService.findByOneField(0, 0,
                "phone", phone, true, "username").getResult();
        if (0 < users2.size()) {
            return Msg(false, "手机号已注册");
        } else {
            User newUser = new User();
            newUser.setUsername("hz"+phone);
            newUser.setName("hz"+phone);
            newUser.setRealName("hz"+phone);
            newUser.setSex(2);
            newUser.setPhone(phone);
            newUser.setMarital(1);
            newUser.setDeleteFlag(1);
            newUser.setEnterpriseRoot(1);
            newUser.setUserFlag(2);
            newUser.setEmailFlag(1);
            newUser.setRoleArray("Common");
            boolean rst = userService.insertNewUser(newUser);
            if (rst) {
                return Msg(true, ConstClass.ResultSaveSuccess);
            } else {
                return Msg(false, ConstClass.ResultSaveFault);
            }
        }

    }

    @RequestMapping("/sessiontimeout")
    public void sessionTimeout(HttpServletRequest request,HttpServletResponse response) throws IOException {
        String requestUrl = request.getRequestURI();
        if (request.getHeader("x-requested-with") != null
                && request.getHeader("x-requested-with").equalsIgnoreCase(
                "XMLHttpRequest")) { // ajax 超时处理
            response.setHeader("sessionstatus", "timeout");
            PrintWriter out = response.getWriter();
            out.print("{timeout:true}");
            out.flush();
            out.close();
        }else { // http 超时处理
            //throw new AccessDeniedException("session timeout");
            response.sendRedirect(request.getContextPath() + "/web/index.html");
        }

    }

    private int findType(String type){
        String sql = "select * from setting_dict where type='Sale3rdMain' and en='"+type+"'";
        List<SettingDict> sList = settingDictService.findByDataSQL(sql);
        if (sList.size()>0){
            return sList.get(0).getObjectid();
        }
        return -1;
    }
}
