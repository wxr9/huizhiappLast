package com.wiseonline.Domain;

/***********************************************************************
 * Module:  MerchantComment.java
 * Author:  R7tech
 * Purpose: Defines the Class MerchantComment
 ***********************************************************************/

import com.fasterxml.jackson.annotation.JsonFormat;
import org.hibernate.annotations.LazyToOne;
import org.hibernate.annotations.LazyToOneOption;

import javax.persistence.*;

import java.io.Serializable;
import java.util.*;
/** 商户用户之间的互动评论
 *
 * @pdOid ef380d1a-07de-4478-8c8d-a9d30217b382 */
@Entity
@Table(name = "merchant_reply")
/***********************************************************************
 * Module:  MerchantReply.java
 * Author:  R7tech
 * Purpose: Defines the Class MerchantReply
 ***********************************************************************/
/** 商户评论回复
 *
 * @pdOid e18396c1-e5cd-409e-a7a2-07ea11b223ff */
public class MerchantReply {

    /** @pdOid 4949683f-3f53-4d76-bb93-d416c204a19d */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int objectid;

    private int eid;
    /** 回复内容
     *
     * @pdOid 77888e0d-0c9a-44ae-afda-cefcb22438c7 */
    private java.lang.String content;
    /** @pdOid 8c32d2d3-921b-4ee8-9800-228e7194d4ba */
    private java.util.Date createTime;

    private int merchant;

    private String bContent;

    @OneToOne
    @JoinColumn(name = "merchant",insertable = false, updatable = false)
    private Merchant mMerchant;

    /**
     *  1代表禁用，2代表不禁用
     */
    public int isBlock;

    /** @pdOid ed4f66fa-7e2c-4601-ac27-38a9f208ae43 */
    public int getObjectid() {
        return objectid;
    }

    /** @param newObjectid
     * @pdOid 313ab079-1c34-4581-8619-3805c7a50568 */
    public void setObjectid(int newObjectid) {
        objectid = newObjectid;
    }

    public int getEid() {
        return eid;
    }

    public void setEid(int eid) {
        this.eid = eid;
    }

    public int getMerchant() {
        return merchant;
    }

    public void setMerchant(int merchant) {
        this.merchant = merchant;
    }

    /** @pdOid 39eae084-4343-4bcb-bdd4-8da7bb9a699b */
    public java.lang.String getContent() {
        return content;
    }

    /** @param newContent
     * @pdOid 9906bdfb-0cd1-4ae4-9149-6b17d6349678 */
    public void setContent(java.lang.String newContent) {
        content = newContent;
    }

    /** @pdOid 58022843-7847-4ae5-a59c-d13876d207b2 */
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    public java.util.Date getCreateTime() {
        return createTime;
    }

    /** @param newCreateTime
     * @pdOid aceb17c1-aabd-47d0-babf-5e7fa853f92e */
    public void setCreateTime(java.util.Date newCreateTime) {
        createTime = newCreateTime;
    }


    public String getbContent() {
        return bContent;
    }

    public void setbContent(String bContent) {
        this.bContent = bContent;
    }

    public int getIsBlock() {
        return isBlock;
    }

    public void setIsBlock(int isBlock) {
        this.isBlock = isBlock;
    }

    public Merchant getmMerchant() {
        return mMerchant;
    }

    public void setmMerchant(Merchant mMerchant) {
        this.mMerchant = mMerchant;
    }
}