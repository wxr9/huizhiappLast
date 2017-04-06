package com.wiseonline.Domain;

/***********************************************************************
 * Module:  MerchantSale.java
 * Author:  R7tech
 * Purpose: Defines the Class MerchantSale
 ***********************************************************************/

import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.LazyToOne;
import org.hibernate.annotations.LazyToOneOption;

import javax.persistence.*;
import java.util.Set;

/** 商户优惠信息表
 *
 * @pdOid 68163e68-6d5b-407a-995a-5ed529ad7208 */
@Entity
@DynamicInsert(true)
@DynamicUpdate(true)
@Table(name = "merchant_sale")
/** 商户优惠信息表
 *
 * @pdOid 68163e68-6d5b-407a-995a-5ed529ad7208 */
public class MerchantSale {
    /** 流水号
     *
     * @pdOid 109934ce-bee6-41bb-b6ff-4bb9a331ee06 */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int objectid;
    /** 优惠活动标题
     *
     * @pdOid a2f3f4e8-5b9d-4073-a16a-00ebfc680661 */
    public java.lang.String title;
    /** 发布日期
     *
     * @pdOid 41b06e2c-78b8-44ae-b089-8df73530d7ef */
    public java.lang.String publishDate;
    /** 封面图片
     *
     * @pdOid 2a20585b-ade1-4084-835a-ef821fd4c47b */
    public java.lang.String coverImg;


    /** 公司ID
     *
     * @pdOid b25792c5-4fa7-49c4-b153-a0c1a01d1efc */
    public int companyId;

    @ManyToOne
    @LazyToOne(LazyToOneOption.PROXY)
    @JoinColumn(name = "companyId",insertable = false, updatable = false)
    private Merchant company;
    /** 活动开始时间
     *
     * @pdOid 2314d61e-a105-4f04-b050-bfb38623c494 */
    public java.lang.String startTime;
    /** 活动结束时间
     *
     * @pdOid 3ac84b53-5993-4c1e-a83c-f3cf2c99bcd9 */
    public java.lang.String endTime;
    /** 活动简介
     *
     * @pdOid e6ff4f5f-0a52-4801-a6dc-b0df80cd76a8 */
    public java.lang.String shortIntro;
    /** 活动内容
     *
     * @pdOid 74e0de2c-7c75-42bf-8647-eaefcd5a43c7 */
    public java.lang.String content;
    /** 是否审核通过
     *1:待审核;2:审核通过;3:审核不通过
     * @pdOid 4166c28c-caa0-47b3-a2a2-550644fd6af8 */
    @Column(name="bCheck")
    public int isCheck;

    /**
     * 1启用2禁用
     */
    public int isBan;
    /** 审核未通过原因
     *
     * @pdOid ccdff202-8d33-4682-9776-405e742236e8 */
    public java.lang.String memo;
    /** @pdOid a8261f64-928e-402d-aa8d-41ddfedd806b */
    public int type;

    @ManyToOne
    @LazyToOne(LazyToOneOption.PROXY)
    @JoinColumn(name = "type",insertable = false, updatable = false)
    private SettingDict sDict;
    /** @pdOid 3e612c68-f5d5-4409-8804-08b449e7fd55 */
    public float discount;
    /** @pdOid 1d3a7906-3753-4c12-a62d-e4baab2e6c62 */
    public float origin;
    /** @pdOid 2c823dd9-acc9-4daa-bb08-69a53eb18aa1 */
    public float current;

    /** @pdOid 56a614d4-cee5-4123-ad89-e44f3ea15260 */
    public int getObjectid() {
        return objectid;
    }

    /** @param newObjectid
     * @pdOid d71dbc0e-17c2-4c85-a892-77e4bba9b595 */
    public void setObjectid(int newObjectid) {
        objectid = newObjectid;
    }

    /** @pdOid d94d6a35-b373-40b6-a3dd-bd6e47dee1e2 */
    public java.lang.String getTitle() {
        return title;
    }

    /** @param newTitle
     * @pdOid 35b5b75f-4b82-40c5-aff6-9b5481ede6fb */
    public void setTitle(java.lang.String newTitle) {
        title = newTitle;
    }

    /** @pdOid 66984aaf-2045-4a6a-8c49-a0365a215e51 */
    public java.lang.String getPublishDate() {
        return publishDate;
    }

    /** @param newPublishDate
     * @pdOid 7a2b49b0-d41c-4998-9aa5-6418dd7d82ed */
    public void setPublishDate(java.lang.String newPublishDate) {
        publishDate = newPublishDate;
    }

