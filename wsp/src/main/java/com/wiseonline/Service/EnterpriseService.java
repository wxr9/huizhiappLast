package com.wiseonline.Service;

import com.wiseonline.Domain.Enterprise;

/**
 * Created by yanwj on 2015/11/9.
 */
public interface EnterpriseService extends BaseDaoService<Enterprise>{
    boolean deleteEnterprise(int id);
}
