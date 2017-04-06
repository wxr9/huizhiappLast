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

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by yanwj on 2016/4/5.
 */
@RestController
@RequestMapping("/Mettingroom/UserMeetingroomVerify")
public class UserMeetingroomVerifyController extends BaseController {

    @Autowired
    UserMeetingroomVerifyServiceImpl userMeetingroomVerifyService;
    @Autowired
    UserMeetingroomApplyServiceImpl userMeetingroomApplyService;
    @Autowired
    MettingroomServiceImpl mettingroomService;
    @Autowired
    UserMeetingroomServiceImpl userMeetingroomService;

    @RequestMapping(value = "Itinerary/Find", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "会议室日程", module = "前台-教室")
    public List<MeetingroomItinerary> getAll(HttpServletRequest request) {
        String beginDate = request.getParameter("beginDate");
        String endDate = request.getParameter("endDate");
        String sql = "SELECT distinct mt.`name`,td.date, \n" +
                "        case when td.date = ucv.apply_date then ucv.begin_time else 'null' end begin_time,\n" +
                "        case when td.date = ucv.apply_date then ucv.end_time else 'null' end end_time,\n" +
                "        case when td.date = ucv.apply_date then um.chinese_name else 'null' end chinese_name\n" +
                "FROM mettingroom as mt LEFT JOIN user_meetingroom_verify as ucv ON mt.objectid = ucv.meetingroom_id  \n" +
                "                and ucv.apply_date >= '" + beginDate + " 00:00:00' AND ucv.apply_date <= '" + endDate + " 23:59:59'\n" +
                "LEFT JOIN user_meetingroom as um ON um.objectid = ucv.user_meetingroom_id \n" +
                "CROSS JOIN time_dimension td \n" +
                "WHERE td.date >= '" + beginDate + " 00:00:00' AND td.date <= '" + endDate + " 23:59:59'\n" +
                "ORDER BY mt.`name` ,td.date  ,ucv.begin_time desc ";

        List<Object[]> list = userMeetingroomVerifyService.findByCustomerSQL(sql);
        List<String> meetingroomNameList = new ArrayList<String>();
        List<String> dateTimeList = new ArrayList<String>();
        List<MeetingroomItinerary> meetingroomItineraryList = new ArrayList<MeetingroomItinerary>();

        for (int i = 0; i < list.size(); i++) {
            if (!meetingroomNameList.contains(list.get(i)[0].toString())) {
                meetingroomNameList.add(list.get(i)[0].toString());
            }
            if (!dateTimeList.contains(list.get(i)[1].toString())) {
                dateTimeList.add(list.get(i)[1].toString());
            }
        }
        for (int j = 0; j < meetingroomNameList.size(); j++) {
            MeetingroomItinerary meetingroomItinerary = new MeetingroomItinerary();
            meetingroomItinerary.setMettingroomName(meetingroomNameList.get(j));
            List<List<AA>> data = new ArrayList<List<AA>>();
            for (Object[] objects : list) {
                List<AA> AAList = new ArrayList<AA>();
                for (int i = 0; i < dateTimeList.size(); i++) {
                    if ((dateTimeList.get(i).toString()).equals(objects[1].toString()) && meetingroomNameList.get(j).equals(objects[0].toString())) {
                        if (!"null".equals(objects[2].toString())) {
                            AA aa = new AA();
                            aa.setBegin_time(objects[2].toString());
                            aa.setEnd_time(objects[3].toString());
                            aa.setName(objects[4].toString());
                            aa.setApply_date(dateTimeList.get(i).toString());
                            AAList.add(aa);
                            data.add(AAList);
                        }
                    }
                }
            }
            meetingroomItinerary.setData(data);
            meetingroomItineraryList.add(meetingroomItinerary);
        }
        return meetingroomItineraryList;
    }

