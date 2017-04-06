package com.wiseonline.Domain;
import java.io.Serializable;
import java.util.Set;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
/**
 * 角色表
 * Created by yanwj on 2015/11/6.
 */
@Entity
@Table(name = "roles")
public class Role implements Serializable{
    /**
     *
     */
    private static final long serialVersionUID = 1L;

    /*
     * 角色名
     */
    @Id
    public String rolename;

    /*
     * 中文名
     */
    public String name;

    /*
     * 备注
     */
    public String memo;

    @JsonIgnore
    @ManyToMany(targetEntity = User.class, mappedBy = "roleList", cascade = CascadeType.MERGE)
    private Set<User> userList;

    @ManyToMany(targetEntity = Permission.class, cascade = CascadeType.ALL)
    @JoinTable(name = "role_permission", joinColumns = @JoinColumn(name = "rolename"), inverseJoinColumns = @JoinColumn(name = "permissionid"))
    private Set<Permission> permissionList;

    // 前端传权限列表string(逗号分隔)
    @Transient
    private String permissionArray;

    @Column(name = "isshow")
    public int isShow;

    // 为了简便起见 ROLE 和 Permission都视为一种权限
    public GrantedAuthority generateGrantedAuthority() {
        return new GrantedAuthority() {
            public String getAuthority() {
                return getName();
            }
        };
    }

    public String getRolename() {
        return rolename;
    }

    public void setRolename(String rolename) {
        this.rolename = rolename;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public Set<User> getUserList() {
        return userList;
    }

    public void setUserList(Set<User> userList) {
        this.userList = userList;
    }

    public Set<Permission> getPermissionList() {
        return permissionList;
    }

    public void setPermissionList(Set<Permission> permissionList) {
        this.permissionList = permissionList;
    }

    public String getPermissionArray() {
        return permissionArray;
    }

    public void setPermissionArray(String permissionArray) {
        this.permissionArray = permissionArray;
    }

    public int getIsShow() {
        return isShow;
    }

    public void setIsShow(int isShow) {
        this.isShow = isShow;
    }
}
