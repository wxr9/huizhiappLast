package com.wiseonline.Controller.cultivate;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.Course;
import com.wiseonline.Domain.SettingDict;
import com.wiseonline.Domain.User;
import com.wiseonline.Domain.UserCultivate;
import com.wiseonline.Service.Impl.CourseServiceImpl;
import com.wiseonline.Service.Impl.SettingDictServiceImpl;
import com.wiseonline.Service.Impl.UserCultivateServiceImpl;
import com.wiseonline.Service.Impl.UserServiceImpl;
import com.wiseonline.Utils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by yanwj on 2016/2/15.
 */
@RestController
@RequestMapping("/Cultivate/UserCultivate")
public class UserCultivateController extends BaseController {
    @Autowired
    UserCultivateServiceImpl userCultivateService;
    @Autowired
    UserServiceImpl userService;
    @Autowired
    CourseServiceImpl courseService;
    @Autowired
    SettingDictServiceImpl settingDictService;

    @RequestMapping(value = "List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看个人培训列表", module = "前台-个人培训")
    public PageResult<UserCultivate> getAll(@PathVariable int page,
                                            @PathVariable int pageSize, UserCultivate Model) {
        PageResult<UserCultivate> models = userCultivateService.findAll(page, pageSize, Model);
        return models;
    }

    @RequestMapping(value = "My/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看个人培训列表", module = "前台-个人培训")
    public PageResult<UserCultivate> MyGetAll(@PathVariable int page,
                                              @PathVariable int pageSize, UserCultivate Model) {
        PageResult<UserCultivate> models = userCultivateService.findByOneField(page, pageSize, "username", getUserName(), true, "objectid");
        return models;
    }

    @RequestMapping(value = "Apply/List/{courseIds}/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看课程申请列表", module = "后台-课程")
    public PageResult<UserCultivate> ApplyGetAll(@PathVariable int page,
                                                 @PathVariable int pageSize, UserCultivate Model, @PathVariable int courseIds,HttpServletRequest request) {
        String doudouke = request.getParameter("searchName");
        if (doudouke != null){
            if (!"".equals(doudouke)) {
                String sql = "SELECT * FROM user_cultivate as uc INNER JOIN course as c ON uc.courseid = c.objectid WHERE chinese_name LIKE '%" + doudouke + "%' AND uc.courseid = " + courseIds;
                String sql2 = "";
                if (page == 1) {
                    sql2 = "SELECT * FROM user_cultivate as uc INNER JOIN course as c ON uc.courseid = c.objectid WHERE chinese_name LIKE '%" + doudouke + "%' AND uc.courseid = " + courseIds + " limit 0," + pageSize;
                } else if (page == 0) {
                    sql2 = sql;
                } else {
                    sql2 = "SELECT * FROM user_cultivate as uc INNER JOIN course as c ON uc.courseid = c.objectid WHERE chinese_name LIKE '%" + doudouke + "%' AND uc.courseid = " + courseIds + " limit " + (page - 1) * pageSize + "," + pageSize;
                }
                PageResult<UserCultivate> pageResult = new PageResult<UserCultivate>();
                List<UserCultivate> list = userCultivateService.findByDataSQL(sql);
                if (list != null) {
                    pageResult.setTotal(list.size());
                } else {
                    pageResult.setTotal(0);
                }
                List<UserCultivate> listObject = userCultivateService.findByDataSQL(sql2);
                pageResult.setResult(listObject);
                pageResult.setPage(0);
                pageResult.setPagesize(pageSize);
                return pageResult;
            }else {
                PageResult<UserCultivate> models = userCultivateService.findByOneField(page, pageSize, "course.objectid", courseIds, true, "objectid", Model);
                return models;
            }
        }else {
            PageResult<UserCultivate> models = userCultivateService.findByOneField(page, pageSize, "course.objectid", courseIds, true, "objectid", Model);
            return models;
        }
    }

