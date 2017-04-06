package com.wiseonline.Domain;

/***********************************************************************
 * Module:  HuizhiCardEnterpise.java
 * Author:  R7tech
 * Purpose: Defines the Class HuizhiCardEnterpise
 ***********************************************************************/

import com.fasterxml.jackson.annotation.JsonFormat;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.SelectBeforeUpdate;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.util.*;
@Entity
@DynamicInsert(true)
@DynamicUpdate(true)
@Table(name = "huizhi_card_enterprise")
/** @pdOid df0957f9-e2e6-4aad-bd1b-fe26b9aecf6d */
public class HuizhiCardEnterpise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    /** @pdOid 9759991c-9d1c-466e-8946-1f7fb9bf9e82 */
    public int id;
    /** @pdOid a0d9849c-5719-4d5b-9d60-636618c8723b */
    public java.lang.String username;
    /** @pdOid e1228582-330c-48ed-ad57-79cd7066765f */
    public java.lang.String email;
    /** @pdOid 1c597ce1-751a-4177-8698-cfc3359ef759 */
    public java.lang.String company;
    /** @pdOid aea4f5d8-d63b-48cb-81c1-6c535c61df21 */
    public java.lang.String contact;
    /** @pdOid 2a00a5b9-6d62-45d4-9b15-16f43c5e06df */
    public java.lang.String attachment;
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    /** @pdOid 5da294e2-ffab-4b6b-aaf7-4b8f58e409b8 */
    public java.util.Date createTime;

    public java.lang.String sn;
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    public java.util.Date getTime;

    /**
     *  0待处理1受理中2审核通过3审核不通过4中止
     */
    public int status;

    public java.lang.String mark;

    /** @pdOid 06d3caca-49dc-42cb-8876-5e672601c243 */
    public int getId() {
        return id;
    }

    /** @param newId
     * @pdOid 82ec5fe2-044d-43eb-a2ab-dfbad4cc5df3 */
    public void setId(int newId) {
        id = newId;
    }

    /** @pdOid 14a1a201-d7cf-462b-8c76-543925e05722 */
    public java.lang.String getUsername() {
        return username;
    }

    /** @param newUsername
     * @pdOid a73cb608-7b7b-46ad-889c-e651e295879c */
    public void setUsername(java.lang.String newUsername) {
        username = newUsername;
    }

    /** @pdOid aaf7ab0e-47b2-48c7-ad1c-d9e3c716f8fc */
    public java.lang.String getEmail() {
        return email;
    }

    /** @param newEmail
     * @pdOid f7f27044-016d-4514-8aa2-54f206648ec2 */
    public void setEmail(java.lang.String newEmail) {
        email = newEmail;
    }

    /** @pdOid 60e732ad-9c37-4e01-943d-c6341544c311 */
    public java.lang.String getCompany() {
        return company;
    }

    /** @param newCompany
     * @pdOid f6165e81-6e52-45a5-8b11-e2f1a285b95b */
    public void setCompany(java.lang.String newCompany) {
        company = newCompany;
    }

    /** @pdOid d608bd4b-8c05-40e0-a4df-7af2ec08c0fb */
    public java.lang.String getContact() {
        return contact;
    }

    /** @param newContact
     * @pdOid 9e7bfe15-5797-4ba0-b5f3-45f86c23bec9 */
    public void setContact(java.lang.String newContact) {
        contact = newContact;
    }

    /** @pdOid ecf08fd8-3ca9-42a9-889e-168937d4649c */
    public java.lang.String getAttachment() {
        return attachment;
    }

    /** @param newAttachment
     * @pdOid 6b52a538-f5b3-490b-8231-f9557af5b4f1 */
    public void setAttachment(java.lang.String newAttachment) {
        attachment = newAttachment;
    }

    /** @pdOid 70cae989-0900-4fe0-b411-9cf6790a991b */
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    public java.util.Date getCreateTime() {
        return createTime;
    }

    /** @param newCreateTime
     * @pdOid 4853086e-1483-4ebd-9097-589454d13345 */
    public void setCreateTime(java.util.Date newCreateTime) {
        createTime = newCreateTime;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMark() {
        return mark;
    }

    public void setMark(String mark) {
        this.mark = mark;
    }

    public String getSn() {
        return sn;
    }

    public void setSn(String sn) {
        this.sn = sn;
    }

    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    public Date getGetTime() {
        return getTime;
    }

    public void setGetTime(Date getTime) {
        this.getTime = getTime;
    }
}
