package com.wiseonline.Controller.Classroom;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.UserClassroomApply;
import com.wiseonline.Service.Impl.UserClassroomApplyServiceImpl;
import com.wiseonline.Utils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created by yanwj on 2016/3/28.
 */
@RestController
@RequestMapping("/Classroom/UserClassroomApply")
public class UserClassroomApplyController extends BaseController{
    @Autowired
    UserClassroomApplyServiceImpl userClassroomApplyService;

    @RequestMapping(value = "List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看教室申请列表", module = "前台-教室")
    public PageResult<UserClassroomApply> getAll(@PathVariable int page,
                                        @PathVariable int pageSize, UserClassroomApply Model) {
        PageResult<UserClassroomApply> models = userClassroomApplyService.findAll(page, pageSize, Model);
        return models;
    }

    @RequestMapping(value = "Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "编辑教室", module = "前台-教室")
    public UserClassroomApply Edit(@PathVariable int id) {
        UserClassroomApply model = userClassroomApplyService.getbyId(id);
        return model;
    }
    @RequestMapping(value = "Update", method = RequestMethod.POST)
    @PermissionInfo(name = "更新教室", module = "前台-教室")
    public ResultMessage Update(UserClassroomApply Model) throws MyException {
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            boolean rst = userClassroomApplyService.update(Model);
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
        boolean rst = userClassroomApplyService.delete(id);
        if (rst) {
            return Msg(true, ConstClass.ResultDeleteSuccess);
        } else {
            return Msg(false, ConstClass.ResultDeleteFault);
        }
    }

    @RequestMapping(value = "UserClassroom/Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "根据申请id查看申请教室列表", module = "前台-教室")
    public UserClassroomApplySpecial UserClassroomEdit(@PathVariable int id) {
        UserClassroomApplySpecial userClassroomApplySpecial = new UserClassroomApplySpecial();
        String sql = "select * from user_classroom_apply where user_classroom_id = "+id;
        List<UserClassroomApply> userClassroomApplyList = userClassroomApplyService.findByDataSQL(sql);
        userClassroomApplySpecial.setResult(userClassroomApplyList);
        return userClassroomApplySpecial;
    }
}
