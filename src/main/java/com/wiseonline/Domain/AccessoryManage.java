package com.wiseonline.Domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by yanwj on 2016/5/3.
 */
@Entity
@Table(name = "accessory_manage")
public class AccessoryManage extends BaseEntity{

    public String name;//资源名称
    public String author;//资源上传者
    public String url;//资源链接
    public String type;//资源类别
    @Column(name = "deleteflag")
    public int deleteFlag;//禁用启用（-1,1）

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getDeleteFlag() {
        return deleteFlag;
    }

    public void setDeleteFlag(int deleteFlag) {
        this.deleteFlag = deleteFlag;
    }
}
