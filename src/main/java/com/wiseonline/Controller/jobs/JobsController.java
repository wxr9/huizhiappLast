package com.wiseonline.Controller.jobs;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.Jobs;
import com.wiseonline.Domain.SettingDict;
import com.wiseonline.Service.Impl.JobsServiceImpl;
import com.wiseonline.Service.Impl.SettingDictServiceImpl;
import com.wiseonline.Utils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by yanwj on 2016/3/10.
 */
@RestController
@RequestMapping("/Jobs")
public class JobsController extends BaseController{
    @Autowired
    JobsServiceImpl jobsService;

    @Autowired
    SettingDictServiceImpl settingDictService;

    @RequestMapping(value = "List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看职位列表", module = "前台-职位")
    public PageResult<Jobs> getAll(@PathVariable int page,
                                     @PathVariable int pageSize, Jobs Model) throws MyException {
        PageResult<Jobs> models = jobsService.findAll(page, pageSize, Model);
        return models;
    }
    @RequestMapping(value = "Enable/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看可用职位列表", module = "前台-职位")
    public PageResult<Jobs> EnableGetAll(@PathVariable int page,
                                   @PathVariable int pageSize, Jobs Model) throws MyException {
        PageResult<Jobs> models = jobsService.findByOneField(page, pageSize,
                "deleteFlag", 1, true, "objectid", Model);
        return models;
    }
    @RequestMapping(value = "Add", method = RequestMethod.POST)
    @PermissionInfo(name = "添加职位", module = "前台-职位")
    public ResultMessage Add(Jobs Model) throws MyException {
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            if (Model.getMoneyTypeId() != 0){
                SettingDict settingDict = settingDictService.getbyId(Model.getMoneyTypeId());
                Model.setMoneyType(settingDict);
            }
            Model.setDeleteFlag(-1);
            boolean rst = jobsService.save(Model);
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
    @PermissionInfo(name = "编辑职位", module = "前台-职位")
    public Jobs Edit(@PathVariable int id) {
        Jobs model = jobsService.getbyId(id);
        return model;
    }
    @RequestMapping(value = "Update", method = RequestMethod.POST)
    @PermissionInfo(name = "更新职位", module = "前台-职位")
    public ResultMessage Update(Jobs Model) throws MyException {
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            if (Model.getMoneyTypeId() != 0){
                SettingDict settingDict = settingDictService.getbyId(Model.getMoneyTypeId());
                Model.setMoneyType(settingDict);
            }
            if (Model.getDeleteFlag() == 0) {
                Model.setDeleteFlag(1);
            }
            boolean rst = jobsService.update(Model);
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
    @PermissionInfo(name = "删除职位", module = "前台-职位")
    public ResultMessage Delete(@PathVariable int id) {
        boolean rst = jobsService.delete(id);
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
            String sql = "update jobs set deleteflag = " + flag + " where objectid = " + id;
            boolean rst = jobsService.execDataSql(sql);
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
