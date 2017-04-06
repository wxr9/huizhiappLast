package com.wiseonline.Domain;

/***********************************************************************
 * Module:  LivingCenterAdver.java
 * Author:  R7tech
 * Purpose: Defines the Class LivingCenterAdver
 ***********************************************************************/

import com.fasterxml.jackson.annotation.JsonFormat;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.LazyToOne;
import org.hibernate.annotations.LazyToOneOption;

import javax.persistence.*;
import java.util.Date;

/** 生活中心广告栏
 *
 * @pdOid 7a102201-2f70-4250-8dd6-94711669324b */
@Entity
@DynamicInsert(true)
@DynamicUpdate(true)
@Table(name = "living_center_adver")
public class LivingCenterAdver {
    /** 流水号
     *
     * @pdOid a8e0f1b5-6788-4308-b652-2b5c5da18239 */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int objectid;
    /** @pdOid 27af2177-ff9d-4db3-a940-5dc31525571a */
    @Column(name="merchant")
    public int merchantId;

    @ManyToOne
    @LazyToOne(LazyToOneOption.PROXY)
    @JoinColumn(name = "merchant",insertable = false, updatable = false)
    private Merchant merchant;
    /** 广告标题
     *
     * @pdOid 41f9b6cd-fa44-44a3-ba17-0c491b10327e */
    public java.lang.String title;
    /** 广告内容
     *
     * @pdOid 4fe294d0-d81e-45fd-98f0-1109aa79adc3 */
    public java.lang.String content;
    /** 广告图片链接
     *
     * @pdOid 6ae8b367-7c93-4d96-9407-2915cc749de5 */
    public java.lang.String imgUrl;


    public int isShow;

    public int orderA;

    public String linkA;

    public int isBan;

    private Date createTime;

    /** @pdOid 15e8076d-d3dc-4437-bca5-a89bd4de0d66 */
    public int getObjectid() {
        return objectid;
    }

    /** @param newObjectid
     * @pdOid f412953f-f036-419f-9f0e-003dea714c58 */
    public void setObjectid(int newObjectid) {
        objectid = newObjectid;
    }

    /** @pdOid d1887851-7503-42c4-9fa9-5920272d2daf */
    public int getMerchantId() {
        return merchantId;
    }

    /** @param newMerchant
     * @pdOid f74476d4-2b4b-458d-a6b9-8352557c59fa */
    public void setMerchantId(int newMerchant) {
        merchantId = newMerchant;
    }

    /** @pdOid 14c692e7-e595-4aa3-b4e0-64510c5231df */
    public java.lang.String getTitle() {
        return title;
    }

    /** @param newTitle
     * @pdOid 541f40de-dcc7-46af-b1b5-bda540104fea */
    public void setTitle(java.lang.String newTitle) {
        title = newTitle;
    }

    /** @pdOid 451de099-c2e0-412f-a16e-832d20b1539f */
    public java.lang.String getContent() {
        return content;
    }

    /** @param newContent
     * @pdOid b39c4159-a205-467a-a94b-7b9cde9d3c07 */
    public void setContent(java.lang.String newContent) {
        content = newContent;
    }

    /** @pdOid d5eec892-aa4a-46bd-b9c7-ca00fe189379 */
    public java.lang.String getImgUrl() {
        return imgUrl;
    }

    /** @param newImgUrl
     * @pdOid cdadedd8-a99a-4241-8990-6d47f95124a1 */
    public void setImgUrl(java.lang.String newImgUrl) {
        imgUrl = newImgUrl;
    }

    public Merchant getMerchant() {
        return merchant;
    }

    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public int getIsShow() {
        return isShow;
    }

    public void setIsShow(int isShow) {
        this.isShow = isShow;
    }

    public int getOrderA() {
        return orderA;
    }

    public void setOrderA(int orderA) {
        this.orderA = orderA;
    }

    public String getLinkA() {
        return linkA;
    }

    public void setLinkA(String linkA) {
        this.linkA = linkA;
    }

    public int getIsBan() {
        return isBan;
    }

    public void setIsBan(int isBan) {
        this.isBan = isBan;
    }
}
