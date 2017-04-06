package com.wiseonline.Quartz;

import com.wiseonline.Domain.User;
import com.wiseonline.Domain.UserComment;
import com.wiseonline.Domain.UserRepair;
import com.wiseonline.Service.Impl.UserCommentServiceImpl;
import com.wiseonline.Service.Impl.UserRepairServiceImpl;
import com.wiseonline.Service.Impl.UserServiceImpl;
import com.wiseonline.Utils.ResponseFromUrl;
import org.json.JSONArray;
import org.json.JSONObject;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;

/**
 * Created by guhuinan on 2016-01-04.
 */
@Service("untreatedQuartz")
public class UntreatedQuartz extends QuartzJobBean {

    private String workflow_url;

    private String message_send;

    private String message_url;

    private String message_key;


    UserServiceImpl userService;

    public String getWorkflow_url() {
        return workflow_url;
    }

    public void setWorkflow_url(String workflow_url) {
        this.workflow_url = workflow_url;
    }

    public String getMessage_send() {
        return message_send;
    }

    public void setMessage_send(String message_send) {
        this.message_send = message_send;
    }

    public String getMessage_url() {
        return message_url;
    }

    public void setMessage_url(String message_url) {
        this.message_url = message_url;
    }

    public String getMessage_key() {
        return message_key;
    }

    public void setMessage_key(String message_key) {
        this.message_key = message_key;
    }

    public UserServiceImpl getUserService() {
        return userService;
    }

    public void setUserService(UserServiceImpl userService) {
        this.userService = userService;
    }

    public void work() throws IOException {
        String resultString = ResponseFromUrl.GetResult(workflow_url + "/workflow/api/get_unaccept_list" );
        JSONObject jso = new JSONObject(resultString);
        if (jso.has("data")) {
            String meta = jso.get("data").toString();
            System.out.println(meta);
            JSONArray jsonArray = new JSONArray(meta);
            for (int i = 0;i < jsonArray.length();i++) {
                String temp = jsonArray.get(i).toString();
                JSONObject jso2 = new JSONObject(temp);
                String count = "";
                String user = "";
                if (jso2.has("count")){
                    count = jso2.get("count").toString();
                }
                if (jso2.has("user")){
                    user = jso2.get("user").toString();
                }
                String sql = "select * from users where username = '"+user+"'";
                List<User> list = userService.findByDataSQL(sql);
                if (list != null){
                    for (User u : list){
                        if (u != null){
                            if (message_send.equals("on")){
                                if (u.getPhone() != "" && u.getDeleteFlag()!=-1){
                                    SendToMessage(u.getPhone(), "您有" + count + "条服务未处理，请及时处理。");
                                }
                            }
                        }
                    }
                }
            }
        }

    }

    @Override
    protected void executeInternal(JobExecutionContext arg0)
            throws JobExecutionException {
        try {
            System.out.println("开始自动处理未处理信息提醒");
            this.work();
            System.out.println("结束自动处理未处理信息提醒");
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
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
