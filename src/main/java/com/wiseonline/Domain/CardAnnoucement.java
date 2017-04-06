package com.wiseonline.Domain;

/**
 * Created by R7tech on 5/3/2016.
 */
/***********************************************************************
 * Module:  ActivityApply.java
 * Author:  R7tech
 * Purpose: Defines the Class ActivityApply
 ***********************************************************************/

import com.fasterxml.jackson.annotation.JsonFormat;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.util.Date;

/** 活动中心报名表
 *
 * @pdOid 6199bd63-9ca9-4c75-8620-58151a7cd100 */
@Entity
@DynamicInsert(true)
@DynamicUpdate(true)
@Table(name = "card_annoucement")
public class CardAnnoucement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int objectid;

    public String username;

    /**
     * 开始时间
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    public java.util.Date startTime;

    /**
     * 结束时间
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    public java.util.Date endTime;

    /**
     * 活动内容
     */
    public java.lang.String content;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    public Date createTime;

    public int getObjectid() {
        return objectid;
    }

    public void setObjectid(int objectid) {
        this.objectid = objectid;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }
}
