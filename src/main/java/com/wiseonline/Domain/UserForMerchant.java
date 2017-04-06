package com.wiseonline.Domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.wiseonline.Utils.CustomDateSerializer;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

/**
 * 用户表
 * Created by yanwj on 2015/11/6.
 */
@Entity
@Table(name = "users")
public class UserForMerchant implements UserDetails{
    /**
     *
     */
    private static final long serialVersionUID = 1L;

    public UserForMerchant() {

    }

    @Id
    private String username;

    public String name;

    @Column(name = "realname")
    public String realName;

    public int sex;

    public Date birthday;

    public String phone;

    public String email;


    @Column(name = "userface")
    public String userFace;

    @Column(name = "deleteflag")
    public int deleteFlag;

    @Column(name = "userflag")
    public int userFlag;




    public void setUsername(String username) {
        this.username = username.toLowerCase();
    }

    public String getUsername() {
        return username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRealName() {
        return realName;
    }

    public void setRealName(String realName) {
        this.realName = realName;
    }


    @JsonIgnore
    public String getPassword() {
        return "";
    }

    public boolean isEnabled() {
        return true;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }



    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {

        return null;
    }

    @JsonIgnore
    public boolean isAccountNonExpired() {
        return true;
    }

    @JsonIgnore
    public boolean isAccountNonLocked() {
        return true;
    }

    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return true;
    }



    public String getUserFace() {
        return userFace;
    }

    public void setUserFace(String userFace) {
        this.userFace = userFace;
    }




    public int getSex() {
        return sex;
    }

    public void setSex(int sex) {
        this.sex = sex;
    }

    @JsonSerialize (using = CustomDateSerializer.class)
    public Date getBirthday() {
        return birthday;
    }

    public void setBirthday(Date birthday) {
        this.birthday = birthday;
    }







    public int getDeleteFlag() {
        return deleteFlag;
    }

    public void setDeleteFlag(int deleteFlag) {
        this.deleteFlag = deleteFlag;
    }



    public int getUserFlag() {
        return userFlag;
    }

    public void setUserFlag(int userFlag) {
        this.userFlag = userFlag;
    }
}
