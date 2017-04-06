package com.wiseonline.Domain;

/**
 * Created by R7tech on 5/3/2016.
 */
/***********************************************************************
 * Module:  ActivityApply.java
 * Author:  R7tech
 * Purpose: Defines the Class ActivityApply
 ***********************************************************************/

import com.fasterxml.jackson.annotation.JsonFormat;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

/** 活动中心报名表
 *
 * @pdOid 6199bd63-9ca9-4c75-8620-58151a7cd100 */
@Entity
@DynamicInsert(true)
@DynamicUpdate(true)
@Table(name = "activity_join")
public class ActivityJoin {
    /** @pdOid ac38c71c-185c-439b-920a-867ba363e237 */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int objectid;

    /**
     * 活动ID
     */
    public int activityMainId;

    public String username;

    /** 姓名
     *
     * @pdOid ec4ac803-3a82-4976-b685-0d052c12a1ce */
    public String name;
    /** @pdOid 315a4bb5-4377-4825-9817-c4d682dce926 */
    public String email;
    /** @pdOid deaaa247-b121-4b81-9c7d-971024b04e99 */
    public String mobile;

    /** @pdOid 853cf786-3939-4bd2-9a14-ee42ee13d26a */
    public Date createTime;

    /** @pdOid ba119be0-13d4-474e-9e83-80deee7c8682 */
    public int getObjectid() {
        return objectid;
    }

    /** @param newObjectid
     * @pdOid 136d3759-be26-40bf-8e5e-ad91fc4d76cb */
    public void setObjectid(int newObjectid) {
        objectid = newObjectid;
    }


    /** @pdOid 54ff43d5-2094-49ad-ac98-70f282868cf8 */
    public String getName() {
        return name;
    }

    /** @param newName
     * @pdOid fe756094-d1a1-4a02-aa75-16bab48362bf */
    public void setName(String newName) {
        name = newName;
    }

    /** @pdOid 03503522-e023-4383-ab96-5dd9d69e280f */
    public String getEmail() {
        return email;
    }

    /** @param newEmail
     * @pdOid f4d2e506-5bbf-4185-b234-fd367594d1fe */
    public void setEmail(String newEmail) {
        email = newEmail;
    }

    /** @pdOid c3f3093e-8295-4adc-a738-af95dd0dbef0 */
    public String getMobile() {
        return mobile;
    }

    /** @param newMobile
     * @pdOid b0ea5aa1-6989-4dce-9c31-eca94a5607f2 */
    public void setMobile(String newMobile) {
        mobile = newMobile;
    }


    /** @pdOid 76f8b257-d92f-4209-b71e-33c9f54c934e */
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    public Date getCreateTime() {
        return createTime;
    }

    /** @param newCreateTime
     * @pdOid 7cabdd36-0389-4e3b-9477-4af59ce06b27 */
    public void setCreateTime(Date newCreateTime) {
        createTime = newCreateTime;
    }


    public int getActivityMainId() {
        return activityMainId;
    }

    public void setActivityMainId(int activityMainId) {
        this.activityMainId = activityMainId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
