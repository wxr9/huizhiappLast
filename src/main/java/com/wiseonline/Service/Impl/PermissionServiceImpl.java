package com.wiseonline.Service.Impl;
import org.springframework.stereotype.Service;

import com.wiseonline.Domain.Permission;
import com.wiseonline.Service.PermissionService;
/**
 * Created by yanwj on 2015/11/6.
 */
@Service("permissionService")
public class PermissionServiceImpl extends BaseDaoServiceImpl<Permission>
        implements PermissionService {

}
