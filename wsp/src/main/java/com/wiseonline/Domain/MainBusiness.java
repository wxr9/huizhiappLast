package com.wiseonline.Domain;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.wiseonline.Utils.CustomDateSerializer;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by yanwj on 2016/4/18.
 */
@Entity
@Table(name = "main_business")
public class MainBusiness extends BaseEntity{
    @Column(name = "serial_number")
    public String serialNumber;//流水号
    public String username;//申请人
    @Column(name = "chinese_name")
    public String chineseName;//用户真实名称
    public String company;//公司名称
    public String phone;//联系方式
    public String email;//E-mail
    @Column(name = "businessid")
    public int businessId;//业务表主键id
    @Column(name = "business_type")
    public String businessType;//业务类别
    @Column(name = "business_type_zh")
    public String businessTypeZh;//业务类别中文
    @Column(name = "complete_date")
    @Temporal(TemporalType.TIMESTAMP)
    @JsonSerialize(using = CustomDateSerializer.class)
    public Date completeDate;
    @Column(name = "commentflag")
    public int commentFlag;//是否评论（1-未评论，2-已经评论）

    public int id;

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getChineseName() {
        return chineseName;
    }

    public void setChineseName(String chineseName) {
        this.chineseName = chineseName;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getBusinessId() {
        return businessId;
    }

    public void setBusinessId(int businessId) {
        this.businessId = businessId;
    }

    public String getBusinessType() {
        return businessType;
    }

    public void setBusinessType(String businessType) {
        this.businessType = businessType;
    }

    public String getBusinessTypeZh() {
        return businessTypeZh;
    }

    public void setBusinessTypeZh(String businessTypeZh) {
        this.businessTypeZh = businessTypeZh;
    }

    public Date getCompleteDate() {
        return completeDate;
    }

    public void setCompleteDate(Date completeDate) {
        this.completeDate = completeDate;
    }

    public int getCommentFlag() {
        return commentFlag;
    }

    public void setCommentFlag(int commentFlag) {
        this.commentFlag = commentFlag;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
}
