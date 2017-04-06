package com.wiseonline.Domain;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.wiseonline.Utils.CustomDateSerializer;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by yanwj on 2016/3/3.
 */
@Entity
@Table(name = "user_advertisement")
public class UserAdvertisement extends BaseEntity{
    @Column(name = "serial_number")
    public String serialNumber; //流水号
    public String username;//申请人
    @Column(name = "chinese_name")
    public String chineseName;//申请人中文名
    public String company;//公司名称
    public String phone;//联系方式
    public String email;//E-mail
    @Column(name = "begin_date")
    @Temporal(TemporalType.TIMESTAMP)
    @JsonSerialize(using = CustomDateSerializer.class)
    public Date beginDate;//投放开始时间
    @Column(name = "end_date")
    @Temporal(TemporalType.TIMESTAMP)
    @JsonSerialize (using = CustomDateSerializer.class)
    public Date endDate;//投放结束时间
    public String content;//需求说明
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

    public Date getBeginDate() {
        return beginDate;
    }

    public void setBeginDate(Date beginDate) {
        this.beginDate = beginDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
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
