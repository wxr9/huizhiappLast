package com.wiseonline.Service;

import com.wiseonline.Domain.User;
import com.wiseonline.Utils.PageResult;
import org.springframework.security.core.userdetails.UserDetailsService;

/**
 * Created by yanwj on 2015/11/6.
 */
public interface UserService extends UserDetailsService,BaseDaoService<User>{
    boolean insertNewUser(final User user);
    boolean confirm(User model);
    boolean ChangePassword(String username, String oldPD,String password);

    boolean enableUser(String username, String flag);
    boolean ResetPassword(User user);

    boolean CompleteUserInfo(User user);
    boolean ChangePhone(String username, String phone);

    boolean SetNewPassword(String username, String phone, String password);

    boolean ChangePassword(String username, String password);
}
