package com.wiseonline.Controller.Setting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.SettingCity;
import com.wiseonline.Service.Impl.SettingCityServiceImpl;
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
 * Created by yanwj on 2015/11/11.
 */
@RestController
@RequestMapping("/Setting/SettingCity")
public class SettingCityController extends BaseController{
    @Autowired
    SettingCityServiceImpl settingCityService;

    @RequestMapping(value = "{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "城市信息列表", module = "后台-配置管理")
    public PageResult<SettingCity> getAll(@PathVariable int page,@PathVariable int pageSize,SettingCity model){
        PageResult<SettingCity> models = settingCityService.findAll(page,pageSize,model);
        return models;
    }
    @RequestMapping(value = "Add",method = RequestMethod.POST)
    @PermissionInfo(name = "新增城市", module = "后台-配置管理")
    public ResultMessage Add(SettingCity model){
        if (settingCityService.IsExistName("name",model.getName(),model.getObjectid())){
            return Msg(false,"城市名已存在");
        }else{
            boolean rst = settingCityService.save(model);
            if (rst){
                return Msg(true, ConstClass.ResultSaveSuccess);
            }else{
                return Msg(false,ConstClass.ResultSaveFault);
            }
        }
    }
    @RequestMapping(value = "Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看城市", module = "后台-配置管理")
    public SettingCity Edit(@PathVariable int id){
        SettingCity model = settingCityService.getbyId(id);
        return model;
    }
    @RequestMapping(value = "Update",method = RequestMethod.POST)
    @PermissionInfo(name = "更新城市", module = "后台-配置管理")
    public ResultMessage Update(SettingCity model){
        if (settingCityService.IsExistName("name",model.getName(),model.getObjectid())){
            return Msg(false,"城市名已存在");
        }else{
            boolean rst = settingCityService.save(model);
            if (rst){
                return Msg(true, ConstClass.ResultSaveSuccess);
            }else{
                return Msg(false,ConstClass.ResultSaveFault);
            }
        }
    }
    @RequestMapping(value = "Delete/{id}")
    @PermissionInfo(name = "删除城市", module = "后台-配置管理")
    public ResultMessage Delete(@PathVariable int id){
        boolean rst = settingCityService.delete(id);
        if (rst){
            return Msg(true,ConstClass.ResultDeleteSuccess);
        }else{
            return Msg(false,ConstClass.ResultDeleteFault);
        }
    }
    @RequestMapping(value = "ParentId/{page}/{pageSize}/{id}")
    @PermissionInfo(name = "根据parentID查询城市列表", module = "前台-城市信息列表")
    public PageResult<SettingCity> ParentId(@PathVariable int page,@PathVariable int pageSize,@PathVariable int id,SettingCity model){
        PageResult<SettingCity> result = settingCityService.findByOneField(page, pageSize,
                "settingCity.objectid", id, true, "objectid",model);
        return result;
    }
}
