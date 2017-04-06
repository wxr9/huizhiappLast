package com.wiseonline.Domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import javax.persistence.*;

/**
 * 企业信息表
 * Created by yanwj on 2015/11/6.
 */
@Entity
@Table(name = "enterprise")
public class Enterprise extends BaseEntity{

    public String name;

    public String abbreviation;

    public String contacts;

    public String contactsinfo;

    public String address;

    @JsonIgnore
    public String introduction;

    public String memo;

    @ManyToOne(targetEntity = SettingDict.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
    @JoinColumn(name = "type")
    @NotFound(action = NotFoundAction.IGNORE)
    public SettingDict enterpriseType;

    @Transient
    public int type;

    @ManyToOne(targetEntity = SettingDict.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
    @JoinColumn(name = "industry")
    @NotFound(action = NotFoundAction.IGNORE)
    public SettingDict enterpriseIndustry;

    @Transient
    public int industry;

    @ManyToOne(targetEntity = SettingDict.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
    @JoinColumn(name = "scale")
    @NotFound(action = NotFoundAction.IGNORE)
    public SettingDict enterpriseScale;

    @Transient
    public int scale;

    @ManyToOne(targetEntity = SettingDict.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
    @JoinColumn(name = "intake")
    @NotFound(action = NotFoundAction.IGNORE)
    public SettingDict enterpriseIntake;

    @Transient
    public int intake;


    @Column(name = "deleteflag")
    public int deleteFlag;

    public String username;
    @Column(name = "clm_id")
    public int clmId;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAbbreviation() {
        return abbreviation;
    }

    public void setAbbreviation(String abbreviation) {
        this.abbreviation = abbreviation;
    }

    public String getContacts() {
        return contacts;
    }

    public void setContacts(String contacts) {
        this.contacts = contacts;
    }

    public String getContactsinfo() {
        return contactsinfo;
    }

    public void setContactsinfo(String contactsinfo) {
        this.contactsinfo = contactsinfo;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getIntroduction() {
        return introduction;
    }

    public void setIntroduction(String introduction) {
        this.introduction = introduction;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public SettingDict getEnterpriseType() {
        return enterpriseType;
    }

    public void setEnterpriseType(SettingDict enterpriseType) {
        this.enterpriseType = enterpriseType;
    }

    public int getType() {
        if (enterpriseType != null){
            return enterpriseType.getObjectid();
        }else {
            return type;
        }
    }

    public void setType(int type) {
        this.type = type;
    }

    public SettingDict getEnterpriseIndustry() {
        return enterpriseIndustry;
    }

    public void setEnterpriseIndustry(SettingDict enterpriseIndustry) {
        this.enterpriseIndustry = enterpriseIndustry;
    }

    public int getIndustry() {
        if (enterpriseIndustry != null){
            return enterpriseIndustry.getObjectid();
        }else {
            return industry;
        }
    }

    public void setIndustry(int industry) {
        this.industry = industry;
    }

    public SettingDict getEnterpriseScale() {
        return enterpriseScale;
    }

    public void setEnterpriseScale(SettingDict enterpriseScale) {
        this.enterpriseScale = enterpriseScale;
    }

    public int getScale() {
        if (enterpriseScale != null){
            return enterpriseScale.getObjectid();
        }else {
            return scale;
        }
    }

    public void setScale(int scale) {
        this.scale = scale;
    }

    public SettingDict getEnterpriseIntake() {
        return enterpriseIntake;
    }

    public void setEnterpriseIntake(SettingDict enterpriseIntake) {
        this.enterpriseIntake = enterpriseIntake;
    }

    public int getIntake() {
        if (enterpriseIntake != null){
            return enterpriseIntake.getObjectid();
        }else {
            return intake;
        }
    }

    public void setIntake(int intake) {
        this.intake = intake;
    }

    public int getDeleteFlag() {
        return deleteFlag;
    }

    public void setDeleteFlag(int deleteFlag) {
        this.deleteFlag = deleteFlag;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getClmId() {
        return clmId;
    }

    public void setClmId(int clmId) {
        this.clmId = clmId;
    }
}
