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

import javax.persistence.*;
import java.util.*;

/** 活动中心报名表
 *
 * @pdOid 6199bd63-9ca9-4c75-8620-58151a7cd100 */
@Entity
@Table(name = "activity_apply")
public class ActivityApply {
    /** @pdOid ac38c71c-185c-439b-920a-867ba363e237 */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int objectid;

    /**
     * 活动ID
     */
    public int activityMainId;
    /** 报名编号
     *
     * @pdOid 0450c0e0-7c55-4886-aded-e68f57dc4201 */
    public java.lang.String sequenceNo;
    /** 票种
     *
     * @pdOid bf9bf2f9-7550-4aa3-8775-ab6b593f6e77 */
    public java.lang.String ticketType;
    /** @pdOid 31f0de75-b1e2-412e-8152-8c7c21c29753 */
    public java.lang.String ticketPrice;
    /** 姓名
     *
     * @pdOid ec4ac803-3a82-4976-b685-0d052c12a1ce */
    public java.lang.String name;
    /** @pdOid 315a4bb5-4377-4825-9817-c4d682dce926 */
    public java.lang.String email;
    /** @pdOid deaaa247-b121-4b81-9c7d-971024b04e99 */
    public java.lang.String mobile;
    /** 签到时间
     *
     * @pdOid d45ff093-91e1-4f2d-8ae9-de8060da3e2b */
    public java.lang.String signTime;

    public java.lang.String joinTime;
    /** 是否有效
     *
     * @pdOid f3d16a8e-5687-4eb7-ab6f-b1057bfde98a */
    public java.lang.String ticketStatus;
    /** @pdOid 853cf786-3939-4bd2-9a14-ee42ee13d26a */
    public java.util.Date createTime;

    /** @pdOid ba119be0-13d4-474e-9e83-80deee7c8682 */
    public int getObjectid() {
        return objectid;
    }

    /** @param newObjectid
     * @pdOid 136d3759-be26-40bf-8e5e-ad91fc4d76cb */
    public void setObjectid(int newObjectid) {
        objectid = newObjectid;
    }

    /** @pdOid a03d41d9-2f43-402d-8c4e-02c82dd10c85 */
    public java.lang.String getSequenceNo() {
        return sequenceNo;
    }

    /** @param newSequenceNo
     * @pdOid be4c1e95-8ed6-4800-aaca-a0c515419972 */
    public void setSequenceNo(java.lang.String newSequenceNo) {
        sequenceNo = newSequenceNo;
    }

    /** @pdOid b979a036-d1a2-4403-aa6f-d71582c07c46 */
    public java.lang.String getTicketType() {
        return ticketType;
    }

    /** @param newTicketType
     * @pdOid 79aad8c6-5608-46b2-86d3-71272dd5274f */
    public void setTicketType(java.lang.String newTicketType) {
        ticketType = newTicketType;
    }

    /** @pdOid 9286c5a9-e90d-453a-bdde-c10b91dbf3b1 */
    public java.lang.String getTicketPrice() {
        return ticketPrice;
    }

    /** @param newTicketPrice
     * @pdOid a451b1ae-1d97-47eb-9614-4341bb790a11 */
    public void setTicketPrice(java.lang.String newTicketPrice) {
        ticketPrice = newTicketPrice;
    }

    /** @pdOid 54ff43d5-2094-49ad-ac98-70f282868cf8 */
    public java.lang.String getName() {
        return name;
    }

    /** @param newName
     * @pdOid fe756094-d1a1-4a02-aa75-16bab48362bf */
    public void setName(java.lang.String newName) {
        name = newName;
    }

    /** @pdOid 03503522-e023-4383-ab96-5dd9d69e280f */
    public java.lang.String getEmail() {
        return email;
    }

    /** @param newEmail
     * @pdOid f4d2e506-5bbf-4185-b234-fd367594d1fe */
    public void setEmail(java.lang.String newEmail) {
        email = newEmail;
    }

    /** @pdOid c3f3093e-8295-4adc-a738-af95dd0dbef0 */
    public java.lang.String getMobile() {
        return mobile;
    }

    /** @param newMobile
     * @pdOid b0ea5aa1-6989-4dce-9c31-eca94a5607f2 */
    public void setMobile(java.lang.String newMobile) {
        mobile = newMobile;
    }

    /** @pdOid 14bdbdd6-b911-4f16-b79c-2436ad0828bd */
    public java.lang.String getSignTime() {
        return signTime;
    }

    /** @param newSignTime
     * @pdOid 5ee8c45f-4a02-4ee1-9c83-a03d0969612a */
    public void setSignTime(java.lang.String newSignTime) {
        signTime = newSignTime;
    }

    /** @pdOid 543be7d0-5c79-48c8-8f2a-cb3146308b93 */
    public java.lang.String getTicketStatus() {
        return ticketStatus;
    }

    /** @param newTicketStatus
     * @pdOid 1ae5704d-b005-4559-a4e2-4532a9e07e54 */
    public void setTicketStatus(java.lang.String newTicketStatus) {
        ticketStatus = newTicketStatus;
    }

    /** @pdOid 76f8b257-d92f-4209-b71e-33c9f54c934e */
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    public java.util.Date getCreateTime() {
        return createTime;
    }

    /** @param newCreateTime
     * @pdOid 7cabdd36-0389-4e3b-9477-4af59ce06b27 */
    public void setCreateTime(java.util.Date newCreateTime) {
        createTime = newCreateTime;
    }

    public String getJoinTime() {
        return joinTime;
    }

    public void setJoinTime(String joinTime) {
        this.joinTime = joinTime;
    }

    public int getActivityMainId() {
        return activityMainId;
    }

    public void setActivityMainId(int activityMainId) {
        this.activityMainId = activityMainId;
    }
}
