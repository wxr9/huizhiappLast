package com.wiseonline.Domain;

/***********************************************************************
 * Module:  MerchantComment.java
 * Author:  R7tech
 * Purpose: Defines the Class MerchantComment
 ***********************************************************************/

import javax.persistence.*;

/** 商户用户之间的互动评论
 *
 * @pdOid ef380d1a-07de-4478-8c8d-a9d30217b382 */
@Entity
@Table(name = "merchant_comment")
public class MerchantComment {
    /** @pdOid c233e69a-5a39-43aa-88f4-debdd045a51e */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int objectid;
    /** @pdOid b568af90-15f1-4837-bb3d-0a60a7c50e54 */
    public java.lang.String customer;
    /** @pdOid 6fc3da8d-2ab0-495f-b4a7-6c5c523595c0 */
    public java.lang.String merchant;
    /** @pdOid c6846564-7f35-4546-9246-80da19aeb478 */
    public int type;
    /** @pdOid ab4af767-c5b6-4584-b699-01bcd0951730 */
    public java.lang.String content;
    /** @pdOid 066ab11f-975d-4235-ab27-8876c35e1652 */
    public java.lang.String reply;
    /** @pdOid 5c04a1e8-bb68-4eca-9f25-500882fac542 */
    public java.util.Date createTime;

    /** @pdOid 9ee88364-6635-4177-ac96-4bad082b78f6 */
    public int getObjectid() {
        return objectid;
    }

    /** @param newObjectid
     * @pdOid d0854fd4-c08b-48b6-b49e-24938ccc4424 */
    public void setObjectid(int newObjectid) {
        objectid = newObjectid;
    }

    /** @pdOid efaa1adf-c368-403c-812d-f665bc8f4edb */
    public java.lang.String getCustomer() {
        return customer;
    }

    /** @param newCustomer
     * @pdOid 65a64e0a-6b3c-44e7-9d76-70089f9d2281 */
    public void setCustomer(java.lang.String newCustomer) {
        customer = newCustomer;
    }

    /** @pdOid 6513374b-83e4-4d75-b1a6-6a793a541578 */
    public java.lang.String getMerchant() {
        return merchant;
    }

    /** @param newMerchant
     * @pdOid f6641ea3-f87e-4309-9df5-6484e8487276 */
    public void setMerchant(java.lang.String newMerchant) {
        merchant = newMerchant;
    }

    /** @pdOid eba36164-2169-4b44-9988-054f56682916 */
    public int getType() {
        return type;
    }

    /** @param newType
     * @pdOid 0c052a69-78ae-412b-97c8-e8877f950794 */
    public void setType(int newType) {
        type = newType;
    }

    /** @pdOid 31527695-eef2-4c4a-a391-68b830ca66df */
    public java.lang.String getContent() {
        return content;
    }

    /** @param newContent
     * @pdOid 26708ec6-7da1-4060-842e-edcc9454e246 */
    public void setContent(java.lang.String newContent) {
        content = newContent;
    }

    /** @pdOid fa34417f-2a2f-4243-b534-daae0d698835 */
    public java.lang.String getReply() {
        return reply;
    }

    /** @param newReply
     * @pdOid 248e5962-724a-41d3-88f6-2177944df898 */
    public void setReply(java.lang.String newReply) {
        reply = newReply;
    }

    /** @pdOid c28a063b-4782-4e35-9566-07249580b53e */
    public java.util.Date getCreateTime() {
        return createTime;
    }

    /** @param newCreateTime
     * @pdOid 27af209f-812a-43e5-a67a-7c66ce00cb20 */
    public void setCreateTime(java.util.Date newCreateTime) {
        createTime = newCreateTime;
    }

}