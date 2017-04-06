package com.wiseonline.Controller.Setting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.Permission;
import com.wiseonline.Domain.Role;
import com.wiseonline.Service.Impl.PermissionServiceImpl;
import com.wiseonline.Service.Impl.RoleServiceImpl;
import com.wiseonline.Utils.ConstClass;
import com.wiseonline.Utils.PageResult;
import com.wiseonline.Utils.PermissionInfo;
import com.wiseonline.Utils.ResultMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Created by yanwj on 2015/11/6.
 */
@RestController
@RequestMapping("/Setting/User/Role")
public class RoleController extends BaseController {
    @Autowired
    RoleServiceImpl roleService;

    @Autowired
    PermissionServiceImpl permissionService;

    @RequestMapping(value = "/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看角色", module = "后台-角色管理")
    public PageResult<Role> getAll(@PathVariable int page,
                                   @PathVariable int pageSize, Role Model) {
        PageResult<Role> models = roleService.findAll(page, pageSize, Model);
        return models;
    }

    @RequestMapping(value = "Add", method = RequestMethod.POST)
    @PermissionInfo(name = "添加角色", module = "后台-角色管理")
    public ResultMessage Add(Role Model) {
        PageResult<Role> rolePageResult = roleService.findByOneField(0, 0, "rolename", Model.getRolename(), true, "rolename");
        if (rolePageResult.getTotal() > 0) {
            return Msg(false, "角色id已存在");
        } else {
            return Update(Model);
        }

    }

    @RequestMapping(value = "Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看角色", module = "后台-角色管理")
    public Role Edit(@PathVariable String id) {
        Role model = roleService.getbyId(id);
        return model;
    }

    @RequestMapping(value = "Update", method = RequestMethod.POST)
    @PermissionInfo(name = "更新角色", module = "后台-角色管理")
    public ResultMessage Update(Role Model) {
        Set<Permission> permissions = new HashSet<Permission>();
        String[] a = Model.getPermissionArray().split(",");
        for (String s : a) {
            Permission r = permissionService.getbyId(Integer.parseInt(s));
            permissions.add(r);
        }
        Model.setPermissionList(permissions);
        PageResult<Role> rolePageResult = roleService.findByOneField(0, 0, "name", Model.getName(), true, "rolename");
        if(rolePageResult.getTotal() == 0){
            boolean rst = roleService.saveOrUpdate(Model);
            if (rst) {
                return Msg(true, ConstClass.ResultSaveSuccess);
            } else {
                return Msg(false, ConstClass.ResultSaveFault);
            }
        }else{
            List<Role> roles = rolePageResult.getResult();
            if((roles.size() == 1 && roles.get(0).getRolename().equals(Model.getRolename()))|| (roles.size() == 0)){
                boolean rst = roleService.saveOrUpdate(Model);
                if (rst) {
                    return Msg(true, ConstClass.ResultSaveSuccess);
                } else {
                    return Msg(false, ConstClass.ResultSaveFault);
                }
            }else{
                return Msg(false, "角色名称已存在");
            }

        }
    }

    @RequestMapping(value = "Delete/{id}", method = RequestMethod.GET)
    @PermissionInfo(name = "删除角色", module = "后台-角色管理")
    public ResultMessage Delete(@PathVariable String id) {
        String deleteRolePer = "delete from role_permission where rolename = '"+id+"'";
        String sql="delete from roles where rolename = '"+id+"'";
        boolean rst = roleService.execDataSql(deleteRolePer);
        if (rst) {
            rst = roleService.execDataSql(sql);
            if (rst) {
                return Msg(true, ConstClass.ResultDeleteSuccess);
            }else {
                return Msg(false, ConstClass.ResultDeleteFault);
            }
        } else {
            return Msg(false, ConstClass.ResultDeleteFault);
        }
    }

}
