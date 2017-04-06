package com.wiseonline.Domain;

/***********************************************************************
 * Module:  Merchant.java
 * Author:  R7tech
 * Purpose: Defines the Class Merchant
 ***********************************************************************/

import com.fasterxml.jackson.annotation.JsonFormat;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.LazyToOne;
import org.hibernate.annotations.LazyToOneOption;

import javax.persistence.*;
import java.util.Date;
import java.util.List;
import java.util.Set;

/** 商户信息表
 *
 * @pdOid 30942150-b950-4b82-b7a1-a7a742b7f5a8 */
@Entity
@DynamicInsert(true)
@DynamicUpdate(true)
@Table(name = "merchant")
/** 商户信息表
 *
 * @pdOid 30942150-b950-4b82-b7a1-a7a742b7f5a8 */
public class Merchant {
    /** 流水号
     *
     * @pdOid 4e2e6c25-2a9c-4414-a643-ccd96bc5666d */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int objectid;

    /**
     * 商户用户名
     */
    public String username;

    @ManyToOne
    @JoinColumn(name = "username",insertable = false, updatable = false)
    private UserForMerchant userC;

    /**
     * 商户状态 1启用 -1禁用
     */
    public int status;

    /**
     * 商户点击量
     */
    public int hitCount;

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
     * 商户热度
     */
    public int activity;

    /** 商户名称
     *
     * @pdOid 9f00bbaf-4f7e-4217-bd42-9e53e4ba1e18 */
    public java.lang.String name;
    /** 营业开始时间
     *
     * @pdOid 5d16f39a-f508-480e-8dc0-28fd2ba705c8 */
    public java.lang.String workStartTime;
    /** 营业结束时间
     *
     * @pdOid 3667f087-7738-4f10-b2d0-975d5d35bde5 */
    public java.lang.String workEndTime;
    /** 商户分类
     *
     * @pdOid b4284a11-7d3c-4119-ab62-bb7bf64db327 */
    public int type;

    /**
     * 商户子分类
     */
    public int childType;

    @ManyToOne
    @JoinColumn(name = "type",insertable = false, updatable = false)
    private SettingDict sDict;

    /**
     * 商户相关指数的平均值
     */
    @Transient
    private MerchantEvaluate mEvaluate;

    @OneToMany(cascade = { CascadeType.REFRESH, CascadeType.PERSIST,CascadeType.MERGE, CascadeType.REMOVE },mappedBy ="mid")
    private Set<MerchantSaleThumbs> thumbList;

    /** 商户头像
     *
     * @pdOid f95b07e8-289f-48ce-81e7-3e50ee933440 */
    public java.lang.String avar;
    /** 商户地址
     *
     * @pdOid f539c3a8-69b9-483f-a344-dc9cdf9af219 */
    public java.lang.String address;
    /** 商户电话
     *
     * @pdOid bbb0fee2-cc80-4047-a28f-b75b9832b37d */
    public java.lang.String phone;
    /** 商户简介
     *
     * @pdOid f2a1d43a-1ac5-452a-99bd-44d9df6684c0 */
    public java.lang.String shortIntro;
    /** 详细介绍
     *
     * @pdOid 32561cb2-ed5a-4d7a-8811-afbe873cadea */
    public java.lang.String introduce;
    /** 是否审核通过
     *  1:待审核;2通过3不通过
     * @pdOid dededc6a-f1c0-4f65-ac44-609364765614 */
    @Column(name = "bCheck")
    public int isCheck;
    /** 审核未通过原因
     *
     * @pdOid 88749487-d341-4a48-827a-1ca0c82f9f59 */
    public java.lang.String memo;


    private Date createTime;

    @Transient
    public List<MerchantSaleForMe> saleList;

    //是否新商户
    @Transient
    private int isNew;

    //园区商业类型
    private int parkType;

    /** @pdOid 92bc4f36-2364-466d-af78-a70d0c170d87 */
    public int getObjectid() {
        return objectid;
    }

    /** @param newObjectid
     * @pdOid 38ad9d44-67f0-4c36-b235-2b45961970d1 */
    public void setObjectid(int newObjectid) {
        objectid = newObjectid;
    }

    /** @pdOid a6802b57-e77f-4b71-aecd-a89f5e5cda35 */
    public java.lang.String getName() {
        return name;
    }

    /** @param newName
     * @pdOid ea549bc8-029d-4e06-91e9-f2bb022d8bae */
    public void setName(java.lang.String newName) {
        name = newName;
    }

    /** @pdOid ed3d7b96-ead1-4fc1-bdf4-be454d05c4f1 */
    public java.lang.String getWorkStartTime() {
        return workStartTime;
    }

    /** @param newWorkStartTime
     * @pdOid 6dcbf89c-e499-4982-8311-a7d769b669c7 */
    public void setWorkStartTime(java.lang.String newWorkStartTime) {
        workStartTime = newWorkStartTime;
    }

