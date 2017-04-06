package com.wiseonline.Controller.Public;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.User;
import com.wiseonline.Service.Impl.UserServiceImpl;
import com.wiseonline.Utils.PermissionInfo;
import com.wiseonline.Utils.ResultMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;;
import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.List;
import java.util.Random;

/**
 * Created by yanwj on 2015/11/12.
 */
@RestController
@RequestMapping("/Public/Phone")
public class PhoneController extends BaseController{
    private static final String VALIDATE_PHONE_CODE = "VALIDATE_PHONE_CODE";
    private static final String VALIDATE_PHONE = "VALIDATE_PHONE";
    private static final String SEND_CODE_TIME = "SEND_CODE_TIME";

    @Autowired
    UserServiceImpl userService;

    @RequestMapping(value = "SendCode/{phone}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "发送短信验证码", module = "公共-用户注册")
    public ResultMessage sendCode(@PathVariable String phone, HttpServletRequest request){
        StringBuilder code = new StringBuilder();
        Random random = new Random();
        //6位验证码
        for(int i = 0;i < 6;i++){
            code.append(String.valueOf(random.nextInt(10)));
        }
        HttpSession session = request.getSession();
        session.setAttribute(VALIDATE_PHONE,phone.toString());
        System.out.println(code.toString());
        session.setAttribute(VALIDATE_PHONE_CODE,code.toString());
        session.setAttribute(SEND_CODE_TIME,new Date().getTime());
        String sendMessage = "验证码为:"+code+"，请在页面中输入以完成验证！";
        String sql = "SELECT * FROM users WHERE phone = '"+phone+"'";
        List<User> userList = userService.findByDataSQL(sql);
        if (userList != null){
            if (0 < userList.size()){
                return Msg(false, "该手机号已经绑定过，请更换手机号码！");
            }
        }
        try{
            boolean rst = SendToMessage(phone, sendMessage);
            if (rst){
                return Msg(true, "发送成功");
            }else{
                return Msg(false, "发送失败");
            }
        }catch (UnsupportedEncodingException e){
            e.printStackTrace();
            return Msg(false, "发送失败");
        }
    }
    @RequestMapping(value ="Validate/{phone}/{code}",method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "校验验证码", module = "公用-验证码")
    protected ResultMessage validate(@PathVariable String phone,@PathVariable String code,HttpServletRequest request){
//        HttpSession session = request.getSession();
//        String sessionCode = (String) session.getAttribute(VALIDATE_PHONE_CODE);
//        String sessionPhone = (String) session.getAttribute(VALIDATE_PHONE);
//        if(code.equalsIgnoreCase(sessionCode) && phone.equalsIgnoreCase(sessionPhone)){
//            return Msg(true, "true");
//        }else{
//            return Msg(false, "false");
//        }
        return Msg(true, "true");
    }
}
