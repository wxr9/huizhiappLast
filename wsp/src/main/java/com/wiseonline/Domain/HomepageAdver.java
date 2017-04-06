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
@Table(name = "homepage_adver")
public class HomepageAdver {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int objectid;

    /** 广告标题
     *
     * @pdOid 41f9b6cd-fa44-44a3-ba17-0c491b10327e */
    public String title;
    /** 广告内容
     *
     * @pdOid 4fe294d0-d81e-45fd-98f0-1109aa79adc3 */
    public String content;
    /** 广告图片链接
     *
     * @pdOid 6ae8b367-7c93-4d96-9407-2915cc749de5 */
    public String imgUrl;


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


    /** @pdOid 14c692e7-e595-4aa3-b4e0-64510c5231df */
    public String getTitle() {
        return title;
    }

    /** @param newTitle
     * @pdOid 541f40de-dcc7-46af-b1b5-bda540104fea */
    public void setTitle(String newTitle) {
        title = newTitle;
    }

    /** @pdOid 451de099-c2e0-412f-a16e-832d20b1539f */
    public String getContent() {
        return content;
    }

    /** @param newContent
     * @pdOid b39c4159-a205-467a-a94b-7b9cde9d3c07 */
    public void setContent(String newContent) {
        content = newContent;
    }

    /** @pdOid d5eec892-aa4a-46bd-b9c7-ca00fe189379 */
    public String getImgUrl() {
        return imgUrl;
    }

    /** @param newImgUrl
     * @pdOid cdadedd8-a99a-4241-8990-6d47f95124a1 */
    public void setImgUrl(String newImgUrl) {
        imgUrl = newImgUrl;
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
