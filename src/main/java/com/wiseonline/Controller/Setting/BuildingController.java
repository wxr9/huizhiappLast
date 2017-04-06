package com.wiseonline.Controller.Setting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.Building;
import com.wiseonline.Service.Impl.BuildingServiceImpl;
import com.wiseonline.Utils.ConstClass;
import com.wiseonline.Utils.PageResult;
import com.wiseonline.Utils.PermissionInfo;
import com.wiseonline.Utils.ResultMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by yanwj on 2015/11/26.
 */
@RestController
@RequestMapping("/Setting/Building")
public class BuildingController extends BaseController{
    @Autowired
    BuildingServiceImpl buildingService;

    @RequestMapping(value = "{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查询楼宇", module = "后台-配置管理")
    public PageResult<Building> getAll(@PathVariable int page,@PathVariable int pageSize,Building model){
        PageResult<Building> models = buildingService.findAll(page,pageSize,model,false,"name");
        return models;
    }
    @RequestMapping(value = "Add",method = RequestMethod.POST)
    @PermissionInfo(name = "新增楼宇", module = "后台-配置管理")
    public ResultMessage Add(Building model){
        if (buildingService.IsExistName("name",model.getName(),model.getObjectid())){
            return Msg(false,"楼宇名已存在");
        }else{
            boolean rst = buildingService.save(model);
            if (rst){
                return Msg(true, ConstClass.ResultSaveSuccess);
            }else{
                return Msg(false,ConstClass.ResultSaveFault);
            }
        }
    }
    @RequestMapping(value = "Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "编辑楼宇", module = "后台-配置管理")
    public Building Edit(@PathVariable int id){
        Building model = buildingService.getbyId(id);
        return model;
    }
    @RequestMapping(value = "Update",method = RequestMethod.POST)
    @PermissionInfo(name = "更新楼宇", module = "后台-配置管理")
    public ResultMessage Update(Building model){
        if (buildingService.IsExistName("name",model.getName(),model.getObjectid())){
            return Msg(false,"楼宇名已存在");
        }else{
            boolean rst = buildingService.saveOrUpdate(model);
            if (rst){
                return Msg(true, ConstClass.ResultSaveSuccess);
            }else{
                return Msg(false,ConstClass.ResultSaveFault);
            }
        }
    }
    @RequestMapping(value = "Delete/{id}",method = RequestMethod.GET)
    @PermissionInfo(name = "删除楼宇信息", module = "后台-配置信息管理")
    public ResultMessage Delete(@PathVariable int id){
        boolean rst = buildingService.delete(id);
        if (rst){
            return Msg(true,ConstClass.ResultDeleteSuccess);
        }else{
            return Msg(false,ConstClass.ResultDeleteFault);
        }
    }

    @RequestMapping(value = "BuildingByParkId/{page}/{pageSize}/{parkId}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查询楼宇", module = "后台-配置管理")
    public PageResult<Building> BuildingByParkId(@PathVariable int page,@PathVariable int pageSize,Building model,@PathVariable int parkId){
        String ordername = "name";
        if (parkId == 2)
        {
            ordername = "objectid";
        }
        PageResult<Building> models = buildingService.findByOneField(page, pageSize, "park.objectid", parkId, false, ordername, model);
        return models;
    }
}
