package com.wiseonline.Controller.Setting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.SettingHelp;
import com.wiseonline.Service.Impl.SettingHelpServiceImpl;
import com.wiseonline.Utils.ConstClass;
import com.wiseonline.Utils.PageResult;
import com.wiseonline.Utils.PermissionInfo;
import com.wiseonline.Utils.ResultMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created by huizhisoft on 15/12/17.
 */
@RestController
@RequestMapping("/Setting/SettingHelp")
public class SettingHelpController extends BaseController{
    @Autowired
    SettingHelpServiceImpl settingHelpService;

    @RequestMapping(value = "{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看帮助列表", module = "后台、前台-帮助信息块管理")
    public PageResult<SettingHelp> getAll(@PathVariable int page, @PathVariable int pageSize, SettingHelp model){
        PageResult<SettingHelp> models = settingHelpService.findAll(page,pageSize,model);
        return models;
    }
    @RequestMapping(value = "Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看帮助信息", module = "后台、前台-帮助信息块管理")
    public SettingHelp Edit(@PathVariable int id){
        SettingHelp model = settingHelpService.getbyId(id);
        return model;
    }
    @RequestMapping(value = "Update",method = RequestMethod.POST)
    @PermissionInfo(name = "更新帮助信息", module = "后台、前台-帮助信息块管理")
    public ResultMessage Update(SettingHelp model){
        if (settingHelpService.IsExistName("title",model.getTitle(),model.getObjectid())){
            return Msg(false,"标题已存在");
        }else{
            boolean rst = settingHelpService.update(model);
            if (rst){
                return Msg(true, ConstClass.ResultSaveSuccess);
            }else{
                return Msg(false,ConstClass.ResultSaveFault);
            }
        }
    }

    /**
     *  顶级菜单列表
     * @return
     */
    @RequestMapping(value = "TopLevel", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看帮助列表", module = "后台、前台-帮助信息块管理")
    public List<SettingHelp> TopLevel(){
        String sql = "select sh.* from setting_help as sh where sh.parentid = 0";
        List<SettingHelp> list = settingHelpService.findByDataSQL(sql);
        return list;
    }

    /**
     *  获取子项菜单列表
     * @return
     */
    @RequestMapping(value = "ChildLevel/{parentid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看子项帮助列表", module = "后台、前台-帮助信息块管理")
    public List<SettingHelp> ChildLevel(@PathVariable int parentid){
        String sql = "select sh.* from setting_help as sh where sh.parentid = "+parentid;
        List<SettingHelp> list = settingHelpService.findByDataSQL(sql);
        return list;
    }

}
