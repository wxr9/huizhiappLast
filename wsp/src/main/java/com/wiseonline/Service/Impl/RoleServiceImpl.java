package com.wiseonline.Service.Impl;
import org.springframework.stereotype.Service;

import com.wiseonline.Domain.Role;
import com.wiseonline.Service.RoleService;
/**
 * Created by yanwj on 2015/11/6.
 */

@Service("roleService")
public class RoleServiceImpl extends BaseDaoServiceImpl<Role>
        implements RoleService {

    @Override
    public boolean delete(String id){
        return execSql("delete roles" + "  where rolename ='"+id+"'");

    }

}
