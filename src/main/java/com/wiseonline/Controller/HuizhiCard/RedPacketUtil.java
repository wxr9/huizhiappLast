package com.wiseonline.Controller.HuizhiCard;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.Noticfication;
import com.wiseonline.Domain.RedPacket;
import com.wiseonline.Domain.RedpacketUser;
import com.wiseonline.Domain.User;
import com.wiseonline.Service.Impl.UserServiceImpl;
import com.wiseonline.Service.NotificationService;
import com.wiseonline.Service.RedPacketService;
import com.wiseonline.Service.RedpacketUserService;
import com.wiseonline.Service.UserService;
import com.wiseonline.Utils.MyException;
import com.wiseonline.Utils.ResponseFromUrl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.UnsupportedEncodingException;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by R7tech on 10/13/2016.
 */

public class RedPacketUtil extends BaseController implements Runnable{
    @Value("#{configProperties['Message.Url']}")
    private String message_url;
    @Value("#{configProperties['Message.Key']}")
    private String message_key;
    //@Autowired
    RedPacketService redPacketService=null;
    //@Autowired
    RedpacketUserService redpacketUserService =null;
    //@Autowired
    UserServiceImpl userService=null;
    //@Autowired
    NotificationService notificationService=null;

    String username = "";
    RedPacketUtil(String name,RedPacketService r1,RedpacketUserService r2,UserServiceImpl u,NotificationService n){
        username = name;
        redPacketService = r1;
        redpacketUserService = r2;
        userService = u;
        notificationService = n;
    }

    public void run() {
        try {
            synchronized (this){
                String sql = "select * from red_packet where enableRule=1 and (startDate<DATE_FORMAT(NOW(),'%Y-%m-%d %H:%i:%S') and endDate>DATE_FORMAT(NOW(),'%Y-%m-%d %H:%i:%S'))";
                List<RedPacket> rList = redPacketService.findByDataSQL(sql);
                if (rList.size()==0){
                    throw new MyException("没有找到匹配的红包规则");
                }
                if (rList.size()>1){
                    throw new MyException("找到多条红包规则");
                }
                RedPacket rp = rList.get(0);
                float probability = rp.getHitPersent();
                Date vdate = rp.getValidDate();
                float totalSum = rp.getTotalSum();
                float maxSum = rp.getMaxSum();
                float minSum = rp.getMinSum();
                int sentNum = rp.getSentNum();
                int dotEnable = rp.getDotEnable();
                float sentSum = rp.getSentSum();
                Random random = new Random(System.currentTimeMillis());

                if (totalSum<sentSum){
                    throw new MyException("红包发放已超过总金额");
                }

                List<User> uList = userService.findAll();
                int totalUsers = uList.size();
                int expectuser = -1;
                if (map.size()!=uList.size()){
                    for (int i=0;i<uList.size();i++){
                        if (!map.containsKey(uList.get(i).getUsername()))
                            map.put(uList.get(i).getUsername(),i);
                    }
                }
                if (map.containsKey(username)){
                    expectuser = map.get(username);
                }

                if (LotteryTool.getInstance(probability,totalUsers).isLucky(expectuser)){
                    RedpacketUser ru = new RedpacketUser();
                    float sum = 0;
                    if (maxSum==minSum){
                        sum = maxSum;
                    }else{
                        sum = random.nextInt((int)Math.floor(maxSum-minSum))+minSum;

                        if (sum<maxSum){
                            float fsum = random.nextFloat();
                            DecimalFormat decimalFormat = null;
                            String p = "";
                            switch (dotEnable){
                                case 1:
                                    decimalFormat=new DecimalFormat(".0");//构造方法的字符格式这里如果小数不足2位,会以0补足.
                                    p=decimalFormat.format(fsum);//format 返回的是字符串
                                    sum = sum + Float.valueOf(p);
                                    break;
                                case 2:
                                    decimalFormat=new DecimalFormat(".00");//构造方法的字符格式这里如果小数不足2位,会以0补足.
                                    p=decimalFormat.format(fsum);//format 返回的是字符串
                                    sum = sum + Float.valueOf(p);
                                    break;
                            }
                        }
                    }

                    ru.setSum(sum);
                    ru.setUsername(username);
                    ru.setValidateDate(vdate);
                    ru.setDidUse(false);
                    ru.setRuleId(rp.getId());
                    ru.setType(RedpacketType.RECHARGE);
                    if (redpacketUserService.save(ru)){
                        //System.out.println(rp.getId()+" before update sentNum "+sentNum+" sentSum "+sentSum);
                        int nSent = sentNum+1;
                        float sSent = sentSum+sum;
                        rp.setSentNum(nSent);
                        rp.setSentSum(sSent);
                        //System.out.println(rp.getId()+" after update sentNum "+nSent+" sentSum "+sSent);
                        if (!redPacketService.update(rp)){
                            System.out.println(rp.getId()+" update sentNum "+nSent+" sentSum "+sSent+" fail!");
                        }
                        System.out.println(username+" get a lucky redpacket!");

                        String msg = "恭喜您获得 "+sum+"元红包一张,请在"+new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
                                .format(vdate)+"之前使用.";
                        Noticfication noticfication = new Noticfication();
                        noticfication.setReadStatus(1);
                        noticfication.setAccepter(username);
                        noticfication.setAuthor("system");
                        noticfication.setContent(msg);
                        noticfication.setTitle("用户红包提醒");
                        notificationService.save(noticfication);
                try {
                    SendToMessage(userService.getbyId(username).getPhone(),msg);
                }catch (UnsupportedEncodingException e){

                }
                    }
                }
            }
        }catch (Exception e){
            e.printStackTrace();
        }

    }

    private static class RedpacketType{
        public static int RECHARGE = 1;
        public static int UNKNOWN = 2;
    }

    private static Map<String, Integer> map = new HashMap<String, Integer>();

    public synchronized void generateRedpacket(String username) throws MyException {

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
}
