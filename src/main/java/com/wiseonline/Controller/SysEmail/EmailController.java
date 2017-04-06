package com.wiseonline.Controller.SysEmail;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.User;
import com.wiseonline.Service.IMailSenderProvider;
import com.wiseonline.Service.Impl.UserServiceImpl;
import com.wiseonline.Service.UserService;
import com.wiseonline.Utils.DataUtil;
import com.wiseonline.Utils.PermissionInfo;
import com.wiseonline.Utils.ResultMessage;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.Date;
import java.util.List;

/**
 * Created by R7tech on 4/20/2016.
 */
@RestController
@RequestMapping("/SysEmail")
public class EmailController extends BaseController {
    @Autowired
    IMailSenderProvider mailSenderProvider;
    @Autowired
    UserServiceImpl userService;

    @Value("#{configProperties['Email.HostSchema']}")
    private String HostSchema;

    @RequestMapping(value = "SendEmail", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "发送邮件", module = "后台-邮件系统")
    public ResultMessage SendEmail(HttpServletRequest request)
    {
        String receiver = request.getParameter("receiver");
        String content = request.getParameter("mailContent");
        String title = request.getParameter("mailTitle");
        sendEmail(receiver,title,content);
        return Msg(true,"success");
    }

    @RequestMapping(value = "SendAuthEmail", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "发送验证邮件", module = "后台-邮件系统")
    public ResultMessage SendAuthEmail(HttpServletRequest request)
    {
        String email = request.getParameter("email");
        String username = request.getParameter("username");
        List<User> users = userService.findByOneField(0, 0,
                "email", email, true, "email").getResult();
        if (0 < users.size() && users.get(0).getEmailFlag()==2) {
            if (username.equals(users.get(0).getUsername())){
                return Msg(false, "Email已被绑定");
            }
            return Msg(false, "Email已被其它帐号使用");
        }

        // 构造发送邮件的内容
        String serverPort = "";
        if (request.getServerPort() != 80) {
            serverPort = ":" + request.getServerPort();
        }
//        String serverName = request.getServerName();
//        String basePath = request.getScheme() + "://" + serverName
//                + serverPort + request.getContextPath() + "/";
        String basePath = HostSchema + request.getContextPath() + "/";
        StringBuffer activateUrl = new StringBuffer();
        activateUrl.append(basePath);

        User ur = userService.getbyId(getUserName());
        ur.setEmail(email);
        //状态改成未绑定
        ur.setEmailFlag(1);
        userService.update(ur);
        // 构造验证码
        String authCode = DataUtil.encryptionPw(email
                + ur.getHpassword());

        Date sendDate = new Date();
        activateUrl.append("SysEmail/DoAuthEmail?id=" + ur.getUsername()
                + "&code=" + authCode + "&m=" + sendDate.getTime());
        String content = "<a href="+activateUrl+">请点击此链接完成验证！</a> <p>也可复制此链接地址用浏览器打开:"+activateUrl+"</p>";

        sendEmail(email,"验证邮件",content);
        return Msg(true,"验证收件已发送，请查收！");
    }

    @RequestMapping(value = "DoAuthEmail", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "完成验证邮件", module = "后台-邮件系统")
    public ResultMessage DoAuthEmail(HttpServletRequest request, HttpServletResponse response)
    {
        String status = "false";
        String msg = "绑定成功";
        // 获得用户帐号
        String id = request.getParameter("id");
        // 获得code
        String code = request.getParameter("code");
        // 获得发送时间m
        String m = request.getParameter("m");
        User member = userService.getbyId(id);

        response.setHeader("Content-type", "text/html;charset=UTF-8");
        if (StringUtils.isBlank(id) || StringUtils.isBlank(code)
                || StringUtils.isBlank(m)) {
            member.setEmailFlag(1);
            userService.update(member);
            msg = "激活链接不正确";

            try{
                String redUrl = "/web/verifyEmail.html?email="+member.getEmail()+"&status="+status+"&msg="+URLEncoder.encode(msg,"UTF-8");
                response.sendRedirect(redUrl);
            }catch (IOException e){

            }
            return Msg(false,"激活链接不正确");
        }

        // 验证30分钟内超时
        Long sendTime = Long.parseLong(m);
        Long reduceResult = new Date().getTime() - sendTime;
        if (((reduceResult / 1000) / 60) > 30) {
            member.setEmailFlag(1);
            userService.update(member);
            msg = "激活链接不正确";

            try{
                String redUrl = "/web/verifyEmail.html?email="+member.getEmail()+"&status="+status+"&msg="+URLEncoder.encode(msg,"UTF-8");
                response.sendRedirect(redUrl);
            }catch (IOException e){

            }
            return Msg(false,"激活连接已失效");
        }

        // 验证会员名是否存在

        if (null == member || !member.getUsername().equals(id)) {
            member.setEmailFlag(1);
            userService.update(member);
            msg = "激活链接不正确";

            try{
                String redUrl = "/web/verifyEmail.html?email="+member.getEmail()+"&status="+status+"&msg="+URLEncoder.encode(msg,"UTF-8");
                response.sendRedirect(redUrl);
            }catch (IOException e){

            }
            return Msg(false,"激活链接不正确");
        }

        // 验证邮件是否已经激活，如果邮箱已经激活，则不能继续 -- 方泉 2013-09-12
        if (member.getEmailFlag()==2){
            userService.update(member);
            msg = "邮件已经绑定";

            try{
                String redUrl = "/web/verifyEmail.html?email="+member.getEmail()+"&status="+status+"&msg="+URLEncoder.encode(msg,"UTF-8");
                response.sendRedirect(redUrl);
            }catch (IOException e){

            }
            return Msg(false,"邮件已经绑定");
        }

        // 验证授权验证码是否正确
        String authCode = DataUtil.encryptionPw(member.getEmail()
                + member.getHpassword());
        if (!authCode.equals(code)) {
            member.setEmailFlag(1);
            userService.update(member);
            msg = "激活链接不正确";

            try{
                String redUrl = "/web/verifyEmail.html?email="+member.getEmail()+"&status="+status+"&msg="+URLEncoder.encode(msg,"UTF-8");
                response.sendRedirect(redUrl);
            }catch (IOException e){

            }
            return Msg(false,"激活链接不正确");
        }
        // 改变帐号的激活状态；
        member.setEmailFlag(2);
        userService.update(member);

        try{
            status = "true";
            String basePath = HostSchema + request.getContextPath();
            String redUrl = basePath + "/web/verifyEmail.html?email="+member.getEmail()+"&status="+status+"&msg="+URLEncoder.encode(msg,"UTF-8");
            response.sendRedirect(redUrl);
        }catch (IOException e){

        }

        return Msg(true,"绑定成功");
    }

    private void sendEmail(final String emailAddr, final String title, final String content) {
        try {
            new Thread(new Runnable() {
                public void run() {
                    try {
                        JavaMailSenderImpl sender = mailSenderProvider
                                .getSender();
                        MimeMessage mimeMessage = sender
                                .createMimeMessage();
                        mimeMessage.setSentDate(new Date());
                        MimeMessageHelper helper = new MimeMessageHelper(
                                mimeMessage, false, "utf-8");
                        helper.setFrom(sender.getUsername());
                        //helper.setFrom(sender.getUsername(), titlePrefix);
                        helper.setSubject(title);
                        helper.setText(content, true);
                        helper.setTo(emailAddr);
                        sender.send(mimeMessage);
                        System.out.print("邮件发送中: %s\n" + emailAddr);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }).start();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

