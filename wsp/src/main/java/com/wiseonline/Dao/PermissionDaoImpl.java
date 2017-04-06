package com.wiseonline.Dao;

import com.wiseonline.Domain.Permission;
import com.wiseonline.Service.Impl.PermissionServiceImpl;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

/**
 * Created by R7tech on 12/22/2015.
 */
@Service
public class PermissionDaoImpl extends BaseDaoImpl<Permission> implements PermissionDao{
    @Resource
    PermissionServiceImpl permissionService;

    public List<Permission> findAll() {
        return permissionService.findAll();
    }

    public List<Permission> getUserResources(String userId) {
        return null;
    }

    public List<Permission> getRoleResources(String roleId) {
        return null;
    }

    public List<Permission> getResourcesByUserName(String username) {
        String c_sql = "select rolename from role_user where username='"+username+"'";
        String c_sql2 = "select permissionid from role_permission where rolename=("+c_sql+")";
        return permissionService.findByDataSQL("select objectid,name,url,memo from permissions where objectid=("+c_sql2+")");
    }

    public void saveRoleRescours() {

    }

    public void deleteRoleRescours(String roleId) {

    }
}
