package com.wiseonline.Controller.Setting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.SettingHelps;
import com.wiseonline.Service.Impl.SettingHelpsServiceImpl;
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
import java.util.List;

/**
 * Created by yanwj on 2016/1/8.
 */
@RestController
@RequestMapping("/Setting/SettingHelps")
public class SettingHelpsController extends BaseController{
    @Autowired
    SettingHelpsServiceImpl settingHelpsService;

    @RequestMapping(value = "{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看帮助列表", module = "后台、前台-帮助信息块管理")
    public PageResult<SettingHelps> getAll(@PathVariable int page, @PathVariable int pageSize, SettingHelps model){
        PageResult<SettingHelps> models = settingHelpsService.findAll(page,pageSize,model);
        return models;
    }
    @RequestMapping(value = "Edit", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看帮助信息", module = "后台、前台-帮助信息块管理")
    public SettingHelps Edit(HttpServletRequest request){
        String type = request.getParameter("type");
        String sql = "select * from setting_helps where flag = '"+type+"'";
        List<SettingHelps> list = settingHelpsService.findByDataSQL(sql);
        if (list != null){
            if (0 < list.size()){
                return list.get(0);
            }
        }
        return new SettingHelps();
    }
    @RequestMapping(value = "Update",method = RequestMethod.POST)
    @PermissionInfo(name = "更新帮助信息", module = "后台、前台-帮助信息块管理")
    public ResultMessage Update(SettingHelps model){
            boolean rst = settingHelpsService.update(model);
            if (rst){
                return Msg(true, ConstClass.ResultSaveSuccess);
            }else{
                return Msg(false,ConstClass.ResultSaveFault);
            }
    }

    @RequestMapping(value = "Add",method = RequestMethod.POST)
    @PermissionInfo(name = "新增帮助信息", module = "后台、前台-帮助信息块管理")
    public ResultMessage Add(SettingHelps model){

        boolean rst = settingHelpsService.update(model);
        if (rst){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }
}