    /** @pdOid 01f0d1f8-02f5-434c-b8e2-39d223906627 */
    public int getType() {
        return type;
    }

    /** @param newType
     * @pdOid 24cf422b-4950-4056-a220-38546aa533fa */
    public void setType(int newType) {
        type = newType;
    }

    /** @pdOid 31aec6ce-6ad6-4fb6-9af5-c63bfaa2fe4f */
    public java.lang.String getAvar() {
        return avar;
    }

    /** @param newAvar
     * @pdOid 76e80bc8-e267-47c9-b555-d9d6ecff2210 */
    public void setAvar(java.lang.String newAvar) {
        avar = newAvar;
    }

    /** @pdOid 57f9fec6-ac99-4478-bf31-9c2cfb8ea57b */
    public java.lang.String getAddress() {
        return address;
    }

    /** @param newAddress
     * @pdOid ad15e9ab-048c-4274-84ef-f4c78cedc82c */
    public void setAddress(java.lang.String newAddress) {
        address = newAddress;
    }

    /** @pdOid 927c3504-722a-4b58-8632-0a451b75f658 */
    public java.lang.String getPhone() {
        return phone;
    }

    /** @param newPhone
     * @pdOid 84d31736-6aae-400b-8675-2f606781fdc0 */
    public void setPhone(java.lang.String newPhone) {
        phone = newPhone;
    }

    /** @pdOid 2d03d310-92d4-4327-938d-e3aff5e99035 */
    public java.lang.String getShortIntro() {
        return shortIntro;
    }

    /** @param newShortIntro
     * @pdOid ffc2410e-e3ae-44f7-bf34-76ebcc264776 */
    public void setShortIntro(java.lang.String newShortIntro) {
        shortIntro = newShortIntro;
    }

    /** @pdOid 3eb5c6d6-a97c-45da-b12b-5cd997dc6b82 */
    public java.lang.String getIntroduce() {
        return introduce;
    }

    /** @param newIntroduce
     * @pdOid 0d3693a6-224d-49ea-baaa-4d7062be81c7 */
    public void setIntroduce(java.lang.String newIntroduce) {
        introduce = newIntroduce;
    }

    public int getIsCheck() {
        return isCheck;
    }

    public void setIsCheck(int isCheck) {
        this.isCheck = isCheck;
    }

    /** @pdOid 765f782b-9b08-42c9-b512-5aa6411434ee */
    public java.lang.String getMemo() {
        return memo;
    }

    /** @param newMemo
     * @pdOid f3bd54e6-b843-4e8f-92f8-d1827bb0539c */
    public void setMemo(java.lang.String newMemo) {
        memo = newMemo;
    }

    /** @pdOid ea84645b-41d4-4354-b231-18378bc9915a */
    public java.lang.String getWorkEndTime() {
        return workEndTime;
    }

    /** @param newWorkEndTime
     * @pdOid ffe5292d-9cfa-4eb6-8f09-1cebf05abbb6 */
    public void setWorkEndTime(java.lang.String newWorkEndTime) {
        workEndTime = newWorkEndTime;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getActivity() {
        return activity;
    }

    public void setActivity(int activity) {
        this.activity = activity;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public int getPark() {
        return park;
    }

    public void setPark(int park) {
        this.park = park;
    }

    public int getIsInvite() {
        return isInvite;
    }

    public void setIsInvite(int isInvite) {
        this.isInvite = isInvite;
    }

    public SettingDict getsDict() {
        return sDict;
    }

    public UserForMerchant getUserC() {
        return userC;
    }


    public MerchantEvaluate getmEvaluate() {
        return mEvaluate;
    }

    public void setmEvaluate(MerchantEvaluate mEvaluate) {
        this.mEvaluate = mEvaluate;
    }

    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Park getParkName(){
        return parkName;
    }

    public void setParkName(Park parkName) {
        this.parkName = parkName;
    }

    public int getIsNew() {
        return isNew;
    }

    public void setIsNew(int isNew) {
        this.isNew = isNew;
    }

    public Set<MerchantSaleThumbs> getThumbList() {
        return thumbList;
    }

    public List<MerchantSaleForMe> getSaleList() {
        return saleList;
    }

    public void setSaleList(List<MerchantSaleForMe> saleList) {
        this.saleList = saleList;
    }

    public int getParkType() {
        return parkType;
    }

    public void setParkType(int parkType) {
        this.parkType = parkType;
    }

    public int getChildType() {
        return childType;
    }

    public void setChildType(int childType) {
        this.childType = childType;
    }

    public int getHitCount() {
        return hitCount;
    }

    public void setHitCount(int hitCount) {
        this.hitCount = hitCount;
    }
}