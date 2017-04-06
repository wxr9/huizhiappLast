package com.wiseonline.Controller.Setting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.MerchantComment;
import com.wiseonline.Service.MerchantCommentService;
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
public class MerchantCommentController  extends BaseController {
    @Autowired
    MerchantCommentService merchantCommentService;


    @RequestMapping(value = "MerchantComment/Edit/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看商户评价互动信息", module = "后台、前台-商户评价互动信息块管理")
    public MerchantComment BaseEdit(@PathVariable int objectid){
        MerchantComment model = merchantCommentService.getbyId(objectid);
        return model;
    }

    @RequestMapping(value = "MerchantComment/Add", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加商户评价互动信息", module = "后台、前台-商户评价互动信息块管理")
    public ResultMessage BaseAdd(MerchantComment model){
        boolean ret = merchantCommentService.save(model);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "MerchantComment/Update", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加商户评价互动信息", module = "后台、前台-商户评价互动信息块管理")
    public ResultMessage BaseUpdate(MerchantComment model){
        boolean ret = merchantCommentService.update(model);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "MerchantComment/Delete/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "删除商户评价互动信息", module = "后台、前台-商户评价互动信息块管理")
    public ResultMessage BaseDel(@PathVariable int objectid){
        boolean ret = merchantCommentService.delete(objectid);
        if (ret){
            return Msg(true, ConstClass.ResultDeleteSuccess);
        }else{
            return Msg(false,ConstClass.ResultDeleteFault);
        }
    }

    @RequestMapping(value = "MerchantComment/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "列表商户评价互动信息", module = "后台、前台-商户评价互动信息块管理")
    public PageResult<MerchantComment> BaseList(@PathVariable int page, @PathVariable int pageSize, MerchantComment Model){
        PageResult<MerchantComment> models = merchantCommentService.findAll(page, pageSize, Model);
        return models;
    }
}
