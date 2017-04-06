package com.wiseonline.Quartz;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.*;
import com.wiseonline.Service.Impl.*;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Created by kelsey on 16-3-30.
 */
@Service("alertListener")
public class AlertListener  extends BaseController implements MessageListener{


    @Autowired
    UserServiceImpl userService;

    @Autowired
    UserRepairServiceImpl userRepairService;

    @Autowired
    EnterApplyServiceImpl enterApplyService;

    @Autowired
    UserClassroomServiceImpl userClassroomService;

    @Autowired
    UserMeetingroomServiceImpl userMeetingroomService;

    @Autowired
    UserTestApplyforServiceImpl userTestApplyforService;


    @Transactional
    public void onMessage(Message message) {
        byte[] body = message.getBody();
        try {
            String json = new String(body, "UTF-8");
            System.out.println("alert data :" + json);
            try {
                JSONObject jso = new JSONObject(json);
                String related_table = null;
                //服务类别
                Set<String> phoneSet = new HashSet<String>();
                if (jso.has("related_table")) {
                    String sn = null;
                    related_table = jso.get("related_table").toString();
                    if (jso.has("due_receiver")) {
                        String due_receiver = jso.get("due_receiver").toString();
                        JSONArray dueReceiverArray = new JSONArray(due_receiver);
                        //ToDo 查找手机号码(多人)
                        StringBuffer sb = new StringBuffer();
                        for(int i = 0;i < dueReceiverArray.length();i++){
                            sb.append(" ru.rolename = '"+dueReceiverArray.get(i).toString()+"' or ");
                        }
                        String orString = sb.substring(0,sb.length()-3);
                        String sql = "select distinct * from users as u INNER  join role_user as ru on ru.username = u.username where "+orString;
                        List<User> userList = userService.findByDataSQL(sql);
                        for (User user:userList){
                            if (user.getDeleteFlag()!=-1)
                                phoneSet.add(user.getPhone());
                        }
                        if (jso.has("due_message")) {
                            String due_message = jso.get("due_message").toString();
                            //流水号
                            if (jso.has("sn")) {
                                sn = jso.get("sn").toString();
                                //ToDO： 统一替换流水号模板
                                due_message = due_message.replace("{{sn}}",sn);
                            }
                            //根据业务处理模板内容,只替换流水号的不进行此操作
                            if (related_table.equals("wy")) {
                                //ToDo:  替换短信模板业务数据
                                //物业报修
                                String sqlWY = "select * from user_repair where serialNumber='"+sn+"'";
                                List<UserRepair> userRepair = userRepairService.findByDataSQL(sqlWY);
                                if (userRepair.size()==0){
                                    throw new Exception("can't find repair WY_data.");
                                }
//                                if (userRepair.get(0).getAppointDate()!=null){
//                                    //throw new Exception("needn't send message.");
//                                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy年MM月dd日 HH时mm分后");
//                                    String apdate = sdf.format(userRepair.get(0).getAppointDate());
//                                    due_message = due_message.replace("{{appointDate}}", apdate);
//                                }
//                                else{
//                                    due_message = due_message.replace("{{appointDate}}", "");
//                                }
                                due_message = due_message.replace("{{company}}", userRepair.get(0).getCompany());
                                due_message = due_message.replace("{{content}}", "物业");
                            }else if (related_table.equals("it")) {
                                //ToDo:  替换短信模板业务数据
                                //IT报修
                                String sqlWY = "select * from user_repair where serialNumber='"+sn+"'";
                                List<UserRepair> userRepair = userRepairService.findByDataSQL(sqlWY);
                                if (userRepair.size()==0){
                                    throw new Exception("can't find repair IT_data.");
                                }
//                                if (userRepair.get(0).getAppointDate()!=null){
//                                    throw new Exception("needn't send message.");
//                                }
//                                else{
//                                    due_message = due_message.replace("{{appointDate}}", "");
//                                }
                                due_message = due_message.replace("{{company}}", userRepair.get(0).getCompany());
                                due_message = due_message.replace("{{content}}", "IT");
                            }else if (related_table.equals("enter_apply")){
                                //入驻申请
                                if (jso.has("task_user")) {
                                    due_message = due_message.replace("{{acceptman}}", jso.get("task_user").toString());
                                }
                            }else if (related_table.equals("user_classroom")){
                                //教室申请
                                if (jso.has("task_user")) {
                                    due_message = due_message.replace("{{acceptman}}", jso.get("task_user").toString());
                                }
                            }else if (related_table.equals("user_meetingroom")){
                                //会议室申请
                                if (jso.has("task_user")) {
                                    due_message = due_message.replace("{{acceptman}}", jso.get("task_user").toString());
                                }
                            }else if (related_table.equals("user_test_applyfor")){
                                //测试申请
                                if (jso.has("task_user")) {
                                    due_message = due_message.replace("{{acceptman}}", jso.get("task_user").toString());
                                }
                            }else if (related_table.equals("enterprist_cultivate")){
                                //企业培训申请
                                if (jso.has("task_user")) {
                                    due_message = due_message.replace("{{acceptman}}", jso.get("task_user").toString());
                                }
                            }else if (related_table.equals("user_copyright")){
                                //著作权申请
                                if (jso.has("task_user")) {
                                    due_message = due_message.replace("{{acceptman}}", jso.get("task_user").toString());
                                }
                            }else if (related_table.equals("user_advertisement")){
                                //广告申请
                                if (jso.has("task_user")) {
                                    due_message = due_message.replace("{{acceptman}}", jso.get("task_user").toString());
                                }
                            }else if (related_table.equals("user_headhunting")){
                                //猎聘申请
                                if (jso.has("task_user")) {
                                    due_message = due_message.replace("{{acceptman}}", jso.get("task_user").toString());
                                }
                            }
                            for (String phone:phoneSet){
                                SendToMessage(phone, due_message);
                            }

                        }
                    }
                }


            } catch (Exception e) {

            }
        } catch (UnsupportedEncodingException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }
}