    @RequestMapping(value = "Apply/All/List//{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看课程申请列表", module = "后台-课程")
    public PageResult<UserCultivate> ApplyGetAll(@PathVariable int page,
                                                 @PathVariable int pageSize, UserCultivate Model,HttpServletRequest request) {
        String doudouke = request.getParameter("searchName");
        if (doudouke != null){
            if (!"".equals(doudouke)) {
                String sql = "SELECT * FROM user_cultivate as uc INNER JOIN course as c ON uc.courseid = c.objectid WHERE chinese_name LIKE '%" + doudouke + "%'  ";
                String sql2 = "";
                if (page == 1) {
                    sql2 = "SELECT * FROM user_cultivate as uc INNER JOIN course as c ON uc.courseid = c.objectid WHERE chinese_name LIKE '%" + doudouke + "%'  limit 0," + pageSize;
                } else if (page == 0) {
                    sql2 = sql;
                } else {
                    sql2 = "SELECT * FROM user_cultivate as uc INNER JOIN course as c ON uc.courseid = c.objectid WHERE chinese_name LIKE '%" + doudouke + "%'  limit " + (page - 1) * pageSize + "," + pageSize;
                }
                PageResult<UserCultivate> pageResult = new PageResult<UserCultivate>();
                List<UserCultivate> list = userCultivateService.findByDataSQL(sql);
                if (list != null) {
                    pageResult.setTotal(list.size());
                } else {
                    pageResult.setTotal(0);
                }
                List<UserCultivate> listObject = userCultivateService.findByDataSQL(sql2);
                pageResult.setResult(listObject);
                pageResult.setPage(0);
                pageResult.setPagesize(pageSize);
                return pageResult;
            }else {
                PageResult<UserCultivate> models = userCultivateService.findAll(page,pageSize,Model,true,"objectid");
                return models;
            }
        }else {
            PageResult<UserCultivate> models = userCultivateService.findAll(page, pageSize, Model, true, "objectid");
            return models;
        }
    }

    @RequestMapping(value = "Add", method = RequestMethod.POST)
    @PermissionInfo(name = "添加个人培训", module = "前台-个人培训")
    public ResultMessage Add(UserCultivate Model, String[] schoolTimeArray) throws MyException {
        if (schoolTimeArray != null) {
            StringBuffer stringBuffer = new StringBuffer();
            for (int i = 0; i < schoolTimeArray.length; i++) {
                stringBuffer.append(schoolTimeArray[i] + ",");
            }
            if (0 < stringBuffer.length()) {
                stringBuffer.deleteCharAt(stringBuffer.length() - 1);
            }
            Model.setSchoolTime(stringBuffer.toString());
            String username = getUserName();
            if (!username.equals("anonymousUser")) {
                if ("ok".equals(isUserInfoComplete())) {
                    boolean rst;
                    if (Model.getWorkYearId() != 0) {
                        SettingDict workYear = settingDictService.getbyId(Model.getWorkYearId());
                        Model.setWorkYear(workYear);
                    }
                    if (Model.getCourseId() != 0) {
                        Course course = courseService.getbyId(Model.getCourseId());
                        Model.setCourse(course);
                    }
                    if (Model.getGradeId() != 0) {
                        SettingDict grade = settingDictService.getbyId(Model.getGradeId());
                        Model.setGrade(grade);
                    }
                    if (Model.getJobId() != 0) {
                        SettingDict job = settingDictService.getbyId(Model.getJobId());
                        Model.setJob(job);
                    }
                    if (Model.getEducationId() != 0) {
                        SettingDict settingDict = settingDictService.getbyId(Model.getEducationId());
                        Model.setEducation(settingDict);
                    }
                    Model.setUsername(username);
                    if (userCultivateService.getbyId(Model.getObjectid()) != null) {
                        rst = userCultivateService.update(Model);
                    } else {
                        rst = userCultivateService.saveGetID(Model);
                    }
                    if (rst) {
                        return Msg(true, ConstClass.ResultSaveSuccess);
                    } else {
                        throw new MyException(ConstClass.ResultSaveFault);
                    }
                } else {
                    throw new MyException("请完善个人资料");
                }
            } else {
                throw new MyException(ConstClass.LoginTimeOut);
            }
        } else {
            throw new MyException("请选择上课时间");
        }
    }

