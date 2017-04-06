package com.wiseonline.Domain;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.wiseonline.Utils.CustomDateSerializer;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by yanwj on 2016/3/22.
 */
@Entity
@Table(name = "user_copyright")
public class UserCopyright extends BaseEntity{
    @Column(name = "serial_number")
    public String serialNumber;//流水号
    public String username;//申请人
    @Column(name = "chinese_name")
    public String chineseName;//用户真实名称
    public String company;//公司名
    public String phone;//联系方式
    public String email; //E-mail
    @Column(name = "soft_name")
    public String softName;//软件名称
    @Column(name = "soft_abbreviation")
    public String softAbbreviation;//软件简称
    @Column(name = "soft_version")
    public String softVersion;//软件版本
    @ManyToOne(targetEntity = SettingDict.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
    @JoinColumn(name = "copyright_type")
    public SettingDict copyrightType;
    @Transient
    public int copyrightTypeId;//申请类别（个人申请、公司申请、联合申请)

    @ManyToOne(targetEntity = SettingDict.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
    @JoinColumn(name = "copyright_business_type")
    public SettingDict copyrightBusinessType; //业务类型
    @Transient
    public int copyrightBusinessTypeId;
    @Column(name = "copyright_unit")
    public String copyrightUnit;//申请单位
    @ManyToOne(targetEntity = SettingDict.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
    @JoinColumn(name = "period")
    public SettingDict period;
    @Transient
    public int periodId; //登记周期（普通件、45个、35个、25个、20个、15个、10个、6个、4个、3个工作日）
    @Column(name = "apply_form")
    public String applyForm;//申请表
    public String material;//其它材料
    public String content; //需求说明
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

    public SettingDict getCopyrightType() {
        return copyrightType;
    }

    public void setCopyrightType(SettingDict copyrightType) {
        this.copyrightType = copyrightType;
    }

    public int getCopyrightTypeId() {
        if (copyrightType != null){
            return copyrightType.getObjectid();
        }else {
            return copyrightTypeId;
        }
    }

    public void setCopyrightTypeId(int copyrightTypeId) {
        this.copyrightTypeId = copyrightTypeId;
    }

    public SettingDict getCopyrightBusinessType() {
        return copyrightBusinessType;
    }

    public void setCopyrightBusinessType(SettingDict copyrightBusinessType) {
        this.copyrightBusinessType = copyrightBusinessType;
    }

    public int getCopyrightBusinessTypeId() {
        if (copyrightBusinessType != null){
            return copyrightBusinessType.getObjectid();
        }else {
            return copyrightBusinessTypeId;
        }
    }

    public void setCopyrightBusinessTypeId(int copyrightBusinessTypeId) {
        this.copyrightBusinessTypeId = copyrightBusinessTypeId;
    }

    public String getCopyrightUnit() {
        return copyrightUnit;
    }

    public void setCopyrightUnit(String copyrightUnit) {
        this.copyrightUnit = copyrightUnit;
    }

    public SettingDict getPeriod() {
        return period;
    }

    public void setPeriod(SettingDict period) {
        this.period = period;
    }

    public int getPeriodId() {
        if (period != null){
            return period.getObjectid();
        }else {
            return periodId;
        }
    }

    public void setPeriodId(int periodId) {
        this.periodId = periodId;
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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

}
