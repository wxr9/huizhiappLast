package com.wiseonline.Service.Impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.StandardPasswordEncoder;
import org.springframework.stereotype.Service;

import com.wiseonline.Domain.Role;
import com.wiseonline.Domain.User;
import com.wiseonline.Service.UserService;

/**
 * Created by yanwj on 2015/11/6.
 */
@Service("userService")
public class UserServiceImpl extends BaseDaoServiceImpl<User> implements
        UserService , UserDetailsService {
    @Autowired
    private StandardPasswordEncoder passwordEncoder;

    @Autowired
    RoleServiceImpl roleService;

    @Autowired
    SettingDictServiceImpl settingDictService;

    @Autowired
    SettingCityServiceImpl settingCityService;

    @Autowired
    EnterpriseServiceImpl enterpriseService;

    public boolean insertNewUser(final User user) {
        if (user.getPassword() == null) {
            user.setPassword("1bbd886460827015e5d605ed44252251");
        }
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setHpassword(hashedPassword);
        if (user.getNation() != 0){
            user.setSettingNation(settingDictService.getbyId(user.getNation()));
        }
        if (user.getApartmentCity() != 0){
            user.setSettingApartmentCity(settingCityService.getbyId(user.getApartmentCity()));
        }
        if (user.getHometownCity() != 0){
            user.setSettingHometowntCity(settingCityService.getbyId(user.getHometownCity()));
        }
        if (user.getEducation() != 0){
            user.setSettingDict(settingDictService.getbyId(user.getEducation()));
        }
        if (user.getEnterpriseId() != 0){
            user.setEnterprise(enterpriseService.getbyId(user.getEnterpriseId()));
        }else{
            user.setEnterprise(null);
        }
        if (user.getDepartment() != 0){
            user.setSettingDepartmentDict(settingDictService.getbyId(user.getDepartment()));
        }
        String roleArray = user.getRoleArray();
        Set<Role> setRoles = new HashSet<Role>();
        if (roleArray != null) {
            String[] roleArrays = roleArray.split(",");
            if (roleArrays != null) {
                for (int i = 0; i < roleArrays.length; i++) {
                    List<Role> roles = roleService.findByOneField(0, 0,
                            "rolename", roleArrays[i], true, "rolename")
                            .getResult();
                    if (roles != null) {
                        Role role = roles.get(0);
                        setRoles.add(role);
                    }
                }
            }
        }
        user.setRoleList(setRoles);

		/*
		 * User newUser = new User(user.getUsername(), hashedPassword,
		 * Role.ROLE_USER);
		 */
        return this.saveOrUpdate(user);
    }

    @Override
    public boolean delete(String id) {
        return execSql("delete User" + "  where username ='" + id + "'");

    }

    public boolean confirm(User model) {
        // TODO Auto-generated method stub
        System.out.println(model.getPassword());
        User user = this.getbyId(model.getUsername());
        if (passwordEncoder.matches(model.getPassword(), user.getHpassword())) {
            return true;
        }else {
            return false;
        }
    }

    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {
        UserDetails ud = locateUser(username);
        return ud;
    }

    public User locateUser(final String username) {
        User user = this.getbyId(username);
        return user;
    }

    /**
     * 用户修改密码
     * @param username
     * @param oldPD
     * @param password
     * @return
     */
    public boolean ChangePassword(String username, String oldPD,String password) {
        User user = this.getbyId(username);
       if (passwordEncoder.matches(oldPD, user.getHpassword())) {
            System.out.println(oldPD);
            String hashedPassword = passwordEncoder.encode(password);
            return this.execDataSql("update users set hpassword = '"
                    + hashedPassword + "' where username='"
                    + username + "'");
        }
        else
            return false;

    }

    /***
     * 禁用、解禁用户
     * @param username
     * @param flag
     * @return
     */
    public boolean enableUser(String username, String flag) {
        User user = this.getbyId(username);
        if (user != null){
            user.setDeleteFlag(Integer.valueOf(flag));
            boolean rst = this.update(user);
            if (rst){
                return true;
            }else {
                return false;
            }
        }else {
            return false;
        }
    }

    /***
     * 重置密码
     * @param user
     * @return
     */
    public boolean ResetPassword(User user){
            String password = "1bbd886460827015e5d605ed44252251";
            String hashedPassword = passwordEncoder.encode(password);
            return this.execDataSql("update users set hpassword = '"
                    + hashedPassword + "' where username='"
                    + user.getUsername() + "'");
    }

    public boolean CompleteUserInfo(User user) {
        return update(user);
    }

    /**
     * 更改电话号码
     * @param username
     * @param phone
     * @return
     */
    public boolean ChangePhone(String username, String phone) {
        return this.execDataSql("update users set phone = '"+phone+"' where username = '"+username+"'");
    }

    /**
     * 用户忘记密码，新设置密码
     * @param username
     * @param phone
     * @param password
     * @return
     */
    public boolean SetNewPassword(String username, String phone, String password) {
        User user = this.getbyId(username);
        if (user.getPhone().equals(phone)) {
            String hashedPassword = passwordEncoder.encode(password);
            return this.execDataSql("update users set hpassword = '"
                    + hashedPassword + "' where username='"
                    + username + "'");
        }
        else
            return false;
    }

    /**
     * 修改密码
     * @param username
     * @param password
     * @return
     */
    public boolean ChangePassword(String username, String password) {
        String hashedPassword = passwordEncoder.encode(password);
        return this.execDataSql("update users set hpassword = '"
                + hashedPassword + "' where username='"
                + username + "'");
    }
}
