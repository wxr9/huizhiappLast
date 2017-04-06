package com.wiseonline.Domain; /***********************************************************************
 * Module:  Attachment.java
 * Author:  R7tech
 * Purpose: Defines the Class Attachment
 ***********************************************************************/

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "Attachment")
/***********************************************************************
 * Module:  Attachment.java
 * Author:  R7tech
 * Purpose: Defines the Class Attachment
 ***********************************************************************/

/** 附件、素材表
 *
 * @pdOid 198a7a70-8b7a-417d-8acf-6564502f8d4c */
public class Attachment {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   /** @pdOid 0f133aaf-d561-41a0-a191-c364a521d2d1 */
   private long objectid;
   /** 上传者
    *
    * @pdOid 47f08688-29d8-476d-8aa6-d196bae173d2 */
   private java.lang.String author;
   /** 文件名
    *
    * @pdOid 9e9883c8-70bd-4318-aacf-38e59b1ba8ce */
   private java.lang.String fileName;
   /** 上传时间
    *
    * @pdOid b21f5a1b-636a-49b4-9202-d118912fbfa1 */
   private java.util.Date createTime;
   /** 保存路径
    *
    * @pdOid 7c9becb9-64d1-4d9e-a28d-450a1c4cd2f6 */
   private java.lang.String urlSave;
   /** 附件类型:voice:语音;image:图片;video:视频;other:其它
    *
    * @pdOid 6d69295d-aeb3-405c-add2-01e13b986373 */
   private java.lang.String type;

   /** @pdOid c159059e-7ded-4406-ba2b-0208c5f52926 */
   public long getObjectid() {
      return objectid;
   }

   /** @param newObjectid
    * @pdOid a867235e-38cf-49a2-9a47-20deb8f95db3 */
   public void setObjectid(long newObjectid) {
      objectid = newObjectid;
   }

   /** @pdOid 360eabaa-740c-4132-a29b-1bd08fe504d5 */
   public java.lang.String getAuthor() {
      return author;
   }

   /** @param newAuthor
    * @pdOid 9bdf5cdd-3ed9-4e36-b76c-f22a6960a37f */
   public void setAuthor(java.lang.String newAuthor) {
      author = newAuthor;
   }

   /** @pdOid 6d79741c-f7e9-4dbd-8653-e3f35673c8af */
   public java.lang.String getFileName() {
      return fileName;
   }

   /** @param newFileName
    * @pdOid 8f282d9a-4292-4226-8148-b90566922fea */
   public void setFileName(java.lang.String newFileName) {
      fileName = newFileName;
   }

   /** @pdOid 2355df74-2df5-4afe-a91a-46cc14cf2064 */
   public java.util.Date getCreateTime() {
      return createTime;
   }

   /** @param newCreateTime
    * @pdOid 85bb3c0b-3d71-440e-bd16-1ffcec22f47e */
   public void setCreateTime(java.util.Date newCreateTime) {
      createTime = newCreateTime;
   }

   /** @pdOid 16463778-4491-4083-bbea-ac499526bfce */
   public java.lang.String getUrlSave() {
      return urlSave;
   }

   /** @param newUrlSave
    * @pdOid ded8288f-e202-4024-ac26-23b1cc598612 */
   public void setUrlSave(java.lang.String newUrlSave) {
      urlSave = newUrlSave;
   }

   /** @pdOid f382c5df-dca9-42b2-aa5e-89e1ceb54c86 */
   public java.lang.String getType() {
      return type;
   }

   /** @param newType
    * @pdOid ba191c95-4822-4419-bce4-7ac282b2084a */
   public void setType(java.lang.String newType) {
      type = newType;
   }

}