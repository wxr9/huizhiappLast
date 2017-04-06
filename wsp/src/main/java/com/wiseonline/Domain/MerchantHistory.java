package com.wiseonline.Domain;

/***********************************************************************
 * Module:  Merchant.java
 * Author:  R7tech
 * Purpose: Defines the Class Merchant
 ***********************************************************************/

import com.fasterxml.jackson.annotation.JsonFormat;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import javax.persistence.*;
import java.util.Date;
import java.util.List;
import java.util.Set;

/**
 * 商户信息表
 *
 * @pdOid 30942150-b950-4b82-b7a1-a7a742b7f5a8
 */
@Entity
@Table(name = "merchant_history")
/** 商户信息表
 *
 * @pdOid 30942150-b950-4b82-b7a1-a7a742b7f5a8 */
public class MerchantHistory {
    /**
     * 流水号
     *
     * @pdOid 4e2e6c25-2a9c-4414-a643-ccd96bc5666d
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int objectid;

    /**
     * 商户名称
     *
     * @pdOid 9f00bbaf-4f7e-4217-bd42-9e53e4ba1e18
     */
    public String name;

    /**
     * 所属商户objectid
     */
    public int mid;

    /**
     * 所属园区
     */
    public int park;

    @ManyToOne
    @JoinColumn(name = "park",insertable = false, updatable = false)
    private Park parkName;

    /**
     * 是否特邀商户 0否1是
     */
    public int isInvite;

    /**
     * 营业开始时间
     *
     * @pdOid 5d16f39a-f508-480e-8dc0-28fd2ba705c8
     */
    public String workStartTime;
    /**
     * 营业结束时间
     *
     * @pdOid 3667f087-7738-4f10-b2d0-975d5d35bde5
     */
    public String workEndTime;
    /**
     * 商户分类
     *
     * @pdOid b4284a11-7d3c-4119-ab62-bb7bf64db327
     */
    public int type;

    @ManyToOne
    @JoinColumn(name = "type",insertable = false, updatable = false)
    private SettingDict sType;

    /**
     * 商户子分类
     */
    public int childType;
    @ManyToOne
    @JoinColumn(name = "childType",insertable = false, updatable = false)
    @NotFound(action = NotFoundAction.IGNORE)
    private SettingDict sChildType;

//    @ManyToOne
//    @JoinColumn(name = "type",insertable = false, updatable = false)
//    private SettingDict sDict;

    /** 商户头像
     *
     */
    public java.lang.String avar;

    /**
     * 商户地址
     *
     * @pdOid f539c3a8-69b9-483f-a344-dc9cdf9af219
     */
    public String address;

    /** 商户简介
     *
     */
    public java.lang.String shortIntro;
    /** 详细介绍
     *
     */
    public java.lang.String introduce;

    //园区商业类型
    private int parkType;

    @ManyToOne
    @JoinColumn(name = "parkType",insertable = false, updatable = false)
    private SettingDict sParkType;

    /**
     * 商户电话
     *
     * @pdOid bbb0fee2-cc80-4047-a28f-b75b9832b37d
     */
    public String phone;

    /**
     * 是否审核通过
     *
     * @pdOid dededc6a-f1c0-4f65-ac44-609364765614
     */
    @Column(name = "bCheck")
    public int isCheck;

    /** 审核未通过原因
     *
     */
    public java.lang.String memo;

    public java.util.Date createTime;


    /**
     * @pdOid 92bc4f36-2364-466d-af78-a70d0c170d87
     */
    public int getObjectid() {
        return objectid;
    }

    /**
     * @param newObjectid
     * @pdOid 38ad9d44-67f0-4c36-b235-2b45961970d1
     */
    public void setObjectid(int newObjectid) {
        objectid = newObjectid;
    }

    /**
     * @pdOid a6802b57-e77f-4b71-aecd-a89f5e5cda35
     */
    public String getName() {
        return name;
    }

    public int getMid() {
        return mid;
    }

    public void setMid(int mid) {
        this.mid = mid;
    }

    /**
     * @param newName
     * @pdOid ea549bc8-029d-4e06-91e9-f2bb022d8bae
     */
    public void setName(String newName) {
        name = newName;
    }

    /**
     * @pdOid ed3d7b96-ead1-4fc1-bdf4-be454d05c4f1
     */
    public String getWorkStartTime() {
        return workStartTime;
    }

    /**
     * @param newWorkStartTime
     * @pdOid 6dcbf89c-e499-4982-8311-a7d769b669c7
     */
    public void setWorkStartTime(String newWorkStartTime) {
        workStartTime = newWorkStartTime;
    }

    /**
     * @pdOid 01f0d1f8-02f5-434c-b8e2-39d223906627
     */
    public int getType() {
        return type;
    }

    /**
     * @param newType
     * @pdOid 24cf422b-4950-4056-a220-38546aa533fa
     */
    public void setType(int newType) {
        type = newType;
    }


    /**
     * @pdOid 57f9fec6-ac99-4478-bf31-9c2cfb8ea57b
     */
    public String getAddress() {
        return address;
    }

    /**
     * @param newAddress
     * @pdOid ad15e9ab-048c-4274-84ef-f4c78cedc82c
     */
    public void setAddress(String newAddress) {
        address = newAddress;
    }

    /**
     * @pdOid 927c3504-722a-4b58-8632-0a451b75f658
     */
    public String getPhone() {
        return phone;
    }

    /**
     * @param newPhone
     * @pdOid 84d31736-6aae-400b-8675-2f606781fdc0
     */
    public void setPhone(String newPhone) {
        phone = newPhone;
    }


    public int getIsCheck() {
        return isCheck;
    }

    public void setIsCheck(int isCheck) {
        this.isCheck = isCheck;
    }


    /**
     * @pdOid ea84645b-41d4-4354-b231-18378bc9915a
     */
    public String getWorkEndTime() {
        return workEndTime;
    }

    /**
     * @param newWorkEndTime
     * @pdOid ffe5292d-9cfa-4eb6-8f09-1cebf05abbb6
     */
    public void setWorkEndTime(String newWorkEndTime) {
        workEndTime = newWorkEndTime;
    }

    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public int getPark() {
        return park;
    }

    public void setPark(int park) {
        this.park = park;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public int getParkType() {
        return parkType;
    }

    public void setParkType(int parkType) {
        this.parkType = parkType;
    }

    public String getAvar() {
        return avar;
    }

    public void setAvar(String avar) {
        this.avar = avar;
    }

    public int getChildType() {
        return childType;
    }

    public void setChildType(int childType) {
        this.childType = childType;
    }

    public int getIsInvite() {
        return isInvite;
    }

    public void setIsInvite(int isInvite) {
        this.isInvite = isInvite;
    }

    public Park getParkName() {
        return parkName;
    }

    public void setParkName(Park parkName) {
        this.parkName = parkName;
    }

    public String getShortIntro() {
        return shortIntro;
    }

    public void setShortIntro(String shortIntro) {
        this.shortIntro = shortIntro;
    }

    public String getIntroduce() {
        return introduce;
    }

    public void setIntroduce(String introduce) {
        this.introduce = introduce;
    }

    public SettingDict getsType() {
        return sType;
    }

    public SettingDict getsParkType() {
        return sParkType;
    }

    public SettingDict getsChildType() {
        return sChildType;
    }
}