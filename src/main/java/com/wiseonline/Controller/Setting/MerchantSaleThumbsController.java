package com.wiseonline.Controller.Setting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.MerchantSaleThumbs;
import com.wiseonline.Service.MerchantSaleThumbsService;
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
 * Created by R7tech on 3/7/2016.
 */
@RestController
@RequestMapping("/Setting")
public class MerchantSaleThumbsController extends BaseController {
    @Autowired
    MerchantSaleThumbsService merchantSaleThumbsService;


    @RequestMapping(value = "MerchantSaleThumbs/Edit/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看后台商户优惠缩略图信息", module = "后台、前台-后台商户优惠缩略图信息块管理")
    public MerchantSaleThumbs BaseEdit(@PathVariable int objectid){
        MerchantSaleThumbs model = merchantSaleThumbsService.getbyId(objectid);
        return model;
    }

    @RequestMapping(value = "MerchantSaleThumbs/Add", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加后台商户优惠缩略图信息", module = "后台、前台-后台商户优惠缩略图信息块管理")
    public ResultMessage BaseAdd(MerchantSaleThumbs model){
        boolean ret = merchantSaleThumbsService.save(model);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "MerchantSaleThumbs/Update", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加后台商户优惠缩略图信息", module = "后台、前台-后台商户优惠缩略图信息块管理")
    public ResultMessage BaseUpdate(MerchantSaleThumbs model){
        boolean ret = merchantSaleThumbsService.update(model);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "MerchantSaleThumbs/Delete/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "删除后台商户优惠缩略图信息", module = "后台、前台-后台商户优惠缩略图信息块管理")
    public ResultMessage BaseDel(@PathVariable int objectid){
        boolean ret = merchantSaleThumbsService.delete(objectid);
        if (ret){
            return Msg(true, ConstClass.ResultDeleteSuccess);
        }else{
            return Msg(false,ConstClass.ResultDeleteFault);
        }
    }

    @RequestMapping(value = "MerchantSaleThumbs/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "列表后台商户优惠缩略图信息", module = "后台、前台-后台商户优惠缩略图信息块管理")
    public PageResult<MerchantSaleThumbs> BaseList(@PathVariable int page, @PathVariable int pageSize, MerchantSaleThumbs Model){
        PageResult<MerchantSaleThumbs> models = merchantSaleThumbsService.findAll(page, pageSize, Model);
        return models;
    }

   
}