    /** @pdOid 927a7309-a129-4a77-9bd6-b3d489cb3e1c */
    public java.lang.String getCoverImg() {
        return coverImg;
    }

    /** @param newCoverImg
     * @pdOid a5f89501-315f-471e-a98f-dc130166ced9 */
    public void setCoverImg(java.lang.String newCoverImg) {
        coverImg = newCoverImg;
    }

    /** @pdOid eec18daf-42df-4685-a509-ccc562509497 */
    public int getCompanyId() {
        return companyId;
    }

    /** @param newCompanyId
     * @pdOid 061e2e9a-3e84-4afb-bfaa-7a807607815f */
    public void setCompanyId(int newCompanyId) {
        companyId = newCompanyId;
    }

    /** @pdOid 96fabc50-dd3d-4917-9c37-ae5f3e07a29b */
    public java.lang.String getStartTime() {
        return startTime;
    }

    /** @param newStartTime
     * @pdOid dfda58f0-1123-4ccf-8107-29fbbdd1eecd */
    public void setStartTime(java.lang.String newStartTime) {
        startTime = newStartTime;
    }

    /** @pdOid 3aba8eb3-3de5-4433-837d-c688dd5520ff */
    public java.lang.String getEndTime() {
        return endTime;
    }

    /** @param newEndTime
     * @pdOid e3c87da4-d1b4-4cf3-9ec1-28628423288b */
    public void setEndTime(java.lang.String newEndTime) {
        endTime = newEndTime;
    }

    /** @pdOid 5bfdcd39-c39e-4ffa-b254-3b4fd4a0088b */
    public java.lang.String getShortIntro() {
        return shortIntro;
    }

    /** @param newShortIntro
     * @pdOid bfd19b4b-7e3d-4d89-8d77-df52bea3d8ee */
    public void setShortIntro(java.lang.String newShortIntro) {
        shortIntro = newShortIntro;
    }

    /** @pdOid 81da9d62-7960-4c3d-82d2-5324537e774d */
    public java.lang.String getContent() {
        return content;
    }

    /** @param newContent
     * @pdOid 2512af0e-0445-4102-8fbe-a676126b477f */
    public void setContent(java.lang.String newContent) {
        content = newContent;
    }

    public int getIsCheck() {
        return isCheck;
    }

    public void setIsCheck(int isCheck) {
        this.isCheck = isCheck;
    }

    /** @pdOid fed9a74f-bfd6-415e-8ae1-fe0366a56e0c */
    public java.lang.String getMemo() {
        return memo;
    }

    /** @param newMemo
     * @pdOid b27747b6-cfd6-4122-ab23-28fd88c976e5 */
    public void setMemo(java.lang.String newMemo) {
        memo = newMemo;
    }

    /** @pdOid 017c777c-80e2-4564-baf3-6ead6b2b4297 */
    public int getType() {
        return type;
    }

    /** @param newType
     * @pdOid 78b2ea93-bb86-473c-9a44-09297d50b49a */
    public void setType(int newType) {
        type = newType;
    }

    /** @pdOid 13bd7fe8-ce59-4e30-ab03-7adbfb3d619b */
    public float getDiscount() {
        return discount;
    }

    /** @param newDiscount
     * @pdOid 041da2ff-c5e3-4774-b713-aeb31cf08d91 */
    public void setDiscount(float newDiscount) {
        discount = newDiscount;
    }

    /** @pdOid 323721d4-6914-40c7-a955-633ebeff1417 */
    public float getOrigin() {
        return origin;
    }

    /** @param newOrigin
     * @pdOid 410b464f-db22-40f1-978d-0b2213fbec92 */
    public void setOrigin(float newOrigin) {
        origin = newOrigin;
    }

    /** @pdOid 082555a2-ecbf-4546-8469-d8c175341d9a */
    public float getCurrent() {
        return current;
    }

    /** @param newCurrent
     * @pdOid f9c8d208-03b2-4bf1-8b0f-24c53861867b */
    public void setCurrent(float newCurrent) {
        current = newCurrent;
    }

    public SettingDict getsDict() {
        return sDict;
    }

    public Merchant getCompany() {
        return company;
    }

    public void setCompany(Merchant company) {
        this.company = company;
    }

    public int getIsBan() {
        return isBan;
    }

    public void setIsBan(int isBan) {
        this.isBan = isBan;
    }
}