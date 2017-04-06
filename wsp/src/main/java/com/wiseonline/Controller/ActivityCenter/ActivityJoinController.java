package com.wiseonline.Controller.ActivityCenter;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.ActivityJoin;
import com.wiseonline.Domain.User;
import com.wiseonline.Service.ActivityJoinService;
import com.wiseonline.Service.Impl.UserServiceImpl;
import com.wiseonline.Service.UserService;
import com.wiseonline.Utils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;

/**
 * Created by R7tech on 2/25/2016.
 */
@RestController
@RequestMapping("/ActivityCenter")
public class ActivityJoinController extends BaseController {
    @Autowired
    ActivityJoinService activityJoinService;
    @Autowired
    UserServiceImpl userService;

    @RequestMapping(value = "ActivityJoin/Edit/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看活动报名信息", module = "后台、前台-活动报名信息块管理")
    public ActivityJoin BaseEdit(@PathVariable int objectid){
        ActivityJoin model = activityJoinService.getbyId(objectid);
        return model;
    }

    @RequestMapping(value = "ActivityJoin/Add", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加活动报名信息", module = "后台、前台-活动报名信息块管理")
    public ResultMessage BaseAdd(ActivityJoin model){
        PageResult<ActivityJoin> aList = activityJoinService.findByOneField(1,100,"username",getUserName(),false,"id");
        if (aList.getTotal()>0){
            return Msg(false, "already");
        }
        User user = userService.getbyId(getUserName());
        model.setUsername(getUserName());
        model.setMobile(user.getPhone());
        model.setEmail(user.getEmail());
        model.setName(user.getName());
        boolean ret = activityJoinService.save(model);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "ActivityJoin/Del/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "删除活动报名信息", module = "后台、前台-活动报名信息块管理")
    public ResultMessage BaseDel(@PathVariable int objectid){
        boolean ret = activityJoinService.delete(objectid);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "ActivityJoin/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "列表活动报名信息", module = "后台、前台-活动报名信息块管理")
    public PageResult<ActivityJoin> BaseList(@PathVariable int page, @PathVariable int pageSize, ActivityJoin model){
        PageResult<ActivityJoin> models = activityJoinService.findAll(page, pageSize, model);
        return models;
    }
}
