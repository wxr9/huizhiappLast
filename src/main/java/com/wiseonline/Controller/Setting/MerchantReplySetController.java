package com.wiseonline.Controller.Setting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.LivingCenterAdver;
import com.wiseonline.Domain.MerchantReplySet;
import com.wiseonline.Service.LivingCenterAdverService;
import com.wiseonline.Service.MerchantReplySetService;
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
 * Created by R7tech on 3/9/2016.
 */
@RestController
@RequestMapping("/Setting")
public class MerchantReplySetController extends BaseController {
    @Autowired
    MerchantReplySetService merchantReplySetService;


    @RequestMapping(value = "MerchantReplySet/Edit/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看商户广告管理信息", module = "后台、前台-商户广告管理信息块管理")
    public MerchantReplySet BaseEdit(@PathVariable int objectid){
        MerchantReplySet model = merchantReplySetService.getbyId(objectid);
        return model;
    }

    @RequestMapping(value = "MerchantReplySet/Add", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加商户广告管理信息", module = "后台、前台-商户广告管理信息块管理")
    public ResultMessage BaseAdd(MerchantReplySet model){
        boolean ret = merchantReplySetService.save(model);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "MerchantReplySet/Update", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加商户广告管理信息", module = "后台、前台-商户广告管理信息块管理")
    public ResultMessage BaseUpdate(MerchantReplySet model){
        boolean ret = merchantReplySetService.update(model);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "MerchantReplySet/Delete/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "删除商户广告管理信息", module = "后台、前台-商户广告管理信息块管理")
    public ResultMessage BaseDel(@PathVariable int objectid){
        boolean ret = merchantReplySetService.delete(objectid);
        if (ret){
            return Msg(true, ConstClass.ResultDeleteSuccess);
        }else{
            return Msg(false,ConstClass.ResultDeleteFault);
        }
    }

    @RequestMapping(value = "MerchantReplySet/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "列表商户广告管理信息", module = "后台、前台-商户广告管理信息块管理")
    public PageResult<MerchantReplySet> BaseList(@PathVariable int page, @PathVariable int pageSize, MerchantReplySet Model){
        PageResult<MerchantReplySet> models = merchantReplySetService.findAll(page, pageSize, Model);
        return models;
    }
}
