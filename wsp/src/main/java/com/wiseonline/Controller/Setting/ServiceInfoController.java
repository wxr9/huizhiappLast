package com.wiseonline.Controller.Setting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.ServiceInfo;
import com.wiseonline.Service.Impl.ServiceInfoServiceImpl;
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
 * Created by yanwj on 2015/11/9.
 */
@RestController
@RequestMapping("/Setting/ServiceInfo")
public class ServiceInfoController extends BaseController{
    @Autowired
    ServiceInfoServiceImpl serviceInfoService;

    @RequestMapping(value = "{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看服务信息", module = "后台、前台-服务信息块管理")
    public PageResult<ServiceInfo> getAll(@PathVariable int page,@PathVariable int pageSize,ServiceInfo model){
        PageResult<ServiceInfo> models = serviceInfoService.findAll(page,pageSize,model);
        return models;
    }
    @RequestMapping(value = "Add",method = RequestMethod.POST)
    @PermissionInfo(name = "新增服务信息", module = "后台、前台-服务信息块管理")
    public ResultMessage Add(ServiceInfo model){
        if (serviceInfoService.IsExistName("name",model.getName(),model.getObjectid())){
            return Msg(false,"服务名称已存在");
        }else{
            boolean rst = serviceInfoService.save(model);
            if (rst){
                return Msg(true, ConstClass.ResultSaveSuccess);
            }else{
                return Msg(false,ConstClass.ResultSaveFault);
            }
        }
    }
    @RequestMapping(value = "Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看服务信息", module = "后台、前台-服务信息块管理")
    public ServiceInfo Edit(@PathVariable int id){
        ServiceInfo model = serviceInfoService.getbyId(id);
        return model;
    }
    @RequestMapping(value = "Update",method = RequestMethod.POST)
    @PermissionInfo(name = "更新服务信息", module = "后台、前台-服务信息块管理")
    public ResultMessage Update(ServiceInfo model){
        if (serviceInfoService.IsExistName("name",model.getName(),model.getObjectid())){
            return Msg(false,"服务名称已存在");
        }else{
            boolean rst = serviceInfoService.save(model);
            if (rst){
                return Msg(true, ConstClass.ResultSaveSuccess);
            }else{
                return Msg(false,ConstClass.ResultSaveFault);
            }
        }
    }
    @RequestMapping(value = "Delete/{id}",method = RequestMethod.GET)
    @PermissionInfo(name = "删除服务信息", module = "后台、前台-服务信息块管理")
    public ResultMessage Delete(@PathVariable int id){
        boolean rst = serviceInfoService.delete(id);
        if (rst){
            return Msg(true,ConstClass.ResultDeleteSuccess);
        }else{
            return Msg(false,ConstClass.ResultDeleteFault);
        }
    }
}
