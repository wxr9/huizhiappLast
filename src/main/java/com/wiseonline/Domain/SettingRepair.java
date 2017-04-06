/***********************************************************************
 * Module:  SettingRepair.java
 * Author:  R7tech
 * Purpose: Defines the Class SettingRepair
 ***********************************************************************/
package com.wiseonline.Domain;
import javax.persistence.*;

/** 报修设置
 * 
 * @pdOid d7180531-1472-4341-bb75-545f5bbb2764 */
@Entity
@Table(name = "setting_repair")
public class SettingRepair {
   /** @pdOid 3d0fc254-d594-4fa2-bf59-4fdb7846f237 */
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private int objectid;
   /** 0: 物业报修设置
    *             1:IT网络报修设置
    * 
    * @pdOid 37642baa-38c1-4f68-81ad-de0a3bd416d6 */
   private short repairType;
   /** @pdOid 733fc24e-76db-43f7-acc0-e83c8f3ed1a1 */
   private short baseEnable;

   @Transient
   private java.lang.String baseTermName;
   /** @pdOid 85357906-fa03-4584-9d3f-65140bd63db8 */

   private int baseTerm;
   /** @pdOid eaafd57f-5621-4471-8d51-a69906c942f5 */
   @Column(name = "work_startTime")
   private java.lang.String workStartTime;
   /** @pdOid ad3eeba8-0f88-49e4-9a95-d2e6ce2fe37f */
   @Column(name = "work_endTime")
   private java.lang.String workEndTime;
   /** @pdOid d62f0390-bad2-4425-a5ed-27e83022c35d */
   @Column(name = "nonWork_startTime")
   private java.lang.String nonWorkStartTime;
   /** @pdOid 3b3d0703-334c-4d59-ba15-d4c61b0fc9b7 */
   @Column(name = "nonWork_endTime")
   private java.lang.String nonWorkEndTime;
   /** @pdOid 6213bbda-4d33-4282-9b55-2a17f5dd00d5 */
   private java.lang.String alertInfo;
   /** @pdOid 58274747-9ded-4fe7-bf99-030669aba53f */
   @Column(name = "autoComment_Deadline")
   private int autoCommentDeadline;
   /** @pdOid 64fafc27-e7d5-4062-9dce-c16669c7338a */
   @Column(name = "autoComment_Speed")
   private short autoCommentSpeed;
   /** @pdOid 8a727bbb-96a5-465d-8193-6eef14ba4fbf */
   @Column(name = "autoComment_Attitude")
   private short autoCommentAttitude;
   /** @pdOid 4a034bf2-8961-4ff2-aa1b-0dde2a66bb22 */
   @Column(name = "autoComment_Quality")
   private short autoCommentQuality;
   /** @pdOid 7f2a0b5c-2aa8-4daa-bfdc-ece56a86e614 */
   @Column(name = "autoComment_Info")
   private java.lang.String autoCommentInfo;
   
   /** @pdOid c2497071-45e1-453b-b336-acd2e7950c48 */
   public long getObjectid() {
      return objectid;
   }
   
   /** @param newObjectid
    * @pdOid 3fe1f123-8efb-42c8-8f3e-1cfab5f95d16 */
   public void setObjectid(int newObjectid) {
      objectid = newObjectid;
   }
   
   /** @pdOid 1f50ded8-b8f8-4443-ac7f-ecdbd9870009 */
   public short getRepairType() {
      return repairType;
   }
   
   /** @param newRepairType
    * @pdOid eaf33a84-4561-4b86-aaea-591159814cb2 */
   public void setRepairType(short newRepairType) {
      repairType = newRepairType;
   }
   
   /** @pdOid 6e7467f1-d507-4641-ab79-33e9bb96f8a4 */
   public short getBaseEnable() {
      return baseEnable;
   }
   
   /** @param newBaseEnable
    * @pdOid 45dc5166-768d-46f2-a728-9b4bc0f84b50 */
   public void setBaseEnable(short newBaseEnable) {
      baseEnable = newBaseEnable;
   }
   
   /** @pdOid 2c4f936a-495a-475b-83df-57f52d6d5066 */
   public int getBaseTerm() {
      return baseTerm;
   }
   
   /** @param newBaseTerm
    * @pdOid d8ea7882-a096-42a4-bf33-cc55240bf1e1 */
   public void setBaseTerm(int newBaseTerm) {
      baseTerm = newBaseTerm;
   }
   
   /** @pdOid 689430c2-d6b7-4435-a2b7-2466cad9c927 */
   public java.lang.String getWorkStartTime() {
      return workStartTime;
   }
   
