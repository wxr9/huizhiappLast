package com.wiseonline.Domain;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import javax.persistence.*;

/**
 * 数据字典表
 * Created by yanwj on 2015/11/11.
 */
@Entity
@Table(name = "setting_dict")
public class SettingDict{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int objectid;

    public String name;

    public String type;

    @ManyToOne(targetEntity = SettingDict.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
    @JoinColumn(name = "parentid")
    @NotFound(action = NotFoundAction.IGNORE)
    public SettingDict settingDict;

    @Transient
    public int parentid;

    @Column(name = "order_flag")
    public int orderFlag;

    @Column(name = "en")
    private String english;

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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public SettingDict getSettingDict() {
        return settingDict;
    }

    public void setSettingDict(SettingDict settingDict) {
        this.settingDict = settingDict;
    }

    public int getParentid() {
        if (settingDict != null){
            return settingDict.getObjectid();
        }else {
            return parentid;
        }
    }

    public void setParentid(int parentid) {
        this.parentid = parentid;
    }

    public int getOrderFlag() {
        return orderFlag;
    }

    public void setOrderFlag(int orderFlag) {
        this.orderFlag = orderFlag;
    }

    public String getEnglish() {
        return english;
    }

    public void setEnglish(String english) {
        this.english = english;
    }
}
