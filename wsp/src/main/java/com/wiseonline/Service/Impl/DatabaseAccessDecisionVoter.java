package com.wiseonline.Service.Impl;
import java.util.Collection;
import java.util.Iterator;


import org.springframework.security.access.AccessDecisionVoter;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
/**
 * Created by yanwj on 2015/11/6.
 */
@Service("databaseAccessDecisionVoter")
public class DatabaseAccessDecisionVoter implements AccessDecisionVoter{
    public boolean supports(ConfigAttribute attribute) {
        // TODO Auto-generated method stub
        return true;
    }

    public boolean supports(Class clazz) {
        // TODO Auto-generated method stub
        return true;
    }

    public int vote(Authentication authentication, Object object,
                    Collection attributes) {
        Iterator<ConfigAttribute> iterator = attributes.iterator();
        while (iterator.hasNext()) {
            ConfigAttribute configAttribute = iterator.next();
            String needPermission = configAttribute.getAttribute();
            //System.out.println("needPermission is " + needPermission);
            for (GrantedAuthority ga : authentication.getAuthorities()) {
                if (needPermission.equals(ga.getAuthority())) {
                    return 1;
                }
            }
        }
        return -1;
    }
}
