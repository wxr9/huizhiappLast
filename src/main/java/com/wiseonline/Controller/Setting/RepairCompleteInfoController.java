package com.wiseonline.Controller.Setting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.RepairCompleteInfo;
import com.wiseonline.Domain.UserRepair;
import com.wiseonline.Service.Impl.RepairCompleteInfoServiceImpl;
import com.wiseonline.Service.Impl.UserRepairServiceImpl;
import com.wiseonline.Utils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by huizhisoft on 15/12/24.
 */
@RestController
@RequestMapping("/Setting/RepairCompleteInfo")
public class RepairCompleteInfoController extends BaseController{

    @Autowired
    RepairCompleteInfoServiceImpl repairCompleteInfoService;

    @Autowired
    UserRepairServiceImpl userRepairService;

    @RequestMapping(value = "Add",method = RequestMethod.POST)
    @PermissionInfo(name = "新增流程完成信息", module = "前台-流程")
    public ResultMessage Add(RepairCompleteInfo model){
        if (model.getRepairId() != 0){
            UserRepair userRepair = userRepairService.getbyId(model.getRepairId());
            model.setUserRepair(userRepair);
        }
        boolean rst = repairCompleteInfoService.save(model);
        if (rst){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看流程完成信息", module = "后台-配置信息管理")
    public PageResult<RepairCompleteInfo> getAll(@PathVariable int page, @PathVariable int pageSize, RepairCompleteInfo model){
        PageResult<RepairCompleteInfo> models = repairCompleteInfoService.findAll(page,pageSize,model);
        return models;
    }

    @RequestMapping(value = "Find/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看流程完成信息", module = "后台-配置信息管理")
    public RepairCompleteInfo Edit(@PathVariable int id,RepairCompleteInfo model) {
        PageResult<RepairCompleteInfo> userRepairAssignList = repairCompleteInfoService.findByOneField(0,0,"userRepair.objectid",id,true,"createDate",model);
        if (userRepairAssignList.getTotal() > 0){
            RepairCompleteInfo repairCompleteInfo = userRepairAssignList.getResult().get(0);
            if (repairCompleteInfo.getRepairId() == 0){
                repairCompleteInfo.setRepairId(-207);//由前端进行传值
            }
            return  repairCompleteInfo;
        }else{
            RepairCompleteInfo repairCompleteInfo = new RepairCompleteInfo();
            repairCompleteInfo.setRepairId(-207);//由前端进行传值
            return  repairCompleteInfo;
        }
    }
    @RequestMapping(value = "Update",method = RequestMethod.POST)
    @PermissionInfo(name = "更新流程完成信息", module = "后台-园区信息管理")
    public ResultMessage Update(RepairCompleteInfo model){
        if (model.getRepairId() != 0){
            UserRepair userRepair = userRepairService.getbyId(model.getRepairId());
            model.setUserRepair(userRepair);
        }
        boolean rst = repairCompleteInfoService.saveOrUpdate(model);
        if (rst){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }
}
