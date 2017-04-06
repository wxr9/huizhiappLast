package com.wiseonline.Controller.Setting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.EmailConfig;
import com.wiseonline.Domain.MerchantReplySet;
import com.wiseonline.Service.EmailConfigService;
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
public class EmailConfigController extends BaseController {
    @Autowired
    EmailConfigService emailConfigService;


    @RequestMapping(value = "EmailConfig/Edit/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看邮件配置管理信息", module = "后台、前台-邮件配置管理信息块管理")
    public EmailConfig BaseEdit(@PathVariable int objectid){
        EmailConfig model = emailConfigService.getbyId(objectid);
        return model;
    }

    @RequestMapping(value = "EmailConfig/Add", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加邮件配置管理信息", module = "后台、前台-邮件配置管理信息块管理")
    public ResultMessage BaseAdd(EmailConfig model){
        boolean ret = emailConfigService.save(model);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "EmailConfig/Update", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加邮件配置管理信息", module = "后台、前台-邮件配置管理信息块管理")
    public ResultMessage BaseUpdate(EmailConfig model){
        boolean ret = emailConfigService.update(model);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "EmailConfig/Delete/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "删除邮件配置管理信息", module = "后台、前台-邮件配置管理信息块管理")
    public ResultMessage BaseDel(@PathVariable int objectid){
        boolean ret = emailConfigService.delete(objectid);
        if (ret){
            return Msg(true, ConstClass.ResultDeleteSuccess);
        }else{
            return Msg(false,ConstClass.ResultDeleteFault);
        }
    }

    @RequestMapping(value = "EmailConfig/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "列表邮件配置管理信息", module = "后台、前台-邮件配置管理信息块管理")
    public PageResult<EmailConfig> BaseList(@PathVariable int page, @PathVariable int pageSize, EmailConfig Model){
        PageResult<EmailConfig> models = emailConfigService.findAll(page, pageSize, Model);
        return models;
    }
}
