package com.wiseonline.Controller.Business;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.*;
import com.wiseonline.Service.Impl.*;
import com.wiseonline.Utils.*;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by yanwj on 15/12/12.
 */
@RestController
@RequestMapping("/workflow")
public class WorkFlowController extends BaseController{
    @Value("#{configProperties['WorkFlow.Url']}")
    private String workflow_url;

    @Value("#{configProperties['Message.Send']}")
    private String message_send;

    private static String WSP_SESSION_USERNAME = "WSP_SESSION_USERNAME";

    @Autowired
    UserServiceImpl userService;

    @Autowired
    UserRepairServiceImpl userRepairService;

    @Autowired
    SettingRepairAutoConfigServiceImpl settingRepairAutoConfigService;

    @Autowired
    UserRepairAssignServiceImpl userRepairAssignService;

    @Autowired
    NotificationServiceImpl notificationService;

    @Autowired
    RoleServiceImpl roleService;
    @Autowired
    WorkFlowUtils workFlowUtils;

    @Autowired
    MainBusinessServiceImpl mainBusinessService;

    /**
     * 我的业务
     * @param request
     * @return
     * @throws MyException
     */
    @RequestMapping(value = "api/processinstances/my_apply/list/{page}/{pageSize}")
    public TranslatePageResult MyApplyList(@PathVariable int page, @PathVariable int pageSize,
                                           HttpServletRequest request) throws MyException {
        String creator = getUserName();
        if (!creator.equals("anonymousUser")) {
            try {
                String resultString = ResponseFromUrl.GetResult(workflow_url + "/workflow/api/processinstances/my_apply/list/" +
                        "?format=json&creator=" + creator + "&!process__id=11&limit=" + pageSize + "&offset=" + (page - 1) * pageSize);
                System.out.println(resultString);
                String total = "0";
                String jsonArray = null;
                JSONObject jso = new JSONObject(resultString);
                if (jso.has("meta")) {
                    String meta = jso.getJSONObject("meta").toString();
                    JSONObject jso2 = new JSONObject(meta);
                    if (jso2.has("total_count")) {
                        total = jso2.get("total_count").toString();
                    }
                }
                if (jso.has("objects")) {
                    jsonArray = jso.get("objects").toString();

                }
                List<TranslateDomain> translateDomainList = translate(jsonArray);
                TranslatePageResult pageResult = new TranslatePageResult();
                pageResult.setPage(page);
                pageResult.setPagesize(pageSize);
                pageResult.setTotal(Integer.parseInt(total));
                pageResult.setResult(translateDomainList);
                return pageResult;
            } catch (Exception e) {
                throw new MyException(ConstClass.WorkFlowError);
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }

    /**
     * 新增工作流过程定义
     * @param request
     * @return
     * @throws MyException
     */
    @RequestMapping(value = "api/process/")
    public ResultMessage Process(HttpServletRequest request) throws MyException {
        String  alias = request.getParameter("alias");
        String 	createview = request.getParameter("createview");
        String	editview = request.getParameter("editview");
        String  identityfield = request.getParameter("identityfield");
        String  name = request.getParameter("name");
        String  printview = request.getParameter("printview");
        String  related_table = request.getParameter("related_table");
        String  sn_template = request.getParameter("sn_template");
        String  version = request.getParameter("version");
        String  param = "{\"alias\":\""+alias+"\",\"createview\":\""+createview+"\","+
                "\"editview\":\""+editview+"\",\"identityfield\":\""+identityfield+"\","+
                "\"name\":\""+name+"\",\"printview\":\""+printview+"\",\"related_table\":\""+
                related_table+"\",\"sn_template\":\""+sn_template+"\",\"version\":\""+version+"\"}";
        try{
            String result = ResponseFromUrl.postJson(workflow_url+"/workflow/api/process/",param);
            if (result == "ok"){
                return Msg(true,ConstClass.OperationSuccess);
            }else {
                return Msg(false,ConstClass.WorkFlowError);
            }
        }catch (Exception e){
            throw new MyException(ConstClass.WorkFlowError);
        }
    }

    /**
     * 新增短信模版
     * @param request
     * @return
     * @throws MyException
     */
    @RequestMapping(value = "api/messagetemplates/")
    public ResultMessage MessageTemplates(HttpServletRequest request) throws MyException {
        String content = request.getParameter("content");
        String 	name = request.getParameter("name");
        String param = "{\"name\":\""+name+"\",\"content\":\""+content+"\"}";
        try{
            String result = ResponseFromUrl.postJson(workflow_url+"/workflow/api/messagetemplates/",param);
            if (result == "ok"){
                return Msg(true,ConstClass.OperationSuccess);
            }else {
                return Msg(false,ConstClass.WorkFlowError);
            }
        }catch (Exception e){
            throw new MyException(ConstClass.WorkFlowError);
        }
    }

    /**
     * 提交审批意见
     * @param request
     * @return
     * @throws MyException
     */
    @RequestMapping(value = "api/taskinstances")
    public ResultMessage TaskInstances(HttpServletRequest request,HttpServletResponse response) throws MyException {
        String content = request.getParameter("content");
        String tid = request.getParameter("tid");
        String piid = request.getParameter("piid");
        String param = "{\"content\":\""+content+"\"}";
        try{
            String result = ResponseFromUrl.putJson(workflow_url + "/workflow/api/taskinstances/" + tid, param);
            if (result == "ok"){
                return Msg(true,ConstClass.OperationSuccess);
            }else {
                response.setStatus(408);
                return Msg(false,ConstClass.WorkFlowError);
            }
        }catch (Exception e){
            response.setStatus(408);
            throw new MyException(ConstClass.WorkFlowError);
        }
    }

    /**
     * 我的待办
     * @param page
     * @param pageSize
     * @param request
     * @return
     * @throws MyException
     */
    @RequestMapping(value = "api/taskinstanceslist/my_todo/list/{page}/{pageSize}")
    public TranslatePageResult2 MyTodoList(@PathVariable int page, @PathVariable int pageSize,
                                           HttpServletRequest request) throws MyException {
        String sn__contains = request.getParameter("sn__contains");
        StringBuffer params = new StringBuffer();
        if ("".equals(sn__contains)|| sn__contains == null||"null".equals(sn__contains)){
        }else {
            params.append("&sn__icontains="+sn__contains);
        }
        String creator = getUserName();
        if (!creator.equals("anonymousUser")) {
            try {
                String resultString = ResponseFromUrl.GetResult(workflow_url + "/workflow/api/taskinstanceslist/my_todo/list/" +
                        "?format=json&task_user="+creator+params+"&limit=" + pageSize + "&offset=" + (page - 1) * pageSize);
                System.out.println(resultString);
                String total = "0";
                String jsonArray = null;
                JSONObject jso = new JSONObject(resultString);
                if (jso.has("meta")) {
                    String meta = jso.getJSONObject("meta").toString();
                    JSONObject jso2 = new JSONObject(meta);
                    if (jso2.has("total_count")) {
                        total = jso2.get("total_count").toString();
                    }
                }
                if (jso.has("objects")) {
                    jsonArray = jso.get("objects").toString();

                }

                List<TranslateDomain2> translateDomainList = myApplyTranslate(jsonArray);
                TranslatePageResult2 pageResult = new TranslatePageResult2();
                pageResult.setPage(page);
                pageResult.setPagesize(pageSize);
                pageResult.setTotal(Integer.parseInt(total));
                pageResult.setResult(translateDomainList);
                return pageResult;
            } catch (Exception e) {
                throw new MyException(ConstClass.WorkFlowError);
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }

    /**
     * 我的经办
     * @param page
     * @param pageSize
     * @param request
     * @return
     * @throws MyException
     */
    @RequestMapping(value = "api/processinstances/my_done/list/{page}/{pageSize}")
    public WorkFlowPageResult MyDoneList(@PathVariable int page, @PathVariable int pageSize,
                                         HttpServletRequest request) throws MyException {
        String sn__contains = request.getParameter("sn__contains");
        StringBuffer params = new StringBuffer();
        if ("".equals(sn__contains)|| sn__contains == null||"null".equals(sn__contains)){
        }else {
            params.append("&sn__icontains="+sn__contains);
        }
        String creator = getUserName();
        if (!creator.equals("anonymousUser")) {
            try {
                String resultString = ResponseFromUrl.GetResult(workflow_url + "/workflow/api/processinstances/my_done/list/" +
                        "?format=json&taskinstances__task_user="+creator+params.toString()+"&limit=" + pageSize + "&offset=" + (page - 1) * pageSize);
                System.out.println(resultString);
                String total = "0";
                String jsonArray = null;
                JSONObject jso = new JSONObject(resultString);
                if (jso.has("meta")) {
                    String meta = jso.getJSONObject("meta").toString();
                    JSONObject jso2 = new JSONObject(meta);
                    if (jso2.has("total_count")) {
                        total = jso2.get("total_count").toString();
                    }
                }
                if (jso.has("objects")) {
                    jsonArray = jso.get("objects").toString();

                }
                ObjectMapper mapper = new ObjectMapper();
                Object object = mapper.readValue(jsonArray, Object.class);
                WorkFlowPageResult pageResult = new WorkFlowPageResult();
                pageResult.setPage(page);
                pageResult.setPagesize(pageSize);
                pageResult.setTotal(Integer.parseInt(total));
                pageResult.setResult(object);
                return pageResult;
            } catch (Exception e) {
                throw new MyException(ConstClass.WorkFlowError);
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }

    /***
     * 逾期(流程跟踪)
     * @param page
     * @param pageSize
     * @param request
     * @return
     * @throws MyException
     */
    @RequestMapping(value = "api/taskinstanceslist/due/list/{page}/{pageSize}")
    public WorkFlowPageResult DueList(@PathVariable int page, @PathVariable int pageSize,
                                      HttpServletRequest request) throws MyException {
        String creator = getUserName();
        if (!creator.equals("anonymousUser")) {
            try {
                String sql = "SELECT * from roles as r INNER JOIN role_user as ru ON r.rolename = ru.rolename WHERE ru.username = '"+creator+"'";
                List<Role> roleList = roleService.findByDataSQL(sql);
                StringBuffer sb = new StringBuffer();
                for (Role role:roleList){
                    sb.append(role.getRolename()+",");
                }
                sb.deleteCharAt(sb.length()-1);

                String resultString = ResponseFromUrl.GetResult(workflow_url + "/workflow/api/taskinstanceslist/due/list/" +
                        "?format=json&limit=" + pageSize + "&offset=" + (page - 1) * pageSize+"&roles="+sb);
                System.out.println(resultString);
                String total = "0";
                String jsonArray = null;
                JSONObject jso = new JSONObject(resultString);
                if (jso.has("meta")) {
                    String meta = jso.getJSONObject("meta").toString();
                    JSONObject jso2 = new JSONObject(meta);
                    if (jso2.has("total_count")) {
                        total = jso2.get("total_count").toString();
                    }
                }
                if (jso.has("objects")) {
                    jsonArray = jso.get("objects").toString();

                }
                ObjectMapper mapper = new ObjectMapper();
                Object object = mapper.readValue(jsonArray, Object.class);
                WorkFlowPageResult pageResult = new WorkFlowPageResult();
                pageResult.setPage(page);
                pageResult.setPagesize(pageSize);
                pageResult.setTotal(Integer.parseInt(total));
                pageResult.setResult(object);
                return pageResult;
            } catch (Exception e) {
                throw new MyException(ConstClass.WorkFlowError);
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }

    /***
     * 新增业务
     * @param id
     * @param request
     * @return
     * @throws MyException
     */
    @RequestMapping(value = "api/create/{id}")
    public Object Create(@PathVariable int id, HttpServletRequest request) throws MyException {
        String creator = getUserName();
        if (!creator.equals("anonymousUser")) {
            try {
                String resultString = ResponseFromUrl.GetResult(workflow_url + "/workflow/api/create/" + id);
                System.out.println(resultString);
                ObjectMapper mapper = new ObjectMapper();
                Object object = mapper.readValue(resultString, Object.class);
                return object;
            } catch (Exception e) {
                throw new MyException(ConstClass.WorkFlowError);
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }

    /***
     * 编辑业务
     * @param id
     * @param request
     * @return
     * @throws MyException
     */
    @RequestMapping(value = "api/edit/{id}")
    public Object Edit(@PathVariable int id, HttpServletRequest request) throws MyException {
        String creator = getUserName();
        if (!creator.equals("anonymousUser")) {
            try {
                String resultString = ResponseFromUrl.GetResult(workflow_url + "/workflow/api/edit/" + id+"?username="+creator);
                ObjectMapper mapper = new ObjectMapper();
                Object object = mapper.readValue(resultString, Object.class);
                return object;
            } catch (Exception e) {
                throw new MyException(ConstClass.WorkFlowError);
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }

    /***
     * 获取业务
     * @param id
     * @param request
     * @return
     * @throws MyException
     */
    @RequestMapping(value = "api/get/{id}")
    public Object Get(@PathVariable int id, HttpServletRequest request) throws MyException {
        String creator = getUserName();
        if (!creator.equals("anonymousUser")) {
            try {
                String resultString = ResponseFromUrl.GetResult(workflow_url + "/workflow/api/get/" + id);
                System.out.println(resultString);
                ObjectMapper mapper = new ObjectMapper();
                Object object = mapper.readValue(resultString, Object.class);
                return object;
            } catch (Exception e) {
                throw new MyException(ConstClass.WorkFlowError);
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }

    /***
     * 执行流转(新建流程)
     * 选择去向和下一步执行者之后的保存事件.
     * @param request
     * @return
     * @throws MyException
     */
    @RequestMapping(value = "api/newTransfer")
    public ResultMessage NewTransfer(HttpServletRequest request) throws MyException {
        String creator = getUserName();
        String currentuser = getUserName();
        if (!creator.equals("anonymousUser")) {
            int identity_field_value = Integer.parseInt(request.getParameter("identity_field_value"))  ;
            String process_id = request.getParameter("process_id");
            String related_table = request.getParameter("related_table");
            String sn = request.getParameter("sn");
            String title = request.getParameter("title");
            String task_id = request.getParameter("task_id");
            String task_user = request.getParameter("task_user");
            StringBuffer sb = new StringBuffer();
            String rolename = "";
            UserRepair userRepair = userRepairService.getbyId(identity_field_value);
            if (userRepair != null){
                sn = userRepair.getSerialNumber();
                if (userRepair.getTypeId() == 2){
                    String sql2 = "SELECT distinct u.* FROM users as u LEFT JOIN role_user as ru on ru.username = u.username WHERE u.deleteflag = 1 and ru.rolename='ITAccept'";
                    List<User> userList = userService.findByDataSQL(sql2);
                    if (userList != null) {
                        if (0 < userList.size()) {
                            for (int i = 0; i < userList.size(); i++) {
                                sb.append(userList.get(i).getUsername()+",");
                            }
                        }
                    }
                }else {
                    int buildingId = userRepair.getBuildingId();
                    String sql = "select sas.* from setting_repair_autoconfig as sas where sas.buildingId=" + buildingId;
                    List<SettingRepairAutoConfig> settingRepairAutoConfigList = settingRepairAutoConfigService.findByDataSQL(sql);
                    int flag = 0;
                    if (settingRepairAutoConfigList != null) {
                        if (0 < settingRepairAutoConfigList.size()) {
                            for (SettingRepairAutoConfig settingRepairAutoConfig : settingRepairAutoConfigList) {
                                if (settingRepairAutoConfig != null) {
                                    String sql2 = "SELECT distinct u.* FROM users as u LEFT JOIN role_user as ru on ru.username = u.username WHERE u.deleteflag = 1 and ru.rolename='" + settingRepairAutoConfig.getAcceptorId() + "'";
                                    List<User> userList = userService.findByDataSQL(sql2);
                                    if (userList != null) {
                                        if (0 < userList.size()) {
                                            flag = 1;
                                            for (int i = 0; i < userList.size(); i++) {
                                                sb.append(userList.get(i).getUsername()+",");
                                            }
                                        }
                                    }
                                }
                            }
                        } else {
                            flag = 2;
                        }
                    } else {
                        flag = 2;
                    }
                    if (flag == 0 || flag == 2) {
                        String sql2 = "SELECT distinct u.* FROM users as u LEFT JOIN role_user as ru on ru.username = u.username WHERE u.deleteflag = 1 and ru.rolename='ServDispatcher'";
                        List<User> userList = userService.findByDataSQL(sql2);
                        if (userList != null) {
                            if (0 < userList.size()) {
                                for (int i = 0; i < userList.size(); i++) {
                                    sb.append(userList.get(i).getUsername()+",");
                                }
                            } else {
                                throw new MyException(ConstClass.NoRepairUser);
                            }
                        } else {
                            throw new MyException(ConstClass.NoRepairUser);
                        }
                    }
                }
            }else {
                throw new MyException("传的identity_field_value错误!");
            }
            String param = "{\"creator\":\"" + creator + "\",\"currentuser\":\"" + currentuser + "\",\"identity_field_value\":\"" +
                    identity_field_value + "\",\"process_id\":\"" + process_id + "\",\"related_table\":\"" + related_table + "\",\"sn\":\"" +
                    sn + "\",\"title\":\"" + sn + "\",\"task_id\":\"" + task_id + "\",\"task_user\":\"" + sb.toString() + "\"}";
            if (currentuser != null) {
                try {
                    String result = ResponseFromUrl.postJsonReturnResult(workflow_url + "/workflow/api/transfer", param);
                    System.out.println(result);
                    //处理发送短信，发送通知
                    JSONObject jsonObject = new JSONObject(result);
                    String mt_service = UTF2GBK.unicodeToUtf8(jsonObject.get("mt_service").toString());
                    String mt_client = UTF2GBK.unicodeToUtf8(jsonObject.get("mt_client").toString());
                    String mb_service = UTF2GBK.unicodeToUtf8(jsonObject.get("mb_service").toString());
                    String mb_client = UTF2GBK.unicodeToUtf8(jsonObject.get("mb_client").toString());
                    String complete_date = UTF2GBK.unicodeToUtf8(jsonObject.get("complete_date").toString());
                    User user = userService.getbyId(userRepair.getApplicant());
                    String hql = "select * from user_repair_assign as ura where ura.repairId="+userRepair.getObjectid();
                    List<UserRepairAssign> userRepairAssignList = userRepairAssignService.findByDataSQL(hql);
                    //受理人短信模板
                    Pattern p_mt_service=Pattern.compile("\\{\\{([a-z]*[A-Z]*)*\\}\\}{1}");
                    Matcher m_mt_service=p_mt_service.matcher(mt_service);
                    while (m_mt_service.find()) {
                        if (m_mt_service.group().equals("{{content}}")){
                            mt_service = mt_service.replace("{{content}}", userRepair.getDescription());
                        }
                        if (m_mt_service.group().equals("{{applicant}}")){
                            mt_service = mt_service.replace("{{applicant}}", userRepair.getApplicant());
                        }
                        if (m_mt_service.group().equals("{{park}}")){
                            mt_service = mt_service.replace("{{park}}", userRepair.getPark().getName());
                        }
                        if (m_mt_service.group().equals("{{building}}")){
                            mt_service = mt_service.replace("{{building}}", userRepair.getBuilding().getName());
                        }
                        if (m_mt_service.group().equals("{{address}}")){
                            mt_service = mt_service.replace("{{address}}", userRepair.getAddress());
                        }
                        if (m_mt_service.group().equals("{{company}}")){
                            mt_service = mt_service.replace("{{company}}", userRepair.getCompany());
                        }
                        if (m_mt_service.group().equals("{{phone}}")){
                            if (user != null){
                                mt_service = mt_service.replace("{{phone}}", user.getPhone());
                            }else {
                                mt_service = mt_service.replace("{{phone}}", "00000000000");
                            }
                        }
                        if (m_mt_service.group().equals("{{sn}}")){
                            mt_service = mt_service.replace("{{sn}}",userRepair.getSerialNumber());
                        }
                    }
                    if (!"null".equals(mt_service)) {
                        String[] taskUserArray = sb.toString().split(",");
                        for (String taskUserTemp:taskUserArray) {
                            String sql = "SELECT u.* FROM users as u where u.username = '" + taskUserTemp + "'";
                            List<User> list = userService.findByDataSQL(sql);
                            if (list != null){
                                if (0 < list.size()){
                                    for (User taskUser:list){
                                        if (message_send.equals("on")) {
                                            SendToMessage(taskUser.getPhone(), mt_service);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    //用户短信模板
                    Pattern p_mt_client=Pattern.compile("\\{\\{([a-z]*[A-Z]*)*\\}\\}{1}");
                    Matcher m_mt_client=p_mt_client.matcher(mt_client);
                    while (m_mt_client.find()) {
                        if (m_mt_client.group().equals("{{sn}}")){
                            mt_client = mt_client.replace("{{sn}}",userRepair.getSerialNumber());
                        }
                        if (m_mt_client.group().equals("{{engineer}}")){
                            mt_client = mt_client.replace("{{engineer}}",userRepairAssignList.get(0).getEngineerDetail().getName());
                        }
                        if (m_mt_client.group().equals("{{engineerPhone}}")){
                            mt_client = mt_client.replace("{{engineerPhone}}",userRepairAssignList.get(0).getEngineerDetail().getMobile());
                        }
                    }
                    User applicantUser = userService.getbyId(userRepair.getApplicant());
                    if (!"null".equals(mt_client)) {
                        if (message_send.equals("on")){
                            SendToMessage(applicantUser.getPhone(), mt_client);
                        }
                    }
                    //用户消息盒子模板
                    Pattern p_mb_client=Pattern.compile("\\{\\{([a-z]*[A-Z]*)*\\}\\}{1}");
                    Matcher m_mb_client=p_mb_client.matcher(mb_client);
                    while (m_mb_client.find()) {
                        if (m_mb_client.group().equals("{{sn}}")){
                            mb_client = mb_client.replace("{{sn}}",userRepair.getSerialNumber());
                        }
                        if (m_mb_client.group().equals("{{engineer}}")){
                            mb_client = mb_client.replace("{{engineer}}",userRepairAssignList.get(0).getEngineerDetail().getName());
                        }
                        if (m_mb_client.group().equals("{{engineerPhone}}")){
                            mb_client = mb_client.replace("{{engineerPhone}}",userRepairAssignList.get(0).getEngineerDetail().getMobile());
                        }
                        if (userRepair.getAppointDate()!=null){
                            //throw new Exception("needn't send message.");
                            SimpleDateFormat sdf = new SimpleDateFormat("yyyy年MM月dd日 HH时mm分后");
                            String apdate = sdf.format(userRepair.getAppointDate());
                            mt_client = mt_client.replace("{{appointDate}}", apdate);
                        }
                        else{
                            mt_client = mt_client.replace("{{appointDate}}", "");
                        }
                    }
                    if (!"null".equals(mb_client)) {
                        if (!"".equals(mb_client)) {
                            Noticfication noticfication = new Noticfication();
                            noticfication.setAccepter(applicantUser.getUsername());
                            noticfication.setAuthor("system");
                            noticfication.setContent(mb_client);
                            noticfication.setTitle("业务处理提醒");
                            noticfication.setReadStatus(1);
                            notificationService.save(noticfication);
                        }
                    }
                    return Msg(true, ConstClass.OperationSuccess);

                } catch (Exception e) {
                    throw new MyException(ConstClass.WorkFlowError);
                }
            } else {
                throw new MyException(ConstClass.LoginTimeOut);
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }

    /**
     * 执行流转(已有流程)
     * 选择去向和下一步执行者之后的保存事件.
     * @param request
     * @return
     * @throws MyException
     */
    @RequestMapping(value = "api/CommonHadTransfer")
    public ResultMessage CommonHadTransfer(HttpServletRequest request) throws MyException ,UnsupportedEncodingException ,ParseException {
//        WorkFlowUtils workFlowUtils = new WorkFlowUtils();
        try {
            workFlowUtils.HadTransfer(request,workflow_url);
        }catch (Exception e){
            e.printStackTrace();
            throw new MyException(e.getMessage());
        }
        return Msg(true,"操作成功！");
    }
    /**
     * 执行流转(已有流程)
     * 选择去向和下一步执行者之后的保存事件.
     * @param request
     * @return
     * @throws MyException
     */
    @RequestMapping(value = "api/HadTransfer")
    public ResultMessage HadTransfer(HttpServletRequest request) throws MyException ,UnsupportedEncodingException ,ParseException {
        String currenttask = request.getParameter("currenttask");
        String currentuser = getUserName();
        String id = request.getParameter("id");
        String process_id = request.getParameter("process_id");
        String sn = request.getParameter("sn");
        String title = request.getParameter("title");
        String task_id = request.getParameter("task_id");
        String task_user = request.getParameter("task_user");
        int identity_field_value = Integer.parseInt(request.getParameter("identity_field_value"))  ;

        if (!currentuser.equals("anonymousUser")) {
            UserRepair userRepair = userRepairService.getbyId(identity_field_value);
            if (userRepair != null) {
                sn = userRepair.getSerialNumber();
                String result = "";
                try {
                    String param = "{\"currenttask\":\"" + currenttask + "\",\"currentuser\":\"" + currentuser + "\",\"id\":\"" +
                            id + "\",\"process_id\":\"" + process_id + "\",\"sn\":\"" +
                            sn + "\",\"title\":\"" + sn + "\",\"task_id\":\"" + task_id + "\",\"task_user\":\"" + task_user + "\"}";
                    result = ResponseFromUrl.postJsonToBack(workflow_url + "/workflow/api/transfer", param);
                } catch (Exception e) {
                    throw new MyException(ConstClass.WorkFlowError);
                }
                    if (result == "error") {
                        return Msg(false, ConstClass.WorkFlowError);
                    } else {
                        //处理发送短信，发送通知
                        JSONObject jsonObject = new JSONObject(result);
                        String mt_service = UTF2GBK.unicodeToUtf8(jsonObject.get("mt_service").toString());
                        String mt_client = UTF2GBK.unicodeToUtf8(jsonObject.get("mt_client").toString());
                        String mb_service = UTF2GBK.unicodeToUtf8(jsonObject.get("mb_service").toString());
                        String mb_client = UTF2GBK.unicodeToUtf8(jsonObject.get("mb_client").toString());
                        String complete_date = UTF2GBK.unicodeToUtf8(jsonObject.get("complete_date").toString());
                        User user = userService.getbyId(userRepair.getApplicant());
                        String hql = "select * from user_repair_assign as ura where ura.repairId="+userRepair.getObjectid();
                        List<UserRepairAssign> userRepairAssignList = userRepairAssignService.findByDataSQL(hql);
                        //受理人短信模板
                        Pattern p_mt_service=Pattern.compile("\\{\\{([a-z]*[A-Z]*)*\\}\\}{1}");
                        Matcher m_mt_service=p_mt_service.matcher(mt_service);
                        int specialFlag = 0;//短信发送给维修工程师标示
                        while (m_mt_service.find()) {
                            if(m_mt_service.group().equals("{{special}}")){
                                specialFlag = 1;
                                mt_service = mt_service.replace("{{special}}","");
                            }
                            if (m_mt_service.group().equals("{{engineer}}")){
                                mt_service = mt_service.replace("{{engineer}}",userRepairAssignList.get(0).getEngineerDetail().getName());
                            }
                            if (m_mt_service.group().equals("{{repairType}}")){
                                mt_service = mt_service.replace("{{repairType}}", userRepair.getRepairTypeDetail().getName());
                            }
                            if (m_mt_service.group().equals("{{content}}")){
                                mt_service = mt_service.replace("{{content}}", userRepair.getDescriptionConfm());
                            }
                            if (m_mt_service.group().equals("{{applicant}}")){
                                mt_service = mt_service.replace("{{applicant}}", userRepair.getApplicant());
                            }
                            if (m_mt_service.group().equals("{{park}}")){
                                mt_service = mt_service.replace("{{park}}", userRepair.getPark().getName());
                            }
                            if (m_mt_service.group().equals("{{building}}")){
                                mt_service = mt_service.replace("{{building}}", userRepair.getBuildingConfmDetail().getName());
                            }
                            if (m_mt_service.group().equals("{{address}}")){
                                mt_service = mt_service.replace("{{address}}", userRepair.getAddress());
                            }
                            if (m_mt_service.group().equals("{{company}}")){
                                mt_service = mt_service.replace("{{company}}", userRepair.getCompany());
                            }
                            if (m_mt_service.group().equals("{{phone}}")){
                                if (user != null){
                                    mt_service = mt_service.replace("{{phone}}", user.getPhone());
                                }else {
                                    mt_service = mt_service.replace("{{phone}}", "00000000000");
                                }
                            }
                        }
                        if (!"null".equals(mt_service)) {
                            if (specialFlag == 0){
                                //发送给处理人
                                User taskUser = userService.getbyId(task_user);
                                if (taskUser != null) {
                                    if (message_send.equals("on")) {
                                        SendToMessage(taskUser.getPhone(), mt_service);
                                    }
                                }
                            }else {
                                //发送给维修工程师
                                if (message_send.equals("on")) {
                                    SendToMessage(userRepairAssignList.get(0).getEngineerDetail().getMobile(), mt_service);
                                }
                            }
                        }
                        System.out.println("taskUser:"+task_user);
                        //用户短信模板
                        Pattern p_mt_client=Pattern.compile("\\{\\{([a-z]*[A-Z]*)*\\}\\}{1}");
                        Matcher m_mt_client=p_mt_client.matcher(mt_client);
                        while (m_mt_client.find()) {
                            if (m_mt_client.group().equals("{{sn}}")){
                                mt_client = mt_client.replace("{{sn}}",userRepair.getSerialNumber());
                            }
                            if (m_mt_client.group().equals("{{engineer}}")){
                                mt_client = mt_client.replace("{{engineer}}",userRepairAssignList.get(0).getEngineerDetail().getName());
                            }
                            if (m_mt_client.group().equals("{{engineerPhone}}")){
                                String sql = "SELECT  * FROM roles as r LEFT JOIN role_user as ru ON r.rolename = ru.rolename WHERE ru.username = '"+task_user+"' and ru.rolename in('TeneAccept2','TeneAccept1','TeneAccept3','ITAccept')";
                                List<Role> roleList = roleService.findByDataSQL(sql);
                                if (roleList != null && roleList.size()>0) {
                                    if(0 < roleList.size()) {
                                        String rolename = roleList.get(0).getRolename();
                                        if (rolename.equals("TeneAccept1")) {
                                            mt_client = mt_client.replace("{{engineerPhone}}", "61821818-8066");
                                        }
                                        if (rolename.equals("TeneAccept2")) {
                                            mt_client = mt_client.replace("{{engineerPhone}}", "61821818-8064");
                                        }
                                        if (rolename.equals("TeneAccept3")) {
                                            mt_client = mt_client.replace("{{engineerPhone}}", "61821818-4102");
                                        }
                                        if (rolename.equals("ITAccept")) {
                                            mt_client = mt_client.replace("{{engineerPhone}}", "61300819");
                                        }
                                    }
                                }else{
                                    mt_client = mt_client.replace("{{engineerPhone}}", userRepairAssignList.get(0).getEngineerDetail().getMobile());
                                }
                                if (userRepair.getAppointDate()!=null){
                                    //throw new Exception("needn't send message.");
                                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy年MM月dd日 HH时mm分后");
                                    String apdate = sdf.format(userRepair.getAppointDate());
                                    mt_client = mt_client.replace("{{appointDate}}", apdate);
                                }
                                else{
                                    mt_client = mt_client.replace("{{appointDate}}", "");
                                }

                            }
                        }
                        User applicantUser = userService.getbyId(userRepair.getApplicant());
                        if (!"null".equals(mt_client)) {
                            if (message_send.equals("on")) {
                                SendToMessage(applicantUser.getPhone(), mt_client);
                            }
                        }
                        //用户消息盒子模板
                        Pattern p_mb_client=Pattern.compile("\\{\\{([a-z]*[A-Z]*)*\\}\\}{1}");
                        Matcher m_mb_client=p_mb_client.matcher(mb_client);
                        while (m_mb_client.find()) {
                            if (m_mb_client.group().equals("{{sn}}")){
                                mb_client = mb_client.replace("{{sn}}",userRepair.getSerialNumber());
                            }
                            if (m_mb_client.group().equals("{{engineer}}")){
                                mb_client = mb_client.replace("{{engineer}}",userRepairAssignList.get(0).getEngineerDetail().getName());
                            }
                            if (m_mb_client.group().equals("{{engineerPhone}}")){
                                mb_client = mb_client.replace("{{engineerPhone}}",userRepairAssignList.get(0).getEngineerDetail().getMobile());
                            }
                            if (userRepair.getAppointDate()!=null){
                                //throw new Exception("needn't send message.");
                                SimpleDateFormat sdf = new SimpleDateFormat("yyyy年MM月dd日 HH时mm分后");
                                String apdate = sdf.format(userRepair.getAppointDate());
                                mb_client = mb_client.replace("{{appointDate}}", apdate);
                            }
                            else{
                                mb_client = mb_client.replace("{{appointDate}}", "");
                            }
                        }
                        if (!"null".equals(mb_client)) {
                            Noticfication noticfication = new Noticfication();
                            noticfication.setCreateTime(new Date());
                            noticfication.setAccepter(applicantUser.getUsername());
                            noticfication.setAuthor("system");
                            noticfication.setContent(mb_client);
                            noticfication.setReadStatus(1);
                            noticfication.setTitle("业务处理提醒");
                            notificationService.save(noticfication);
                        }
                        //更新完成时间
                        if (!"null".equals(complete_date)){
                            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                            Date date = sdf.parse(complete_date);
//                            userRepair.setCompleteDate(date);
//                            userRepairService.update(userRepair);
                            String sql = "";
                            if (userRepair.getTypeId() == 1) {
                                sql = "select * from main_business where business_type='WY' and businessid =" + userRepair.getObjectid();
                            }else {
                                sql = "select * from main_business where business_type='IT' and businessid =" + userRepair.getObjectid();
                            }
                            List<MainBusiness> mainBusinessList = mainBusinessService.findByDataSQL(sql);
                            if (mainBusinessList != null){
                                MainBusiness mainBusiness = mainBusinessList.get(0);
                                mainBusiness.setCompleteDate(new Date());
                                mainBusinessService.update(mainBusiness);
                            }
                        }
                        return Msg(true, ConstClass.OperationSuccess);
                    }
            }else {
                throw new MyException("传的identity_field_value错误!");
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }

    /**
     * 获取下一步处理人员信息
     * @param id
     * @param page
     * @param pageSize
     * @param request
     * @return
     * @throws MyException
     */
    @RequestMapping(value = "api/user/task/list/{id}/{page}/{pageSize}")
    public WorkFlowPageResult TaskList(@PathVariable int id,@PathVariable int page, @PathVariable int pageSize,
                                       HttpServletRequest request) throws MyException {
        String creator = getUserName();
        if (!creator.equals("anonymousUser")) {
            try {
                String resultString = ResponseFromUrl.GetResult(workflow_url + "/workflow/api/user/task/list/" + id +
                        "?format=json&limit=" + pageSize + "&offset=" + (page - 1) * pageSize);
                System.out.println(resultString);
                String total = "0";
                String jsonArray = null;
                JSONObject jso = new JSONObject(resultString);
                if (jso.has("meta")) {
                    String meta = jso.getJSONObject("meta").toString();
                    JSONObject jso2 = new JSONObject(meta);
                    if (jso2.has("total_count")) {
                        total = jso2.get("total_count").toString();
                    }
                }
                if (jso.has("objects")) {
                    jsonArray = jso.get("objects").toString();

                }
                ObjectMapper mapper = new ObjectMapper();
                Object object = mapper.readValue(jsonArray, Object.class);
                WorkFlowPageResult pageResult = new WorkFlowPageResult();
                pageResult.setPage(page);
                pageResult.setPagesize(pageSize);
                pageResult.setTotal(Integer.parseInt(total));
                pageResult.setResult(object);
                return pageResult;
            } catch (Exception e) {
                throw new MyException(ConstClass.WorkFlowError);
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }

    /**
     * 获取下一步所有任务节点
     * @param id
     * @param page
     * @param pageSize
     * @param request
     * @return
     * @throws MyException
     */
    @RequestMapping(value = "api/tasks/next/list/{id}/{page}/{pageSize}")
    public WorkFlowPageResult NextList(@PathVariable int id,@PathVariable int page, @PathVariable int pageSize,
                                       HttpServletRequest request) throws MyException {
        String creator = getUserName();
        if (!creator.equals("anonymousUser")) {
            try {
                String resultString = ResponseFromUrl.GetResult(workflow_url + "/workflow/api/transitions/next/list/" + id +
                        "?format=json&limit=" + pageSize + "&offset=" + (page - 1) * pageSize);
                System.out.println(resultString);
                String total = "0";
                String jsonArray = null;
                JSONObject jso = new JSONObject(resultString);
                if (jso.has("meta")) {
                    String meta = jso.getJSONObject("meta").toString();
                    JSONObject jso2 = new JSONObject(meta);
                    if (jso2.has("total_count")) {
                        total = jso2.get("total_count").toString();
                    }
                }
                if (jso.has("objects")) {
                    jsonArray = jso.get("objects").toString();

                }
                ObjectMapper mapper = new ObjectMapper();
                Object object = mapper.readValue(jsonArray, Object.class);
                WorkFlowPageResult pageResult = new WorkFlowPageResult();
                pageResult.setPage(page);
                pageResult.setPagesize(pageSize);
                pageResult.setTotal(Integer.parseInt(total));
                pageResult.setResult(object);
                return pageResult;
            } catch (Exception e) {
                throw new MyException(ConstClass.WorkFlowError);
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }

    /**
     * 错发回收
     * @param page
     * @param pageSize
     * @param request
     * @return
     * @throws MyException
     */
    @RequestMapping(value = "api/taskinstanceslist/Retrieve/{page}/{pageSize}")
    public WorkFlowPageResult Retrieve(@PathVariable int page, @PathVariable int pageSize,
                                       HttpServletRequest request) throws MyException {
        String creator = getUserName();
        String search = request.getParameter("searchName");
        if (!creator.equals("anonymousUser")) {
            try {
                String url = workflow_url + "/workflow/api/taskinstanceslist/retrieve/list/?format=json&task_user=" + creator + "&limit=" + pageSize + "&offset=" + (page - 1) * pageSize;
                if (search!=""){
                    url = url + "&sn__icontains="+search;
                }
                String resultString = ResponseFromUrl.GetResult(url);
                String total = "0";
                String jsonArray = null;
                JSONObject jso = new JSONObject(resultString);
                if (jso.has("meta")) {
                    String meta = jso.getJSONObject("meta").toString();
                    JSONObject jso2 = new JSONObject(meta);
                    if (jso2.has("total_count")) {
                        total = jso2.get("total_count").toString();
                    }
                }
                if (jso.has("objects")) {
                    jsonArray = jso.get("objects").toString();

                }
                ObjectMapper mapper = new ObjectMapper();
                Object object = mapper.readValue(jsonArray, Object.class);
                WorkFlowPageResult pageResult = new WorkFlowPageResult();
                pageResult.setPage(page);
                pageResult.setPagesize(pageSize);
                pageResult.setTotal(Integer.parseInt(total));
                pageResult.setResult(object);
                return pageResult;
            } catch (Exception e) {
                throw new MyException(ConstClass.WorkFlowError);
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }

    @RequestMapping(value = "api/taskinstances/recovery/{id}")
    public ResultMessage Recovery(@PathVariable String id, HttpServletRequest request) throws MyException {
        String creator = getUserName();
        if (!creator.equals("anonymousUser")) {
            try {
                String resultString = ResponseFromUrl.doDelete(workflow_url + "/workflow/api/taskinstances/"+id+"/");
                System.out.println(resultString);
                if (resultString == "ok"){
                    return Msg(true,"回收成功");
                }else {
                    return Msg(false,"回收失败");
                }
            } catch (Exception e) {
                throw new MyException(ConstClass.WorkFlowError);
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }

    private List<TranslateDomain> translate(String jsonString){
        List<TranslateDomain> translateDomainList = new ArrayList<TranslateDomain>();
        JSONArray jsonArray = new JSONArray(jsonString);
        for (int i = 0;i < jsonArray.length();i++){
            String temp = jsonArray.get(i).toString();
            JSONObject jso = new JSONObject(temp);
            String current_state = "";
            TranslateDomain translateDomain = new TranslateDomain();
            if (jso.has("creator")){
                translateDomain.setCreator(jso.get("creator").toString());
            }
            if (jso.has("modifytime")){
                translateDomain.setModifytime(jso.get("modifytime").toString());
            }
            if (jso.has("current_state")){
                translateDomain.setCurrent_state(jso.get("current_state").toString());
                current_state = jso.get("current_state").toString();
            }
            if (jso.has("related_table")){
                translateDomain.setRelated_table(jso.get("related_table").toString());
            }
            String serialNumber = "";
            if (jso.has("identity_field_value")) {
                translateDomain.setIdentity_field_value(jso.get("identity_field_value").toString());
            }
                /*
                String objectid = jso.get("identity_field_value").toString();
                if (current_state.equals("已完成")) {
                    String sql = "select ur.* from user_repair as ur where ur.objectid = " + objectid;
                    List<UserRepair> userRepair = userRepairService.findByDataSQL(sql);
                    if (userRepair != null) {
                        serialNumber = userRepair.get(0).getSerialNumber();
                        int flag = userRepair.get(0).getCommentFlag();
                        if (flag == 2) {
                            translateDomain.setCommentFlag("1");
                        } else {
                            translateDomain.setCommentFlag("0");
                        }
                    }
                }else {
                    translateDomain.setCommentFlag("1");
                }
            }*/
            translateDomain.setSerialNumber(serialNumber);
            if (jso.has("starttime")){
                translateDomain.setStarttime(jso.get("starttime").toString());
            }
            if (jso.has("title")){
                translateDomain.setTitle(jso.get("title").toString());
            }
            if (jso.has("addtime")){
                translateDomain.setAddtime(jso.get("addtime").toString());
            }
            if (jso.has("is_canceled")){
                translateDomain.setIs_canceled(jso.get("is_canceled").toString());
            }
            if (jso.has("process_name")){
                translateDomain.setProcess_name(jso.get("process_name").toString());
                String tmp = jso.get("process_name").toString();
                if(tmp.contains("物业")){
                    translateDomain.setType("1");
                }else {
                    translateDomain.setType("2");
                }
            }

            if (jso.has("id")) {
                translateDomain.setId(jso.get("id").toString());
            }
            if (jso.has("sn")){
                translateDomain.setSn(jso.get("sn").toString());
            }

            if (jso.has("can_retrieve")){
                translateDomain.setCan_retrieve(jso.get("can_retrieve").toString());
            }

            translateDomainList.add(translateDomain);
        }
        return translateDomainList;
    }

    private List<TranslateDomain2> myApplyTranslate(String jsonString){
        List<TranslateDomain2> translateDomainList = new ArrayList<TranslateDomain2>();
        JSONArray jsonArray = new JSONArray(jsonString);
        for (int i = 0;i < jsonArray.length();i++){
            String temp = jsonArray.get(i).toString();
            JSONObject jso = new JSONObject(temp);
            String current_state = "";
            TranslateDomain2 translateDomain = new TranslateDomain2();
            if (jso.has("creator")){
                translateDomain.setCreator(jso.get("creator").toString());
            }
            if (jso.has("modifytime")){
                translateDomain.setModifytime(jso.get("modifytime").toString());
            }
            if (jso.has("complete_date")){
                translateDomain.setComplete_date(jso.get("complete_date").toString());
                current_state = jso.get("complete_date").toString();
            }
            if (jso.has("content")){
                translateDomain.setContent(jso.get("content").toString());
            }
            if (jso.has("display_state")){
                translateDomain.setDisplay_state(jso.get("display_state").toString());
            }
            if (jso.has("duetime")){
                translateDomain.setDuetime(jso.get("duetime").toString());
            }
            if (jso.has("id")){
                translateDomain.setId(jso.get("id").toString());
            }
            if (jso.has("identity_field_value")){
                translateDomain.setIdentity_field_value(jso.get("identity_field_value").toString());
            }
            if (jso.has("is_due")){
                translateDomain.setIs_due(jso.get("is_due").toString());
            }
            if (jso.has("process_instance_id")){
                translateDomain.setProcess_instance_id(jso.get("process_instance_id").toString());
            }
            if (jso.has("process_name")){
                translateDomain.setProcess_name(jso.get("process_name").toString());
            }
            if (jso.has("addtime")){
                translateDomain.setAddtime(jso.get("addtime").toString());
            }
            if (jso.has("state")){
                translateDomain.setState(jso.get("state").toString());
            }
            if (jso.has("task_name")){
                translateDomain.setTask_name(jso.get("task_name").toString());
            }

            if (jso.has("sn")){
                translateDomain.setSn(jso.get("sn").toString());
            }
            if (jso.has("can_retrieve")){
                translateDomain.setCan_retrieve(jso.get("can_retrieve").toString());
            }
            if (jso.has("pre_task_instance")){
                if (jso.get("pre_task_instance").toString().equals("")||jso.get("pre_task_instance").toString().equals(null) || jso.get("pre_task_instance").toString()==""||jso.get("pre_task_instance").toString() == null){
                    translateDomain.setPre_task_instance("false");
                }else {
                    String[] tempArray = jso.get("pre_task_instance").toString().split(",");
                    if (tempArray.length > 1){
                        translateDomain.setPre_task_instance("true");
                    }else {
                        translateDomain.setPre_task_instance("false");
                    }
                }
            }else {
                translateDomain.setPre_task_instance("false");
            }

            translateDomainList.add(translateDomain);
        }
        return translateDomainList;
    }

    @RequestMapping(value = "api/pistatcount")
    public Object Pistatcount() throws MyException {
        try {
            String resultString = ResponseFromUrl.GetResult(workflow_url + "/workflow/api/pistatcount");
            System.out.println(resultString);
            ObjectMapper mapper = new ObjectMapper();
            Object object = mapper.readValue(resultString, Object.class);
            return object;
        } catch (Exception e) {
            throw new MyException(ConstClass.WorkFlowError);
        }
    }

    @RequestMapping(value = "api/duestatdate")
    public Object Duestatdate(HttpServletRequest request) throws MyException {
        String beginDate = request.getParameter("beginDate")+" 00:00:00";
        String endDate = request.getParameter("endDate")+" 23:59:59";
        String query = request.getParameter("query");
        String flag = request.getParameter("flag");
        String s = "";
        if (query.equals("a")){
            s = "/workflow/api/duestatdate?beginDate="+beginDate+"&endDate="+endDate+"&flag="+flag;
        }else{
            s = "/workflow/api/duestatdate?beginDate="+beginDate+"&endDate="+endDate+"&query="+query+"&flag="+flag;
        }
        try {
            String resultString = ResponseFromUrl.GetResult(workflow_url + s);
            System.out.println(resultString);
            ObjectMapper mapper = new ObjectMapper();
            Object object = mapper.readValue(resultString, Object.class);
            return object;
        } catch (Exception e) {
            throw new MyException(ConstClass.WorkFlowError);
        }
    }

    @RequestMapping(value = "api/duestatcount")
    public Object Duestatcount() throws MyException {
        try {
            String resultString = ResponseFromUrl.GetResult(workflow_url + "/workflow/api/duestatcount");
            System.out.println(resultString);
            ObjectMapper mapper = new ObjectMapper();
            Object object = mapper.readValue(resultString, Object.class);
            return object;
        } catch (Exception e) {
            throw new MyException(ConstClass.WorkFlowError);
        }
    }

    @RequestMapping(value = "api/pistatdate")
    public Object pistatdate(HttpServletRequest request) throws MyException {
        String beginDate = request.getParameter("beginDate")+" 00:00:00";
        String endDate = request.getParameter("endDate")+" 23:59:59";
        String query = request.getParameter("query");
        String flag = request.getParameter("flag");
        String s = "";
        if (query.equals("a")){
            s = "/workflow/api/pistatdate?beginDate="+beginDate+"&endDate="+endDate+"&flag="+flag;
        }else {
            s = "/workflow/api/pistatdate?beginDate="+beginDate+"&endDate="+endDate+"&query="+query+"&flag="+flag;
        }
        try {
            String resultString = ResponseFromUrl.GetResult(workflow_url + s);
            System.out.println(resultString);
            ObjectMapper mapper = new ObjectMapper();
            Object object = mapper.readValue(resultString, Object.class);
            return object;
        } catch (Exception e) {
            throw new MyException(ConstClass.WorkFlowError);
        }
    }
    /**
     * 退回上一步
     * @param request
     * @return
     * @throws MyException
     */
    @RequestMapping(value = "api/sendback/{id}",method = RequestMethod.POST)
    public ResultMessage SendBack(@PathVariable String id, HttpServletRequest request) throws MyException {
        String currentuser = getUserName();
        if (!currentuser.equals("anonymousUser")) {
            String result = ResponseFromUrl.postJson(workflow_url + "/workflow/api/sendback/"+id,null);
            if (result == "ok") {
                return Msg(true, ConstClass.OperationSuccess);
            } else {
                return Msg(false, ConstClass.WorkFlowError);
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }

    /**
     * 流程跟踪
     * @param page
     * @param pageSize
     * @param request
     * @return
     * @throws MyException
     */
    @RequestMapping(value = "api/processinstances/{page}/{pageSize}")
    public WorkFlowPageResult Processinstances(@PathVariable int page, @PathVariable int pageSize,
                                               HttpServletRequest request) throws MyException {
        String process__business__id = request.getParameter("process__business__id");
        String sn__contains = request.getParameter("sn__contains");
        String starttime__gte = request.getParameter("starttime__gte");
        String starttime__lte = request.getParameter("starttime__lte");
        if (starttime__gte!=null && starttime__gte!=""){
            starttime__gte += " 00:00:00";
        }
        if (starttime__lte!=null && starttime__lte!=""){
            starttime__lte += " 23:59:59";
        }
        String creator = getUserName();
        if (!creator.equals("anonymousUser")) {
            String sql = "SELECT * from roles as r INNER JOIN role_user as ru ON r.rolename = ru.rolename WHERE ru.username = '"+creator+"'";
            List<Role> roleList = roleService.findByDataSQL(sql);
            StringBuffer sb = new StringBuffer();
            for (Role role:roleList){
                sb.append(role.getRolename()+",");
            }
            sb.deleteCharAt(sb.length()-1);
            StringBuffer params = new StringBuffer();
            if ("".equals(process__business__id)|| process__business__id==null||"null".equals(process__business__id)){
            }else {
                params.append("&process__business__id="+process__business__id);
            }
            if ("".equals(sn__contains)|| sn__contains== null|| "null".equals(sn__contains)){
            }else {
                params.append("&sn__icontains="+sn__contains);
            }
            if ("".equals(starttime__gte) || starttime__gte == null||"null".equals(starttime__gte)){
            }else {
                params.append("&starttime__gte="+starttime__gte);
            }
            if ("".equals(starttime__lte) || starttime__lte==null || "null".equals(starttime__lte)){
            }else {
                params.append("&starttime__lte="+starttime__lte);
            }
            params.append("&roles="+sb);
            try {
                String resultString = ResponseFromUrl.GetResult(workflow_url + "/workflow/api/processinstances/?format=json"+params.toString()+"&limit=" + pageSize + "&offset=" + (page - 1) * pageSize);
                System.out.println(resultString);
                String total = "0";
                String jsonArray = null;
                JSONObject jso = new JSONObject(resultString);
                if (jso.has("meta")) {
                    String meta = jso.getJSONObject("meta").toString();
                    JSONObject jso2 = new JSONObject(meta);
                    if (jso2.has("total_count")) {
                        total = jso2.get("total_count").toString();
                    }
                }
                if (jso.has("objects")) {
                    jsonArray = jso.get("objects").toString();

                }
                ObjectMapper mapper = new ObjectMapper();
                Object object = mapper.readValue(jsonArray, Object.class);
                WorkFlowPageResult pageResult = new WorkFlowPageResult();
                pageResult.setPage(page);
                pageResult.setPagesize(pageSize);
                pageResult.setTotal(Integer.parseInt(total));
                pageResult.setResult(object);
                return pageResult;
            } catch (Exception e) {
                throw new MyException(ConstClass.WorkFlowError);
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }
    /**
     * 流程跟踪
     * @param page
     * @param pageSize
     * @param request
     * @return
     * @throws MyException
     */
    @RequestMapping(value = "api/processinstances/my_apply/done/{page}/{pageSize}")
    public WorkFlowPageResult MyApplyDone(@PathVariable int page, @PathVariable int pageSize,
                                          HttpServletRequest request) throws MyException {
        String creator = getUserName();
        if (!creator.equals("anonymousUser")) {
            try {
                String resultString = ResponseFromUrl.GetResult(workflow_url + "/workflow/api/processinstances/my_apply/list/?format=json&creator="+creator+"&taskinstances__state=done&taskinstances__task__nodetype=end&limit=" + pageSize + "&offset=" + (page - 1) * pageSize);
                System.out.println(resultString);
                String total = "0";
                String jsonArray = null;
                JSONObject jso = new JSONObject(resultString);
                if (jso.has("meta")) {
                    String meta = jso.getJSONObject("meta").toString();
                    JSONObject jso2 = new JSONObject(meta);
                    if (jso2.has("total_count")) {
                        total = jso2.get("total_count").toString();
                    }
                }
                if (jso.has("objects")) {
                    jsonArray = jso.get("objects").toString();

                }
                ObjectMapper mapper = new ObjectMapper();
                Object object = mapper.readValue(jsonArray, Object.class);
                WorkFlowPageResult pageResult = new WorkFlowPageResult();
                pageResult.setPage(page);
                pageResult.setPagesize(pageSize);
                pageResult.setTotal(Integer.parseInt(total));
                pageResult.setResult(object);
                return pageResult;
            } catch (Exception e) {
                throw new MyException(ConstClass.WorkFlowError);
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }

    /**
     * 显示流转情况列表
     * @param page
     * @param pageSize
     * @param id
     * @param request
     * @return
     * @throws MyException
     */
    @RequestMapping(value = "api/taskinstances/history/{id}/{page}/{pageSize}")
    public WorkFlowPageResult Taskinstances(@PathVariable int page, @PathVariable int pageSize,@PathVariable String id,
                                            HttpServletRequest request) throws MyException {
        String creator = getUserName();
        if (!creator.equals("anonymousUser")) {
            try {
                String resultString = ResponseFromUrl.GetResult(workflow_url + "/workflow/api/taskinstances/?format=json&process_instance__id="+id+"&limit=" + pageSize + "&offset=" + (page - 1) * pageSize);
                System.out.println(resultString);
                String total = "0";
                String jsonArray = null;
                JSONObject jso = new JSONObject(resultString);
                if (jso.has("meta")) {
                    String meta = jso.getJSONObject("meta").toString();
                    JSONObject jso2 = new JSONObject(meta);
                    if (jso2.has("total_count")) {
                        total = jso2.get("total_count").toString();
                    }
                }
                if (jso.has("objects")) {
                    jsonArray = jso.get("objects").toString();

                }
                ObjectMapper mapper = new ObjectMapper();
                Object object = mapper.readValue(jsonArray, Object.class);
                WorkFlowPageResult pageResult = new WorkFlowPageResult();
                pageResult.setPage(page);
                pageResult.setPagesize(pageSize);
                pageResult.setTotal(Integer.parseInt(total));
                pageResult.setResult(object);
                return pageResult;
            } catch (Exception e) {
                throw new MyException(ConstClass.WorkFlowError);
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }

    /***
     * 列表
     * @param request
     * @return
     * @throws MyException
     */
    @RequestMapping(value = "api/business")
    public Object apiBusiness( HttpServletRequest request) throws MyException {
        String creator = getUserName();
        if (!creator.equals("anonymousUser")) {
            try {
                String resultString = ResponseFromUrl.GetResult(workflow_url + "/workflow/api/business/?format=json");
                System.out.println(resultString);
                ObjectMapper mapper = new ObjectMapper();
                Object object = mapper.readValue(resultString, Object.class);
                return object;
            } catch (Exception e) {
                throw new MyException(ConstClass.WorkFlowError);
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }


    /***
     * 获取当前审批意见
     * @param request
     * @return
     * @throws MyException
     */
    @RequestMapping(value = "api/taskinstances/curent/{id}")
    public Object apiCurentTaskinstances(HttpServletRequest request) throws MyException {
        String creator = getUserName();
        String tid = request.getParameter("tid");

        if (!creator.equals("anonymousUser")) {
            try {
                String resultString = ResponseFromUrl.GetResult(workflow_url + "/workflow/api/taskinstances/"+tid+"/?format=json");
                System.out.println(resultString);
                ObjectMapper mapper = new ObjectMapper();
                Object object = mapper.readValue(resultString, Object.class);
                return object;
            } catch (Exception e) {
                throw new MyException(ConstClass.WorkFlowError);
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }
    /***
     * 显示历史审批意见
     * @param request
     * @return
     * @throws MyException
     */
    @RequestMapping(value = "api/taskinstances/history/opinion/List/{page}/{pageSize}/{heikeji}")
    public Object apiHistoryTaskinstances(@PathVariable int page,@PathVariable int pageSize, HttpServletRequest request) throws MyException {
        String creator = getUserName();
        String piid = request.getParameter("piid");
        String tid = request.getParameter("tid");

        if (!creator.equals("anonymousUser")) {
            try {
                String resultString = ResponseFromUrl.GetResult(workflow_url + "/workflow/api/taskinstances/"+piid+"/history/"+tid+"/?format=json&limit=" + pageSize + "&offset=" + (page - 1) * pageSize);
                System.out.println(resultString);
                ObjectMapper mapper = new ObjectMapper();
                Object object = mapper.readValue(resultString, Object.class);
                return object;
            } catch (Exception e) {
                throw new MyException(ConstClass.WorkFlowError);
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }

    /***
     * 发起人撤销
     * @param request
     * @return
     * @throws MyException
     */
    @RequestMapping(value = "api/usercallback")
    public Object apiUsercallback( HttpServletRequest request) throws MyException {
        String creator = getUserName();
        String id = request.getParameter("id");
        if (!creator.equals("anonymousUser")) {
            try {
                String resultString = ResponseFromUrl.sendPost(workflow_url + "/workflow/api/usercallback/"+id,"");
                System.out.println(resultString);
                ObjectMapper mapper = new ObjectMapper();
                Object object = mapper.readValue(resultString, Object.class);
                return object;
            } catch (Exception e) {
                throw new MyException(ConstClass.WorkFlowError);
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }

    /***
     * 服务次数统计
     * @param request
     * @return
     * @throws MyException
     */
    @RequestMapping(value = "api/pistatbytype")
    public Object apiPistatbytype( HttpServletRequest request) throws MyException {
        String creator = getUserName();
        if (!creator.equals("anonymousUser")) {
            try {
                String resultString = ResponseFromUrl.GetResult(workflow_url + "/workflow/api/pistatbytype");
                System.out.println(resultString);
                ObjectMapper mapper = new ObjectMapper();
                Object object = mapper.readValue(resultString, Object.class);
                return object;
            } catch (Exception e) {
                throw new MyException(ConstClass.WorkFlowError);
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }

    /***
     * 汇智卡申请
     * @param request
     * @return
     * @throws MyException
     */
    @RequestMapping(value = "api/hzcardapply")
    public Object apiCardApply( HttpServletRequest request) throws MyException {
        String creator = getUserName();
        if (!creator.equals("anonymousUser")) {
            try {
                String resultString = ResponseFromUrl.GetResult(workflow_url + "/workflow/api/processinstances/my_apply/list/?format=json&creator="+creator+"&process__related_table=applypcard");
                System.out.println(resultString);
                ObjectMapper mapper = new ObjectMapper();
                Object object = mapper.readValue(resultString, Object.class);
                return object;
            } catch (Exception e) {
                throw new MyException(ConstClass.WorkFlowError);
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }
}