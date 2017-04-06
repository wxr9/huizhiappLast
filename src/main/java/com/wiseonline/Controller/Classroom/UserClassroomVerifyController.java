package com.wiseonline.Controller.Classroom;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.*;
import com.wiseonline.Service.Impl.ClassroomServiceImpl;
import com.wiseonline.Service.Impl.UserClassroomApplyServiceImpl;
import com.wiseonline.Service.Impl.UserClassroomServiceImpl;
import com.wiseonline.Service.Impl.UserClassroomVerifyServiceImpl;
import com.wiseonline.Utils.*;
import org.apache.commons.collections.map.HashedMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by yanwj on 2016/3/28.
 */
@RestController
@RequestMapping("/Classroom/UserClassroomVerify")
public class UserClassroomVerifyController extends BaseController {

    @Autowired
    UserClassroomVerifyServiceImpl userClassroomVerifyService;

    @Autowired
    UserClassroomApplyServiceImpl userClassroomApplyService;
    @Autowired
    UserClassroomServiceImpl userClassroomService;
    @Autowired
    ClassroomServiceImpl classroomService;

    @RequestMapping(value = "List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看教室确认列表", module = "前台-教室")
    public PageResult<UserClassroomVerify> getAll(@PathVariable int page,
                                                  @PathVariable int pageSize, UserClassroomVerify Model) {
        PageResult<UserClassroomVerify> models = userClassroomVerifyService.findAll(page, pageSize, Model);
        return models;
    }

