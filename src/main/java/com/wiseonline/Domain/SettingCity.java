package com.wiseonline.Domain;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import javax.persistence.*;

/**
 * Created by yanwj on 2015/11/11.
 */
@Entity
@Table(name = "setting_city")
public class SettingCity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int objectid;

    public String name;

    @ManyToOne(targetEntity = SettingCity.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
    @JoinColumn(name = "parentid")
    @NotFound(action = NotFoundAction.IGNORE)
    public SettingCity settingCity;

    @Transient
    public int patentid;

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

    public SettingCity getSettingCity() {
        return settingCity;
    }

    public void setSettingCity(SettingCity settingCity) {
        this.settingCity = settingCity;
    }

    public int getPatentid() {
        if (settingCity != null){
            return settingCity.getObjectid();
        }else {
            return patentid;
        }
    }

    public void setPatentid(int patentid) {
        this.patentid = patentid;
    }
}
