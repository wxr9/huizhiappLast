package com.wiseonline.Utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.*;
import com.wiseonline.Service.Impl.*;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by yanwj on 2016/3/23.
 */
@Service("workFlowUtils")
public class WorkFlowUtils extends BaseController {

    @Value("#{configProperties['WorkFlow.Url']}")
    private String workflow_url;

    @Value("#{configProperties['Message.Send']}")
    private String message_send;
    @Autowired
    UserRepairServiceImpl userRepairService;
    @Autowired
    UserServiceImpl userService;
    @Autowired
    SettingRepairAutoConfigServiceImpl settingRepairAutoConfigService;
    @Autowired
    UserRepairAssignServiceImpl userRepairAssignService;
    @Autowired
    NotificationServiceImpl notificationService;
    @Autowired
    EnterpriseCultivateServiceImpl enterpriseCultivateService;
    @Autowired
    UserAdvertisementServiceImpl userAdvertisementService;
    @Autowired
    UserCopyrightServiceImpl userCopyrightService;
    @Autowired
    UserHeadhuntingServiceImpl userHeadhuntingService;
    @Autowired
    UserClassroomServiceImpl userClassroomService;
    @Autowired
    UserMeetingroomServiceImpl userMeetingroomService;
    @Autowired
    UserMeetingroomApplyServiceImpl userMeetingroomApplyService;
    @Autowired
    UserMeetingroomVerifyServiceImpl userMeetingroomVerifyService;
    @Autowired
    UserClassroomApplyServiceImpl userClassroomApplyService;
    @Autowired
    UserClassroomVerifyServiceImpl userClassroomVerifyService;
    @Autowired
    EnterApplyServiceImpl enterApplyService;
    @Autowired
    UserTestApplyforServiceImpl userTestApplyforService;
    @Autowired
    MainBusinessServiceImpl mainBusinessService;

    /***
     * 新增业务
     *
     * @param id
     * @return
     * @throws MyException
     */
    public CreateDomain Create(int id) throws MyException {
        String resultString = "";
        try {
            resultString = ResponseFromUrl.GetResult(workflow_url + "/workflow/api/create/" + id);
        } catch (Exception e) {
            throw new MyException("工作流新增业务接口异常！");
        }
        return translateCreate(resultString);
    }

    /**
     * 解析create业务返回模型
     *
     * @param resultString
     * @return
     */
    private CreateDomain translateCreate(String resultString) {
        JSONObject jso = new JSONObject(resultString);
        CreateDomain createDomain = new CreateDomain();
        if (jso.has("is_grab")) {
            createDomain.setIs_grab(jso.get("is_grab").toString());
        }
        if (jso.has("process")) {
            createDomain.setProcess(jso.get("process").toString());
        }
        if (jso.has("related_table")) {
            createDomain.setRelated_table(jso.get("related_table").toString());
        }
        if (jso.has("task_id")) {
            createDomain.setTask_id(jso.get("task_id").toString());
        }
        if (jso.has("task_user")) {
            createDomain.setTask_user(jso.get("task_user").toString());
        }
        if (jso.has("view")) {
            createDomain.setView(jso.get("view").toString());
        }
        return createDomain;
    }

