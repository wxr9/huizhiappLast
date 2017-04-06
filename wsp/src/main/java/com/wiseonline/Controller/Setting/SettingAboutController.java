package com.wiseonline.Controller.Setting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.SettingAbout;
import com.wiseonline.Domain.SettingRichText;
import com.wiseonline.Service.Impl.SettingAboutServiceImpl;
import com.wiseonline.Service.Impl.SettingRichTextServiceImpl;
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
 * Created by yanwj on 2015/12/3.
 */
@RestController
@RequestMapping("/Setting/SettingAbout")
public class SettingAboutController extends BaseController{

    @Autowired
    SettingAboutServiceImpl settingAboutService;

    @Autowired
    SettingRichTextServiceImpl settingRichTextService;

    @RequestMapping(value = "{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看服务信息", module = "后台、前台-服务信息块管理")
    public PageResult<SettingAbout> getAll(@PathVariable int page,@PathVariable int pageSize,SettingAbout model){
        PageResult<SettingAbout> models = settingAboutService.findAll(page,pageSize,model);
        return models;
    }
    @RequestMapping(value = "Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看服务信息", module = "后台、前台-服务信息块管理")
    public SettingAbout Edit(@PathVariable int id){
        SettingAbout model = settingAboutService.getbyId(id);
        return model;
    }
    @RequestMapping(value = "Update",method = RequestMethod.POST)
    @PermissionInfo(name = "更新服务信息", module = "后台、前台-服务信息块管理")
    public ResultMessage Update(SettingAbout model){
            if (model.getRichtextid() != 0){
                SettingRichText settingRichText = settingRichTextService.getbyId(model.getRichtextid());
                model.setSettingRichText(settingRichText);
            }
            boolean rst = settingAboutService.update(model);
            if (rst){
                return Msg(true, ConstClass.ResultSaveSuccess);
            }else{
                return Msg(false,ConstClass.ResultSaveFault);
            }
    }
}
