package com.wiseonline.Controller.Repair;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.SettingRepairManConfig;
import com.wiseonline.Domain.UserRepair;
import com.wiseonline.Domain.UserRepairAssign;
import com.wiseonline.Service.Impl.SettingRepairManConfigServiceImpl;
import com.wiseonline.Service.Impl.UserRepairAssignServiceImpl;
import com.wiseonline.Service.Impl.UserRepairServiceImpl;
import com.wiseonline.Utils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by guhuinan on 2015-12-21.
 */
@RestController
@RequestMapping("/UserRepairAssign")
public class UserRepairAssignController extends BaseController{
    @Autowired
    UserRepairAssignServiceImpl userRepairAssignService;

    @Autowired
    UserRepairServiceImpl userRepairService;

    @Autowired
    SettingRepairManConfigServiceImpl settingRepairManConfigService;



    @RequestMapping(value = "{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看派工", module = "后台-报修管理")
    public PageResult<UserRepairAssign> getALL(@PathVariable int page,
                                               @PathVariable int pageSize, HttpServletRequest request,UserRepairAssign Model) throws MyException {
        String repairIdString = request.getParameter("repairId");
        if (repairIdString != null)
        try {
            int repairId = Integer.parseInt(repairIdString);
            PageResult<UserRepairAssign> userRepairAssignPageResult = userRepairAssignService.findByOneField(page,pageSize,"repairDetail.objectid",repairId,false,"assignTime",Model);
            return userRepairAssignPageResult;
        }catch (Exception e){
            throw new MyException(ConstClass.DataError);
        }else{
            PageResult<UserRepairAssign> userRepairAssignPageResult = userRepairAssignService.findAll(page,pageSize,Model);
            return userRepairAssignPageResult;
        }
    }

    @RequestMapping(value = "Find/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看最后一条派工", module = "后台-报修管理")
    public UserRepairAssign Find(@PathVariable int id,UserRepairAssign Model) {
        PageResult<UserRepairAssign> userRepairAssignList = userRepairAssignService.findByOneField(0,0,"repairDetail.objectid",id,true,"assignTime",Model);
        if (userRepairAssignList.getTotal() > 0){
            UserRepairAssign userRepairAssign = userRepairAssignList.getResult().get(0);
            if (userRepairAssign.getRepairDetail().getObjectid() == 0){
                userRepairAssign.setRepairId(-207);//由前端进行传值
            }
            return  userRepairAssign;
        }else{
            UserRepairAssign userRepairAssign = new UserRepairAssign();
            userRepairAssign.setRepairId(-207);
            return  userRepairAssign;
        }
    }

    @RequestMapping(value = "Add", method = RequestMethod.POST)
    @PermissionInfo(name = "新增派工", module = "后台-报修管理")
    public ResultMessage Add(UserRepairAssign Model, HttpServletRequest request, HttpServletResponse response){
        if (Model.getRepairId() != 0){
            UserRepair userRepair = userRepairService.getbyId(Model.getRepairId());
            Model.setRepairDetail(userRepair);
        }
        if (Model.getEngineer() != 0){
            SettingRepairManConfig settingRepairManConfig = settingRepairManConfigService.getbyId(Model.getEngineer());
            Model.setEngineerDetail(settingRepairManConfig);
        }
        Boolean rst = userRepairAssignService.save(Model);
        if (rst) {
            return Msg(true, ConstClass.ResultSaveSuccess);
        } else {
            response.setStatus(408);
            return Msg(false, ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "编辑派工", module = "后台-报修管理")
    public UserRepairAssign Edit(@PathVariable int id) throws MyException{
        UserRepairAssign userRepairAssign = userRepairAssignService.getbyId(id);
        if (userRepairAssign != null){
            if (userRepairAssign.getRepairId() == 0){
                userRepairAssign.setRepairId(-207);
            }
            return userRepairAssign;
        }else{
            throw new MyException(ConstClass.DataError);
        }
    }

    @RequestMapping(value = "Update", method = RequestMethod.POST)
    @PermissionInfo(name = "更新派工", module = "后台-报修管理")
    public ResultMessage Update(UserRepairAssign Model,HttpServletResponse response) {
        if (Model.getRepairId() != 0){
            UserRepair userRepair = userRepairService.getbyId(Model.getRepairId());
            Model.setRepairDetail(userRepair);
        }
        if (Model.getEngineer() != 0){
            SettingRepairManConfig settingRepairManConfig = settingRepairManConfigService.getbyId(Model.getEngineer());
            Model.setEngineerDetail(settingRepairManConfig);
        }else {
            response.setStatus(408);
            return Msg(false, "请选择工程师");
        }
        boolean rst = userRepairAssignService.saveOrUpdate(Model);
        if (rst) {
            return Msg(true, ConstClass.ResultSaveSuccess);
        } else {
            return Msg(false, ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "Delete/{id}", method = RequestMethod.GET)
    @PermissionInfo(name = "删除派工", module = "后台-报修管理")
    public ResultMessage Delete(@PathVariable int id) {
        boolean rst = userRepairAssignService.delete(id);
        if (rst) {
            return Msg(true, ConstClass.ResultDeleteSuccess);
        } else {
            return Msg(false, ConstClass.ResultDeleteFault);
        }
    }

}
