package com.wiseonline.Domain;

/**
 * Created by R7tech on 4/18/2016.
 */

import com.fasterxml.jackson.annotation.JsonFormat;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.text.SimpleDateFormat;
import java.util.Date;

/** 汇智卡操作日志
 *
 * @pdOid 7b1b319c-39bf-4467-9acc-354b1b00e76b */
@Entity
@DynamicInsert(true)
@DynamicUpdate(true)
@Table(name = "pay_log")
public class PayLog {
    /** @pdOid 0b619051-8b4a-4ee9-a4b1-a6948533a316 */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int objectid;

    /**
     * 用户名
     */
    public String member;

    /** 汇智卡号
     *
     * @pdOid 7264398d-03d2-4e58-ab6e-01aaeed19ff2 */
    public String cardNo;
    /** 1充值支付2绑定3历史查询
     *
     * @pdOid 971ed380-8ae1-45d7-9765-29365d1c783a */
    public int type;
    /** @pdOid 621c3ba0-1de5-4e51-844a-6db6bf7af308 */
    public String mobile;
    /** @pdOid 6cdfd0f7-ca26-4fd1-b930-eae681c15276 */
    public String ipAddr;
    /** @pdOid 313b3c88-61bf-4a82-975a-b4ecadb4c49e */
    public Date createTime;

    public String orderNo;

    public String orderAmt;

    public String tranTime;

    public float discountAmt;

    public float actualCharge;

    public String tranSerialNo;

    public boolean status;

    public String memo;

    //充值成功金额
    public String rechargeAmt;

    public String verifyCode;

    /** @pdOid fbfc1992-8d6b-463b-9379-12d9b1494ecc */
    public int getObjectid() {
        return objectid;
    }

    /** @param newObjectid
     * @pdOid 0c454348-f4e4-4db1-a5d5-31d4aa8966a4 */
    public void setObjectid(int newObjectid) {
        objectid = newObjectid;
    }

    /** @pdOid 816ace6f-8210-4bde-b009-338f798e29a0 */
    public String getCardNo() {
        return cardNo;
    }

    /** @param newCardNo
     * @pdOid f38206d2-9ed4-4e2d-9d04-74a55c8dd7ae */
    public void setCardNo(String newCardNo) {
        cardNo = newCardNo;
    }

    /** @pdOid 6ca8cf8c-e9b9-4cda-923f-bad73639af2b */
    public int getType() {
        return type;
    }

    /** @param newType
     * @pdOid cec28e04-1a11-4723-9297-21c06e300344 */
    public void setType(int newType) {
        type = newType;
    }

    /** @pdOid 1799265c-0065-40f3-8e8e-bedd2addb993 */
    public String getMobile() {
        return mobile;
    }

    /** @param newMobile
     * @pdOid 7d9ca147-4dcc-4f62-8a78-b7dc81d9027c */
    public void setMobile(String newMobile) {
        mobile = newMobile;
    }

    /** @pdOid 2cff9041-3efc-4aed-8f95-1090c8b16ea2 */
    public String getIpAddr() {
        return ipAddr;
    }

    /** @param newIpAddr
     * @pdOid 0893d81d-b214-4a5c-a554-c8d5200ef176 */
    public void setIpAddr(String newIpAddr) {
        ipAddr = newIpAddr;
    }

    public String getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(String orderNo) {
        this.orderNo = orderNo;
    }

    public String getOrderAmt() {
        return orderAmt;
    }

    public void setOrderAmt(String orderAmt) {
        this.orderAmt = orderAmt;
    }

    /** @pdOid fb359965-3055-4e5e-8de6-328317e5b0be */
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    public Date getCreateTime() {
        return createTime;
    }

    /** @param newCreateTime
     * @pdOid afc5bd18-8294-4f38-91c8-d52985744850 */
    public void setCreateTime(Date newCreateTime) {
        createTime = newCreateTime;
    }

    public String getMember() {
        return member;
    }

    public void setMember(String member) {
        this.member = member;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    public Date getTranTime() {
        Date date = new Date();
        try{
            date = new SimpleDateFormat("yyyyMMddHHmmss").parse(tranTime);
        }catch (Exception e){

        }
        return date;
    }

    public void setTranTime(String tranTime) {
        this.tranTime = tranTime;
    }

    public String getTranSerialNo() {
        return tranSerialNo;
    }

    public void setTranSerialNo(String tranSerialNo) {
        this.tranSerialNo = tranSerialNo;
    }

    public float getActualCharge() {
        return actualCharge;
    }

    public void setActualCharge(float actualCharge) {
        this.actualCharge = actualCharge;
    }

    public float getDiscountAmt() {
        return discountAmt;
    }

    public void setDiscountAmt(float discountAmt) {
        this.discountAmt = discountAmt;
    }

    public String getVerifyCode() {
        return verifyCode;
    }

    public void setVerifyCode(String verifyCode) {
        this.verifyCode = verifyCode;
    }

    public String getRechargeAmt() {
        return rechargeAmt;
    }

    public void setRechargeAmt(String rechargeAmt) {
        this.rechargeAmt = rechargeAmt;
    }
}
