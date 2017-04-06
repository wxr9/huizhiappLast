package com.wiseonline.Domain;

/**
 * Created by R7tech on 2/25/2016.
 */

import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.text.SimpleDateFormat;

/***********************************************************************
 * Module:  LoginLog.java
 * Author:  R7tech
 * Purpose: Defines the Class LoginLog
 ***********************************************************************/
@Entity
@DynamicInsert(true)
@DynamicUpdate(true)
@Table(name = "login_log")
/** 用户登录表
 *
 * @pdOid 274029c2-1050-4d2b-b297-7f5ac9d497c9 */
public class LoginLog {
    /** @pdOid fc5d2dd7-204a-4e5b-a821-b428b3282698 */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int id;
    /** @pdOid 823f22d9-030f-45c8-99dd-8f0e252fced0 */
    public java.lang.String userName;
    /** @pdOid 3c0349ef-0a4e-47f8-909e-af734ee9d8ea */
    public java.util.Date createTime;
    /** @pdOid 67dc4951-3408-4d6a-8c1f-bf68175e14e3 */
    public java.lang.String browser;

    public java.lang.String ipAddr;

    public java.lang.String status;

    /** @pdOid ed14c2a0-149b-4bc0-804d-36a414fa7e2b */
    public java.lang.String getBrowser() {
        return browser;
    }

    /** @param newBrowser
     * @pdOid c582dc65-5192-4d95-8652-9695e2e3fa86 */
    public void setBrowser(java.lang.String newBrowser) {
        browser = newBrowser;
    }

    /** @pdOid ad3d9c4d-38a3-47c5-ab4f-014292423724 */
    public int getId() {
        return id;
    }

    /** @param newId
     * @pdOid b5619e0c-90c8-4fa9-9c0f-113ad89d41f9 */
    public void setId(int newId) {
        id = newId;
    }

    /** @pdOid f3f9e673-88f2-4452-a2b4-2fe7b90347b5 */
    public java.lang.String getUserName() {
        return userName;
    }

    /** @param newUserName
     * @pdOid e7611fc6-2e8b-40b1-a6b3-381113ef48d1 */
    public void setUserName(java.lang.String newUserName) {
        userName = newUserName;
    }

    /** @pdOid b21156bb-f7fb-4a59-9113-1caefc400c28 */
    public String getCreateTime() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return sdf.format(createTime);
    }

    /** @param newCreateTime
     * @pdOid d70fdd11-bc24-41b7-9f4b-c89c02104baf */
    public void setCreateTime(java.util.Date newCreateTime) {
        createTime = newCreateTime;
    }

    public String getIpAddr() {
        return ipAddr;
    }

    public void setIpAddr(String ipAddr) {
        this.ipAddr = ipAddr;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}