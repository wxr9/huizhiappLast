package com.wiseonline.Controller.Setting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.Park;
import com.wiseonline.Service.Impl.ParkServiceImpl;
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
 * Created by yanwj on 2015/11/25.
 */
@RestController
@RequestMapping("/Setting/Park")
public class ParkController extends BaseController{

    @Autowired
    ParkServiceImpl parkService;

    @RequestMapping(value = "{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看园区信息", module = "后台-配置信息管理")
    public PageResult<Park> getAll(@PathVariable int page,@PathVariable int pageSize,Park model){
        PageResult<Park> models = parkService.findAll(page,pageSize,model);
        return models;
    }
    @RequestMapping(value = "Add",method = RequestMethod.POST)
    @PermissionInfo(name = "新增园区信息", module = "后台-配置信息管理")
    public ResultMessage Add(Park model){
        if (parkService.IsExistName("name",model.getName(),model.getObjectid())){
            return Msg(false,"园区名称已存在");
        }else{
            boolean rst = parkService.save(model);
            if (rst){
                return Msg(true, ConstClass.ResultSaveSuccess);
            }else{
                return Msg(false,ConstClass.ResultSaveFault);
            }
        }
    }
    @RequestMapping(value = "Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看园区信息", module = "后台-配置信息管理")
    public Park Edit(@PathVariable int id){
        Park model = parkService.getbyId(id);
        return model;
    }
    @RequestMapping(value = "Update",method = RequestMethod.POST)
    @PermissionInfo(name = "更新园区信息", module = "后台-园区信息管理")
    public ResultMessage Update(Park model){
        if (parkService.IsExistName("name",model.getName(),model.getObjectid())){
            return Msg(false,"园区名称已存在");
        }else{
            boolean rst = parkService.update(model);
            if (rst){
                return Msg(true, ConstClass.ResultSaveSuccess);
            }else{
                return Msg(false,ConstClass.ResultSaveFault);
            }
        }
    }
    @RequestMapping(value = "Delete/{id}",method = RequestMethod.GET)
    @PermissionInfo(name = "删除园区信息", module = "后台-配置信息管理")
    public ResultMessage Delete(@PathVariable int id){
        boolean rst = parkService.delete(id);
        if (rst){
            return Msg(true,ConstClass.ResultDeleteSuccess);
        }else{
            return Msg(false,ConstClass.ResultDeleteFault);
        }
    }
}
