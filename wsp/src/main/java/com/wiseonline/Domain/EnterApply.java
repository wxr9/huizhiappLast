package com.wiseonline.Domain;

/***********************************************************************
 * Module:  EnterApply.java
 * Author:  R7tech
 * Purpose: Defines the Class EnterApply
 ***********************************************************************/

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.wiseonline.Utils.CustomDateSerializer;
import org.hibernate.annotations.LazyToOne;
import org.hibernate.annotations.LazyToOneOption;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import javax.persistence.*;
import java.util.*;

/** 入驻申请
 *
 * @pdOid f6435272-1825-4cef-9c8b-2ff680e858b1 */
@Entity
@Table(name = "enter_apply")
public class EnterApply extends BaseEntity{

    @Column(name = "serial_number")
    public String serialNumber; //流水号

    public String username;//申请人
    @Column(name = "chinese_name")
    public String chineseName;//申请人中文名

    /** 电子邮箱
     *
     * @pdOid c2f61f78-5589-41dc-880b-28f006bb5c6c */
    public java.lang.String email;
    /** 公司名称
     *
     * @pdOid b9408d00-0a30-421b-9552-09dab4303c5b */
    public java.lang.String company;
    /** 联系方式
     *
     * @pdOid e069a50d-94aa-4e25-bea3-a8669aab1ce4 */
    public java.lang.String contact;
    /** 公司规模
     *
     * @pdOid 82b24e70-d2fa-450d-99a1-7e8f2065abf9 */

    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(targetEntity = SettingDict.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
    @JoinColumn(name = "staff")
    public SettingDict sStaff;

    @Transient
    public int sStafffId;
    /** 产业类别
     *
     * @pdOid ffcad4fb-39ce-4f98-8667-d9d3abbda067 */

    @ManyToOne(targetEntity = SettingDict.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
    @JoinColumn(name = "type")
    @NotFound(action = NotFoundAction.IGNORE)
    public SettingDict sType;
    @Transient
    public int sTypeId;

    /** 园区
     *
     * @pdOid 19c0e8b0-8d8f-4476-ada4-524805ec0038 */

    @Column(name = "park")
    public String park;

    @Transient
    public String parkName;
    /** 需求面积
     *
     * @pdOid 91525b97-b302-4b23-bc97-ac6ecd25b035 */
    public java.lang.String area;
    /** 需求说明
     *
     * @pdOid 7e153ddf-c91d-4204-b98f-6813e3fa1132 */
    public java.lang.String details;
    /** 备注
     *
     * @pdOid c47ea679-608a-4de3-92d8-b03905fa7fdc */
    public java.lang.String memo;


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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public SettingDict getsStaff() {
        return sStaff;
    }

    public void setsStaff(SettingDict sStaff) {
        this.sStaff = sStaff;
    }

    public int getsStafffId() {
        if (sStaff != null){
            return sStaff.getObjectid();
        }else {
            return sStafffId;
        }
    }

    public void setsStafffId(int sStafffId) {
        this.sStafffId = sStafffId;
    }

    public SettingDict getsType() {
        return sType;
    }

    public void setsType(SettingDict sType) {
        this.sType = sType;
    }

    public int getsTypeId() {
        if (sType != null){
            return sType.getObjectid();
        }else {
            return sTypeId;
        }
    }

    public void setsTypeId(int sTypeId) {
        this.sTypeId = sTypeId;
    }

    public String getPark() {
        return park;
    }

    public void setPark(String park) {
        this.park = park;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public String getParkName() {
        return parkName;
    }

    public void setParkName(String parkName) {
        this.parkName = parkName;
    }
}
