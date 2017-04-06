package com.wiseonline.Domain;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.wiseonline.Utils.CustomDateSerializer;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by yanwj on 2016/3/14.
 */
@Entity
@Table(name = "enterprist_cultivate")
public class EnterpriseCultivate extends BaseEntity{
    @Column(name = "serial_number")
    public String serialNumber;//流水号
    public String username;//申请人
    @Column(name = "chinese_name")
    public String chineseName; //用户真实名称
    public String company;//公司名称
    @Column(name = "company_address")
    public String companyAddress; //公司地址
    public String phone;//联系方式
    public String email;//E-mail
    @Column(name = "business_type")
    public String businessType;//业务方向
    @Transient
    public String businessTypeString;//业务方向文字
    public String content;//培训需求描述
    public String accessory;//附件
    public String memo;//备注

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

    public String getCompanyAddress() {
        return companyAddress;
    }

    public void setCompanyAddress(String companyAddress) {
        this.companyAddress = companyAddress;
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

    public String getBusinessType() {
        return businessType;
    }

    public void setBusinessType(String businessType) {
        this.businessType = businessType;
    }

    public String getBusinessTypeString() {
        return businessTypeString;
    }

    public void setBusinessTypeString(String businessTypeString) {
        this.businessTypeString = businessTypeString;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getAccessory() {
        return accessory;
    }

    public void setAccessory(String accessory) {
        this.accessory = accessory;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

}