    @RequestMapping(value = "Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "编辑个人培训", module = "前台-个人培训")
    public UserCultivate Edit(@PathVariable int id) {
        UserCultivate model = userCultivateService.getbyId(id);
        String schoolTime = model.getSchoolTime();
        if (schoolTime != null){
            if (!"".equals(schoolTime)){
                String[] schoolTimeArray = schoolTime.split(",");
                StringBuffer sb = new StringBuffer();
                for (String s:schoolTimeArray) {
                    if ("1".equals(s)){
                        sb.append("周一,");
                    }
                    if ("2".equals(s)){
                        sb.append("周二,");
                    }
                    if ("3".equals(s)){
                        sb.append("周三,");
                    }
                    if ("4".equals(s)){
                        sb.append("周四,");
                    }
                    if ("5".equals(s)){
                        sb.append("周五,");
                    }
                    if ("6".equals(s)){
                        sb.append("周六,");
                    }
                    if ("7".equals(s)){
                        sb.append("周日,");
                    }
                }
                sb.deleteCharAt(sb.length()-1);
                model.setSchoolTime(sb.toString());
            }
        }
        return model;
    }

    @RequestMapping(value = "Update", method = RequestMethod.POST)
    @PermissionInfo(name = "更新个人培训", module = "前台-个人培训")
    public ResultMessage Update(UserCultivate Model) throws MyException {
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            boolean rst;
            if (Model.getWorkYearId() != 0) {
                SettingDict workYear = settingDictService.getbyId(Model.getWorkYearId());
                Model.setWorkYear(workYear);
            }
            if (Model.getCourseId() != 0) {
                Course course = courseService.getbyId(Model.getCourseId());
                Model.setCourse(course);
            }
            if (Model.getGradeId() != 0) {
                SettingDict grade = settingDictService.getbyId(Model.getGradeId());
                Model.setGrade(grade);
            }
            if (Model.getJobId() != 0) {
                SettingDict job = settingDictService.getbyId(Model.getJobId());
                Model.setJob(job);
            }
            Model.setUsername(username);
            UserCultivate userCultivate = userCultivateService.getbyId(Model.getObjectid());
            if (userCultivate != null) {
                rst = userCultivateService.update(Model);
            } else {
                rst = userCultivateService.saveGetID(Model);
            }
            if (rst) {
                return Msg(true, ConstClass.ResultSaveSuccess);
            } else {
                throw new MyException(ConstClass.ResultSaveFault);
            }
        } else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }

    @RequestMapping(value = "Delete/{id}", method = RequestMethod.GET)
    @PermissionInfo(name = "删除个人培训", module = "前台-个人培训")
    public ResultMessage Delete(@PathVariable int id) {
        boolean rst = userCultivateService.delete(id);
        if (rst) {
            return Msg(true, ConstClass.ResultDeleteSuccess);
        } else {
            return Msg(false, ConstClass.ResultDeleteFault);
        }
    }

