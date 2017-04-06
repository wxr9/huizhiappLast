package com.wiseonline.Domain; /***********************************************************************
 * Module:  UserComment.java
 * Author:  R7tech
 * Purpose: Defines the Class UserComment
 ***********************************************************************/

import org.hibernate.annotations.LazyToOne;
import org.hibernate.annotations.LazyToOneOption;

import javax.persistence.*;
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;

/** 评论表
 * 
 * @pdOid 7944ed61-505a-4ed1-81bf-e77c6814c576 */
@Entity
@Table(name = "user_comment")
public class UserComment  implements Serializable {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private int objectid;

   /** @pdOid 2102c810-7da4-4197-8d15-e84acf80a4bb */
   private String serialNumber;
   /** 发表评论的用户ID
    * 
    * @pdOid ab411cfb-8e6f-4767-81eb-fc340f8aa72d */
   private String userid;
   /** 评论的内容
    * 
    * @pdOid 54bcd622-5a93-4ceb-b6e2-94c31a9820a7 */
   private String content;
   /** 评论打分项－－完成时间
    * 
    * @pdOid f47bb3db-d984-4cb7-93df-0185a246df36 */
   private short duration;
   /** 评论打分项－－工作态度
    * 
    * @pdOid deabc448-33d2-45b5-85c6-47e3b3564a92 */
   private short attitude;
   /** 评论打分项－－工作质量
    * 
    * @pdOid e2eb3b32-5a2c-4d51-91eb-a2dabf56bc68 */
   private short quality;


   private int businessId;

   public String businessType;

   @Transient
   private String bTypeChinese;


   //新增时间
   @Column(updatable = false,nullable=false,name = "createTime")
   private java.util.Date createTime = new Date();

   
   /** @pdOid 87b8ca9f-93cf-4710-957a-844cd0039eb4 */
   public String getUserid() {
      return userid;
   }
   
   /** @param newUserid
    * @pdOid 1f66eaff-2cb6-4459-94d9-eda45f5049a3 */
   public void setUserid(String newUserid) {
      userid = newUserid;
   }
   
   /** @pdOid 10d2b382-ed0b-4836-9db2-92cec860efe9 */
   public String getSerialNumber() {
      return serialNumber;
   }
   
   /** @param newSerialNumber
    * @pdOid 9b0021de-5a35-4d91-82af-3c06fef576a1 */
   public void setSerialNumber(String newSerialNumber) {
      serialNumber = newSerialNumber;
   }

   public String getContent() {
      return content;
   }

   public void setContent(String content) {
      this.content = content;
   }

   public short getDuration() {
      return duration;
   }

   public void setDuration(short duration) {
      this.duration = duration;
   }

   public short getAttitude() {
      return attitude;
   }

   public void setAttitude(short attitude) {
      this.attitude = attitude;
   }

   public short getQuality() {
      return quality;
   }

   public void setQuality(short quality) {
      this.quality = quality;
   }

   public String getCreateTime() {
      SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
      return sdf.format(createTime);
   }

   public void setCreateTime(Date createTime) {
      this.createTime = createTime;
   }


   public int getObjectid() {
      return objectid;
   }

   public void setObjectid(int objectid) {
      this.objectid = objectid;
   }

   public int getBusinessId() {
      return businessId;
   }

   public void setBusinessId(int businessId) {
      this.businessId = businessId;
   }

   public String getBusinessType() {
      return businessType;
   }

   public void setBusinessType(String businessType) {
      this.businessType = businessType;
   }

   public String getbTypeChinese() {
      return bTypeChinese;
   }

   public void setbTypeChinese(String bTypeChinese) {
      this.bTypeChinese = bTypeChinese;
   }
}