    /***
     * 执行流转(新建流程)
     * 选择去向和下一步执行者之后的保存事件.
     *
     * @return
     * @throws MyException
     */
    public ResultMessage NewTransfer(CreateDomain createDomain, String sn, int identity_field_value, String type) throws MyException, ParseException {
        String creator = getUserName();
        String currentuser = getUserName();
        String process_id = createDomain.getProcess();
        String related_table = createDomain.getRelated_table();
        String task_id = createDomain.getTask_id();
        String task_user = createDomain.getTask_user();
        StringBuffer sb = new StringBuffer();
        String rolenameArray = task_user.replace(",","','");

        String sql2 = "SELECT distinct u.* FROM users as u LEFT JOIN role_user as ru on ru.username = u.username WHERE u.deleteflag = 1 and ru.rolename in ('" + rolenameArray + "')";
        List<User> userList = userService.findByDataSQL(sql2);
        if (userList != null) {
            if (0 < userList.size()) {
                for (int i = 0; i < userList.size(); i++) {
                    sb.append(userList.get(i).getUsername() + ",");
                }
            } else {
                sb.append("admin,");
            }
        } else {
            sb.append("admin,");
        }

        String param = "{\"creator\":\"" + creator + "\",\"currentuser\":\"" + currentuser + "\",\"identity_field_value\":\"" +
                identity_field_value + "\",\"process_id\":\"" + process_id + "\",\"related_table\":\"" + related_table + "\",\"sn\":\"" +
                sn + "\",\"title\":\"" + sn + "\",\"task_id\":\"" + task_id + "\",\"task_user\":\"" + sb.toString() + "\"}";
        String resultString = "";
        if (currentuser != null) {
            try {
                resultString = ResponseFromUrl.postJsonReturnResult(workflow_url + "/workflow/api/transfer", param);
            } catch (Exception e) {
                throw new MyException(ConstClass.WorkFlowError);
            }
        } else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
        JSONObject jsonObject = new JSONObject(resultString);
        String flag = UTF2GBK.unicodeToUtf8(jsonObject.get("related_table").toString());
        if (flag.equals("user_advertisement")) {
            //广告服务
            UserAdvertisement tempMode = userAdvertisementService.getbyId(identity_field_value);
            //String createDate = tempMode.getCreateDate().toString();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//小写的mm表示的是分钟
            Date date = tempMode.getCreateDate();
            String applicationTime = sdf.format(new Date(date.getTime() + 1 * 24 * 60 * 60 * 1000));
            String hasComplate = "0";
            try {
                hasComplate = sendMessage(resultString, tempMode.getUsername(), task_user, applicationTime,
                        task_user, "", "", String.valueOf(tempMode.getBeginDate()), String.valueOf(tempMode.getEndDate()), "", tempMode.getCompany(), "", tempMode.getSerialNumber(), "", "","");
            } catch (Exception e) {
                throw new MyException("流程已流转，短信发送失败！");
            }
        } else if (flag.equals("enterprist_cultivate")) {
            //企业培训
            EnterpriseCultivate tempMode = enterpriseCultivateService.getbyId(identity_field_value);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//小写的mm表示的是分钟
            Date date = tempMode.getCreateDate();
            String applicationTime = sdf.format(new Date(date.getTime() + 1 * 24 * 60 * 60 * 1000));
            String hasComplate = "0";
            try {
                hasComplate = sendMessage(resultString, tempMode.getUsername(), task_user, applicationTime,
                        task_user, "", "", "", "", "", tempMode.getCompany(), "", tempMode.getSerialNumber(), "", "","");
            } catch (Exception e) {
                throw new MyException("流程已流转，短信发送失败！");
            }
        } else if (flag.equals("user_headhunting")) {
            //猎聘申请
            UserHeadhunting tempMode = userHeadhuntingService.getbyId(identity_field_value);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//小写的mm表示的是分钟
            Date date = tempMode.getCreateDate();
            String applicationTime = sdf.format(new Date(date.getTime() + 1 * 24 * 60 * 60 * 1000));
            String hasComplate = "0";
            try {
                hasComplate = sendMessage(resultString, tempMode.getUsername(), task_user, applicationTime,
                        task_user, "", "", "", "", "", tempMode.getCompany(), "", tempMode.getSerialNumber(), "", "","");
            } catch (Exception e) {
                throw new MyException("流程已流转，短信发送失败！");
            }
        } else if (flag.equals("user_classroom")) {
            //教室预定
            UserClassroom tempMode = userClassroomService.getbyId(identity_field_value);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//小写的mm表示的是分钟
            Date date = tempMode.getCreateDate();
            String applicationTime = sdf.format(new Date(date.getTime() + 1 * 24 * 60 * 60 * 1000));
            String hasComplate = "0";

            //获取教室名称
            String sql = "select * from user_classroom_apply where user_classroom_id = " + identity_field_value;
            List<UserClassroomApply> list = userClassroomApplyService.findByDataSQL(sql);
            String classroom = "";
            if (list != null) {
                if (0 < list.size()) {
                    classroom = list.get(0).getClassroom().getName();
                }
            }
            try {
                hasComplate = sendMessage(resultString, tempMode.getUsername(), task_user, applicationTime,
                        task_user, classroom, "", "", "", "", tempMode.getCompany(), "", tempMode.getSerialNumber(), "", "","");
            } catch (Exception e) {
                throw new MyException("流程已流转，短信发送失败！");
            }
        } else if (flag.equals("user_meetingroom")) {
            //会议室预定
            UserMeetingroom tempMode = userMeetingroomService.getbyId(identity_field_value);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//小写的mm表示的是分钟
            Date date = tempMode.getCreateDate();
            String applicationTime = sdf.format(new Date(date.getTime() + 1 * 24 * 60 * 60 * 1000));
            String hasComplate = "0";
            //获取会议室名称
            String sql = "select * from user_meetingroom_apply where user_meetingroom_id = " + identity_field_value;
            List<UserMeetingroomApply> list = userMeetingroomApplyService.findByDataSQL(sql);
            String meetingroom = "";
            if (list != null) {
                if (0 < list.size()) {
                    meetingroom = list.get(0).getMettingroom().getName();
                }
            }
            try {
                hasComplate = sendMessage(resultString, tempMode.getUsername(), task_user, applicationTime,
                        task_user, meetingroom, "", "", "", "", tempMode.getCompany(), "", tempMode.getSerialNumber(), "", "","");
            } catch (Exception e) {
                throw new MyException("流程已流转，短信发送失败！");
            }
        } else if (flag.equals("user_test_applyfor")) {
            //测试申请
            UserTestApplyfor tempMode = userTestApplyforService.getbyId(identity_field_value);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//小写的mm表示的是分钟
            Date date = tempMode.getCreateDate();
            String applicationTime = sdf.format(new Date(date.getTime() + 1 * 24 * 60 * 60 * 1000));
            String hasComplate = "0";
            try {
                hasComplate = sendMessage(resultString, tempMode.getUsername(), task_user, applicationTime,
                        task_user, "", "", "", "", "", tempMode.getCompany(), "", tempMode.getSerialNumber(), "", "","");
            } catch (Exception e) {
                throw new MyException("流程已流转，短信发送失败！");
            }
        } else if (flag.equals("user_copyright")) {
            //著作权登记
            UserCopyright tempMode = userCopyrightService.getbyId(identity_field_value);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//小写的mm表示的是分钟
            Date date = tempMode.getCreateDate();
            String applicationTime = sdf.format(new Date(date.getTime() + 1 * 24 * 60 * 60 * 1000));
            String hasComplate = "0";
            try {
                hasComplate = sendMessage(resultString, tempMode.getUsername(), task_user, applicationTime,
                        task_user, "", "", "", "", "", tempMode.getCompany(), "", tempMode.getSerialNumber(), "", "","");
            } catch (Exception e) {
                throw new MyException("流程已流转，短信发送失败！");
            }
        } else if (flag.equals("enter_apply")) {
            //入驻申请
            EnterApply tempMode = enterApplyService.getbyId(identity_field_value);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//小写的mm表示的是分钟
            Date date = tempMode.getCreateDate();
            String applicationTime = sdf.format(new Date(date.getTime() + 1 * 24 * 60 * 60 * 1000));
            String hasComplate = "0";
            try {
                hasComplate = sendMessage(resultString, tempMode.getUsername(), task_user, applicationTime,
                        task_user, "", "", "", "", "", tempMode.getCompany(), "", tempMode.getSerialNumber(), "", "","");
            } catch (Exception e) {
                throw new MyException("流程已流转，短信发送失败！");
            }
        }
        return Msg(true, "操作成功");
    }


