package com.wiseonline.Controller.Setting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.AccessoryManage;
import com.wiseonline.Service.Impl.AccessoryManageServiceImpl;
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
import java.io.File;

/**
 * Created by yanwj on 2016/5/3.
 */
@RestController
@RequestMapping("/Setting/AccessoryManage")
public class AccessoryManageController extends BaseController {

    @Autowired
    AccessoryManageServiceImpl accessoryManageService;

    @RequestMapping(value = "List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查询附件资源", module = "后台-配置管理")
    public PageResult<AccessoryManage> getAll(@PathVariable int page, @PathVariable int pageSize, AccessoryManage model) {
        PageResult<AccessoryManage> models = accessoryManageService.findAll(page, pageSize, model);
        return models;
    }

    @RequestMapping(value = "Add", method = RequestMethod.POST)
    @PermissionInfo(name = "新增附件资源", module = "后台-配置管理")
    public ResultMessage Add(AccessoryManage model) {
        boolean rst = accessoryManageService.save(model);
        if (rst) {
            return Msg(true, ConstClass.ResultSaveSuccess);
        } else {
            return Msg(false, ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "编辑附件资源", module = "后台-配置管理")
    public AccessoryManage Edit(@PathVariable int id) {
        AccessoryManage model = accessoryManageService.getbyId(id);
        return model;
    }

    @RequestMapping(value = "Update", method = RequestMethod.POST)
    @PermissionInfo(name = "更新附件资源", module = "后台-配置管理")
    public ResultMessage Update(AccessoryManage model) {
        boolean rst = accessoryManageService.saveOrUpdate(model);
        if (rst) {
            return Msg(true, ConstClass.ResultSaveSuccess);
        } else {
            return Msg(false, ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "Delete/{id}", method = RequestMethod.GET)
    @PermissionInfo(name = "删除附件资源", module = "后台-配置管理")
    public ResultMessage Delete(@PathVariable int id,HttpServletRequest request) {
        AccessoryManage model = accessoryManageService.getbyId(id);
        String fileUrl = model.getUrl();
        fileUrl = fileUrl.replace("/","\\");
        String filedir = request.getSession().getServletContext().getRealPath("/")+fileUrl;
        filedir = filedir.replace("\\","/");
        File file = new File(filedir);
        if (file.isFile() && file.exists()) {
            file.delete();//"删除单个文件"+name+"成功！"
        }
        boolean rst = accessoryManageService.delete(id);
        if (rst) {
            return Msg(true, ConstClass.ResultDeleteSuccess);
        } else {
            return Msg(false, ConstClass.ResultDeleteFault);
        }
    }
}
