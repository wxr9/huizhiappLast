package com.wiseonline.Domain;

/***********************************************************************
 * Module:  MerchantEvaluate.java
 * Author:  R7tech
 * Purpose: Defines the Class MerchantEvaluate
 ***********************************************************************/

import com.fasterxml.jackson.annotation.JsonFormat;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.LazyToOne;
import org.hibernate.annotations.LazyToOneOption;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

/** 用户对商户的点评
 *
 * @pdOid 305b196d-f717-40b7-a98f-c79fb2e446d0 */
@Entity
@DynamicInsert(true)
@DynamicUpdate(true)
@Table(name = "merchant_evaluate")
public class MerchantEvaluate {
    /** @pdOid 236318a8-bf51-4de8-a873-40368b1d86c2 */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int objectid;
    /** @pdOid 2b29791a-710e-4516-b1af-32e94ef1dba1 */
    public java.lang.String customer;
    /** @pdOid 1c98a6ab-81f3-4e33-aa71-c8b2b9e62db5 */
    public int merchant;
    /** @pdOid bb8fea9d-7591-4483-b91d-b3bb148fcb04 */
    public float env;
    /** @pdOid c8f85dee-7ee7-4e1f-b7d2-2f8cdf767a13 */
    public float taste;
    /** @pdOid b18aa563-257f-4e0c-8f10-c93a6818060e */
    public float service;
    /** @pdOid c3e2a0b7-1588-402d-8a0c-4a0493a80907 */
    public java.lang.String comment;

    private java.util.Date createTime;

    @ManyToOne
    @JoinColumn(name = "merchant",insertable = false, updatable = false)
    private Merchant mMerchant;

    @ManyToOne
    @JoinColumn(name = "customer",insertable = false, updatable = false)
    private UserForMerchant cCustomer;

    @Transient
    private List<MerchantReply> replyList;

    /** @pdOid 27efc909-f984-44ee-9e8c-ccb54eda732b */
    public int getObjectid() {
        return objectid;
    }

    /** @param newObjectid
     * @pdOid f713d9f7-7180-49cc-b36c-35ad3fb5bad2 */
    public void setObjectid(int newObjectid) {
        objectid = newObjectid;
    }

    /** @pdOid ffe15e29-6901-484c-b9bd-c0f2850f9efa */
    public java.lang.String getCustomer() {
        return customer;
    }

    /** @param newCustomer
     * @pdOid 09163242-4a16-434e-9d01-901044041a63 */
    public void setCustomer(java.lang.String newCustomer) {
        customer = newCustomer;
    }

    /** @pdOid 2a00f119-eabf-4e51-b892-546002c423bf */
    public int getMerchant() {
        return merchant;
    }

    /** @param newMerchant
     * @pdOid e0de06f6-5ed9-4f66-900e-a327064fde06 */
    public void setMerchant(int newMerchant) {
        merchant = newMerchant;
    }

    /** @pdOid 964f3471-7927-490b-9be0-990d416585f2 */
    public float getEnv() {
        return env;
    }

    /** @param newEnv
     * @pdOid 45019e3c-1410-442c-9945-1201988773ff */
    public void setEnv(float newEnv) {
        env = newEnv;
    }

    /** @pdOid 9b6ad235-6777-4f41-8294-28365c971fbd */
    public float getTaste() {
        return taste;
    }

    /** @param newTaste
     * @pdOid c1cd1dd1-92b8-49ee-bf2a-3e3cd011c890 */
    public void setTaste(float newTaste) {
        taste = newTaste;
    }

    /** @pdOid a2db667b-8c3d-456c-88a8-128af8e95ba7 */
    public float getService() {
        return service;
    }

    /** @param newService
     * @pdOid 28b80c77-8256-4d99-a76d-f2d932d7b9c4 */
    public void setService(float newService) {
        service = newService;
    }

    /** @pdOid c8470742-5e0f-49b6-9b41-a59a43a77979 */
    public java.lang.String getComment() {
        return comment;
    }

    /** @param newComment
     * @pdOid 4e4ca9cf-779a-4dd8-9d82-461e8ba5e008 */
    public void setComment(java.lang.String newComment) {
        comment = newComment;
    }

    public List<MerchantReply> getReplyList() {
        return replyList;
    }

    public void setReplyList(List<MerchantReply> replyList) {
        this.replyList = replyList;
    }

    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    public java.util.Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(java.util.Date createTime) {
        this.createTime = createTime;
    }

    public UserForMerchant getcCustomer() {
        return cCustomer;
    }

    public Merchant getmMerchant() {
        return mMerchant;
    }
}