    @RequestMapping(value = "Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "编辑教室", module = "前台-教室")
    public UserClassroomVerify Edit(@PathVariable int id) {
        UserClassroomVerify model = userClassroomVerifyService.getbyId(id);
        return model;
    }

    @RequestMapping(value = "Update", method = RequestMethod.POST)
    @PermissionInfo(name = "更新教室确认", module = "前台-教室")
    public ResultMessage Update(Date[] applyDate,String[] halfDay,int userClassroomId,int classroomId,Integer[] isCheck,HttpServletResponse response) throws MyException {
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
        if(applyDate.length != halfDay.length){
            throw  new MyException("请勾选上午下午");
        }else {

            List<Integer> listtemp = new ArrayList<Integer>();
            Collections.addAll(listtemp, isCheck);
            for (int i = 0; i < applyDate.length;i++) {
                if (listtemp.contains(i)) {
                    for (int j = i + 1; j < applyDate.length; j++) {
                        if (listtemp.contains(j)) {
                            if (applyDate[i].equals(applyDate[j]) && halfDay[i].equals(halfDay[j])){
                                response.setStatus(408);
                                throw new MyException("教室时间有误！");
                            }
                        }
                    }
                }
            }

            if (0 < applyDate.length) {
                for (int i = 0; i < applyDate.length; i++) {
                    if (listtemp.contains(i)) {
                        SimpleDateFormat sdf1 = new SimpleDateFormat ("yyyy-MM-dd");
                        String timeD = sdf1.format(applyDate[i]);
                            String sql2 = "select * from user_classroom_verify where apply_date = '" + timeD + "' and half_day = '" + halfDay[i] + "' and classroom_id = " + classroomId;
                            List<UserClassroomVerify> userClassroomVerifyList = userClassroomVerifyService.findByDataSQL(sql2);
                            if (userClassroomVerifyList != null) {
                                if (0 < userClassroomVerifyList.size()) {
                                    response.setStatus(408);
                                    throw new MyException("教室已被预订，请选择其它时间！");
                                }
                            }
                    }
                }
                String sql = "delete from user_classroom_verify where user_classroom_id=" + userClassroomId + " and classroom_id=" + classroomId;
                userClassroomVerifyService.execDataSql(sql);
                UserClassroom userClassroom = userClassroomService.getbyId(userClassroomId);
                Classroom classroom = classroomService.getbyId(classroomId);
                for (int i = 0; i < applyDate.length; i++) {
                    if (listtemp.contains(i)) {
                            UserClassroomVerify userClassroomVerify = new UserClassroomVerify();
                            userClassroomVerify.setApplyDate(applyDate[i]);
                            userClassroomVerify.setUserClassroom(userClassroom);
                            userClassroomVerify.setClassroom(classroom);
                            userClassroomVerify.setHalfDay(halfDay[i]);
                            userClassroomVerifyService.save(userClassroomVerify);
                        }
                }
                return Msg(true, ConstClass.ResultSaveSuccess);
            } else {
                response.setStatus(408);
                return Msg(false, ConstClass.ResultSaveFault);
            }
        }
    }

    @RequestMapping(value = "Delete/{id}", method = RequestMethod.GET)
    @PermissionInfo(name = "删除教室", module = "前台-教室")
    public ResultMessage Delete(@PathVariable int id) {
        boolean rst = userClassroomVerifyService.delete(id);
        if (rst) {
            return Msg(true, ConstClass.ResultDeleteSuccess);
        } else {
            return Msg(false, ConstClass.ResultDeleteFault);
        }
    }

    @RequestMapping(value = "Itinerary/Find", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看教室确认列表", module = "前台-教室")
    public List<ClassroomItinerary> getAll(HttpServletRequest request) {
        String beginDate = request.getParameter("beginDate");
        String endDate = request.getParameter("endDate");
        String sql = "select name, max(case h_d when 'a' then datas else 0 end) as a,max(case h_d when 'p' then datas else 0 end) as p\n" +
                "from (\n" +
                "        select name ,h_d,group_concat(half_day order by date) as datas\n" +
                "        from (\n" +
                "                select aa.date,aa.name,aa.h_d,sum(aa.half_day) as half_day\n" +
                "                from (\n" +
                "                        select  u1.date,ifnull(u2.`name`,0) as 'name',case when u1.date = u2.apply_date and u2.half_day = u3.h_d then 1 else 0 end as half_day,u3.h_d\n" +
                "                        FROM (\n" +
                "                                SELECT cm.`name`,vcm.half_day ,vcm.apply_date FROM classroom as cm LEFT JOIN user_classroom_verify as vcm on cm.objectid = vcm.classroom_id   and vcm.apply_date >= '"+beginDate+" 00:00:00' and vcm.apply_date <= '"+endDate+" 23:59:59' \n" +
                "                        )u2 cross join time_dimension u1 \n" +
                "                        cross join (select 'a'as h_d union select 'p') u3\n" +
                "                WHERE u1.date >= '"+beginDate+" 00:00:00' and u1.date <= '"+endDate+" 23:59:59'\n" +
                "                ) aa\n" +
                "                group by aa.date,aa.name,aa.h_d\n" +
                "        ) bb\n" +
                "        group by name,h_d\n" +
                ") cc\n" +
                "group by name";

        List<Object[]> list = userClassroomVerifyService.findByCustomerSQL(sql);
        List<ClassroomItinerary> classroomItineraryList = new ArrayList<ClassroomItinerary>();
        for (int i = 0;i < list.size();i++){
            ClassroomItinerary classroomItinerary = new ClassroomItinerary();
            classroomItinerary.setClassroomName(list.get(i)[0].toString());
            String amString = list.get(i)[1].toString();
            String pmString = list.get(i)[2].toString();
            String[] amArray = amString.split(",");
            String[] pmArray = pmString.split(",");
            List<String> amList = new ArrayList<String>();
            List<String> pmList = new ArrayList<String>();
            for (int k = 0;k < amArray.length;k++){
                amList.add(amArray[k]);
                pmList.add(pmArray[k]);
            }
            classroomItinerary.setAm(amList);
            classroomItinerary.setPm(pmList);
            classroomItineraryList.add(classroomItinerary);
        }
        return classroomItineraryList;
    }

    @RequestMapping(value = "UserClassroom/Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "根据申请id查看申请教室列表", module = "前台-教室")
    public List<UserClassroomVerify> UserClassroomEdit(@PathVariable int id) {
        String sql = "select * from user_classroom_verify where user_classroom_id = "+id;
        List<UserClassroomVerify> userClassroomApplyList = userClassroomVerifyService.findByDataSQL(sql);
        return userClassroomApplyList;
    }

    @RequestMapping(value = "UserClassroom/IsSave/Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "根据是否已确认及申请id查看申请教室列表", module = "前台-教室")
    public UserClassroomApplyAndVerifySpecial UserClassroomIsSaveEdit(@PathVariable int id) {
        String sql = "select * from user_classroom_verify where user_classroom_id = "+id;
        List<UserClassroomVerify> userClassroomVerifyList = userClassroomVerifyService.findByDataSQL(sql);
        int flag = 0;
        List<UserClassroomApplyAndVerify> userClassroomApplyAndVerifyList = new ArrayList<UserClassroomApplyAndVerify>();
        UserClassroomApplyAndVerifySpecial userClassroomApplyAndVerifySpecial = new UserClassroomApplyAndVerifySpecial();
        if (userClassroomVerifyList != null){
            if (0 < userClassroomVerifyList.size()){
                int classroomId = userClassroomVerifyList.get(0).getClassroomId();
                int userClassroomId = userClassroomVerifyList.get(0).getUserClassroomId();
                userClassroomApplyAndVerifySpecial.setClassroomId(classroomId);
                userClassroomApplyAndVerifySpecial.setUserClassroomId(userClassroomId);
                flag = 1;
                for (UserClassroomVerify userClassroomVerify:userClassroomVerifyList){
                    UserClassroomApplyAndVerify userClassroomApplyAndVerify = new UserClassroomApplyAndVerify();
                    userClassroomApplyAndVerify.setApplyDate(userClassroomVerify.getApplyDate());
                    userClassroomApplyAndVerify.setClassroom(userClassroomVerify.getClassroom());
                    userClassroomApplyAndVerify.setClassroomId(userClassroomVerify.getClassroomId());
                    userClassroomApplyAndVerify.setHalfDay(userClassroomVerify.getHalfDay());
                    userClassroomApplyAndVerify.setUserClassroom(userClassroomVerify.getUserClassroom());
                    userClassroomApplyAndVerify.setUserClassroomId(userClassroomVerify.getUserClassroomId());
                    userClassroomApplyAndVerify.setCreateDate(userClassroomVerify.getCreateDate());
                    userClassroomApplyAndVerify.setObjectid(userClassroomVerify.getObjectid());
                    userClassroomApplyAndVerify.setUpdateDate(userClassroomVerify.getUpdateDate());
                    userClassroomApplyAndVerifyList.add(userClassroomApplyAndVerify);
                }
                userClassroomApplyAndVerifySpecial.setResult(userClassroomApplyAndVerifyList);
            }
        }
        if (flag == 1){
            return userClassroomApplyAndVerifySpecial;
        }else {
            String sql2 = "select * from user_classroom_apply where user_classroom_id = "+id;
            List<UserClassroomApply> userClassroomApplyList = userClassroomApplyService.findByDataSQL(sql2);
            int classroomId = userClassroomApplyList.get(0).getClassroomId();
            int userClassroomId = userClassroomApplyList.get(0).getUserClassroomId();
            userClassroomApplyAndVerifySpecial.setClassroomId(classroomId);
            userClassroomApplyAndVerifySpecial.setUserClassroomId(userClassroomId);
            for (UserClassroomApply userClassroomApply:userClassroomApplyList){
                UserClassroomApplyAndVerify userClassroomApplyAndVerify = new UserClassroomApplyAndVerify();
                userClassroomApplyAndVerify.setApplyDate(userClassroomApply.getApplyDate());
                userClassroomApplyAndVerify.setClassroom(userClassroomApply.getClassroom());
                userClassroomApplyAndVerify.setClassroomId(userClassroomApply.getClassroomId());
                userClassroomApplyAndVerify.setHalfDay(userClassroomApply.getHalfDay());
                userClassroomApplyAndVerify.setUserClassroom(userClassroomApply.getUserClassroom());
                userClassroomApplyAndVerify.setUserClassroomId(userClassroomApply.getUserClassroomId());
                userClassroomApplyAndVerify.setCreateDate(userClassroomApply.getCreateDate());
                userClassroomApplyAndVerify.setObjectid(userClassroomApply.getObjectid());
                userClassroomApplyAndVerify.setUpdateDate(userClassroomApply.getUpdateDate());
                userClassroomApplyAndVerifyList.add(userClassroomApplyAndVerify);
            }
            userClassroomApplyAndVerifySpecial.setResult(userClassroomApplyAndVerifyList);
            return userClassroomApplyAndVerifySpecial;
        }
    }
}
