package com.wiseonline.Controller.Setting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.MenuAdmin;
import com.wiseonline.Domain.Permission;
import com.wiseonline.Domain.Role;
import com.wiseonline.Service.MenuAdminService;
import com.wiseonline.Service.RoleService;
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
import java.util.*;

/**
 * Created by R7tech on 3/2/2016.
 */
@RestController
@RequestMapping("/Setting")
public class MenuAdminController extends BaseController {
    @Autowired
    MenuAdminService menuAdminService;

    @Autowired
    RoleService roleService;

    @RequestMapping(value = "MenuAdmin/Edit/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看后台管理菜单信息", module = "后台、前台-后台管理菜单信息块管理")
    public MenuAdmin BaseEdit(@PathVariable int objectid){
        MenuAdmin model = menuAdminService.getbyId(objectid);
        return model;
    }

    @RequestMapping(value = "MenuAdmin/Add", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加后台管理菜单信息", module = "后台、前台-后台管理菜单信息块管理")
    public ResultMessage BaseAdd(MenuAdmin model){
        boolean ret = menuAdminService.save(model);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "MenuAdmin/Delete/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "删除后台管理菜单信息", module = "后台、前台-后台管理菜单信息块管理")
    public ResultMessage BaseDel(@PathVariable int objectid){
        boolean ret = menuAdminService.delete(objectid);
        if (ret){
            return Msg(true, ConstClass.ResultDeleteSuccess);
        }else{
            return Msg(false,ConstClass.ResultDeleteFault);
        }
    }

    @RequestMapping(value = "MenuAdmin/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "列表后台管理菜单信息", module = "后台、前台-后台管理菜单信息块管理")
    public PageResult<MenuAdmin> BaseList(@PathVariable int page, @PathVariable int pageSize, MenuAdmin Model){
        PageResult<MenuAdmin> models = menuAdminService.findAll(page, pageSize, Model);
        return models;
    }

    @RequestMapping(value = "MenuAdmin/GetRoleMenu", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "获取后台管理菜单信息", module = "后台、前台-后台管理菜单信息块管理")
    public List<MenuAdmin> RoleMenuList(HttpServletRequest request){
        String username = getUserName();
        //String sql = "select * from roles where rolename=(select rolename from role_user where username='"+username+"')";
        String sql = "SELECT  * FROM roles as r LEFT JOIN role_user as ru ON r.rolename = ru.rolename WHERE ru.username = '"+username+"' order by ru.rolename";
        List<Role> roleList = roleService.findByDataSQL(sql);

        List<MenuAdmin> mList = menuAdminService.findByDataSQL("select * from menu_admin where enable=1");
        List<MenuAdmin> returnList  = new ArrayList<MenuAdmin>();
        for (Role r:roleList){
            Iterator<Permission> iter = r.getPermissionList().iterator();
            while (iter.hasNext()){
                Permission ma = iter.next();
                for (int j=0;j<mList.size();j++){
                    String mUrl = ma.getUrl();
                    String lUrl = mList.get(j).getUrl();
                    if (mList.get(j).getParent()==0 && !returnList.contains(mList.get(j))){
                        returnList.add(mList.get(j));
                        continue;
                    }
                    if (mUrl!=null && lUrl!=null && lUrl.trim().equals(mUrl.trim())){
                        if (!returnList.contains(mList.get(j))) returnList.add(mList.get(j));
                    }
                }
            }
        }

        Collections.sort(returnList, new Comparator<MenuAdmin>() {
            public int compare(MenuAdmin arg0, MenuAdmin arg1) {
                return new Integer(arg0.getId()).compareTo(arg1.getId());
            }
        });
        return returnList;
    }
}
