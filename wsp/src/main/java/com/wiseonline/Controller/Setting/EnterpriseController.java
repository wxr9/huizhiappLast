package com.wiseonline.Controller.Setting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.Enterprise;
import com.wiseonline.Domain.SettingDict;
import com.wiseonline.Domain.User;
import com.wiseonline.Service.Impl.EnterpriseServiceImpl;
import com.wiseonline.Service.Impl.RoleServiceImpl;
import com.wiseonline.Service.Impl.SettingDictServiceImpl;
import com.wiseonline.Service.Impl.UserServiceImpl;
import com.wiseonline.Utils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * Created by yanwj on 2015/11/9.
 */
@RestController
@RequestMapping("/Setting/Enterprise")
public class EnterpriseController extends BaseController {
    @Autowired
    EnterpriseServiceImpl enterpriseService;
    @Autowired
    UserServiceImpl userService;
    @Autowired
    SettingDictServiceImpl settingDictService;
    @Autowired
    RoleServiceImpl roleService;

    private static String WSP_SESSION_USERNAME = "WSP_SESSION_USERNAME";

    @RequestMapping(value = "{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查询企业", module = "后台-企业管理")
    public PageResult<Enterprise> getAll(HttpServletRequest request,@PathVariable int page,@PathVariable int pageSize,Enterprise model){
        String doudouke = request.getParameter("searchName");
        if (doudouke != null){
            String sql = "SELECT * FROM enterprise WHERE name LIKE '%"+doudouke+"%' or contacts LIKE '%"+doudouke+
                    "%' OR contactsinfo LIKE '%"+doudouke+"%' OR abbreviation LIKE '%"+doudouke+"%' or address LIKE '%"
                    +doudouke+"%' or username LIKE '%"+doudouke+"%'";
            String sql2 ="";
            if (page == 1){
                sql2 = "SELECT * FROM enterprise WHERE name LIKE '%"+doudouke+"%' or contacts LIKE '%"+doudouke+
                        "%' OR contactsinfo LIKE '%"+doudouke+"%' OR abbreviation LIKE '%"+doudouke+"%' or address LIKE '%"+
                        doudouke+"%' or username LIKE '%"+doudouke+"%' limit 0,"+pageSize;
            }else if (page == 0){
                sql2 = sql;
            }else {
                sql2 = "SELECT * FROM enterprise WHERE name LIKE '%"+doudouke+"%' or contacts LIKE '%"+doudouke+
                        "%' OR contactsinfo LIKE '%"+doudouke+"%' OR abbreviation LIKE '%"+doudouke+"%' or address LIKE '%"+
                        doudouke+"%' or username LIKE '%"+doudouke+"%' limit "+(page-1)*pageSize+","+pageSize;
            }
            PageResult<Enterprise> pageResult = new PageResult<Enterprise>();
            List<Enterprise> list = enterpriseService.findByDataSQL(sql);
            if (list != null) {
                pageResult.setTotal(list.size());
            }else {
                pageResult.setTotal(0);
            }
            List<Enterprise> listObject = enterpriseService.findByDataSQL(sql2);
            pageResult.setResult(listObject);
            pageResult.setPage(0);
            pageResult.setPagesize(pageSize);
            return pageResult;
        }else {
            PageResult<Enterprise> models = enterpriseService.findAll(page, pageSize, model);
            return models;
        }
    }

