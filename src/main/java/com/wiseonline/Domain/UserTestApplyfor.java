package com.wiseonline.Domain;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.wiseonline.Utils.CustomDateSerializer;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by yanwj on 2016/3/3.
 */
@Entity
@Table(name = "user_test_applyfor")
public class UserTestApplyfor extends BaseEntity{
    @Column(name = "serial_number")
    public String serialNumber;  //流水号
    public String username;  //用户登录名
    @Column(name = "chinese_name")
    public String chineseName; //申请人
    public String company;  //公司
    public String phone;  //联系方式
    public String email; //email
    @Column(name = "soft_name")
    public String softName;//软件名称
    @Column(name = "soft_abbreviation")
    public String softAbbreviation;//软件简称
    @Column(name = "soft_version")
    public String softVersion;//版本号
    public String organizers;//测送单位
    @ManyToOne(targetEntity = SettingDict.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
    @JoinColumn(name = "test_type")
    public SettingDict testType;
    @Transient
    public int testTypeId;//测试类别
    public String content;//需求说明
    @Column(name = "apply_form")
    public String applyForm;//申请表
    public String material;//其它材料
    public String memo;//备注信息


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

    public String getSoftName() {
        return softName;
    }

    public void setSoftName(String softName) {
        this.softName = softName;
    }

    public String getSoftAbbreviation() {
        return softAbbreviation;
    }

    public void setSoftAbbreviation(String softAbbreviation) {
        this.softAbbreviation = softAbbreviation;
    }

    public String getSoftVersion() {
        return softVersion;
    }

    public void setSoftVersion(String softVersion) {
        this.softVersion = softVersion;
    }

    public String getOrganizers() {
        return organizers;
    }

    public void setOrganizers(String organizers) {
        this.organizers = organizers;
    }

    public SettingDict getTestType() {
        return testType;
    }

    public void setTestType(SettingDict testType) {
        this.testType = testType;
    }

    public int getTestTypeId() {
        if (testType != null){
            return testType.getObjectid();
        }else {
            return testTypeId;
        }
    }

    public void setTestTypeId(int testTypeId) {
        this.testTypeId = testTypeId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getApplyForm() {
        return applyForm;
    }

    public void setApplyForm(String applyForm) {
        this.applyForm = applyForm;
    }

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

}
