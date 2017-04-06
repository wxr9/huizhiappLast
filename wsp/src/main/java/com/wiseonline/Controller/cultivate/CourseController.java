package com.wiseonline.Controller.cultivate;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.Course;
import com.wiseonline.Service.Impl.CourseServiceImpl;
import com.wiseonline.Utils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;


/**
 * Created by yanwj on 2016/2/29.
 */
@RestController
@RequestMapping("/Cultivate/Course")
public class CourseController extends BaseController{

    @Autowired
    CourseServiceImpl courseService;

    @RequestMapping(value = "List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看课程列表", module = "后台-个人培训")
    public PageResult<Course> getAll(@PathVariable int page,
                                            @PathVariable int pageSize, Course Model) {
        PageResult<Course> models = courseService.findAll(page, pageSize, Model);
        return models;
    }
    @RequestMapping(value = "Enable/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看可用课程列表", module = "后台-个人培训")
    public PageResult<Course> getEnableAll(@PathVariable int page,
                                     @PathVariable int pageSize, Course Model) {
        PageResult<Course> models = courseService.findByOneField(page, pageSize,
                "deleteFlag", 1, true, "objectid",Model);
        return models;
    }
    @RequestMapping(value = "Add", method = RequestMethod.POST)
    @PermissionInfo(name = "添加课程", module = "后台-个人培训")
    public ResultMessage Add(Course Model) throws MyException {
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
                boolean rst;
                Model.setDeleteFlag(-1);
                if (courseService.getbyId(Model.getObjectid()) != null){
                    rst = courseService.update(Model);
                }else{
                    rst = courseService.saveGetID(Model);
                }
                if (rst){
                    return Msg(true,ConstClass.ResultSaveSuccess);
                }else {
                    return Msg(false,ConstClass.ResultSaveFault);
                }

        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }
    @RequestMapping(value = "Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "编辑课程", module = "后台-个人培训")
    public Course Edit(@PathVariable int id) {
        Course model = courseService.getbyId(id);
        return model;
    }
    @RequestMapping(value = "Update", method = RequestMethod.POST)
    @PermissionInfo(name = "更新课程", module = "后台-个人培训")
    public ResultMessage Update(Course Model) throws MyException {
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            boolean rst;
            if (Model.getDeleteFlag() == 0){
                Model.setDeleteFlag(1);
            }
            Course userCultivate = courseService.getbyId(Model.getObjectid());
            if (userCultivate != null){
                rst = courseService.update(Model);
            }else{
                rst = courseService.saveGetID(Model);
            }
            if (rst){
                return Msg(true,ConstClass.ResultSaveSuccess);
            }else {
               return Msg(false, ConstClass.ResultSaveFault);
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }
    @RequestMapping(value = "Delete/{id}", method = RequestMethod.GET)
    @PermissionInfo(name = "删除课程", module = "后台-个人培训")
    public ResultMessage Delete(@PathVariable int id) {
        boolean rst = courseService.delete(id);
        if (rst) {
            return Msg(true, ConstClass.ResultDeleteSuccess);
        } else {
            return Msg(false, ConstClass.ResultDeleteFault);
        }
    }

    @RequestMapping(value = "Enable/Delete/{id}/{flag}", method = RequestMethod.GET)
    @PermissionInfo(name = "禁用启用课程", module = "后台-课程")
    public ResultMessage EnableDelete(@PathVariable int id,@PathVariable int flag) {
        if (flag == 1 || flag == -1) {
            String sql = "update course set deleteflag = " + flag + " where objectid = " + id;
            boolean rst = courseService.execDataSql(sql);
            if (rst) {
                return Msg(true, ConstClass.OperationSuccess);
            } else {
                return Msg(false, ConstClass.OperationFault);
            }
        }else {
            return Msg(false,"参数有误");
        }
    }
}