    @RequestMapping(value = "Available/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查询企业", module = "后台-企业管理")
    public PageResult<Enterprise> AvailableGetAll(HttpServletRequest request,@PathVariable int page,@PathVariable int pageSize,Enterprise model){
        String doudouke = request.getParameter("searchName");
        if (doudouke != null && !doudouke.equals("")){
            String sql = "SELECT * FROM enterprise WHERE name LIKE '%"+doudouke+"%' or contacts LIKE '%"+doudouke+
                    "%' OR contactsinfo LIKE '%"+doudouke+"%' OR abbreviation LIKE '%"+doudouke+"%' or address LIKE '%"
                    +doudouke+"%' or username and deleteflag > 0 LIKE '%"+doudouke+"%'";
            String sql2 ="";
            if (page == 1){
                sql2 = "SELECT * FROM enterprise WHERE name LIKE '%"+doudouke+"%' or contacts LIKE '%"+doudouke+
                        "%' OR contactsinfo LIKE '%"+doudouke+"%' OR abbreviation LIKE '%"+doudouke+"%' or address LIKE '%"+
                        doudouke+"%' or username deleteflag > 0 LIKE '%"+doudouke+"%' limit 0,"+pageSize;
            }else if (page == 0){
                sql2 = sql;
            }else {
                sql2 = "SELECT * FROM enterprise WHERE name LIKE '%"+doudouke+"%' or contacts LIKE '%"+doudouke+
                        "%' OR contactsinfo LIKE '%"+doudouke+"%' OR abbreviation LIKE '%"+doudouke+"%' or address LIKE '%"+
                        doudouke+"%' or username deleteflag > 0 LIKE '%"+doudouke+"%' limit "+(page-1)*pageSize+","+pageSize;
            }
            PageResult<Enterprise> pageResult = new PageResult<Enterprise>();
            List<Enterprise> list = enterpriseService.findByDataSQL(sql);
            if (list != null) {
                pageResult.setTotal(list.size());
            }else {
                pageResult.setTotal(0);
            }
            List<Enterprise> listObject = enterpriseService.findByDataSQL(sql2);
            pageResult.setResult(listObject);
            pageResult.setPage(0);
            pageResult.setPagesize(pageSize);
            return pageResult;
        }else {
            PageResult<Enterprise> models = enterpriseService.findByOneField(page,pageSize,"deleteFlag",1,true,"objectid",model);
            return models;
        }
    }
    @RequestMapping(value = "Add",method = RequestMethod.POST)
    @PermissionInfo(name = "新增企业", module = "后台-企业管理")
    public ResultMessage Add(Enterprise model){
        String username = model.getUsername();
        List<User> users = userService.findByOneField(0, 0,
                "username", username, true, "username").getResult();
        if (0 < users.size()) {
            return Msg(false, "企业用户名已被使用");
        } else {
            User user = new User();
            user.setUsername(username);
            user.setName(username);
            user.setRealName(username);
            user.setEnterpriseRoot(2);
            user.setUserFlag(3);
            user.setSex(1);
            user.setMarital(1);
            user.setDeleteFlag(1);
            boolean rst = userService.insertNewUser(user);
            if (rst) {
                String sql = "insert into role_user (rolename,username) values ('Common','"+username+"')";
                roleService.execDataSql(sql);
                if (enterpriseService.IsExistName("name", model.getName(), model.getObjectid())) {
                    return Msg(false, "企业名已存在");
                } else {
                    if (model.getType() != 0){
                        SettingDict settingDict = settingDictService.getbyId(model.getType());
                        model.setEnterpriseType(settingDict);
                    }
                    if (model.getIndustry() != 0){
                        SettingDict settingDict = settingDictService.getbyId(model.getIndustry());
                        model.setEnterpriseIndustry(settingDict);
                    }
                    if (model.getScale() != 0){
                        SettingDict settingDict = settingDictService.getbyId(model.getScale());
                        model.setEnterpriseScale(settingDict);
                    }
                    if (model.getIntake() != 0){
                        SettingDict settingDict = settingDictService.getbyId(model.getIntake());
                        model.setEnterpriseIntake(settingDict);
                    }
                    if (model.getDeleteFlag() == 0){
                        model.setDeleteFlag(1);
                    }
                    boolean rsts = enterpriseService.saveGetID(model);
                    if (rsts) {
                        User user1 = userService.getbyId(user.getUsername());
                        System.out.println(model.getObjectid());
                        user1.setEnterprise(model);
                        boolean r = userService.update(user1);
                        return Msg(true, ConstClass.ResultSaveSuccess);
                    } else {
                        userService.delete(username);
                        return Msg(false, ConstClass.ResultSaveFault);
                    }
                }
            } else {
                return Msg(false, ConstClass.ResultSaveFault);
            }
        }
    }
    @RequestMapping(value = "Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "编辑企业", module = "后台-企业管理")
    public Enterprise Edit(@PathVariable int id){
        Enterprise model = enterpriseService.getbyId(id);
        return model;
    }
    @RequestMapping(value = "Update",method = RequestMethod.POST)
    @PermissionInfo(name = "更新企业", module = "后台-企业管理")
    public ResultMessage Update(Enterprise model){
        if (enterpriseService.IsExistName("name",model.getName(),model.getObjectid())){
            return Msg(false,"企业名已存在");
        }else{
            if (model.getType() != 0){
                SettingDict settingDict = settingDictService.getbyId(model.getType());
                model.setEnterpriseType(settingDict);
            }
            if (model.getIndustry() != 0){
                SettingDict settingDict = settingDictService.getbyId(model.getIndustry());
                model.setEnterpriseIndustry(settingDict);
            }
            if (model.getScale() != 0){
                SettingDict settingDict = settingDictService.getbyId(model.getScale());
                model.setEnterpriseScale(settingDict);
            }
            if (model.getIntake() != 0){
                SettingDict settingDict = settingDictService.getbyId(model.getIntake());
                model.setEnterpriseIntake(settingDict);
            }
            if (model.getDeleteFlag() == 0){
                model.setDeleteFlag(1);
            }
            boolean rst = enterpriseService.update(model);
            if (rst){
                return Msg(true, ConstClass.ResultSaveSuccess);
            }else{
                return Msg(false,ConstClass.ResultSaveFault);
            }
        }
    }
    @RequestMapping(value = "EnableEnterprise/{enterpriseId}/{flag}")
    @PermissionInfo(name = "禁用解禁企业", module = "后台-企业管理")
    public ResultMessage EnableEnterprise(@PathVariable int enterpriseId,@PathVariable String flag){
        if (flag.equals("0")){
            //禁用企业
            boolean rst = this.enableEnterprise(enterpriseId, "-1");
            if (rst){
                return Msg(true,ConstClass.DisableEnterpriseSuccess);
            }else{
                return Msg(false,ConstClass.DisableEnterpriseFault);
            }
        }else{
            //启用企业
            boolean rst = this.enableEnterprise(enterpriseId, "1");
            if (rst){
                return Msg(true,ConstClass.EnableEnterpriseSuccess);
            }else{
                return Msg(true,ConstClass.EnableEnterpriseFault);
            }
        }
    }

    @RequestMapping(value = "RestEnterpriseAdminPassword/{enterpriseId}")
    @PermissionInfo(name = "重置企业管理员密码", module = "后台-企业管理")
    public ResultMessage RestEnterpriseAdminPassword(@PathVariable int enterpriseId){
        String sql = "select u.* from users as u where u.enterpriseid = "+enterpriseId+" and u.enterpriseroot = 2";
        List<User> list = userService.findByDataSQL(sql);
        if (list != null){
            if (0 < list.size() && list.size() < 2){
                User user = list.get(0);
                boolean rst = userService.ResetPassword(user);
                if (rst){
                    return Msg(true,ConstClass.RestPasswordSuccess);
                }else{
                    return Msg(false,ConstClass.RestPasswordFault);
                }
            }else{
                return Msg(false,ConstClass.DataError);
            }
        }else {
            return Msg(false, ConstClass.EnterpriseNotFind);
        }
    }
    @RequestMapping(value = "EnterpriseInfo", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "编辑企业", module = "后台-企业管理")
    public Enterprise EnterpriseInfo(HttpServletRequest request) throws MyException {
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            User user = userService.getbyId(username);
            if (user != null) {
                Enterprise model = enterpriseService.getbyId(user.getEnterpriseId());
                return model;
            }else {
                throw new MyException(ConstClass.NoUser);
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }

    /**
     * 禁用启用企业
     * @param enterpriseId
     * @param flag
     * @return
     */
    private boolean enableEnterprise(int enterpriseId, String flag) {
        Enterprise enterprise = enterpriseService.getbyId(enterpriseId);
        if (enterprise != null){
            enterprise.setDeleteFlag(Integer.valueOf(flag));
            boolean rst = enterpriseService.update(enterprise);
            if (rst){
                String username = enterprise.getUsername();
                User user = userService.getbyId(username);
                if (user != null){
                    if (Integer.valueOf(flag) == 1) {
                        user.setDeleteFlag(1);
                    }else {
                        user.setDeleteFlag(-1);
                    }
                }
                userService.update(user);
                return true;
            }else {
                return false;
            }
        }else {
            return false;
        }
    }

}
