package com.wiseonline.Controller.HuizhiCard;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.RechargeManage;
import com.wiseonline.Domain.User;
import com.wiseonline.Service.Impl.UserServiceImpl;
import com.wiseonline.Service.RechargeManageService;
import com.wiseonline.Utils.ResultMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.Random;

/**
 * Created by R7tech on 4/19/2016.
 */
@Controller
public class PayUtil extends BaseController {
    @Autowired
    RechargeManageService rechargeManageService;
    @Autowired
    UserServiceImpl userService;

    public void WriteRechargeInfo(String amount,String cardNo,String orderNo){
        StringBuilder code = new StringBuilder();
        Random random = new Random();
        //6位验证码
        for(int i = 0;i < 6;i++){
            code.append(String.valueOf(random.nextInt(10)));
        }

        RechargeManage rm = new RechargeManage();
        rm.setAccount(getUserName());
        rm.setAmount(amount);
        rm.setCardNo(cardNo);
        rm.setCheckCode(code.toString());
        rm.setOrderNo(orderNo);
        rm.setCheckGet(1);
        rechargeManageService.save(rm);

        User user = userService.getbyId(getUserName());
        String sendMessage = "尊敬的用户,您的充值订单号为:"+orderNo+",发票验证码为:"+code+",凭此短信就近就一卡通中心领取定额发票.为减少您的排除等候时间,建议于非高峰就餐时间,谢谢！";
        SendPaySms(user.getPhone(),sendMessage);
    }

    private ResultMessage SendPaySms(String phone, String sendMessage){
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
}