    @RequestMapping(value = "UserTrainApply/Page/Add", method = RequestMethod.GET)
    @PermissionInfo(name = "填写个人培训页面", module = "前台-个人培训")
    public ModelAndView UserTrainApplyAdd() {
        Map<String, Object> variables = getHashMap();
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            String courseSql = "select * from course where deleteflag = 1";
            List<Course> courseList = courseService.findByDataSQL(courseSql);
            variables.put("courseList", courseList);
            return new ModelAndView("web/userTrainApply", variables);
        } else {
            return new ModelAndView("jade", variables);
        }
    }

    @RequestMapping(value = "Export/List/{courseIds}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "导出课程报名情况", module = "后台-课程")
    public void ExportGetAll(HttpServletResponse response,UserCultivate Model, @PathVariable int courseIds) {
        PageResult<UserCultivate> userCultivatePageResult = userCultivateService.findByOneField(0, 0, "course.objectid", courseIds, true, "objectid", Model);
        String[] str = new String[]{"课程名称","报名时间","报名人姓名","联系方式","E-mail","是否缴纳社保","是否沪籍","上课时间"};
        if (0 < userCultivatePageResult.getTotal()) {
            String courseName = "";
            List<UserCultivate> userCultivates = userCultivatePageResult.getResult();
            List<CourseExcel> result = new ArrayList<CourseExcel>();
            for (UserCultivate userCultivate:userCultivates){
                CourseExcel courseExcel = new CourseExcel();
                courseExcel.setApplyTime(userCultivate.getCreateDate());
                if (userCultivate.getCensusRegister() == 1){
                    courseExcel.setCensusRegister("是");
                }else {
                    courseExcel.setCensusRegister("否");
                }
                courseExcel.setChineseName(userCultivate.getChineseName());
                courseExcel.setCourseName(userCultivate.getCourse().getName());
                courseExcel.setEmail(userCultivate.getEmail());
                courseExcel.setPhone(userCultivate.getPhone());
                if (userCultivate.getSocialInsurance() == 1){
                    courseExcel.setSocialInsurance("是");
                }else {
                    courseExcel.setSocialInsurance("否");
                }
                courseName = userCultivate.getCourse().getName();
                courseExcel.setSchoolTime(userCultivate.getSchoolTime());
                result.add(courseExcel);
            }
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd H:m:s");
            Calendar c1 = Calendar.getInstance();
            c1.setTime(new Date());
            ExportExcel.exportExcel(response,courseName+"-"+format.format(c1.getTime())+".xls",str,result);
        }else {
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd H:m:s");
            Calendar c1 = Calendar.getInstance();
            c1.setTime(new Date());
            ExportExcel.exportExcel(response,"无数据-"+format.format(c1.getTime())+".xls",str,new ArrayList<CourseExcel>());
        }
    }

    @RequestMapping(value = "Export/List/All", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "导出课程报名情况", module = "后台-课程")
    public void ExportGetAll(HttpServletResponse response,UserCultivate Model) {
        PageResult<UserCultivate> userCultivatePageResult = userCultivateService.findAll(0, 0, Model, true, "objectid");
        String[] str = new String[]{"课程名称","报名时间","报名人姓名","联系方式","E-mail","是否缴纳社保","是否沪籍","上课时间"};
        if (0 < userCultivatePageResult.getTotal()) {
            String courseName = "";
            List<UserCultivate> userCultivates = userCultivatePageResult.getResult();
            List<CourseExcel> result = new ArrayList<CourseExcel>();
            for (UserCultivate userCultivate:userCultivates){
                CourseExcel courseExcel = new CourseExcel();
                courseExcel.setApplyTime(userCultivate.getCreateDate());
                if (userCultivate.getCensusRegister() == 1){
                    courseExcel.setCensusRegister("是");
                }else {
                    courseExcel.setCensusRegister("否");
                }
                courseExcel.setChineseName(userCultivate.getChineseName());
                courseExcel.setCourseName(userCultivate.getCourse().getName());
                courseExcel.setEmail(userCultivate.getEmail());
                courseExcel.setPhone(userCultivate.getPhone());
                if (userCultivate.getSocialInsurance() == 1){
                    courseExcel.setSocialInsurance("是");
                }else {
                    courseExcel.setSocialInsurance("否");
                }
                courseName = userCultivate.getCourse().getName();
                courseExcel.setSchoolTime(userCultivate.getSchoolTime());
                result.add(courseExcel);
            }
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd H:m:s");
            Calendar c1 = Calendar.getInstance();
            c1.setTime(new Date());
            ExportExcel.exportExcel(response,courseName+"-"+format.format(c1.getTime())+".xls",str,result);
        }else {
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd H:m:s");
            Calendar c1 = Calendar.getInstance();
            c1.setTime(new Date());
            ExportExcel.exportExcel(response,"无数据-"+format.format(c1.getTime())+".xls",str,new ArrayList<CourseExcel>());
        }
    }
}