   /** @param newWorkStartTime
    * @pdOid c1ba0c78-33c0-45bd-bc06-1bec931e43b8 */
   public void setWorkStartTime(java.lang.String newWorkStartTime) {
      workStartTime = newWorkStartTime;
   }
   
   /** @pdOid 60ccef30-ca89-467d-b62d-6eb94bad46e0 */
   public java.lang.String getWorkEndTime() {
      return workEndTime;
   }
   
   /** @param newWorkEndTime
    * @pdOid 83f70f5b-022d-499a-8970-ee9968969866 */
   public void setWorkEndTime(java.lang.String newWorkEndTime) {
      workEndTime = newWorkEndTime;
   }
   
   /** @pdOid 22c3476b-8617-4c8d-abe6-b8cec9402985 */
   public java.lang.String getNonWorkStartTime() {
      return nonWorkStartTime;
   }
   
   /** @param newNonWorkStartTime
    * @pdOid d06164f8-c812-44e7-b2b9-e1a62644eb38 */
   public void setNonWorkStartTime(java.lang.String newNonWorkStartTime) {
      nonWorkStartTime = newNonWorkStartTime;
   }
   
   /** @pdOid b0ed7299-fee9-4976-80d3-c0816e9fd7b5 */
   public java.lang.String getNonWorkEndTime() {
      return nonWorkEndTime;
   }
   
   /** @param newNonWorkEndTime
    * @pdOid efb8c763-4d42-479b-821f-499bd94df6d0 */
   public void setNonWorkEndTime(java.lang.String newNonWorkEndTime) {
      nonWorkEndTime = newNonWorkEndTime;
   }
   
   /** @pdOid 2c128dd8-e992-419f-ac1a-4365d7f8c659 */
   public java.lang.String getAlertInfo() {
      return alertInfo;
   }
   
   /** @param newAlertInfo
    * @pdOid 17965b9c-d514-4370-b909-a325dbf5909b */
   public void setAlertInfo(java.lang.String newAlertInfo) {
      alertInfo = newAlertInfo;
   }
   
   /** @pdOid cec7288e-00eb-4508-80b9-dfcf34e8ae0f */
   public int getAutoCommentDeadline() {
      return autoCommentDeadline;
   }
   
   /** @param newAutoCommentDeadline
    * @pdOid 43bf3ef0-0f77-4771-bc9f-06f6306f38e2 */
   public void setAutoCommentDeadline(int newAutoCommentDeadline) {
      autoCommentDeadline = newAutoCommentDeadline;
   }

   
   /** @pdOid d252ff7a-a2e8-4d15-940f-901d4e6058cb */
   public short getAutoCommentSpeed() {
      return autoCommentSpeed;
   }
   
   /** @param newAutoCommentSpeed
    * @pdOid 3d202d82-62db-4c53-9f3b-f745187a24a6 */
   public void setAutoCommentSpeed(short newAutoCommentSpeed) {
      autoCommentSpeed = newAutoCommentSpeed;
   }
   
   /** @pdOid 57b59956-8280-41e3-b0c4-e017717efb84 */
   public short getAutoCommentAttitude() {
      return autoCommentAttitude;
   }
   
   /** @param newAutoCommentAttitude
    * @pdOid 1d29de3a-227c-4ec8-ad27-25445fe12b04 */
   public void setAutoCommentAttitude(short newAutoCommentAttitude) {
      autoCommentAttitude = newAutoCommentAttitude;
   }
   
   /** @pdOid d8568139-84ef-4252-8ea4-13984b96f013 */
   public short getAutoCommentQuality() {
      return autoCommentQuality;
   }
   
   /** @param newAutoCommentQuality
    * @pdOid 5feedd53-ee74-4331-84c1-c009fb352bd1 */
   public void setAutoCommentQuality(short newAutoCommentQuality) {
      autoCommentQuality = newAutoCommentQuality;
   }
   
   /** @pdOid 25a98eb3-a6b0-4502-917d-694844e950e0 */
   public java.lang.String getAutoCommentInfo() {
      return autoCommentInfo;
   }
   
   /** @param newAutoCommentInfo
    * @pdOid 9e6043cf-1620-4f62-ae9f-12ca68c44fd4 */
   public void setAutoCommentInfo(java.lang.String newAutoCommentInfo) {
      autoCommentInfo = newAutoCommentInfo;
   }

   public String getBaseTermName() {
      return baseTermName;
   }
   public void setBaseTermName(String baseTermName) {
      this.baseTermName = baseTermName;
   }
}