    @RequestMapping(value = "UserMeetingroom/Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "根据申请id查看申请会议室列表", module = "前台-会议室")
    public List<UserMeetingroomVerify> UserClassroomEdit(@PathVariable int id) {
        String sql = "select * from user_meetingroom_verify where user_meetingroom_id = " + id;
        List<UserMeetingroomVerify> userMeetingroomVerifyList = userMeetingroomVerifyService.findByDataSQL(sql);
        return userMeetingroomVerifyList;
    }

    @RequestMapping(value = "UserMeetingroom/IsSave/Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "根据是否已确认及申请id查看申请会议室列表", module = "前台-教室")
    public UserMeetingroomApplyAndVerifySpecial UserMeetingroomIsSaveEdit(@PathVariable int id) {
        String sql = "select * from user_meetingroom_verify where user_meetingroom_id = " + id;
        List<UserMeetingroomVerify> userMeetingroomVerifyList = userMeetingroomVerifyService.findByDataSQL(sql);
        int flag = 0;
        List<UserMeetingroomApplyAndVerify> userClassroomApplyAndVerifyList = new ArrayList<UserMeetingroomApplyAndVerify>();
        UserMeetingroomApplyAndVerifySpecial userMeetingroomApplyAndVerifySpecial = new UserMeetingroomApplyAndVerifySpecial();
        if (userMeetingroomVerifyList != null) {
            if (0 < userMeetingroomVerifyList.size()) {
                int userMeetingroomId = userMeetingroomVerifyList.get(0).getUserMeetingroomId();
                int meetingroomId = userMeetingroomVerifyList.get(0).getMeetingroomId();
                userMeetingroomApplyAndVerifySpecial.setMeetingroomId(meetingroomId);
                userMeetingroomApplyAndVerifySpecial.setUserMeetingroomId(userMeetingroomId);
                flag = 1;
                for (UserMeetingroomVerify userMeetingroomVerify : userMeetingroomVerifyList) {
                    UserMeetingroomApplyAndVerify userMeetingroomApplyAndVerify = new UserMeetingroomApplyAndVerify();
                    userMeetingroomApplyAndVerify.setApplyDate(userMeetingroomVerify.getApplyDate());
                    userMeetingroomApplyAndVerify.setMettingroom(userMeetingroomVerify.getMettingroom());
                    userMeetingroomApplyAndVerify.setMeetingroomId(userMeetingroomVerify.getMeetingroomId());
                    userMeetingroomApplyAndVerify.setBeginTime(userMeetingroomVerify.getBeginTime());
                    userMeetingroomApplyAndVerify.setEndTime(userMeetingroomVerify.getEndTime());
                    userMeetingroomApplyAndVerify.setUserMeetingroom(userMeetingroomVerify.getUserMeetingroom());
                    userMeetingroomApplyAndVerify.setUserMeetingroomId(userMeetingroomVerify.getUserMeetingroomId());
                    userMeetingroomApplyAndVerify.setCreateDate(userMeetingroomVerify.getCreateDate());
                    userMeetingroomApplyAndVerify.setObjectid(userMeetingroomVerify.getObjectid());
                    userMeetingroomApplyAndVerify.setUpdateDate(userMeetingroomVerify.getUpdateDate());
                    userClassroomApplyAndVerifyList.add(userMeetingroomApplyAndVerify);
                }
                userMeetingroomApplyAndVerifySpecial.setResult(userClassroomApplyAndVerifyList);
            }
        }
        if (flag == 1) {
            return userMeetingroomApplyAndVerifySpecial;
        } else {
            String sql2 = "select * from user_meetingroom_apply where user_meetingroom_id = " + id;
            List<UserMeetingroomApply> userMeetingroomApplyList = userMeetingroomApplyService.findByDataSQL(sql2);
            int userMeetingroomId = userMeetingroomApplyList.get(0).getUserMeetingroomId();
            int meetingroomId = userMeetingroomApplyList.get(0).getMeetingroomId();
            userMeetingroomApplyAndVerifySpecial.setMeetingroomId(meetingroomId);
            userMeetingroomApplyAndVerifySpecial.setUserMeetingroomId(userMeetingroomId);
            for (UserMeetingroomApply userMeetingroomApply : userMeetingroomApplyList) {
                UserMeetingroomApplyAndVerify userMeetingroomApplyAndVerify = new UserMeetingroomApplyAndVerify();
                userMeetingroomApplyAndVerify.setApplyDate(userMeetingroomApply.getApplyDate());
                userMeetingroomApplyAndVerify.setMettingroom(userMeetingroomApply.getMettingroom());
                userMeetingroomApplyAndVerify.setMeetingroomId(userMeetingroomApply.getMeetingroomId());
                userMeetingroomApplyAndVerify.setBeginTime(userMeetingroomApply.getBeginTime());
                userMeetingroomApplyAndVerify.setEndTime(userMeetingroomApply.getEndTime());
                userMeetingroomApplyAndVerify.setUserMeetingroom(userMeetingroomApply.getUserMeetingroom());
                userMeetingroomApplyAndVerify.setUserMeetingroomId(userMeetingroomApply.getUserMeetingroomId());
                userMeetingroomApplyAndVerify.setCreateDate(userMeetingroomApply.getCreateDate());
                userMeetingroomApplyAndVerify.setObjectid(userMeetingroomApply.getObjectid());
                userMeetingroomApplyAndVerify.setUpdateDate(userMeetingroomApply.getUpdateDate());
                userClassroomApplyAndVerifyList.add(userMeetingroomApplyAndVerify);
            }
            userMeetingroomApplyAndVerifySpecial.setResult(userClassroomApplyAndVerifyList);
            return userMeetingroomApplyAndVerifySpecial;
        }
    }

    @RequestMapping(value = "Update", method = RequestMethod.POST)
    @PermissionInfo(name = "更新会议室确认", module = "前台-会议室")
    public ResultMessage Update(Date[] applyDate, String[] beginTime, String[] endTime, int userMeetingroomId, int meetingroomId, Integer[] isCheck, HttpServletResponse response) throws MyException {
        if (applyDate == null){
            response.setStatus(408);
            throw  new MyException("请确认时间");
        }else if (0 == applyDate.length){
            response.setStatus(408);
            throw  new MyException("请确认时间");
        }

        if (isCheck == null){
            response.setStatus(408);
            throw  new MyException("请确认时间");
        }else  if (0 == isCheck.length){
            response.setStatus(408);
            throw  new MyException("请确认时间");
        }
        List<Integer> listtemp = new ArrayList<Integer>();
        Collections.addAll(listtemp, isCheck);
        for (int i = 0; i < applyDate.length;i++){
            if (listtemp.contains(i)){
                for (int j = i+1;j < applyDate.length;j++){
                    if (listtemp.contains(j)){
                        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                        SimpleDateFormat sdfwh = new SimpleDateFormat("yyyy-MM-dd HH:mm");
                        String str = sdf.format(applyDate[i]);
                        String beginDate = str + " " + beginTime[i];
                        String endDate = str + " " + endTime[i];

                        String strj = sdf.format(applyDate[j]);
                        String beginDatej = strj + " " + beginTime[j];
                        String endDatej = strj + " " + endTime[j];
                        try {
                            Date beginDateTime = sdfwh.parse(beginDate);
                            Date endDateTime = sdfwh.parse(endDate);
                            Date beginDateTimej = sdfwh.parse(beginDatej);
                            Date endDateTimej = sdfwh.parse(endDatej);
                            if (beginDateTime.getTime() < beginDateTimej.getTime() && beginDateTimej.getTime() < endDateTime.getTime()) {
                               //重合
                                response.setStatus(408);
                                throw  new MyException("会议室时间有误！");
                            }
                            if (beginDateTime.getTime() < endDateTimej.getTime() && beginDateTimej.getTime() < endDateTime.getTime()) {
                                //重合
                                response.setStatus(408);
                                throw  new MyException("会议室时间有误！");
                            }
                            if (beginDateTime.getTime() == beginDateTimej.getTime() && endDateTime.getTime() == endDateTimej.getTime()){
                                //重合
                                response.setStatus(408);
                                throw  new MyException("会议室时间有误！");
                            }

                        } catch (ParseException e) {
                            e.printStackTrace();
                            response.setStatus(408);
                            throw  new MyException("会议室时间有误！");
                        }
                    }
                }
            }
        }

        List list = new ArrayList();
        for (int i = 0; i < applyDate.length; i++) {
            if (listtemp.contains(i)){
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                    String str = sdf.format(applyDate[i]);
                    String beginDate = str + " " + beginTime[i];
                    String endDate = str + " " + endTime[i];
                    String sql2 = "SELECT COUNT(BD) FROM (" +
                            "SELECT STR_TO_DATE(CONCAT(umv.apply_date,umv.begin_time),'%Y-%m-%d %H:%i:%s') AS BD,STR_TO_DATE(CONCAT(umv.apply_date,umv.end_time),'%Y-%m-%d %H:%i:%s') AS ED" +
                            " FROM user_meetingroom_verify as umv WHERE umv.meetingroom_id = " + meetingroomId+ " and umv.user_meetingroom_id != "+userMeetingroomId+
                            ") AA WHERE  ('"+beginDate+"' BETWEEN AA.BD AND AA.ED OR '"+endDate+"' BETWEEN AA.BD AND AA.ED OR AA.BD Between '"+beginDate+"' AND '"+endDate+"' OR AA.ED Between '"+beginDate+"' AND '"+endDate+"')";
                    int count = userMeetingroomVerifyService.getCountBySQL(sql2);
                    if (0 < count) {
                        response.setStatus(408);
                        throw new MyException("会议室时间有误！");
                    }
                    list.add(i);
                }
        }
        String sql = "delete from user_meetingroom_verify where user_meetingroom_id=" + userMeetingroomId + " and meetingroom_id=" + meetingroomId;
        userMeetingroomVerifyService.execDataSql(sql);
        UserMeetingroom userMeetingroom = userMeetingroomService.getbyId(userMeetingroomId);
        Mettingroom mettingroom = mettingroomService.getbyId(meetingroomId);
        for (int i = 0; i < applyDate.length; i++) {
            if (listtemp.contains(i)){
                    UserMeetingroomVerify userMeetingroomVerify = new UserMeetingroomVerify();
                    userMeetingroomVerify.setApplyDate(applyDate[i]);
                    userMeetingroomVerify.setUserMeetingroom(userMeetingroom);
                    userMeetingroomVerify.setMettingroom(mettingroom);
                    userMeetingroomVerify.setBeginTime(beginTime[i]);
                    userMeetingroomVerify.setEndTime(endTime[i]);
                    userMeetingroomVerifyService.save(userMeetingroomVerify);
            }
        }
        return Msg(true, ConstClass.ResultSaveSuccess);

    }
}
