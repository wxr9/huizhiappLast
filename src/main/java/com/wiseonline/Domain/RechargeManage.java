package com.wiseonline.Domain;

/**
 * Created by R7tech on 4/18/2016.
 */

import com.fasterxml.jackson.annotation.JsonFormat;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;

/** @pdOid f6ff5323-405b-45ff-9677-02805d859cde */
@Entity
@DynamicInsert(true)
@DynamicUpdate(true)
@Table(name = "recharge_manage")
public class RechargeManage {
    /** @pdOid d1ab6182-30e0-4bc1-a0fb-8353d84e9311 */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int id;
    /** @pdOid 83cbb88c-6921-4998-901d-8fb0c8bcafd9 */
    public java.lang.String orderNo;
    /** 发票验证码
     *
     * @pdOid 78d5a6f6-b6bf-490e-b04a-fef7166defd1 */
    public java.lang.String checkCode;
    /** 金额
     *
     * @pdOid 4c49cbaf-af0d-4b79-ad22-d5742e2c430b */
    public String amount;
    /** 汇智卡号
     *
     * @pdOid 22c93616-33ce-4141-a0b1-5720b3d27d79 */
    public java.lang.String cardNo;
    /** 帐号号
     *
     * @pdOid 38a6b60a-6d09-4d1b-b94c-71b467489946 */
    public java.lang.String account;
    /** 1未领发票2已领发票
     *
     * @pdOid a3f3951b-3e56-423f-9ec8-9f2cb4e985d1 */
    public int checkGet;
    /** @pdOid 5f2869ee-55ce-459e-a081-673e3712f4b0 */
    public java.util.Date createTime;

    /** @pdOid 041b35bb-8ff0-40a2-a7f8-45d204841c4c */
    public int getId() {
        return id;
    }

    /** @param newId
     * @pdOid ea57f919-feae-49ef-b5f0-bd55d3d6a49c */
    public void setId(int newId) {
        id = newId;
    }

    /** @pdOid 861ab8f3-eddc-453f-a617-6e4f2c5e6b7e */
    public java.lang.String getOrderNo() {
        return orderNo;
    }

    /** @param newOrderNo
     * @pdOid 8bf60786-1df4-48ec-9c57-958070966115 */
    public void setOrderNo(java.lang.String newOrderNo) {
        orderNo = newOrderNo;
    }

    /** @pdOid ecdf1596-7176-40eb-83eb-31bafbe82783 */
    public java.lang.String getCheckCode() {
        return checkCode;
    }

    /** @param newCheckCode
     * @pdOid 79439818-9b6b-4d4f-964a-3701212ce71a */
    public void setCheckCode(java.lang.String newCheckCode) {
        checkCode = newCheckCode;
    }

    /** @pdOid 95d99787-f651-4f18-8878-650e825edb09 */
    public String getAmount() {
        return amount;
    }

    /** @param newAmount
     * @pdOid b3bfc04e-4d4a-40c0-9b9b-b6baecdc5d7d */
    public void setAmount(String newAmount) {
        amount = newAmount;
    }

    /** @pdOid 870c6202-50b4-43c8-abe5-b60452ae6e95 */
    public java.lang.String getCardNo() {
        return cardNo;
    }

    /** @param newCardNo
     * @pdOid 38d24b9f-cd2a-4199-aaee-a01845472408 */
    public void setCardNo(java.lang.String newCardNo) {
        cardNo = newCardNo;
    }

    /** @pdOid 6373a031-e63e-4d6f-bf52-c4a61d0578dc */
    public java.lang.String getAccount() {
        return account;
    }

    /** @param newAccount
     * @pdOid c8dd9085-fe8d-426e-a6b5-007aff207b7f */
    public void setAccount(java.lang.String newAccount) {
        account = newAccount;
    }

    /** @pdOid 89205afe-a916-4378-9d46-6b622c573580 */
    public int getCheckGet() {
        return checkGet;
    }

    /** @param newCheckGet
     * @pdOid ab9d2f88-86e8-4f22-92d5-ba4e636d6cf7 */
    public void setCheckGet(int newCheckGet) {
        checkGet = newCheckGet;
    }

    /** @pdOid c854d25e-746b-4cbd-90c1-2ae38f075541 */
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    public java.util.Date getCreateTime() {
        return createTime;
    }

    /** @param newCreateTime
     * @pdOid ffa1a504-bdd7-4cd1-863b-90be36fcc703 */
    public void setCreateTime(java.util.Date newCreateTime) {
        createTime = newCreateTime;
    }

}
