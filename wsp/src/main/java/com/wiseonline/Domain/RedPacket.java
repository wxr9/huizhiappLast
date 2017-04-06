package com.wiseonline.Domain;

/**
 * Created by R7tech on 10/12/2016.
 */
/***********************************************************************
 * Module:  RedPacket.java
 * Author:  R7tech
 * Purpose: Defines the Class RedPacket
 ***********************************************************************/

import com.fasterxml.jackson.annotation.JsonFormat;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.util.*;

/** 红包模块
 *
 * @pdOid 1ff9016f-e282-499c-aabc-8dfc1657c5cb */
@Entity
@DynamicInsert(true)
@DynamicUpdate(true)
@Table(name = "red_packet")
public class RedPacket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    /** @pdOid ada3ba78-7dfe-4320-9e06-990385ca43a4 */
    public int id;
    /** @pdOid f9efbcca-073f-4986-8466-5e7ad9a0c91d */
    public java.lang.String name;
    /** @pdOid eafdba2d-e625-488a-871b-6b43392f524b */
    public float totalSum;
    /** @pdOid bd127aa7-2d08-4127-a92b-93528232fb1a */
    public float sentSum;
    /** @pdOid 5e40329c-850d-480a-b8ca-e00db0ba2e29 */
    public int sentNum;
    /** @pdOid 17e848fd-ab93-48d0-9a84-993932c4ef56 */
    public int type;
    /** @pdOid 725a652e-4f02-4b20-83eb-5303c0754703 */
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    public java.util.Date startDate;
    /** @pdOid 46a98e74-a036-4f33-b5d4-d133eb3a4d48 */
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    public java.util.Date endDate;
    /** @pdOid 947d19fd-7eb2-4b84-ba16-69559c37b5cd */
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    public java.util.Date validDate;
    /** @pdOid 47390af2-e978-486e-8e81-826b5a0a01ee */
    public float hitPersent;
    /** @pdOid a17a36d4-d81f-4f96-acda-0f440a75ee99 */
    public int dotEnable;
    /** @pdOid e85d1fdd-fb76-4e50-9fd9-fd65882b7d3a */
    public float minSum;
    /** @pdOid f1466e37-9d0c-4512-b09d-a767c496296c */
    public float maxSum;
    /** @pdOid 9846e16c-0d47-4def-8eae-9e78d72fff15 */
    public boolean enableRule;

    public java.util.Date createTime;

    /** @pdOid 987a519d-82d2-4d40-842b-7684aecaf45a */
    public int getId() {
        return id;
    }

    /** @param newId
     * @pdOid 0401e281-59f8-4e0b-8437-9f660aecfd38 */
    public void setId(int newId) {
        id = newId;
    }

    /** @pdOid 5a15cd38-a14c-419b-a17a-7349c2ca4efa */
    public java.lang.String getName() {
        return name;
    }

    /** @param newName
     * @pdOid ac79a883-9799-4221-a82f-4f1aec545531 */
    public void setName(java.lang.String newName) {
        name = newName;
    }

    /** @pdOid 9fda352c-f7da-49f2-9554-7ace0e7412be */
    public float getTotalSum() {
        return totalSum;
    }

    /** @param newTotalSum
     * @pdOid 61d3f550-747d-4e40-b4d2-923696e23c7b */
    public void setTotalSum(float newTotalSum) {
        totalSum = newTotalSum;
    }

    /** @pdOid 62e1d019-4d96-4e66-82f8-2ab94902ca4a */
    public float getSentSum() {
        return sentSum;
    }

    /** @param newSentSum
     * @pdOid 1bd8ca2f-16d1-434c-b350-74f3fa7c71af */
    public void setSentSum(float newSentSum) {
        sentSum = newSentSum;
    }

    /** @pdOid 82affd81-99e9-4176-b3af-2f1ee9bd07df */
    public int getSentNum() {
        return sentNum;
    }

    /** @param newSentNum
     * @pdOid 29052370-d17d-4c8f-8b1d-7ddf7ad52231 */
    public void setSentNum(int newSentNum) {
        sentNum = newSentNum;
    }

    /** @pdOid 47acee27-25e6-4df8-8488-c2beccc8d0e3 */
    public int getType() {
        return type;
    }

    /** @param newType
     * @pdOid 9bc12af2-d7ee-4431-99d7-218f8752e188 */
    public void setType(int newType) {
        type = newType;
    }

    /** @pdOid 8c866757-eb4d-4ff2-bd23-6ebfaf628a36 */
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    public java.util.Date getStartDate() {
        return startDate;
    }

    /** @param newStartDate
     * @pdOid 04b2d529-a1f0-47ac-8c51-90340f76be64 */
    public void setStartDate(java.util.Date newStartDate) {
        startDate = newStartDate;
    }

    /** @pdOid 5490586d-d360-47b5-b428-f2f401d91ad4 */
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    public java.util.Date getEndDate() {
        return endDate;
    }

    /** @param newEndDate
     * @pdOid 8720c6b1-dae3-4d17-abaa-89bc7a3e9ce3 */
    public void setEndDate(java.util.Date newEndDate) {
        endDate = newEndDate;
    }

    /** @pdOid 97272412-f5d3-4b2e-ad64-043fea7548bb */
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    public java.util.Date getValidDate() {
        return validDate;
    }

    /** @param newValidDate
     * @pdOid 121fb5a5-848a-454f-af16-932acf612a04 */
    public void setValidDate(java.util.Date newValidDate) {
        validDate = newValidDate;
    }

    /** @pdOid 2875ac1d-4806-4c38-8f41-93ba61d9de7e */
    public float getHitPersent() {
        return hitPersent;
    }

    /** @param newHitPersent
     * @pdOid 07d60bc8-e142-4698-b78e-3018e426f0d1 */
    public void setHitPersent(float newHitPersent) {
        hitPersent = newHitPersent;
    }

    /** @pdOid 99568985-5fbc-4034-a900-42353c84f51d */
    public int getDotEnable() {
        return dotEnable;
    }

    /** @param newDotEnable
     * @pdOid cb449235-f3f2-436d-8174-324ead634803 */
    public void setDotEnable(int newDotEnable) {
        dotEnable = newDotEnable;
    }

    /** @pdOid 3b2b3859-aead-458d-8037-d4ac6ccfb0bc */
    public float getMinSum() {
        return minSum;
    }

    /** @param newMinSum
     * @pdOid d3b21796-52a6-409e-ad4d-8625083a7c9e */
    public void setMinSum(float newMinSum) {
        minSum = newMinSum;
    }

    /** @pdOid daa44cc4-de3e-42de-9c26-ccf198c4f8c6 */
    public float getMaxSum() {
        return maxSum;
    }

    /** @param newMaxSum
     * @pdOid 59022490-926e-446c-be7b-623a4a2b5c47 */
    public void setMaxSum(float newMaxSum) {
        maxSum = newMaxSum;
    }

    /** @pdOid 91ef8094-8988-4550-a55a-ac7c095ec0c4 */
    public boolean getEnableRule() {
        return enableRule;
    }

    /** @param newEnableRule
     * @pdOid 6ff63a58-0c27-418a-b5fe-3b501b694dfb */
    public void setEnableRule(boolean newEnableRule) {
        enableRule = newEnableRule;
    }

    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }
}
