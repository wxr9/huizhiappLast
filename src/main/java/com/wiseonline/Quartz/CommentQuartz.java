package com.wiseonline.Quartz;

import com.wiseonline.Domain.UserComment;
import com.wiseonline.Domain.UserRepair;
import com.wiseonline.Service.Impl.UserCommentServiceImpl;
import com.wiseonline.Service.Impl.UserRepairServiceImpl;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

/**
 * Created by guhuinan on 2016-01-04.
 */
@Service("commentQuartz")
public class CommentQuartz extends QuartzJobBean {

    UserCommentServiceImpl userCommentService;

    UserRepairServiceImpl userRepairService;

    public void setUserCommentService(UserCommentServiceImpl userCommentService) {
        this.userCommentService = userCommentService;
    }

    public void setUserRepairService(UserRepairServiceImpl userRepairService) {
        this.userRepairService = userRepairService;
    }

    public void work() throws IOException {
       /* String sql = "SELECT a.objectid,a.serialNumber,a.applicant as userid,b.autoComment_Info as content,b.autoComment_Speed as duration,\n" +
                "b.autoComment_Attitude as attitude,b.autoComment_Quality as quality,a.typeId as commentType,NOW() as createTime,a.objectid as repairId\n" +
                "FROM user_repair a LEFT JOIN setting_repair b ON a.typeId = b.repairType\n" +
                "WHERE a.commentflag <> 2 AND DATE_ADD(a.completeDate ,INTERVAL b.autoComment_Deadline MINUTE) <= NOW() ORDER BY a.typeId";
        List<UserComment> userCommentList = userCommentService.findByDataSQL(sql);
        if (userCommentList != null){
            for (int i = 0 ; i < userCommentList.size();i++){
                UserComment userComment = userCommentList.get(i);
                *//*userComment.setRepairId(userCommentList.get(i).getRepairDetail().getObjectid());*//*
                userComment.setObjectid(0);

                UserRepair userRepair = userRepairService.getbyId(userComment.getBusinessId());
                userRepair.setCommentFlag(2);

                boolean rst = (userCommentService.save(userComment) && userRepairService.save(userRepair));
                if (rst) {
                    System.out.println("流水号：" + userComment.getSerialNumber() + "的业务于"+ userComment.getCreateTime() + "进行了自动评价！");
                }else {
                    System.out.println("流水号：" + userComment.getSerialNumber() + "的业务自动评价失败！");
                }
            }
        }*/
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
}
