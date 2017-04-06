package com.wiseonline.Domain;

/**
 * Created by R7tech on 10/13/2016.
 */
/***********************************************************************
 * Module:  RedpacketUser.java
 * Author:  R7tech
 * Purpose: Defines the Class RedpacketUser
 ***********************************************************************/

import com.fasterxml.jackson.annotation.JsonFormat;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.*;

/** 用户红包
 *
 * @pdOid e55e98b4-a269-490b-842a-637bc4935d73 */
@Entity
@DynamicInsert(true)
@DynamicUpdate(true)
@Table(name = "redpacket_user")
public class RedpacketUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    /** @pdOid 82b1533f-bf73-4e2e-9e1a-21dd802e5a5d */
    public int id;
    /** @pdOid aefb6e9d-4c1e-49ad-8b7b-bc3dde5317ce */
    public java.lang.String username;
    /** @pdOid f8fb50f9-332c-46b4-9569-1c47cc430742 */
    public float sum;
    /** @pdOid ab801f20-309b-40b2-befb-fa69dbc5c3b5 */
    public java.util.Date validateDate;
    /** @pdOid 92227b3f-f5dc-4833-9b11-293eb101485c */
    public boolean didUse;
    /** @pdOid adc57a7e-febd-48ce-b238-37e8385d1745 */
    public java.util.Date createTime;

    public int type;

    public int ruleId;

    public java.lang.String orderNo;

    /** @pdOid 3a6132ce-6788-4253-86f1-5680ee2f434e */
    public int getId() {
        return id;
    }

    /** @param newId
     * @pdOid 16b7e4c7-aea3-444b-8d36-100ad3e4812b */
    public void setId(int newId) {
        id = newId;
    }

    /** @pdOid f1e0ad0b-e770-47a3-9a18-7c12deae8f21 */
    public java.lang.String getUsername() {
        return username;
    }

    /** @param newUsername
     * @pdOid 66383158-2828-4026-8ef6-fdf41f910f8c */
    public void setUsername(java.lang.String newUsername) {
        username = newUsername;
    }

    /** @pdOid f978f4af-780c-4c1a-9d65-2fb29a46e9c8 */
    public float getSum() {
        return sum;
    }

    /** @param newSum
     * @pdOid c4dd0287-dde2-4181-b1db-8b663f66adf1 */
    public void setSum(float newSum) {
        sum = newSum;
    }

    /** @pdOid 91c9bcaf-1fcf-4010-9226-bfc124833068 */
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    public java.util.Date getValidateDate() {
        return validateDate;
    }

    /** @param newValidateDate
     * @pdOid 1a027a91-50c2-4341-9295-5ed4d89d64a8 */
    public void setValidateDate(java.util.Date newValidateDate) {
        validateDate = newValidateDate;
    }

    /** @pdOid 8cd94b64-4347-4303-adce-edb8a679cc15 */
    public boolean getDidUse() {
        return didUse;
    }

    /** @param newDidUse
     * @pdOid 7cf5e028-6dd2-4171-9185-69bd55f7311e */
    public void setDidUse(boolean newDidUse) {
        didUse = newDidUse;
    }

    /** @pdOid bdce26a4-0658-4d5e-8c0a-ea28d8a6af8b */
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    public java.util.Date getCreateTime() {
        return createTime;
    }

    /** @param newCreateTime
     * @pdOid cde0fb2c-c866-4f84-8b08-0d2306c66948 */
    public void setCreateTime(java.util.Date newCreateTime) {
        createTime = newCreateTime;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public int getRuleId() {
        return ruleId;
    }

    public void setRuleId(int ruleId) {
        this.ruleId = ruleId;
    }

    public String getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(String orderNo) {
        this.orderNo = orderNo;
    }
}
