package com.wiseonline.Domain;

/**
 * Created by R7tech on 5/3/2016.
 */
/***********************************************************************
 * Module:  ActivityMain.java
 * Author:  R7tech
 * Purpose: Defines the Class ActivityMain
 ***********************************************************************/

import com.fasterxml.jackson.annotation.JsonFormat;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/** @pdOid aa93c997-920a-485c-9db4-e29c6ddfe824 */
@Entity
@DynamicInsert(true)
@DynamicUpdate(true)
@Table(name = "activity_main")
public class ActivityMain {
    /** @pdOid 9e55c252-83fc-4948-9fa8-224dc16a9629 */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int objectid;
    /** 主题
     *
     * @pdOid 021576c7-2a39-418e-b55b-cf7b77edb3fd */
    public java.lang.String title;
    /** 活动类别
     *
     * @pdOid 2fbc49c3-c1c4-4e3f-82fc-a741bca03a19 */
    public int type;
    @ManyToOne
    @JoinColumn(name = "type",insertable = false, updatable = false)
    public SettingDict mType;
    /** 详情
     *
     * @pdOid 1afca48b-88af-4833-9431-642e57847009 */
    public java.lang.String details;
    /** 地点
     *
     * @pdOid 79292b26-cb81-46e4-89ad-261a2879e2fe */
    public java.lang.String address;
    /** @pdOid 5f070edd-1c20-4774-8c78-c473dc2980f7 */
    public java.util.Date createTime;
    /** 封面图片
     *
     * @pdOid 9cd9caf5-75fc-4f0f-bee8-6e0294c01ee1 */
    public java.lang.String image;

    /**
     *  1启用2禁用
     */
    public int isBan;

    /**
     *  1需要2不需要
     */
    public int needLogin;

    /**
     * 活动时间
     */
    public java.util.Date startTime;

    /**
     * 移动端活动链接
     */
    public java.lang.String mobileUrl;

    /**
     * 富文本ID
     */
    public java.lang.String richText;

    /** @pdOid 7b53ea0e-8ecc-4892-99ee-319fb144a137 */
    public int getObjectid() {
        return objectid;
    }

    /** @param newObjectid
     * @pdOid e8477469-d491-49eb-bc99-cc876e5a0556 */
    public void setObjectid(int newObjectid) {
        objectid = newObjectid;
    }

    /** @pdOid 2ae0ad49-e13c-4ca0-9fa6-425be3f85b49 */
    public java.lang.String getTitle() {
        return title;
    }

    /** @param newTitle
     * @pdOid bbd453fa-8ad7-4853-b8b9-363a6566eeda */
    public void setTitle(java.lang.String newTitle) {
        title = newTitle;
    }

    /** @pdOid e40815d5-446e-4b77-a8cf-9f742d1b44ed */
    public int getType() {
        return type;
    }

    /** @param newType
     * @pdOid 5e52e4ac-db24-43f8-8edc-6a9436810baf */
    public void setType(int newType) {
        type = newType;
    }

    /** @pdOid cf30c470-0c41-45a3-81d5-ecdbb899ccd4 */
    public java.lang.String getDetails() {
        return details;
    }

    /** @param newDetails
     * @pdOid c64a2351-8480-4107-8ac2-f6fb757fbbf0 */
    public void setDetails(java.lang.String newDetails) {
        details = newDetails;
    }

    /** @pdOid c8c274fa-423b-483e-afc3-63a5e075848a */
    public java.lang.String getAddress() {
        return address;
    }

    /** @param newAddress
     * @pdOid 32cf9510-43d7-4ad3-b99b-9597a41bef8f */
    public void setAddress(java.lang.String newAddress) {
        address = newAddress;
    }

    /** @pdOid e7738b53-3d36-4f82-9d13-e10aff1aadde */
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    public java.util.Date getCreateTime() {
        return createTime;
    }

    /** @param newCreateTime
     * @pdOid 1860eb81-68ba-4161-9f47-36d665ce046a */
    public void setCreateTime(java.util.Date newCreateTime) {
        createTime = newCreateTime;
    }

    /** @pdOid efb4ef13-43b8-42af-bde0-af2517e26bd7 */
    public java.lang.String getImage() {
        return image;
    }

    /** @param newImage
     * @pdOid abbd2576-7296-4f4a-bafd-846afbca9d5b */
    public void setImage(java.lang.String newImage) {
        image = newImage;
    }

    public int getIsBan() {
        return isBan;
    }

    public void setIsBan(int isBan) {
        this.isBan = isBan;
    }

    public SettingDict getmType() {
        return mType;
    }

    @JsonFormat(pattern="yyyy/MM/dd HH:mm:ss",timezone = "GMT+8")
    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(String starttime) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
        try{
            this.startTime = sdf.parse(starttime);
        }catch (ParseException e){
            e.printStackTrace();
        }
    }

    public int getNeedLogin() {
        return needLogin;
    }

    public void setNeedLogin(int needLogin) {
        this.needLogin = needLogin;
    }

    public String getMobileUrl() {
        return mobileUrl;
    }

    public void setMobileUrl(String mobileUrl) {
        this.mobileUrl = mobileUrl;
    }

    public String getRichText() {
        return richText;
    }

    public void setRichText(String richText) {
        this.richText = richText;
    }
}
