package com.wiseonline.Domain;

/***********************************************************************
 * Module:  HuizhiCardPerson.java
 * Author:  R7tech
 * Purpose: Defines the Class HuizhiCardPerson
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
@Table(name = "huizhi_card_person")
/** @pdOid a2c7e55f-a5c5-4b43-8ffd-da64e917207f */
public class HuizhiCardPerson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    /** @pdOid a804b6d6-ddfb-4c7f-ad41-135e7c2cd321 */
    public int id;
    /** @pdOid 7d81e687-2dbb-461c-9616-b627831022fa */
    public java.lang.String username;
    /** @pdOid 06ba3dc1-1739-432b-8bfa-c6b6fbdf4580 */
    public java.lang.String email;
    /** @pdOid bf7bf4de-ec93-4ce7-932f-dc3976c56849 */
    public java.lang.String company;
    /** @pdOid 03628df8-75b2-4aa5-a245-71f127818e74 */
    public java.lang.String realname;
    /** @pdOid 3f29c92a-258c-4292-a0e9-5e17fcbd29e5 */
    public java.lang.String idcard;
    /** @pdOid f26140d4-0c3c-49ea-bf2b-b926e1ba18d1 */
    public java.lang.String contact;
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    /** @pdOid 77765aa6-4ad9-441d-a49b-b5252b660c18 */
    public java.util.Date createTime;

    public java.lang.String sn;
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    public java.util.Date getTime;
    /**
     *  0待处理1受理中2审核通过3审核不通过4中止
     */
    public int status;

    public java.lang.String mark;

    /** @pdOid f5af57cb-61b0-4ee9-984e-b53b2928a391 */
    public int getId() {
        return id;
    }

    /** @param newId
     * @pdOid 1edfd6a6-b425-4244-a24b-d3510b2b5620 */
    public void setId(int newId) {
        id = newId;
    }

    /** @pdOid 8bde0c19-69a1-4298-ad0a-ee1344244492 */
    public java.lang.String getUsername() {
        return username;
    }

    /** @param newUsername
     * @pdOid ad23573f-9693-4a15-9fc7-d79d25b0c647 */
    public void setUsername(java.lang.String newUsername) {
        username = newUsername;
    }

    /** @pdOid ceec5094-1069-48d7-9b85-a55541de1160 */
    public java.lang.String getEmail() {
        return email;
    }

    /** @param newEmail
     * @pdOid a48528e1-6fd8-4445-a080-b11fc744fff9 */
    public void setEmail(java.lang.String newEmail) {
        email = newEmail;
    }

    /** @pdOid 34c25c7f-47fb-4c13-9775-c7a8ba18c9c0 */
    public java.lang.String getCompany() {
        return company;
    }

    /** @param newCompany
     * @pdOid ed5c5e09-aaf1-4e50-ab34-425bfe591b8f */
    public void setCompany(java.lang.String newCompany) {
        company = newCompany;
    }

    /** @pdOid 1e5ad52a-c58a-482c-91c3-224797b2f669 */
    public java.lang.String getRealname() {
        return realname;
    }

    /** @param newRealname
     * @pdOid cb78d3c1-0e02-4140-bf00-45791206aad4 */
    public void setRealname(java.lang.String newRealname) {
        realname = newRealname;
    }

    /** @pdOid f04a0f1f-cfb1-4a0e-b7df-5ad51a0757f7 */
    public java.lang.String getIdcard() {
        return idcard;
    }

    /** @param newIdcard
     * @pdOid 833e52c2-1b46-45fb-84d9-48963b6ef489 */
    public void setIdcard(java.lang.String newIdcard) {
        idcard = newIdcard;
    }

    /** @pdOid 572bd72b-8055-4104-8c97-79fe788b2bec */
    public java.lang.String getContact() {
        return contact;
    }

    /** @param newContact
     * @pdOid 61f06c11-3f78-490b-979f-b5ffcbfd508b */
    public void setContact(java.lang.String newContact) {
        contact = newContact;
    }

    /** @pdOid 9c05a25a-7a4f-4e93-a81c-271e77c067f7 */
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    public java.util.Date getCreateTime() {
        return createTime;
    }

    /** @param newCreateTime
     * @pdOid ade1e8db-184b-44b3-8bbf-bae37de1d830 */
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
