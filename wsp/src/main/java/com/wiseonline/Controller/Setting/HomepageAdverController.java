package com.wiseonline.Controller.Setting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.HomepageAdver;
import com.wiseonline.Service.HomepageAdverService;
import com.wiseonline.Service.HomepageAdverService;
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
public class HomepageAdverController extends BaseController {
    @Autowired
    HomepageAdverService homepageAdverService;


    @RequestMapping(value = "HomepageAdver/Edit/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看首页广告管理信息", module = "后台、前台-首页广告管理信息块管理")
    public HomepageAdver BaseEdit(@PathVariable int objectid){
        HomepageAdver model = homepageAdverService.getbyId(objectid);
        return model;
    }

    @RequestMapping(value = "HomepageAdver/Add", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加首页广告管理信息", module = "后台、前台-首页广告管理信息块管理")
    public ResultMessage BaseAdd(HomepageAdver model){
        boolean ret = homepageAdverService.save(model);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "HomepageAdver/Update", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加首页广告管理信息", module = "后台、前台-首页广告管理信息块管理")
    public ResultMessage BaseUpdate(HomepageAdver model){
        boolean ret = homepageAdverService.update(model);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "HomepageAdver/Delete/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "删除首页广告管理信息", module = "后台、前台-首页广告管理信息块管理")
    public ResultMessage BaseDel(@PathVariable int objectid){
        boolean ret = homepageAdverService.delete(objectid);
        if (ret){
            return Msg(true, ConstClass.ResultDeleteSuccess);
        }else{
            return Msg(false,ConstClass.ResultDeleteFault);
        }
    }

    @RequestMapping(value = "HomepageAdver/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "列表首页广告管理信息", module = "后台、前台-首页广告管理信息块管理")
    public PageResult<HomepageAdver> BaseList(@PathVariable int page, @PathVariable int pageSize, HomepageAdver Model){
        PageResult<HomepageAdver> models = homepageAdverService.findAll(page, pageSize, Model,false,"orderA");
        return models;
    }

    @RequestMapping(value = "HomepageAdver/isBan", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "禁用/启用", module = "后台、前台-首页广告管理信息块管理")
    public ResultMessage isBan(HttpServletRequest request){
        String oid = request.getParameter("objectid");
        String isBan = request.getParameter("isBan");
        try{
            HomepageAdver lca = homepageAdverService.getbyId(Integer.valueOf(oid));
            lca.setIsBan(Integer.valueOf(isBan));
            boolean ret = homepageAdverService.update(lca);
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
