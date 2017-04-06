package com.wiseonline.Controller.Classroom;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.*;
import com.wiseonline.Service.Impl.*;
import com.wiseonline.Utils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

/**
 * Created by yanwj on 2016/2/22.
 */
@RestController
@RequestMapping("/Classroom/UserClassroom")
public class UserClassroomController extends BaseController {

    @Autowired
    UserClassroomServiceImpl userClassroomService;
    @Autowired
    ClassroomServiceImpl classroomService;
    @Autowired
    UserClassroomApplyServiceImpl userClassroomApplyService;
    @Autowired
    UserClassroomVerifyServiceImpl userClassroomVerifyService;

    @Autowired
    WorkFlowUtils workFlowUtils;
    @Autowired
    MainBusinessServiceImpl mainBusinessService;

    @RequestMapping(value = "List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看教室申请列表", module = "前台-教室")
    public PageResult<UserClassroom> getAll(@PathVariable int page,
                                            @PathVariable int pageSize, UserClassroom Model) {
        PageResult<UserClassroom> models = userClassroomService.findAll(page, pageSize, Model);
        return models;
    }

    @RequestMapping(value = "Add", method = RequestMethod.POST)
    @PermissionInfo(name = "添加教室申请", module = "前台-教室")
    public ResultMessage Add(UserClassroom Model, Date[] dateTimeArray, String[] halfDayArray, int classroomId) throws MyException, ParseException {
        CreateDomain createDomain = workFlowUtils.Create(5);
        if (dateTimeArray.length == dateTimeArray.length) {
            if (dateTimeArray.length > 0) {
                String username = getUserName();
                if (!username.equals("anonymousUser")) {
                    if ("ok".equals(isUserInfoComplete())) {
                        Model.setSerialNumber(getMaxSN("JS"));
                        Model.setUsername(username);
                        boolean rst = userClassroomService.saveGetID(Model);
                        MainBusiness mainBusiness = new MainBusiness();
                        mainBusiness.setSerialNumber(Model.getSerialNumber());
                        mainBusiness.setBusinessId(Model.getObjectid());
                        mainBusiness.setBusinessType("userClassroom");
                        mainBusiness.setBusinessTypeZh("教室预定");
                        mainBusiness.setChineseName(Model.getChineseName());
                        mainBusiness.setCommentFlag(1);
                        mainBusiness.setCompany(Model.getCompany());
                        mainBusiness.setEmail(Model.getEmail());
                        mainBusiness.setPhone(Model.getPhone());
                        mainBusiness.setUsername(Model.getUsername());
                        mainBusinessService.save(mainBusiness);
                        if (rst) {
                            for (int i = 0; i < dateTimeArray.length; i++) {
                                UserClassroomApply userClassroomApply = new UserClassroomApply();
                                Classroom classroom = classroomService.getbyId(classroomId);
                                userClassroomApply.setClassroom(classroom);
                                userClassroomApply.setApplyDate(dateTimeArray[i]);
                                userClassroomApply.setHalfDay(halfDayArray[i]);
                                userClassroomApply.setUserClassroom(Model);
                                userClassroomApplyService.save(userClassroomApply);
                            }
                            try {
                                workFlowUtils.NewTransfer(createDomain, Model.getSerialNumber(), Model.getObjectid(), "js");
                            } catch (MyException e) {
                                userClassroomService.delete(Model.getObjectid());
                                e.printStackTrace();
                                return Msg(false, ConstClass.ResultSaveFault);
                            }
                            return Msg(true, ConstClass.ResultSaveSuccess);
                        } else {
                            return Msg(false, ConstClass.ResultSaveFault);
                        }
                    } else {
                        throw new MyException("请完善个人资料");
                    }
                } else {
                    throw new MyException(ConstClass.LoginTimeOut);
                }
            } else {
                return Msg(false, "提交数据有误");
            }
        } else {
            return Msg(false, "提交数据有误");
        }
    }

