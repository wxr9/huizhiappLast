package com.wiseonline.Security;

import com.wiseonline.Dao.UserDao;
import com.wiseonline.Domain.LoginLog;
import com.wiseonline.Domain.User;
import com.wiseonline.Service.LoginLogService;
import com.wiseonline.Utils.Common;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.event.InteractiveAuthenticationSuccessEvent;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.StandardPasswordEncoder;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

/**
 * Created by yanwj on 2015/11/11.
 */
public class MyAuthenticationFilter extends
        UsernamePasswordAuthenticationFilter {

    private static final String USERNAME = "username";
    private static final String PASSWORD = "password";
    /**
     * 登录成功后跳转的地址
     */
    private String successUrl = "/admin/index.html";
    /**
     * 登录失败后跳转的地址
     */
    private String errorUrl = "/admin/login.html";
    @Autowired
    private UserDao userDao;
    @Autowired
    private StandardPasswordEncoder passwordEncoder;
    @Autowired
    private LoginLogService loginLogService;

    @Autowired
    private MyAuthenticationSuccessHandler myAuthenticationSuccessHandler;

    @Autowired
    private MyAuthenticationFailureHandler myAuthenticationFailureHandler;


    /**
     * 自定义表单参数的name属性，默认是 j_username 和 j_password
     * 定义登录成功和失败的跳转地址
     */
    public void init() {
//		System.err.println(" ---------------  MyAuthenticationFilter init--------------- ");
        //this.setUsernameParameter(USERNAME);
        //this.setPasswordParameter(PASSWORD);
        // 验证成功，跳转的页面
//        SavedRequestAwareAuthenticationSuccessHandler successHandler = new SavedRequestAwareAuthenticationSuccessHandler();
//        successHandler.setDefaultTargetUrl(successUrl);
//        this.setAuthenticationSuccessHandler(successHandler);
//
//        // 验证失败，跳转的页面
//        SimpleUrlAuthenticationFailureHandler failureHandler = new SimpleUrlAuthenticationFailureHandler();
//        failureHandler.setDefaultFailureUrl(errorUrl);
//        this.setAuthenticationFailureHandler(failureHandler);
        this.setAuthenticationSuccessHandler(myAuthenticationSuccessHandler);
        this.setAuthenticationFailureHandler(myAuthenticationFailureHandler);
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request,
                                                HttpServletResponse response) throws AuthenticationException {
//		System.err.println(" ---------------  MyAuthenticationFilter attemptAuthentication--------------- ");

        if (!request.getMethod().equals("POST")) {
            throw new AuthenticationServiceException(
                    "Authentication method not supported: "
                            + request.getMethod());
        }

        String loginType = request.getParameter("lgtp").trim();
        String username = obtainUsername(request).trim();
        String password = obtainPassword(request).trim();
        // System.out.println(">>>>>>>>>>000<<<<<<<<<< username is " +
        // username);
        if (Common.isEmpty(username) || Common.isEmpty(password)) {
            BadCredentialsException exception = new BadCredentialsException(
                    "用户名或密码不能为空！");// 在界面输出自定义的信息！！
            throw exception;
        }

        //如果错误5次则直接拒绝
        //String sql = "select * from login_log where (userName='"+username+"' or ipAddr='"+getRemoteHost(request)+"') and status='false' and createTime < DATE_FORMAT(NOW(),'%Y-%m-%d-%T') and createTime > DATE_SUB(NOW(),INTERVAL 1 DAY)";
        //String sql = "select * from login_log where userName='"+username+"' and status='false' and createTime < DATE_FORMAT(NOW(),'%Y-%m-%d 23:59:59') and DATE_FORMAT(NOW(),'%Y-%m-%d %T') < DATE_FORMAT(NOW(),'%Y-%m-%d 23:59:59')";
        String sql = "select status from login_log where userName = '" +username+"' and createTime <= date_format(now(),'%Y-%m-%d %T') order by createTime desc limit 0,5";
        List lList = loginLogService.findByCustomerSQL(sql);
        int flag = 0;
        for (int i = 0;i < lList.size();i++){
            if (lList.get(i).toString().equals("true")){
                flag++;
            }
        }
        if (flag == 0){
            String s = "select * from login_log where userName = '" +username+"' and createTime > date_sub(date_format(now(),'%Y-%m-%d %T'),interval 1 hour)";
            List l = loginLogService.findByDataSQL(s);
            if (l.size() > 0) {
                String hksql = "insert into login_log(userName,createTime,browser,ipAddr,status)values('" +username+"',date_sub(date_format(now(),'%Y-%m-%d %T'),interval -1 hour),'chrome','127.0.0.1','true')";
                loginLogService.execDataSql(hksql);
                BadCredentialsException eexception = new BadCredentialsException(
                        "您已连续登陆失败五次，请一小时后再试！");// 在界面输出自定义的信息！！
                throw eexception;
            }
        }

        // 验证用户账号与密码是否正确
        User user = this.userDao.querySingleUser(username);

        //用户登录为空，试试手机号码登录
        if(user==null){
            List<User> users = this.userDao.queryUserByMobile(username);
            if(users!=null && users.size()>0){
                user=users.get(0);
            }
        }

        if (user == null || !passwordEncoder.matches(password,user.getHpassword())) {
            BadCredentialsException exception = new BadCredentialsException(
                    "用户名或密码不匹配！");// 在界面输出自定义的信息！！
            //记录登录日志
            try{
                String ip = getRemoteHost(request);
                String Agent = request.getHeader("User-Agent").toLowerCase();
                String userbrowser = getBrowserName(Agent);
                LoginLog ll = new LoginLog();
                ll.setIpAddr(ip);
                ll.setBrowser(userbrowser);
                ll.setUserName(username);
                ll.setStatus("false");
                loginLogService.save(ll);
            }catch (Exception e){
                e.printStackTrace();
            }
            throw exception;
        }

        if(user.getDeleteFlag()==-1){
            BadCredentialsException exception = new BadCredentialsException(
                    "帐户被禁用");// 在界面输出自定义的信息！！
            throw exception;
        }

        boolean ret = false;

        if(loginType.equals("back")){
            switch(user.getUserFlag()){
                case 1:
                    ret = true;
                    break;
                case 2:
                case 3:
                    ret = false;
                    break;
            }
        }

        if(loginType.equals("front")){
            switch(user.getUserFlag()){
                //内部用户
                case 1:
                    ret = true;
                    break;
                //普通用户
                case 2:
                //企业用户
                case 3:
                //商户
                case 4:
                    ret = true;
                    break;
            }
        }

        if (!ret){
            BadCredentialsException exception = new BadCredentialsException(
                    "用户名登录类型不匹配！");// 在界面输出自定义的信息！！
            throw exception;
        }

        //记录登录日志
        try{
            String ip = getRemoteHost(request);
            String Agent = request.getHeader("User-Agent").toLowerCase();
            String userbrowser = getBrowserName(Agent);
            LoginLog ll = new LoginLog();
            ll.setIpAddr(ip);
            ll.setBrowser(userbrowser);
            ll.setUserName(user.getUsername());
            ll.setStatus("true");
            loginLogService.save(ll);
        }catch (Exception e){
            e.printStackTrace();
        }


        // 当验证都通过后，把用户信息放在session里
        request.getSession().setAttribute("userSession", user);
       /* // 记录登录信息
        UserLoginList userLoginList = new UserLoginList();
        userLoginList.setUserId(users.getUserId());
        System.out.println("userId----" + users.getUserId() + "---ip--"
                + Common.toIpAddr(request));
        userLoginList.setLoginIp(Common.toIpAddr(request));
        userLoginListService.add(userLoginList);*/
        // 实现 Authentication
        UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(
                username, user.getPassword());
        // 允许子类设置详细属性
        setDetails(request, authRequest);

        // 运行UserDetailsService的loadUserByUsername 再次封装Authentication
        return this.getAuthenticationManager().authenticate(authRequest);
    }

    public String getSuccessUrl() {
        return successUrl;
    }

    public void setSuccessUrl(String successUrl) {
        this.successUrl = successUrl;
    }

    public String getErrorUrl() {
        return errorUrl;
    }

    public void setErrorUrl(String errorUrl) {
        this.errorUrl = errorUrl;
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
        if(request.getRequestURL().indexOf(":8080")<0){
            ip = request.getHeader("X-Real-IP");
        }
        return ip.equals("0:0:0:0:0:0:0:1")?"127.0.0.1":ip;
    }

    /**
     * 获取浏览器版本信息
     * @Title: getBrowserName
     * @data:2015-1-12下午05:08:49
     * @author:wolf
     *
     * @param agent
     * @return
     */
    private String getBrowserName(String agent) {
        if(agent.indexOf("msie 7")>0){
            return "ie";
        }else if(agent.indexOf("msie 8")>0){
            return "ie";
        }else if(agent.indexOf("msie 9")>0){
            return "ie";
        }else if(agent.indexOf("msie 10")>0){
            return "ie";

        }else if(agent.indexOf("msie")>0){
            return "ie";
        }else if(agent.indexOf("opera")>0){
            return "opera";
        }else if(agent.indexOf("opera")>0){
            return "opera";
        }else if(agent.indexOf("firefox")>0){
            return "firefox";
        }else if(agent.indexOf("chrome")>0){
            return "chrome";
        }else if(agent.indexOf("webkit")>0){
            return "webkit";
        }else if(agent.indexOf("gecko")>0 && agent.indexOf("rv:11")>0){
            return "ie";
        }
        else{
            return "N/A";
        }
    }
}
