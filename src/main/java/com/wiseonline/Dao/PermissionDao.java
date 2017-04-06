package com.wiseonline.Dao;

import com.wiseonline.Domain.Permission;

import java.util.List;

/**
 * Created by yanwj on 2015/11/11.
 */
public interface PermissionDao  extends BaseDao<Permission>{
    public List<Permission> findAll();
    //<!-- 根据用户Id获取该用户的权限-->
    public List<Permission> getUserResources(String userId);
    //<!-- 根据角色Id获取该角色的权限-->
    public List<Permission> getRoleResources(String roleId);
    //<!-- 根据用户名获取该用户的权限-->
    public List<Permission> getResourcesByUserName(String username);
    public void saveRoleRescours();
    public void deleteRoleRescours(String roleId);
}
