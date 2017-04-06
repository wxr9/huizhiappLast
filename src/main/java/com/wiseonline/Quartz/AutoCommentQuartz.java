package com.wiseonline.Quartz;

import com.wiseonline.Domain.*;
import com.wiseonline.Service.Impl.*;
import com.wiseonline.Service.UserClassroomService;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

/*
 * Created by guhuinan on 2016-01-04.
*/

@Service("autoCommentQuartz")
public class AutoCommentQuartz extends QuartzJobBean {

    UserCommentServiceImpl userCommentService;

    UserAdvertisementServiceImpl userAdvertisementService;

    EnterpriseCultivateServiceImpl enterpriseCultivateService;

    EnterApplyServiceImpl enterApplyService;

    UserClassroomServiceImpl userClassroomService;

    UserCopyrightServiceImpl userCopyrightService;

    UserHeadhuntingServiceImpl userHeadhuntingService;

    UserMeetingroomServiceImpl userMeetingroomService;

    UserTestApplyforServiceImpl userTestApplyforService;

    MainBusinessServiceImpl mainBusinessService;


    public void work() throws IOException {
        this.userAdvertisement();
        this.enterpriseCultivate();
        this.enterApply();
        this.userClassroom();
        this.userCopyright();
        this.userHeadhunting();
        this.userMeetingroom();
        this.userTestApplyfor();
        this.userRepairIT();
        this.userRepairWY();
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

    /**
     * 广告自动评价
     * @return
     */
    private boolean userAdvertisement(){
        try {
            String advertisementSql = "SELECT a.objectid as objectid,a.serial_number AS serialNumber,a.username as userid,b.auto_comment_quality as quality,\n" +
                    "                   b.auto_comment_attitude as attitude,b.auto_comment_speed as duration,a.business_type businessType,NOW() as createTime,\n" +
                    "                    b.content as content,a.businessid as businessId\n" +
                    "                    FROM main_business a LEFT JOIN setting_auto_comment b ON b.type='commercialize'\n" +
                    "                     WHERE a.commentflag <> 2 AND DATE_ADD(a.complete_date ,INTERVAL b.auto_comment_deadline MINUTE) <= NOW() AND a.business_type = 'commercialize'";
            List<UserComment> userCommentList = userCommentService.findByDataSQL(advertisementSql);
            if (userCommentList != null) {
                for (int i = 0; i < userCommentList.size(); i++) {
                    UserComment userComment = userCommentList.get(i);
                    userComment.setObjectid(0);
                    String sql = "select * from main_business where business_type='commercialize' and businessid ="+userComment.getBusinessId();
                    List<MainBusiness> mainBusinessList = mainBusinessService.findByDataSQL(sql);
                    if (mainBusinessList != null) {
                        MainBusiness mainBusiness = mainBusinessList.get(0);
                        mainBusiness.setCommentFlag(2);
                        boolean rst = (userCommentService.save(userComment) && mainBusinessService.saveOrUpdate(mainBusiness));
                        if (rst) {
                            System.out.println("流水号：" + userComment.getSerialNumber() + "的业务于" + userComment.getCreateTime() + "进行了自动评价！");
                        } else {
                            System.out.println("流水号：" + userComment.getSerialNumber() + "的业务自动评价失败！");
                        }
                    }
                }
            }
            return true;
        }catch (Exception e){
            return false;
        }
    }
    /**
     * 入驻申请自动评价
     * @return
     */
    private boolean enterApply(){
        try {
            String advertisementSql = "SELECT a.objectid as objectid,a.serial_number AS serialNumber,a.username as userid,b.auto_comment_quality as quality,\n" +
                    "                   b.auto_comment_attitude as attitude,b.auto_comment_speed as duration,a.business_type as businessType,NOW() as createTime,\n" +
                    "                    b.content as content,a.businessid as businessId\n" +
                    "                    FROM main_business a LEFT JOIN setting_auto_comment b ON b.type='enterApply'\n" +
                    "                     WHERE a.commentflag <> 2 AND DATE_ADD(a.complete_date ,INTERVAL b.auto_comment_deadline MINUTE) <= NOW() AND a.business_type = 'enterApply'";
            List<UserComment> userCommentList = userCommentService.findByDataSQL(advertisementSql);
            if (userCommentList != null) {
                for (int i = 0; i < userCommentList.size(); i++) {
                    UserComment userComment = userCommentList.get(i);
                    userComment.setObjectid(0);
                    String sql = "select * from main_business where business_type='enterApply' and businessid ="+userComment.getBusinessId();
                    List<MainBusiness> mainBusinessList = mainBusinessService.findByDataSQL(sql);
                    if (mainBusinessList != null) {
                        MainBusiness mainBusiness = mainBusinessList.get(0);
                        mainBusiness.setCommentFlag(2);
                        boolean rst = (userCommentService.save(userComment) && mainBusinessService.saveOrUpdate(mainBusiness));
                        if (rst) {
                            System.out.println("流水号：" + userComment.getSerialNumber() + "的业务于" + userComment.getCreateTime() + "进行了自动评价！");
                        } else {
                            System.out.println("流水号：" + userComment.getSerialNumber() + "的业务自动评价失败！");
                        }
                    }
                }
            }
            return true;
        }catch (Exception e){
            return false;
        }
    }

    /**
     * 企业培训自动评价
     * @return
     */
    private boolean enterpriseCultivate(){
        try {
            String advertisementSql = "SELECT a.objectid as objectid,a.serial_number AS serialNumber,a.username as userid,b.auto_comment_quality as quality,\n" +
                    "                   b.auto_comment_attitude as attitude,b.auto_comment_speed as duration,a.business_type as businessType,NOW() as createTime,\n" +
                    "                    b.content as content,a.businessid as businessId\n" +
                    "                    FROM main_business a LEFT JOIN setting_auto_comment b ON b.type='enterpriseCultivate'\n" +
                    "                     WHERE a.commentflag <> 2 AND DATE_ADD(a.complete_date ,INTERVAL b.auto_comment_deadline MINUTE) <= NOW() AND a.business_type = 'enterpriseCultivate'";
            List<UserComment> userCommentList = userCommentService.findByDataSQL(advertisementSql);
            if (userCommentList != null) {
                for (int i = 0; i < userCommentList.size(); i++) {
                    UserComment userComment = userCommentList.get(i);
                    userComment.setObjectid(0);
                    String sql = "select * from main_business where business_type='enterpriseCultivate' and businessid ="+userComment.getBusinessId();
                    List<MainBusiness> mainBusinessList = mainBusinessService.findByDataSQL(sql);
                    if (mainBusinessList != null) {
                        MainBusiness mainBusiness = mainBusinessList.get(0);
                        mainBusiness.setCommentFlag(2);
                        boolean rst = (userCommentService.save(userComment) && mainBusinessService.saveOrUpdate(mainBusiness));
                        if (rst) {
                            System.out.println("流水号：" + userComment.getSerialNumber() + "的业务于" + userComment.getCreateTime() + "进行了自动评价！");
                        } else {
                            System.out.println("流水号：" + userComment.getSerialNumber() + "的业务自动评价失败！");
                        }
                    }
                }
            }
            return true;
        }catch (Exception e){
            return false;
        }
    }

    /**
     * 教室申请自动评价
     * @return
     */
    private boolean userClassroom(){
        try {
            String advertisementSql = "SELECT a.objectid as objectid,a.serial_number AS serialNumber,a.username as userid,b.auto_comment_quality as quality,\n" +
                    "                   b.auto_comment_attitude as attitude,b.auto_comment_speed as duration,a.business_type as businessType,NOW() as createTime,\n" +
                    "                    b.content as content,a.businessid as businessId\n" +
                    "                    FROM main_business a LEFT JOIN setting_auto_comment b ON b.type='classroom'\n" +
                    "                     WHERE a.commentflag <> 2 AND DATE_ADD(a.complete_date ,INTERVAL b.auto_comment_deadline MINUTE) <= NOW() AND a.business_type = 'userClassroom'";
            List<UserComment> userCommentList = userCommentService.findByDataSQL(advertisementSql);
            if (userCommentList != null) {
                for (int i = 0; i < userCommentList.size(); i++) {
                    UserComment userComment = userCommentList.get(i);
                    userComment.setObjectid(0);
                    String sql = "select * from main_business where business_type='userClassroom' and businessid ="+userComment.getBusinessId();
                    List<MainBusiness> mainBusinessList = mainBusinessService.findByDataSQL(sql);
                    if (mainBusinessList != null) {
                        MainBusiness mainBusiness = mainBusinessList.get(0);
                        mainBusiness.setCommentFlag(2);
                        boolean rst = (userCommentService.save(userComment) && mainBusinessService.saveOrUpdate(mainBusiness));
                        if (rst) {
                            System.out.println("流水号：" + userComment.getSerialNumber() + "的业务于" + userComment.getCreateTime() + "进行了自动评价！");
                        } else {
                            System.out.println("流水号：" + userComment.getSerialNumber() + "的业务自动评价失败！");
                        }
                    }
                }
            }
            return true;
        }catch (Exception e){
            return false;
        }
    }

    /**
     * 版权自动评价
     * @return
     */
    private boolean userCopyright(){
        try {
            String advertisementSql = "SELECT a.objectid as objectid,a.serial_number AS serialNumber,a.username as userid,b.auto_comment_quality as quality,\n" +
                    "                   b.auto_comment_attitude as attitude,b.auto_comment_speed as duration,a.business_type as businessType,NOW() as createTime,\n" +
                    "                    b.content as content,a.businessid as businessId\n" +
                    "                    FROM main_business a LEFT JOIN setting_auto_comment b ON b.type='copyright'\n" +
                    "                     WHERE a.commentflag <> 2 AND DATE_ADD(a.complete_date ,INTERVAL b.auto_comment_deadline MINUTE) <= NOW() AND a.business_type = 'userCopyright'";
            List<UserComment> userCommentList = userCommentService.findByDataSQL(advertisementSql);
            if (userCommentList != null) {
                for (int i = 0; i < userCommentList.size(); i++) {
                    UserComment userComment = userCommentList.get(i);
                    userComment.setObjectid(0);
                    String sql = "select * from main_business where business_type='userCopyright' and businessid ="+userComment.getBusinessId();
                    List<MainBusiness> mainBusinessList = mainBusinessService.findByDataSQL(sql);
                    if (mainBusinessList != null) {
                        MainBusiness mainBusiness = mainBusinessList.get(0);
                        mainBusiness.setCommentFlag(2);
                        boolean rst = (userCommentService.save(userComment) && mainBusinessService.saveOrUpdate(mainBusiness));
                        if (rst) {
                            System.out.println("流水号：" + userComment.getSerialNumber() + "的业务于" + userComment.getCreateTime() + "进行了自动评价！");
                        } else {
                            System.out.println("流水号：" + userComment.getSerialNumber() + "的业务自动评价失败！");
                        }
                    }
                }
            }
            return true;
        }catch (Exception e){
            return false;
        }
    }

    /**
     * 猎聘自动评价
     * @return
     */
    private boolean userHeadhunting(){
        try {
            String advertisementSql = "SELECT a.objectid as objectid,a.serial_number AS serialNumber,a.username as userid,b.auto_comment_quality as quality,\n" +
                    "                   b.auto_comment_attitude as attitude,b.auto_comment_speed as duration,a.business_type as businessType,NOW() as createTime,\n" +
                    "                    b.content as content,a.businessid as businessId\n" +
                    "                    FROM main_business a LEFT JOIN setting_auto_comment b ON b.type='headhunting'\n" +
                    "                     WHERE a.commentflag <> 2 AND DATE_ADD(a.complete_date ,INTERVAL b.auto_comment_deadline MINUTE) <= NOW() AND a.business_type = 'userHeadhunting'";
            List<UserComment> userCommentList = userCommentService.findByDataSQL(advertisementSql);
            if (userCommentList != null) {
                for (int i = 0; i < userCommentList.size(); i++) {
                    UserComment userComment = userCommentList.get(i);
                    userComment.setObjectid(0);
                    String sql = "select * from main_business where business_type='userHeadhunting' and businessid ="+userComment.getBusinessId();
                    List<MainBusiness> mainBusinessList = mainBusinessService.findByDataSQL(sql);
                    if (mainBusinessList != null) {
                        MainBusiness mainBusiness = mainBusinessList.get(0);
                        mainBusiness.setCommentFlag(2);
                        boolean rst = (userCommentService.save(userComment) && mainBusinessService.update(mainBusiness));
                        if (rst) {
                            System.out.println("流水号：" + userComment.getSerialNumber() + "的业务于" + userComment.getCreateTime() + "进行了自动评价！");
                        } else {
                            System.out.println("流水号：" + userComment.getSerialNumber() + "的业务自动评价失败！");
                        }
                    }
                }
            }
            return true;
        }catch (Exception e){
            return false;
        }
    }

    /**
     * 会议室自动评价
     * @return
     */
    private boolean userMeetingroom(){
        try {
            String advertisementSql = "SELECT a.objectid as objectid,a.serial_number AS serialNumber,a.username as userid,b.auto_comment_quality as quality,\n" +
                    "                   b.auto_comment_attitude as attitude,b.auto_comment_speed as duration,a.business_type as businessType,NOW() as createTime,\n" +
                    "                    b.content as content,a.businessid as businessId\n" +
                    "                    FROM main_business a LEFT JOIN setting_auto_comment b ON b.type='meetingroom'\n" +
                    "                     WHERE a.commentflag <> 2 AND DATE_ADD(a.complete_date ,INTERVAL b.auto_comment_deadline MINUTE) <= NOW() AND a.business_type = 'userMeetingroom'";
            List<UserComment> userCommentList = userCommentService.findByDataSQL(advertisementSql);
            if (userCommentList != null) {
                for (int i = 0; i < userCommentList.size(); i++) {
                    UserComment userComment = userCommentList.get(i);
                    userComment.setObjectid(0);
                    String sql = "select * from main_business where business_type='userMeetingroom' and businessid ="+userComment.getBusinessId();
                    List<MainBusiness> mainBusinessList = mainBusinessService.findByDataSQL(sql);
                    if (mainBusinessList != null) {
                        MainBusiness mainBusiness = mainBusinessList.get(0);
                        mainBusiness.setCommentFlag(2);
                        boolean rst = (userCommentService.save(userComment) && mainBusinessService.saveOrUpdate(mainBusiness));
                        if (rst) {
                            System.out.println("流水号：" + userComment.getSerialNumber() + "的业务于" + userComment.getCreateTime() + "进行了自动评价！");
                        } else {
                            System.out.println("流水号：" + userComment.getSerialNumber() + "的业务自动评价失败！");
                        }
                    }
                }
            }
            return true;
        }catch (Exception e){
            return false;
        }
    }
    /**
     * 测试申请自动评价
     * @return
     */
    private boolean userTestApplyfor(){
        try {
            String advertisementSql = "SELECT a.objectid as objectid,a.serial_number AS serialNumber,a.username as userid,b.auto_comment_quality as quality,\n" +
                    "                   b.auto_comment_attitude as attitude,b.auto_comment_speed as duration,a.business_type as businessType,NOW() as createTime,\n" +
                    "                    b.content as content,a.businessid as businessId\n" +
                    "                    FROM main_business a LEFT JOIN setting_auto_comment b ON b.type='testApplyfor'\n" +
                    "                     WHERE a.commentflag <> 2 AND DATE_ADD(a.complete_date ,INTERVAL b.auto_comment_deadline MINUTE) <= NOW() AND a.business_type = 'userTestApplyfor'";
            List<UserComment> userCommentList = userCommentService.findByDataSQL(advertisementSql);
            if (userCommentList != null) {
                for (int i = 0; i < userCommentList.size(); i++) {
                    UserComment userComment = userCommentList.get(i);
                    userComment.setObjectid(0);
                    String sql = "select * from main_business where business_type='userTestApplyfor' and businessid ="+userComment.getBusinessId();
                    List<MainBusiness> mainBusinessList = mainBusinessService.findByDataSQL(sql);
                    if (mainBusinessList != null) {
                        MainBusiness mainBusiness = mainBusinessList.get(0);
                        mainBusiness.setCommentFlag(2);
                        boolean rst = (userCommentService.save(userComment) && mainBusinessService.saveOrUpdate(mainBusiness));
                        if (rst) {
                            System.out.println("流水号：" + userComment.getSerialNumber() + "的业务于" + userComment.getCreateTime() + "进行了自动评价！");
                        } else {
                            System.out.println("流水号：" + userComment.getSerialNumber() + "的业务自动评价失败！");
                        }
                    }
                }
            }
            return true;
        }catch (Exception e){
            return false;
        }
    }

    /**
     * 物业报修自动评价
     * @return
     */
    private boolean userRepairWY(){
        try {
            String advertisementSql = "SELECT a.objectid,a.serial_number as serialNumber,a.username as userid,b.autoComment_Info as content,b.autoComment_Speed as duration,\n" +
                    "                b.autoComment_Attitude as attitude,b.autoComment_Quality as quality,a.business_type as businessType,NOW() as createTime,a.businessid as businessId\n" +
                    "                FROM main_business a LEFT JOIN setting_repair b ON b.repairType = 1\n" +
                    "                WHERE a.commentflag <> 2 AND DATE_ADD(a.complete_date ,INTERVAL b.autoComment_Deadline MINUTE) <= NOW() AND a.business_type = 'WY'";
            List<UserComment> userCommentList = userCommentService.findByDataSQL(advertisementSql);
            if (userCommentList != null) {
                for (int i = 0; i < userCommentList.size(); i++) {
                    UserComment userComment = userCommentList.get(i);
                    userComment.setObjectid(0);
                    String sql = "select * from main_business where business_type='WY' and businessid ="+userComment.getBusinessId();
                    List<MainBusiness> mainBusinessList = mainBusinessService.findByDataSQL(sql);
                    if (mainBusinessList != null) {
                        MainBusiness mainBusiness = mainBusinessList.get(0);
                        mainBusiness.setCommentFlag(2);
                        boolean rst = (userCommentService.save(userComment) && mainBusinessService.saveOrUpdate(mainBusiness));
                        if (rst) {
                            System.out.println("流水号：" + userComment.getSerialNumber() + "的业务于" + userComment.getCreateTime() + "进行了自动评价！");
                        } else {
                            System.out.println("流水号：" + userComment.getSerialNumber() + "的业务自动评价失败！");
                        }
                    }
                }
            }
            return true;
        }catch (Exception e){
            return false;
        }
    }
    /**
     * IT报修自动评价
     * @return
     */
    private boolean userRepairIT(){
        try {
            String advertisementSql = "SELECT a.objectid,a.serial_number as serialNumber,a.username as userid,b.autoComment_Info as content,b.autoComment_Speed as duration,\n" +
                    "                b.autoComment_Attitude as attitude,b.autoComment_Quality as quality,a.business_type as businessType,NOW() as createTime,a.businessid as businessId\n" +
                    "                FROM main_business a LEFT JOIN setting_repair b ON b.repairType = 2\n" +
                    "                WHERE a.commentflag <> 2 AND DATE_ADD(a.complete_date ,INTERVAL b.autoComment_Deadline MINUTE) <= NOW() AND a.business_type = 'IT'";
            List<UserComment> userCommentList = userCommentService.findByDataSQL(advertisementSql);
            if (userCommentList != null) {
                for (int i = 0; i < userCommentList.size(); i++) {
                    UserComment userComment = userCommentList.get(i);
                    userComment.setObjectid(0);
                    String sql = "select * from main_business where business_type='IT' and businessid ="+userComment.getBusinessId();
                    List<MainBusiness> mainBusinessList = mainBusinessService.findByDataSQL(sql);
                    if (mainBusinessList != null) {
                        MainBusiness mainBusiness = mainBusinessList.get(0);
                        mainBusiness.setCommentFlag(2);
                        boolean rst = (userCommentService.save(userComment) && mainBusinessService.saveOrUpdate(mainBusiness));
                        if (rst) {
                            System.out.println("流水号：" + userComment.getSerialNumber() + "的业务于" + userComment.getCreateTime() + "进行了自动评价！");
                        } else {
                            System.out.println("流水号：" + userComment.getSerialNumber() + "的业务自动评价失败！");
                        }
                    }
                }
            }
            return true;
        }catch (Exception e){
            return false;
        }
    }
    public void setUserCommentService(UserCommentServiceImpl userCommentService) {
        this.userCommentService = userCommentService;
    }

    public void setUserAdvertisementService(UserAdvertisementServiceImpl userAdvertisementService) {
        this.userAdvertisementService = userAdvertisementService;
    }

    public void setEnterpriseCultivateService(EnterpriseCultivateServiceImpl enterpriseCultivateService) {
        this.enterpriseCultivateService = enterpriseCultivateService;
    }

    public void setEnterApplyService(EnterApplyServiceImpl enterApplyService) {
        this.enterApplyService = enterApplyService;
    }

    public void setUserClassroomService(UserClassroomServiceImpl userClassroomService) {
        this.userClassroomService = userClassroomService;
    }

    public void setUserCopyrightService(UserCopyrightServiceImpl userCopyrightService) {
        this.userCopyrightService = userCopyrightService;
    }

    public void setUserHeadhuntingService(UserHeadhuntingServiceImpl userHeadhuntingService) {
        this.userHeadhuntingService = userHeadhuntingService;
    }

    public void setUserMeetingroomService(UserMeetingroomServiceImpl userMeetingroomService) {
        this.userMeetingroomService = userMeetingroomService;
    }

    public void setUserTestApplyforService(UserTestApplyforServiceImpl userTestApplyforService) {
        this.userTestApplyforService = userTestApplyforService;
    }

    public void setMainBusinessService(MainBusinessServiceImpl mainBusinessService) {
        this.mainBusinessService = mainBusinessService;
    }
}
