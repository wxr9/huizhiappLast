package com.wiseonline.Service;
import com.wiseonline.Domain.Role;
/**
 * Created by yanwj on 2015/11/6.
 */
public interface RoleService extends BaseDaoService<Role>{

    public boolean delete(String id);

}
