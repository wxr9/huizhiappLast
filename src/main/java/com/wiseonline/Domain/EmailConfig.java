package com.wiseonline.Domain;

/***********************************************************************
 * Module:  EmailConfig.java
 * Author:  R7tech
 * Purpose: Defines the Class EmailConfig
 ***********************************************************************/

import javax.persistence.*;
import java.util.*;

/** @pdOid 450ebd4a-6b02-44ed-b053-3f7e2abe51af */
@Entity
@Table(name = "email_config")
public class EmailConfig {
    /** @pdOid d14db337-132e-47a1-9552-90199b1985e2 */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int objectid;
    /** @pdOid bdc81c47-b960-4659-a9f8-97de19685c00 */
    public java.lang.String hostName;
    /** @pdOid c0c8f11f-4251-4a0f-be00-918362550e51 */
    public java.lang.String account;
    /** @pdOid d953278d-4d1e-47d2-ad5f-e9945768f270 */
    public java.lang.String password;
    /** @pdOid 1353ba5b-3c44-4198-98e7-f546fb80250b */
    public int enable;

    /** @pdOid 58943b49-f058-4f66-ac90-47c65d5d7581 */
    public int getObjectid() {
        return objectid;
    }

    /** @param newObjectid
     * @pdOid fc4a353a-de5c-41d5-a3cd-c10343404d62 */
    public void setObjectid(int newObjectid) {
        objectid = newObjectid;
    }

    /** @pdOid 19f7c322-5a2d-4df5-86df-34d46c08127b */
    public java.lang.String getHostName() {
        return hostName;
    }

    /** @param newHostName
     * @pdOid 685e3a34-8c9b-4a1a-8262-f1407e913a11 */
    public void setHostName(java.lang.String newHostName) {
        hostName = newHostName;
    }

    /** @pdOid d8ecb7f9-ded4-4e83-9bc5-af589e92e29c */
    public java.lang.String getAccount() {
        return account;
    }

    /** @param newAccount
     * @pdOid b0e876bd-6571-4cfc-969e-65b79957dc4b */
    public void setAccount(java.lang.String newAccount) {
        account = newAccount;
    }

    /** @pdOid 3b5a62bb-569f-4cc6-bd27-e5a1467007e6 */
    public java.lang.String getPassword() {
        return password;
    }

    /** @param newPassword
     * @pdOid be944998-1a9a-4c32-b444-820c2538e46f */
    public void setPassword(java.lang.String newPassword) {
        password = newPassword;
    }

    /** @pdOid eb8562fd-6c04-42b5-82d2-e30f760e7cc9 */
    public int getEnable() {
        return enable;
    }

    /** @param newEnable
     * @pdOid abef472c-2973-498c-b335-8e193e752215 */
    public void setEnable(int newEnable) {
        enable = newEnable;
    }

}
