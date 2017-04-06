package com.wiseonline.Dao;

import com.wiseonline.Domain.User;
import com.wiseonline.Service.Impl.UserServiceImpl;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

/**
 * Created by R7tech on 12/22/2015.
 */
@Service
public class UserDaoImpl extends  BaseDaoImpl<User> implements UserDao{

    @Resource
    UserServiceImpl userService;
    public int countUser(String userName, String userPassword) {
        return userService.findByDataSQL("select * from users where username='"+userName+"'").size();
    }

    public User querySingleUser(String userName) {
        return userService.locateUser(userName);
    }

    public List<User> queryUserByMobile(String mobile){
        return userService.findByDataSQL("select * from users where phone='"+mobile+"'");
    }
}