    @RequestMapping(value = "Admin/Add", method = RequestMethod.POST)
    @PermissionInfo(name = "添加教室申请", module = "前台-教室")
    public ResultMessage AdminAdd(UserClassroom Model, String[] dateTimeArray, String[] halfDayArray, int classroomId) throws MyException, ParseException {
        CreateDomain createDomain = workFlowUtils.Create(5);
        if (dateTimeArray.length == dateTimeArray.length) {
            if (dateTimeArray.length > 0) {
                String username = getUserName();
                if (!username.equals("anonymousUser")) {
                    for (int i = 0; i < dateTimeArray.length;i++) {
                            for (int j = i + 1; j < dateTimeArray.length; j++) {
                                    if (dateTimeArray[i].equals(dateTimeArray[j]) && halfDayArray[i].equals(halfDayArray[j])){
                                        throw new MyException("教室时间有误！");
                                    }
                            }
                    }
                    Model.setSerialNumber(getMaxSN("JS"));
                    Model.setUsername(username);
                    boolean rst = userClassroomService.saveGetID(Model);
                    MainBusiness mainBusiness = new MainBusiness();
                    mainBusiness.setSerialNumber(Model.getSerialNumber());
                    mainBusiness.setBusinessId(Model.getObjectid());
                    mainBusiness.setBusinessType("userClassroom");
                    mainBusiness.setBusinessTypeZh("教室预定");
                    mainBusiness.setChineseName(Model.getChineseName());
                    mainBusiness.setCommentFlag(1);
                    mainBusiness.setCompany(Model.getCompany());
                    mainBusiness.setEmail(Model.getEmail());
                    mainBusiness.setPhone(Model.getPhone());
                    mainBusiness.setUsername(Model.getUsername());
                    mainBusinessService.save(mainBusiness);
                    if (rst) {
                        for (int i = 0;i < dateTimeArray.length;i++){
                            String sql = "select * from user_classroom_verify where apply_date = '"+dateTimeArray[i]+"' and half_day = '"+halfDayArray[i]+"' and classroom_id = "+classroomId+" and user_classroom_id != "+Model.getObjectid();
                            List<UserClassroomVerify> userClassroomVerifyList = userClassroomVerifyService.findByDataSQL(sql);
                            if (userClassroomVerifyList != null){
                                if (0 < userClassroomVerifyList.size()){
                                    throw new MyException("教室时间有误！");
                                }
                            }
                        }
                        SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
                        Classroom classroom = classroomService.getbyId(classroomId);
                        for (int i = 0; i < dateTimeArray.length; i++) {
                            UserClassroomVerify userClassroomVerify = new UserClassroomVerify();
                            userClassroomVerify.setClassroom(classroom);
                            Date date = sdf.parse(dateTimeArray[i]);
                            userClassroomVerify.setApplyDate(date);
                            userClassroomVerify.setHalfDay(halfDayArray[i]);
                            userClassroomVerify.setUserClassroom(Model);
                            userClassroomVerifyService.save(userClassroomVerify);
                        }
                        return Msg(true, ConstClass.ResultSaveSuccess);
                    } else {
                        return Msg(false, ConstClass.ResultSaveFault);
                    }
                } else {
                    throw new MyException(ConstClass.LoginTimeOut);
                }
            } else {
                return Msg(false, "提交数据有误");
            }
        } else {
            return Msg(false, "提交数据有误");
        }
    }

    @RequestMapping(value = "Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "编辑教室申请", module = "前台-教室")
    public UserClassroom Edit(@PathVariable int id) {
        UserClassroom model = userClassroomService.getbyId(id);
        return model;
    }

    @RequestMapping(value = "Update", method = RequestMethod.POST)
    @PermissionInfo(name = "更新教室申请", module = "前台-教室")
    public ResultMessage Update(UserClassroom Model, Date[] dateTimeArray, String[] halfDayArray, int classroomId) throws MyException {
        if (dateTimeArray.length == dateTimeArray.length) {
            if (dateTimeArray.length > 0) {
                String username = getUserName();
                if (!username.equals("anonymousUser")) {
                    boolean rst = userClassroomService.update(Model);
                    if (rst) {
                        for (int i = 0;i < dateTimeArray.length;i++){
                            String sql = "select * from user_classroom_verify where apply_date = '"+dateTimeArray[i]+"' and half_day = "+halfDayArray[i]+" and classroom_id = "+classroomId+" and user_classroom_id != "+Model.getObjectid();
                            List<UserClassroomVerify> userClassroomVerifyList = userClassroomVerifyService.findByDataSQL(sql);
                            if (userClassroomVerifyList != null){
                                if (0 < userClassroomVerifyList.size()){
                                    throw new MyException("教室时间有误！");
                                }
                            }
                        }
                        for (int i = 0; i < dateTimeArray.length; i++) {
                            UserClassroomVerify userClassroomVerify = new UserClassroomVerify();
                            Classroom classroom = classroomService.getbyId(classroomId);
                            userClassroomVerify.setClassroom(classroom);
                            userClassroomVerify.setApplyDate(dateTimeArray[i]);
                            userClassroomVerify.setHalfDay(halfDayArray[i]);
                            userClassroomVerify.setUserClassroom(Model);
                            userClassroomVerifyService.save(userClassroomVerify);
                        }
                        return Msg(true, ConstClass.ResultSaveSuccess);
                    } else {
                        return Msg(false, ConstClass.ResultSaveFault);
                    }
                } else {
                    throw new MyException(ConstClass.LoginTimeOut);
                }
            } else {
                return Msg(false, "提交数据有误");
            }
        } else {
            return Msg(false, "提交数据有误");
        }
    }

    @RequestMapping(value = "Delete/{id}", method = RequestMethod.GET)
    @PermissionInfo(name = "删除教室申请", module = "前台-教室")
    public ResultMessage Delete(@PathVariable int id) {
        boolean rst = userClassroomService.delete(id);
        if (rst) {
            return Msg(true, ConstClass.ResultDeleteSuccess);
        } else {
            return Msg(false, ConstClass.ResultDeleteFault);
        }
    }

    public String getMaxSN(String typeName) {
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
        String sql = "select CAST(ifnull(MAX(CAST(substring_index(serial_number,'-',-1) AS UNSIGNED INTEGER)),0) as UNSIGNED INTEGER) as num\n" +
                "from user_classroom \n" +
                "where date_format(create_date,'%Y-%m-%d')= date_format(now(),'%Y-%m-%d')";
        int SN = userClassroomService.getCountBySQL(sql);
        return typeName + "-" + df.format(new Date()) + "-" + String.format("%04d", SN + 1);
    }
}
