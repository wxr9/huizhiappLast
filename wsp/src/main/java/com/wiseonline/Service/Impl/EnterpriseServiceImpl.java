package com.wiseonline.Service.Impl;
import com.wiseonline.Domain.Enterprise;
import com.wiseonline.Domain.User;
import org.springframework.stereotype.Service;

import com.wiseonline.Service.EnterpriseService;

import java.util.List;

/**
 * Created by yanwj on 2015/11/9.
 */
@Service("enterpriseService")
public class EnterpriseServiceImpl  extends BaseDaoServiceImpl<Enterprise> implements EnterpriseService{
    /**
     * 逻辑删除企业信息
     * @param id
     * @return
     */
    public boolean deleteEnterprise(int id) {
        Enterprise enterprise = this.getbyId(id);
        if (enterprise != null){
            enterprise.setDeleteFlag(-1);
            return update(enterprise);
        }else {
            return false;
        }
    }

}
