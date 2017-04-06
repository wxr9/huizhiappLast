package com.wiseonline.Controller.Mettingroom;

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
import java.util.Date;
import java.util.List;

/**
 * Created by yanwj on 2016/2/22.
 */
@RestController
@RequestMapping("/Mettingroom/UserMeetingroom")
public class UserMeetingroomController extends BaseController {

    @Autowired
    UserMeetingroomServiceImpl userMeetingroomService;
    @Autowired
    MettingroomServiceImpl mettingroomService;

    @Autowired
    WorkFlowUtils workFlowUtils;
    @Autowired
    UserMeetingroomVerifyServiceImpl userMeetingroomVerifyService;
    @Autowired
    UserMeetingroomApplyServiceImpl userMeetingroomApplyService;
    @Autowired
    MainBusinessServiceImpl mainBusinessService;

    @RequestMapping(value = "List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看会议室申请列表", module = "前台-会议室")
    public PageResult<UserMeetingroom> getAll(@PathVariable int page,
                                              @PathVariable int pageSize, UserMeetingroom Model) {
        PageResult<UserMeetingroom> models = userMeetingroomService.findAll(page, pageSize, Model);
        return models;
    }

    @RequestMapping(value = "Add", method = RequestMethod.POST)
    @PermissionInfo(name = "添加会议室申请", module = "前台-会议室")
    public ResultMessage Add(UserMeetingroom Model, Date[] dateTimeArray, String[] beginTimeArray, String[] endTimeArray, int meetingroomId) throws MyException, ParseException {
        CreateDomain createDomain = workFlowUtils.Create(6);
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            if ("ok".equals(isUserInfoComplete())) {
                Model.setSerialNumber(getMaxSN("HY"));
                Model.setUsername(username);
                boolean rst = userMeetingroomService.saveGetID(Model);
                if (rst) {
                    MainBusiness mainBusiness = new MainBusiness();
                    mainBusiness.setSerialNumber(Model.getSerialNumber());
                    mainBusiness.setBusinessId(Model.getObjectid());
                    mainBusiness.setBusinessType("userMeetingroom");
                    mainBusiness.setBusinessTypeZh("会议室预定");
                    mainBusiness.setChineseName(Model.getChineseName());
                    mainBusiness.setCommentFlag(1);
                    mainBusiness.setCompany(Model.getCompany());
                    mainBusiness.setEmail(Model.getEmail());
                    mainBusiness.setPhone(Model.getPhone());
                    mainBusiness.setUsername(Model.getUsername());
                    mainBusinessService.save(mainBusiness);
                    for (int i = 0; i < dateTimeArray.length; i++) {
                        UserMeetingroomApply userMeetingroomApply = new UserMeetingroomApply();
                        Mettingroom mettingroom = mettingroomService.getbyId(meetingroomId);
                        userMeetingroomApply.setApplyDate(dateTimeArray[i]);
                        userMeetingroomApply.setBeginTime(beginTimeArray[i]);
                        userMeetingroomApply.setEndTime(endTimeArray[i]);
                        userMeetingroomApply.setMettingroom(mettingroom);
                        userMeetingroomApply.setUserMeetingroom(Model);
                        userMeetingroomApplyService.save(userMeetingroomApply);
                    }
                    try {
                        workFlowUtils.NewTransfer(createDomain, Model.getSerialNumber(), Model.getObjectid(), "hy");
                    } catch (MyException e) {
                        userMeetingroomService.delete(Model.getObjectid());
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
    }

    @RequestMapping(value = "Admin/Add", method = RequestMethod.POST)
    @PermissionInfo(name = "添加会议室申请", module = "前台-会议室")
    public ResultMessage AdminAdd(UserMeetingroom Model, Date[] dateTimeArray, String[] beginTimeArray, String[] endTimeArray, int meetingroomId) throws MyException, ParseException {
        CreateDomain createDomain = workFlowUtils.Create(6);
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            for (int i = 0; i < dateTimeArray.length;i++){
                    for (int j = i+1;j < dateTimeArray.length;j++){
                            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                            SimpleDateFormat sdfwh = new SimpleDateFormat("yyyy-MM-dd HH:mm");
                            String str = sdf.format(dateTimeArray[i]);
                            String beginDate = str + " " + beginTimeArray[i];
                            String endDate = str + " " + endTimeArray[i];

                            String strj = sdf.format(dateTimeArray[j]);
                            String beginDatej = strj + " " + beginTimeArray[j];
                            String endDatej = strj + " " + endTimeArray[j];
                            try {
                                Date beginDateTime = sdfwh.parse(beginDate);
                                Date endDateTime = sdfwh.parse(endDate);
                                Date beginDateTimej = sdfwh.parse(beginDatej);
                                Date endDateTimej = sdfwh.parse(endDatej);
                                if (beginDateTime.getTime() < beginDateTimej.getTime() && beginDateTimej.getTime() < endDateTime.getTime()) {
                                    //重合

                                    throw  new MyException("会议室时间有误！");
                                }
                                if (beginDateTime.getTime() < endDateTimej.getTime() && beginDateTimej.getTime() < endDateTime.getTime()) {
                                    //重合

                                    throw  new MyException("会议室时间有误！");
                                }
                                if (beginDateTime.getTime() == beginDateTimej.getTime() && endDateTime.getTime() == endDateTimej.getTime()){
                                    //重合

                                    throw  new MyException("会议室时间有误！");
                                }

                            } catch (ParseException e) {
                                e.printStackTrace();

                                throw  new MyException("会议室时间有误！");
                            }
                        }
                    }


            for (int i = 0; i < dateTimeArray.length; i++) {
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                    String str = sdf.format(dateTimeArray[i]);
                    String beginDate = str + " " + beginTimeArray[i];
                    String endDate = str + " " + endTimeArray[i];
                    String sql2 = "SELECT COUNT(BD) FROM (" +
                            "SELECT STR_TO_DATE(CONCAT(umv.apply_date,umv.begin_time),'%Y-%m-%d %H:%i:%s') AS BD,STR_TO_DATE(CONCAT(umv.apply_date,umv.end_time),'%Y-%m-%d %H:%i:%s') AS ED" +
                            " FROM user_meetingroom_verify as umv WHERE umv.meetingroom_id = " + meetingroomId+
                            ") AA WHERE  ('"+beginDate+"' BETWEEN AA.BD AND AA.ED OR '"+endDate+"' BETWEEN AA.BD AND AA.ED OR AA.BD Between '"+beginDate+"' AND '"+endDate+"' OR AA.ED Between '"+beginDate+"' AND '"+endDate+"')";
                    int count = userMeetingroomVerifyService.getCountBySQL(sql2);
                    if (0 < count) {
                        throw new MyException("会议室时间有误！");
                    }
            }



            Model.setSerialNumber(getMaxSN("HY"));
            Model.setUsername(username);
            boolean rst = userMeetingroomService.saveGetID(Model);
            MainBusiness mainBusiness = new MainBusiness();
            mainBusiness.setSerialNumber(Model.getSerialNumber());
            mainBusiness.setBusinessId(Model.getObjectid());
            mainBusiness.setBusinessType("userMeetingroom");
            mainBusiness.setBusinessTypeZh("会议室预定");
            mainBusiness.setChineseName(Model.getChineseName());
            mainBusiness.setCommentFlag(1);
            mainBusiness.setCompany(Model.getCompany());
            mainBusiness.setEmail(Model.getEmail());
            mainBusiness.setPhone(Model.getPhone());
            mainBusiness.setUsername(Model.getUsername());
            mainBusinessService.save(mainBusiness);
            if (rst) {
                /*for (int i = 0;i < dateTimeArray.length;i++){
                    String sql = "select * from user_meetingroom_verify where apply_date = '"+dateTimeArray[i]+"' and beginTime = '"+beginTimeArray[i]+"' and end_time = and user_meetingroom_id = "+meetingroomId;
                    List<UserMeetingroomVerify> userMeetingroomVerifyList = userMeetingroomVerifyService.findByDataSQL(sql);
                    if (userMeetingroomVerifyList != null){
                        if (0 < userMeetingroomVerifyList.size()){
                            throw new MyException("会议室时间有误！");
                        }
                    }
                }*/
                for (int i = 0; i < dateTimeArray.length; i++) {
                    UserMeetingroomVerify userMeetingroomVerify = new UserMeetingroomVerify();
                    Mettingroom mettingroom = mettingroomService.getbyId(meetingroomId);
                    userMeetingroomVerify.setApplyDate(dateTimeArray[i]);
                    userMeetingroomVerify.setBeginTime(beginTimeArray[i]);
                    userMeetingroomVerify.setEndTime(endTimeArray[i]);
                    userMeetingroomVerify.setMettingroom(mettingroom);
                    userMeetingroomVerify.setUserMeetingroom(Model);
                    userMeetingroomVerifyService.save(userMeetingroomVerify);
                }
                return Msg(true, ConstClass.ResultSaveSuccess);
            } else {
                return Msg(false, ConstClass.ResultSaveFault);
            }
        } else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }

    @RequestMapping(value = "Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "编辑会议室申请", module = "前台-会议室")
    public UserMeetingroom Edit(@PathVariable int id) {
        UserMeetingroom model = userMeetingroomService.getbyId(id);
        return model;
    }

    @RequestMapping(value = "Update", method = RequestMethod.POST)
    @PermissionInfo(name = "更新会议室申请", module = "前台-会议室")
    public ResultMessage Update(UserMeetingroom Model, Date[] dateTimeArray, String[] beginTimeArray, String[] endTimeArray, int meetingroomId) throws MyException {
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            boolean rst = userMeetingroomService.update(Model);
            if (rst) {
                for (int i = 0; i < dateTimeArray.length; i++) {
                    UserMeetingroomVerify userMeetingroomVerify = new UserMeetingroomVerify();
                    Mettingroom mettingroom = mettingroomService.getbyId(meetingroomId);
                    userMeetingroomVerify.setApplyDate(dateTimeArray[i]);
                    userMeetingroomVerify.setBeginTime(beginTimeArray[i]);
                    userMeetingroomVerify.setEndTime(endTimeArray[i]);
                    userMeetingroomVerify.setMettingroom(mettingroom);
                    userMeetingroomVerify.setUserMeetingroom(Model);
                    userMeetingroomVerifyService.save(userMeetingroomVerify);
                }
                return Msg(true, ConstClass.ResultSaveSuccess);
            } else {
                return Msg(false, ConstClass.ResultSaveFault);
            }
        } else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }

    @RequestMapping(value = "Delete/{id}", method = RequestMethod.GET)
    @PermissionInfo(name = "删除会议室申请", module = "前台-会议室")
    public ResultMessage Delete(@PathVariable int id) {
        boolean rst = userMeetingroomService.delete(id);
        if (rst) {
            return Msg(true, ConstClass.ResultDeleteSuccess);
        } else {
            return Msg(false, ConstClass.ResultDeleteFault);
        }
    }

    public String getMaxSN(String typeName) {
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
        String sql = "select CAST(ifnull(MAX(CAST(substring_index(serial_number,'-',-1) AS UNSIGNED INTEGER)),0) as UNSIGNED INTEGER) as num\n" +
                "from user_meetingroom \n" +
                "where date_format(create_date,'%Y-%m-%d')= date_format(now(),'%Y-%m-%d')";
        int SN = userMeetingroomService.getCountBySQL(sql);
        return typeName + "-" + df.format(new Date()) + "-" + String.format("%04d", SN + 1);
    }
}