    /**
     * 执行流转
     *
     * @param request
     * @return
     * @throws MyException
     * @throws UnsupportedEncodingException
     * @throws ParseException
     */
    public String HadTransfer(HttpServletRequest request, String workflow_urls) throws MyException, UnsupportedEncodingException, ParseException {
        String currenttask = request.getParameter("currenttask");
        String currentuser = getUserName();
        String id = request.getParameter("id");
        String process_id = request.getParameter("process_id");
        String title = request.getParameter("title");
        String task_id = request.getParameter("task_id");
        String task_user = request.getParameter("task_user");
        int identity_field_value = Integer.parseInt(request.getParameter("identity_field_value"));
        String result = "";
        String param = "{\"currenttask\":\"" + currenttask + "\",\"currentuser\":\"" + currentuser + "\",\"id\":\"" +
                id + "\",\"process_id\":\"" + process_id + "\",\"task_id\":\"" + task_id + "\",\"task_user\":\"" + task_user + "\"}";
        result = ResponseFromUrl.postJsonToBack(workflow_urls + "/workflow/api/transfer", param);
        JSONObject jsonObject = new JSONObject(result);
        String flag = UTF2GBK.unicodeToUtf8(jsonObject.get("related_table").toString());
        if (flag.equals("user_advertisement")) {
            //广告服务
            UserAdvertisement tempMode = userAdvertisementService.getbyId(identity_field_value);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//小写的mm表示的是分钟
            String applicationTime = sdf.format(new Date(tempMode.getCreateDate().getTime() + 1 * 24 * 60 * 60 * 1000));
            String hasComplate = "0";
            try {
                hasComplate = sendMessage(result, tempMode.getUsername(), task_user, applicationTime,
                        task_user, "", "", String.valueOf(tempMode.getBeginDate()), String.valueOf(tempMode.getEndDate()), "", tempMode.getCompany(), "", tempMode.getSerialNumber(), "", "","");
            } catch (Exception e) {
                throw new MyException("流程已流转，短信发送失败！");
            }
            if (hasComplate.equals("1")) {
                String sql = "select * from main_business where business_type='commercialize' and businessid =" + tempMode.getObjectid();
                List<MainBusiness> mainBusinessList = mainBusinessService.findByDataSQL(sql);
                if (mainBusinessList != null) {
                    MainBusiness mainBusiness = mainBusinessList.get(0);
                    mainBusiness.setCompleteDate(new Date());
                    mainBusinessService.update(mainBusiness);
                }
            }
        } else if (flag.equals("enterprist_cultivate")) {
            //企业培训
            EnterpriseCultivate tempMode = enterpriseCultivateService.getbyId(identity_field_value);
            String hasComplate = "0";
            hasComplate = sendMessage(result, tempMode.getUsername(), task_user, "",
                    task_user, "", "", "", "", "", tempMode.getCompany(), "", tempMode.getSerialNumber(), "", "","");
            if (hasComplate.equals("1")) {
                String sql = "select * from main_business where business_type='enterpriseCultivate' and businessid =" + tempMode.getObjectid();
                List<MainBusiness> mainBusinessList = mainBusinessService.findByDataSQL(sql);
                if (mainBusinessList != null) {
                    MainBusiness mainBusiness = mainBusinessList.get(0);
                    mainBusiness.setCompleteDate(new Date());
                    mainBusinessService.update(mainBusiness);
                }
            }
        } else if (flag.equals("user_headhunting")) {
            //猎聘申请
            UserHeadhunting tempMode = userHeadhuntingService.getbyId(identity_field_value);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//小写的mm表示的是分钟
            //String applicationTime = sdf.format(new Date(tempMode.getCreateDate().getTime() + 1 * 24 * 60 * 60 * 1000));
            String hasComplate = "0";
                hasComplate = sendMessage(result, tempMode.getUsername(), task_user, "",
                        task_user, "", "", "", "", "", tempMode.getCompany(), "", tempMode.getSerialNumber(), "", "","");
            if (hasComplate.equals("1")) {
                String sql = "select * from main_business where business_type='userHeadhunting' and businessid =" + tempMode.getObjectid();
                List<MainBusiness> mainBusinessList = mainBusinessService.findByDataSQL(sql);
                if (mainBusinessList != null) {
                    MainBusiness mainBusiness = mainBusinessList.get(0);
                    mainBusiness.setCompleteDate(new Date());
                    mainBusinessService.update(mainBusiness);
                }
            }
        } else if (flag.equals("user_classroom")) {
            //教室预定
            UserClassroom tempMode = userClassroomService.getbyId(identity_field_value);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//小写的mm表示的是分钟
            String applicationTime = sdf.format(new Date(tempMode.getCreateDate().getTime() + 1 * 24 * 60 * 60 * 1000));
            String hasComplate = "0";
            //获取教室名称
            String sql2 = "select * from user_classroom_verify where user_classroom_id = " + identity_field_value;
            List<UserClassroomVerify> list = userClassroomVerifyService.findByDataSQL(sql2);
            String classRoom = "";
            if (list != null) {
                classRoom = list.get(0).getClassroom().getName();
            }
            try {
                if (list != null) {
                    if (0 < list.size()) {
                        for (UserClassroomVerify userClassroomVerify : list) {
                            String applyDate = userClassroomVerify.getApplyDate().toString();
                            applyDate = applyDate.substring(0, 10);
                            String ap = "";
                            if ("a".equals(userClassroomVerify.getHalfDay())) {
                                ap = "-上午";
                            } else {
                                ap = "-下午";
                            }
                            hasComplate = sendMessage(result, tempMode.getUsername(), task_user, applicationTime,
                                    task_user, classRoom, "", applyDate + ap, "", "", tempMode.getCompany(), "", tempMode.getSerialNumber(), "", "","");
                        }
                    }
                }
            } catch (Exception e) {
                throw new MyException("流程已流转，短信发送失败！");
            }
            if (hasComplate.equals("1")) {
                String sql = "select * from main_business where business_type='userClassroom' and businessid =" + tempMode.getObjectid();
                List<MainBusiness> mainBusinessList = mainBusinessService.findByDataSQL(sql);
                if (mainBusinessList != null) {
                    MainBusiness mainBusiness = mainBusinessList.get(0);
                    mainBusiness.setCompleteDate(new Date());
                    mainBusinessService.update(mainBusiness);
                }
            }
        } else if (flag.equals("user_meetingroom")) {
            //会议室预定
            UserMeetingroom tempMode = userMeetingroomService.getbyId(identity_field_value);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//小写的mm表示的是分钟
            String applicationTime = "";
            String hasComplate = "0";
            //获取会议室名称
            String sql2 = "select * from user_meetingroom_verify where user_meetingroom_id = " + identity_field_value;
            List<UserMeetingroomVerify> list = userMeetingroomVerifyService.findByDataSQL(sql2);
            String meetingRoom = "";
            if (list != null) {
                meetingRoom = list.get(0).getMettingroom().getName();
            }
            if (list != null) {
                if (0 < list.size()) {
                    for (UserMeetingroomVerify userClassroomVerify : list) {
                        SimpleDateFormat sdfs = new SimpleDateFormat("yyyy-MM-dd ");//小写的mm表示的是分钟
                        String applyDate = sdfs.format(userClassroomVerify.getApplyDate());
                        String beginTime = userClassroomVerify.getBeginTime();
                        String endTime = userClassroomVerify.getEndTime();
                        hasComplate = sendMessage(result, tempMode.getUsername(), task_user, applicationTime,
                                task_user, "", meetingRoom, applyDate + " " + beginTime, applyDate + " " + endTime, "", tempMode.getCompany(), "", tempMode.getSerialNumber(), "", "","");
                    }
                }
            }
            if (hasComplate.equals("1")) {
                String sql = "select * from main_business where business_type='userMeetingroom' and businessid =" + tempMode.getObjectid();
                List<MainBusiness> mainBusinessList = mainBusinessService.findByDataSQL(sql);
                if (mainBusinessList != null) {
                    MainBusiness mainBusiness = mainBusinessList.get(0);
                    mainBusiness.setCompleteDate(new Date());
                    mainBusinessService.update(mainBusiness);
                }
            }
        } else if (flag.equals("user_test_applyfor")) {
            //测试申请
            UserTestApplyfor tempMode = userTestApplyforService.getbyId(identity_field_value);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//小写的mm表示的是分钟
            String applicationTime = sdf.format(new Date(tempMode.getCreateDate().getTime() + 1 * 24 * 60 * 60 * 1000));
            String hasComplate = "0";
            try {
                hasComplate = sendMessage(result, tempMode.getUsername(), task_user, applicationTime,
                        task_user, "", "", "", "", "", tempMode.getCompany(), "", tempMode.getSerialNumber(), "", "","");
            } catch (Exception e) {
                throw new MyException("流程已流转，短信发送失败！");
            }
            if (hasComplate.equals("1")) {
                String sql = "select * from main_business where business_type='userTestApplyfor' and businessid =" + tempMode.getObjectid();
                List<MainBusiness> mainBusinessList = mainBusinessService.findByDataSQL(sql);
                if (mainBusinessList != null) {
                    MainBusiness mainBusiness = mainBusinessList.get(0);
                    mainBusiness.setCompleteDate(new Date());
                    mainBusinessService.update(mainBusiness);
                }
            }
        } else if (flag.equals("user_copyright")) {
            //著作权登记
            UserCopyright tempMode = userCopyrightService.getbyId(identity_field_value);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//小写的mm表示的是分钟
            String applicationTime = sdf.format(new Date(tempMode.getCreateDate().getTime() + 1 * 24 * 60 * 60 * 1000));
            String hasComplate = "0";
            try {
                hasComplate = sendMessage(result, tempMode.getUsername(), task_user, applicationTime,
                        task_user, "", "", "", "", "", tempMode.getCompany(), "", tempMode.getSerialNumber(), "", "","");
            } catch (Exception e) {
                throw new MyException("流程已流转，短信发送失败！");
            }
            if (hasComplate.equals("1")) {
                String sql = "select * from main_business where business_type='userCopyright' and businessid =" + tempMode.getObjectid();
                List<MainBusiness> mainBusinessList = mainBusinessService.findByDataSQL(sql);
                if (mainBusinessList != null) {
                    MainBusiness mainBusiness = mainBusinessList.get(0);
                    mainBusiness.setCompleteDate(new Date());
                    mainBusinessService.update(mainBusiness);
                }
            }
        } else if (flag.equals("enter_apply")) {
            //入驻申请
            EnterApply tempMode = enterApplyService.getbyId(identity_field_value);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//小写的mm表示的是分钟
            String applicationTime = sdf.format(new Date(tempMode.getCreateDate().getTime() + 1 * 24 * 60 * 60 * 1000));
            String hasComplate = "0";
            try {
                hasComplate = sendMessage(result, tempMode.getUsername(), task_user, applicationTime,
                        task_user, "", "", "", "", "", tempMode.getCompany(), "", tempMode.getSerialNumber(), "", "","");
            } catch (Exception e) {
                throw new MyException("流程已流转，短信发送失败！");
            }
            if (hasComplate.equals("1")) {
                String sql = "select * from main_business where business_type='enterApply' and businessid =" + tempMode.getObjectid();
                List<MainBusiness> mainBusinessList = mainBusinessService.findByDataSQL(sql);
                if (mainBusinessList != null) {
                    MainBusiness mainBusiness = mainBusinessList.get(0);
                    mainBusiness.setCompleteDate(new Date());
                    mainBusinessService.update(mainBusiness);
                }
            }
        }
        return result;
    }

