package com.wiseonline.Dao;

import com.wiseonline.Domain.User;

import java.util.List;

/**
 * Created by yanwj on 2015/11/11.
 */
public interface UserDao extends BaseDao<User>{
    public int countUser(String userName,String userPassword);

    public User querySingleUser(String userName);

    public List<User> queryUserByMobile(String mobile);
}
