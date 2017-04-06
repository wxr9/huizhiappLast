package com.wiseonline.Quartz;


import com.wiseonline.Dao.BaseDao;
import com.wiseonline.Domain.JSJtoken;
import com.wiseonline.Domain.Role;
import com.wiseonline.Domain.User;
import com.wiseonline.Domain.UserIncubator;
import com.wiseonline.Service.Impl.RoleServiceImpl;
import com.wiseonline.Service.Impl.UserIncubatorServiceImpl;
import com.wiseonline.Service.UserService;
import com.wiseonline.Utils.PageResult;
import com.wiseonline.Utils.ResponseFromUrl;
import com.wiseonline.Utils.SendMessageValue;
import com.wiseonline.Utils.WorkFlowUtils;
import org.json.JSONObject;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * Created by kelsey on 2016-4-11.
 */
@Service("enterpriseRegisterQuartz")
public class EnterpriseRegisterQuartz extends QuartzJobBean {
    UserIncubatorServiceImpl userIncubatorService;

    UserService userService;

    WorkFlowUtils workFlowUtils;

    public void work() throws IOException {
        Calendar cal = Calendar.getInstance();
        cal.setTime(new Date());
        int year = cal.get(Calendar.YEAR);//获取年份
        int month = cal.get(Calendar.MONTH)+1;//获取月份
        int day = cal.get(Calendar.DATE);//获取日
        String sql = "select * from user_incubator where deleteflag=1 and appointment_date = '" + year + "-" + month + "-" + (day + 1) + "'";
        List<UserIncubator> userIncubatorList = userIncubatorService.findByDataSQL(sql);

        String sql2 = "select * from users u left join role_user r on r.username=u.username where r.rolename='IncubatorAdmin'";
        List<User> uList = userService.findByDataSQL(sql2);
        if (userIncubatorList.size()>0){
            for (User user:uList){
                if (user.getPhone()!=null){
                    workFlowUtils.SendToMessage(user.getPhone(),"您明天将有"+userIncubatorList.size()+"个孵化注册预约，详情请前往汇智e站查看。");
                }
            }
        }
        //return result;
    }

    @Override
    protected void executeInternal(JobExecutionContext arg0)
            throws JobExecutionException {
        try {
            System.out.println("begin1 auto job");
            this.work();
            System.out.println("begin auto job");
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    public UserIncubatorServiceImpl getUserIncubatorService() {
        return userIncubatorService;
    }

    public void setUserIncubatorService(UserIncubatorServiceImpl userIncubatorService) {
        this.userIncubatorService = userIncubatorService;
    }

    public UserService getUserService() {
        return userService;
    }

    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    public WorkFlowUtils getWorkFlowUtils() {
        return workFlowUtils;
    }

    public void setWorkFlowUtils(WorkFlowUtils workFlowUtils) {
        this.workFlowUtils = workFlowUtils;
    }
}