    /**
     * 发送短信模板
     *
     * @param result          调用工作流返回数据
     * @param applicant       申请人
     * @param task_user       下一步处理人
     * @param applicationTime 申请时间
     * @param acceptman       acceptman
     * @param classroom       教室名称
     * @param beginTime       预订时间（首个）
     * @param endTime         预订时间（末个）
     * @param n               {{n}}个孵化注册预约
     * @param company         公司
     * @param projectManage   项目管理
     * @param sn              流水号
     * @return
     * @throws UnsupportedEncodingException
     * @throws ParseException
     */
    public String sendMessage(String result, String applicant, String task_user, String applicationTime, String acceptman,
                              String classroom, String mettingroom, String beginTime, String endTime,
                              String n, String company, String projectManage, String sn, String assignTime, String discussTime,String appointDate) {
        //处理发送短信，发送通知
        JSONObject jsonObject = new JSONObject(result);
        String mt_service = UTF2GBK.unicodeToUtf8(jsonObject.get("mt_service").toString());
        String mt_client = UTF2GBK.unicodeToUtf8(jsonObject.get("mt_client").toString());
        String mb_service = UTF2GBK.unicodeToUtf8(jsonObject.get("mb_service").toString());
        String mb_client = UTF2GBK.unicodeToUtf8(jsonObject.get("mb_client").toString());
        String complete_date = UTF2GBK.unicodeToUtf8(jsonObject.get("complete_date").toString());
        //受理人短信模板
        Pattern p_mt_service = Pattern.compile("\\{\\{([a-z]*[A-Z]*)*\\}\\}{1}");
        Matcher m_mt_service = p_mt_service.matcher(mt_service);
        while (m_mt_service.find()) {
            if (m_mt_service.group().equals("{{applicationTime}}")) {
                mt_service = mt_service.replace("{{applicationTime}}", applicationTime);
            }
            if (m_mt_service.group().equals("{{acceptman}}")) {
                mt_service = mt_service.replace("{{acceptman}}", task_user);
            }
            if (m_mt_service.group().equals("{{classroom}}")) {
                mt_service = mt_service.replace("{{classroom}}", classroom);
            }
            if (m_mt_service.group().equals("{{mettingroom}}")) {
                mt_service = mt_service.replace("{{mettingroom}}", mettingroom);
            }
            if (m_mt_service.group().equals("{{beginTime}}")) {
                mt_service = mt_service.replace("{{beginTime}}", beginTime);
            }
            if (m_mt_service.group().equals("{{endTime}}")) {
                mt_service = mt_service.replace("{{endTime}}", endTime);
            }
            if (m_mt_service.group().equals("{{n}}")) {
                mt_service = mt_service.replace("{{n}}", n);
            }
            if (m_mt_service.group().equals("{{company}}")) {
                mt_service = mt_service.replace("{{company}}", company);
            }
            if (m_mt_service.group().equals("{{projectManage}}")) {
                mt_service = mt_service.replace("{{projectManage}}", projectManage);
            }
            if (m_mt_service.group().equals("{{sn}}")) {
                mt_service = mt_service.replace("{{sn}}", sn);
            }
            if (m_mt_service.group().equals("{{assignTime}}")) {
                mt_service = mt_service.replace("{{assignTime}}", assignTime);
            }
            if (m_mt_service.group().equals("{{discussTime}}")) {
                mt_service = mt_service.replace("{{discussTime}}", discussTime);
            }
        }
        if (!"null".equals(mt_service)) {
            if (!"".equals(mt_service)) {
                //发送给处理人
                String[] taskUsers = task_user.split(",");
                for (String taskUser : taskUsers) {
                    String sql = "SELECT * FROM users u LEFT JOIN role_user ru on ru.username = u.username WHERE ru.rolename = '" + taskUser + "' and u.deleteflag > 0";
                    List<User> userList = userService.findByDataSQL(sql);
                    if (userList != null) {
                        for (User user : userList) {
                            if (message_send.equals("on")) {
                                try {
                                    SendToMessage(user.getPhone(), mt_service);
                                } catch (UnsupportedEncodingException e) {
                                    e.printStackTrace();
                                }
                            }
                        }
                    }
                }
            }
        }
        //用户短信模板
        Pattern p_mt_client = Pattern.compile("\\{\\{([a-z]*[A-Z]*)*\\}\\}{1}");
        Matcher m_mt_client = p_mt_client.matcher(mt_client);
        while (m_mt_client.find()) {
            if (m_mt_client.group().equals("{{applicationTime}}")) {
                mt_client = mt_client.replace("{{applicationTime}}", applicationTime);
            }
            if (m_mt_client.group().equals("{{acceptman}}")) {
                mt_client = mt_client.replace("{{acceptman}}", task_user);
            }
            if (m_mt_client.group().equals("{{classroom}}")) {
                mt_client = mt_client.replace("{{classroom}}", classroom);
            }
            if (m_mt_client.group().equals("{{mettingroom}}")) {
                mt_client = mt_client.replace("{{mettingroom}}", mettingroom);
            }
            if (m_mt_client.group().equals("{{beginTime}}")) {
                mt_client = mt_client.replace("{{beginTime}}", beginTime);
            }
            if (m_mt_client.group().equals("{{endTime}}")) {
                mt_client = mt_client.replace("{{endTime}}", endTime);
            }
            if (m_mt_client.group().equals("{{n}}")) {
                mt_client = mt_client.replace("{{n}}", n);
            }
            if (m_mt_client.group().equals("{{company}}")) {
                mt_client = mt_client.replace("{{company}}", company);
            }
            if (m_mt_client.group().equals("{{projectManage}}")) {
                mt_client = mt_client.replace("{{projectManage}}", projectManage);
            }
            if (m_mt_client.group().equals("{{sn}}")) {
                mt_client = mt_client.replace("{{sn}}", sn);
            }
            if (m_mt_client.group().equals("{{assignTime}}")) {
                mt_client = mt_client.replace("{{assignTime}}", assignTime);
            }
            if (m_mt_client.group().equals("{{discussTime}}")) {
                mt_client = mt_client.replace("{{discussTime}}", discussTime);
            }
        }
        User applicantUser = userService.getbyId(applicant);
        if (!"null".equals(mt_client)) {
            if (!"".equals(mt_client)) {
                if (message_send.equals("on")) {
                    try {
                        SendToMessage(applicantUser.getPhone(), mt_client);
                    } catch (UnsupportedEncodingException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
        //用户消息盒子模板
        Pattern p_mb_client = Pattern.compile("\\{\\{([a-z]*[A-Z]*)*\\}\\}{1}");
        Matcher m_mb_client = p_mb_client.matcher(mb_client);
        while (m_mb_client.find()) {
            if (m_mb_client.group().equals("{{applicationTime}}")) {
                mb_client = mb_client.replace("{{applicationTime}}", applicationTime);
            }
            if (m_mb_client.group().equals("{{acceptman}}")) {
                mb_client = mb_client.replace("{{acceptman}}", task_user);
            }
            if (m_mb_client.group().equals("{{classroom}}")) {
                mb_client = mb_client.replace("{{classroom}}", classroom);
            }
            if (m_mb_client.group().equals("{{mettingroom}}")) {
                mb_client = mb_client.replace("{{mettingroom}}", mettingroom);
            }
            if (m_mb_client.group().equals("{{beginTime}}")) {
                mb_client = mb_client.replace("{{beginTime}}", beginTime);
            }
            if (m_mb_client.group().equals("{{endTime}}")) {
                mb_client = mb_client.replace("{{endTime}}", endTime);
            }
            if (m_mb_client.group().equals("{{n}}")) {
                mb_client = mb_client.replace("{{n}}", n);
            }
            if (m_mb_client.group().equals("{{company}}")) {
                mb_client = mb_client.replace("{{company}}", company);
            }
            if (m_mb_client.group().equals("{{projectManage}}")) {
                mb_client = mb_client.replace("{{projectManage}}", projectManage);
            }
            if (m_mb_client.group().equals("{{sn}}")) {
                mb_client = mb_client.replace("{{sn}}", sn);
            }
            if (m_mb_client.group().equals("{{assignTime}}")) {
                mb_client = mb_client.replace("{{assignTime}}", assignTime);
            }
            if (m_mb_client.group().equals("{{discussTime}}")) {
                mb_client = mb_client.replace("{{discussTime}}", discussTime);
            }

            if (m_mb_client.group().equals("{{appointDate}}")) {
                if (appointDate!=""){
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy年MM月dd日 HH时mm分后");
                    String apdate = sdf.format(appointDate);
                    mb_client = mb_client.replace("{{appointDate}}", apdate);
                }
                else {
                    mb_client = mb_client.replace("{{appointDate}}", "");
                }
            }
        }
        if (!"null".equals(mb_client)) {
            if (!"".equals(mb_client)) {
                Noticfication noticfication = new Noticfication();
                noticfication.setCreateTime(new Date());
                noticfication.setAccepter(applicantUser.getUsername());
                noticfication.setAuthor("system");
                noticfication.setContent(mb_client);
                noticfication.setTitle("业务处理提醒");
                noticfication.setReadStatus(1);
                notificationService.save(noticfication);
            }
        }
        System.out.println("mt_service:" + mt_service);
        System.out.println("mt_client:" + mt_client);
        System.out.println("mb_service:" + mb_service);
        System.out.println("mb_client:" + mb_client);
        System.out.println("complete_date:"+complete_date);
        String complete = "0";
        //更新完成时间
        if ("null".equals(complete_date)||"".equals(complete_date)|| complete_date == null) {
            complete = "0";
        }else {
            complete = "1";
        }
        return complete;
    }
}
