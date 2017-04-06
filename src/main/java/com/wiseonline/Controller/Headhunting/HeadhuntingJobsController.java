package com.wiseonline.Controller.Headhunting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.HeadhuntingJobs;
import com.wiseonline.Service.Impl.HeadhuntingJobsServiceImpl;
import com.wiseonline.Service.Impl.UserHeadhuntingServiceImpl;
import com.wiseonline.Utils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import sun.misc.resources.Messages_pt_BR;

import java.util.List;

/**
 * Created by yanwj on 2016/3/18.
 */
@RestController
@RequestMapping("/Headhunting/HeadhuntingJobs")
public class HeadhuntingJobsController extends BaseController{
    @Autowired
    HeadhuntingJobsServiceImpl headhuntingJobsService;
    @Autowired
    UserHeadhuntingServiceImpl userHeadhuntingService;
    @RequestMapping(value = "Add", method = RequestMethod.POST)
    @PermissionInfo(name = "添加猎聘职位", module = "前台-猎聘")
    public ResultMessage Add(HeadhuntingJobs Model) throws MyException {
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            if (Model.getHeadhuntingId() != 0){
                Model.setUserHeadhunting(userHeadhuntingService.getbyId(Model.getHeadhuntingId()));
            }
            boolean rst = headhuntingJobsService.save(Model);
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
    @PermissionInfo(name = "编辑猎聘职位", module = "前台-猎聘")
    public HeadhuntingJobs Edit(@PathVariable int id) {
        HeadhuntingJobs model = headhuntingJobsService.getbyId(id);
        return model;
    }
    @RequestMapping(value = "Update", method = RequestMethod.POST)
    @PermissionInfo(name = "更新猎聘职位", module = "前台-猎聘")
    public ResultMessage Update(HeadhuntingJobs Model) throws MyException {
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            boolean rst = headhuntingJobsService.update(Model);
            if (rst){
                return Msg(true,ConstClass.ResultSaveSuccess);
            }else {
                return Msg(false,ConstClass.ResultSaveFault);
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }
    @RequestMapping(value = "HeadhuntingJobs/Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "编辑猎聘职位", module = "前台-猎聘")
    public PageResult HeadhuntingJobsEdit(@PathVariable int id,HeadhuntingJobs Model) {
        PageResult<HeadhuntingJobs> pageResult = headhuntingJobsService.findByOneField(0, 0, "userHeadhunting.objectid", id, true, "objectid", Model);
        return pageResult;
    }
}
