package com.wiseonline.Domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Set;
/**
 * 权限表
 * Created by yanwj on 2015/11/6.
 */
@Entity
@Table(name = "permissions")
public class Permission implements Serializable{
    /**
     *
     */
    private static final long serialVersionUID = 1L;

    /*
     *
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int objectid;

    /*
     * 权限名
     */
    public String name;


    public String url;

    /*
     * 备注
     */
    public String memo;

    @JsonIgnore
    @ManyToMany(targetEntity = Role.class,fetch= FetchType.EAGER, mappedBy = "permissionList", cascade = CascadeType.ALL)
    private Set<Role> roleList;

    public int getObjectid() {
        return objectid;
    }

    public void setObjectid(int objectid) {
        this.objectid = objectid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public Set<Role> getRoleList() {
        return roleList;
    }

    public void setRoleList(Set<Role> roleList) {
        this.roleList = roleList;
    }
}
