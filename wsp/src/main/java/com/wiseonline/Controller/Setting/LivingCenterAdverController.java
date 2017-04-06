package com.wiseonline.Controller.Setting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.LivingCenterAdver;
import com.wiseonline.Service.LivingCenterAdverService;
import com.wiseonline.Utils.ConstClass;
import com.wiseonline.Utils.PageResult;
import com.wiseonline.Utils.PermissionInfo;
import com.wiseonline.Utils.ResultMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by R7tech on 3/9/2016.
 */
@RestController
@RequestMapping("/Setting")
public class LivingCenterAdverController  extends BaseController {
    @Autowired
    LivingCenterAdverService livingCenterAdverService;


    @RequestMapping(value = "LivingCenterAdver/Edit/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看商户广告管理信息", module = "后台、前台-商户广告管理信息块管理")
    public LivingCenterAdver BaseEdit(@PathVariable int objectid){
        LivingCenterAdver model = livingCenterAdverService.getbyId(objectid);
        return model;
    }

    @RequestMapping(value = "LivingCenterAdver/Add", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加商户广告管理信息", module = "后台、前台-商户广告管理信息块管理")
    public ResultMessage BaseAdd(LivingCenterAdver model){
        boolean ret = livingCenterAdverService.save(model);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "LivingCenterAdver/Update", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加商户广告管理信息", module = "后台、前台-商户广告管理信息块管理")
    public ResultMessage BaseUpdate(LivingCenterAdver model){
        boolean ret = livingCenterAdverService.update(model);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "LivingCenterAdver/Delete/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "删除商户广告管理信息", module = "后台、前台-商户广告管理信息块管理")
    public ResultMessage BaseDel(@PathVariable int objectid){
        boolean ret = livingCenterAdverService.delete(objectid);
        if (ret){
            return Msg(true, ConstClass.ResultDeleteSuccess);
        }else{
            return Msg(false,ConstClass.ResultDeleteFault);
        }
    }

    @RequestMapping(value = "LivingCenterAdver/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "列表商户广告管理信息", module = "后台、前台-商户广告管理信息块管理")
    public PageResult<LivingCenterAdver> BaseList(@PathVariable int page, @PathVariable int pageSize, LivingCenterAdver Model){
        PageResult<LivingCenterAdver> models = livingCenterAdverService.findAll(page, pageSize, Model,false,"orderA");
        return models;
    }

    @RequestMapping(value = "LivingCenterAdver/isBan", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "禁用/启用", module = "后台、前台-商户广告管理信息块管理")
    public ResultMessage isBan(HttpServletRequest request){
        String oid = request.getParameter("objectid");
        String isBan = request.getParameter("isBan");
        try{
            LivingCenterAdver lca = livingCenterAdverService.getbyId(Integer.valueOf(oid));
            lca.setIsBan(Integer.valueOf(isBan));
            boolean ret = livingCenterAdverService.update(lca);
            if (ret){
                return Msg(true, ConstClass.ResultSaveSuccess);
            }else{
                return Msg(false,ConstClass.ResultSaveFault);
            }
        }catch (NullPointerException e){
            return Msg(false,ConstClass.DataError);
        }
    }
}
