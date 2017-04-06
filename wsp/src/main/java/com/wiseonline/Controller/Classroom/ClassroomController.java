package com.wiseonline.Controller.Classroom;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.Classroom;
import com.wiseonline.Service.Impl.ClassroomServiceImpl;
import com.wiseonline.Utils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by yanwj on 2016/2/22.
 */
@RestController
@RequestMapping("/Classroom/Classroom")
public class ClassroomController extends BaseController{
    @Autowired
    ClassroomServiceImpl classroomService;

    @RequestMapping(value = "List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看教室列表", module = "前台-教室")
    public PageResult<Classroom> getAll(@PathVariable int page,
                                     @PathVariable int pageSize, Classroom Model) {
        PageResult<Classroom> models = classroomService.findAll(page, pageSize, Model);
        return models;
    }
    @RequestMapping(value = "Enable/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看可用教室列表", module = "后台-教室")
    public PageResult<Classroom> getEnableAll(@PathVariable int page,
                                           @PathVariable int pageSize, Classroom Model) {
        PageResult<Classroom> models = classroomService.findByOneField(page, pageSize,
                "deleteFlag", 1, true, "objectid",Model);
        return models;
    }
    @RequestMapping(value = "Add", method = RequestMethod.POST)
    @PermissionInfo(name = "添加教室", module = "前台-教室")
    public ResultMessage Add(Classroom Model) throws MyException {
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            Model.setDeleteFlag(-1);
            boolean rst = classroomService.save(Model);
            if (rst){
                return Msg(true, ConstClass.ResultSaveSuccess);
            }else {
                return Msg(false,ConstClass.ResultSaveFault);
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }
    @RequestMapping(value = "Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "编辑教室", module = "前台-教室")
    public Classroom Edit(@PathVariable int id) {
        Classroom model = classroomService.getbyId(id);
        return model;
    }
    @RequestMapping(value = "Update", method = RequestMethod.POST)
    @PermissionInfo(name = "更新教室", module = "前台-教室")
    public ResultMessage Update(Classroom Model) throws MyException {
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            boolean rst = classroomService.update(Model);
            if (rst){
                return Msg(true,ConstClass.ResultSaveSuccess);
            }else {
                return Msg(false,ConstClass.ResultSaveFault);
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }
    @RequestMapping(value = "Delete/{id}", method = RequestMethod.GET)
    @PermissionInfo(name = "删除教室", module = "前台-教室")
    public ResultMessage Delete(@PathVariable int id) {
        boolean rst = classroomService.delete(id);
        if (rst) {
            return Msg(true, ConstClass.ResultDeleteSuccess);
        } else {
            return Msg(false, ConstClass.ResultDeleteFault);
        }
    }
    @RequestMapping(value = "Enable/Delete/{id}/{flag}", method = RequestMethod.GET)
    @PermissionInfo(name = "禁用启用职位", module = "后台-职位")
    public ResultMessage EnableDelete(@PathVariable int id,@PathVariable int flag) {
        if (flag == 1 || flag == -1) {
            String sql = "update classroom set deleteflag = " + flag + " where objectid = " + id;
            boolean rst = classroomService.execDataSql(sql);
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
