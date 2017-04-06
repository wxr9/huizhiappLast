package com.wiseonline.Domain;

/***********************************************************************
 * Module:  Sale3rdMain.java
 * Author:  R7tech
 * Purpose: Defines the Class Sale3rdMain
 ***********************************************************************/

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.io.Serializable;
import java.util.*;

/** @pdOid a2adc705-b872-4c0c-9d1b-50d0ee9b6c3d */
@Entity
@DynamicInsert(true)
@DynamicUpdate(true)
@Table(name = "sale_3rd_main")
public class Sale3rdMain {

    /**
     * @pdOid 93e52e59-63ce-4303-b75c-697467144791
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "objectid")
    public int id;
    /**
     * @pdOid 37dfaa92-7a37-4ad8-b199-dc9dfa66fee0
     */
    public java.lang.String name;

    @OneToMany(targetEntity = Sale3rdChild.class,cascade = CascadeType.ALL,mappedBy = "sale3rdMain",fetch = FetchType.LAZY)
    private Set<Sale3rdChild> childList;

    /**
     * @pdOid 6ff81c94-5a48-4c1a-bfe4-2ac06cc0369d
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    public java.util.Date startDate;

    /**
     * @pdOid 577b735b-5f26-4972-ae6a-3e9b8e5a68c4
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    public java.util.Date endDate;
    /**
     * @pdOid 34da939c-3870-46fc-954b-e17f4dd8af16
     */
    public java.lang.String content;


    public int type;

    @ManyToOne
    @JoinColumn(name = "type",insertable = false, updatable = false)
    private SettingDict sDict;
    /**
     * @pdOid e9b653fe-a239-48fd-8fbf-8b9bcbf47753
     */
    public java.util.Date createTime;

    /** @pdOid e19f2455-183e-4643-9e7d-88fb9bf6378d */
    public int getId() {
        return id;
    }

    /** @param newId
     * @pdOid 0b9e9450-8cf0-4122-9d36-06ff239fa680 */
    public void setId(int newId) {
        id = newId;
    }

    /** @pdOid fed15069-80b6-4f50-b64b-106689c6053f */
    public java.lang.String getName() {
        return name;
    }

    /** @param newName
     * @pdOid 2ad4ef9a-2029-409c-b268-29e35b9fadad */
    public void setName(java.lang.String newName) {
        name = newName;
    }

    /** @pdOid dc69933a-0fc9-433a-b6c2-55548397f740 */
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    public java.util.Date getStartDate() {
        return startDate;
    }

    /** @param newStartDate
     * @pdOid 1f710490-8bb9-408e-b8f6-abb5ab2cd85f */
    public void setStartDate(java.util.Date newStartDate) {
        startDate = newStartDate;
    }

    /** @pdOid 01ddfc59-af44-4796-a0ce-e2731fb9cb6f */
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    public java.util.Date getEndDate() {
        return endDate;
    }

    /** @param newEndDate
     * @pdOid c3b452fc-4283-4ba3-acc1-de9403e634d5 */
    public void setEndDate(java.util.Date newEndDate) {
        endDate = newEndDate;
    }

    /** @pdOid ccb6fcd8-61b9-40d7-8960-828e448beffd */
    public java.lang.String getContent() {
        return content;
    }

    /** @param newContent
     * @pdOid 32202f0e-dce7-48cd-8d28-2041a62fa0ee */
    public void setContent(java.lang.String newContent) {
        content = newContent;
    }

    /** @pdOid 25df1502-61f9-44a6-b757-37a4c828cf56 */
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    public java.util.Date getCreateTime() {
        return createTime;
    }

    /** @param newCreateTime
     * @pdOid 45ac2da5-0fee-462a-b475-904960226668 */
    public void setCreateTime(java.util.Date newCreateTime) {
        createTime = newCreateTime;
    }

    public Set<Sale3rdChild> getChildList() {
        return childList;
    }

    public void setChildList(Set<Sale3rdChild> childList) {
        this.childList = childList;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public SettingDict getsDict() {
        return sDict;
    }

    public void setsDict(SettingDict sDict) {
        this.sDict = sDict;
    }
}