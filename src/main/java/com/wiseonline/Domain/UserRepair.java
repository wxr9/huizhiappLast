package com.wiseonline.Domain; /***********************************************************************
 * Module:  UserRepair.java
 * Author:  R7tech
 * Purpose: Defines the Class UserRepair
 ***********************************************************************/

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.wiseonline.Utils.CustomDateSerializer;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import javax.persistence.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/** 用户报修表
 * 
 * @pdOid 1a902613-afb0-444c-a914-1b9af4e6d953 */
@Entity
@DynamicInsert(true)
@DynamicUpdate(true)
@Table(name = "user_repair")
public class UserRepair {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   /** @pdOid 03aebad3-f1b2-4edc-8229-39b4405547b1 */
   private int objectid;
   /** 报修流水号
    * 
    * @pdOid cb41b442-c173-4a46-a4eb-4357c1aa13e8 */
   private String serialNumber;
   /** @pdOid d9f9e85a-a441-44a3-ab96-641ce4ce45df */
   private Date createDate;

   private Date acceptDate;
   //预约时间
   private Date appointDate;


   /** 报修申请人
    * 
    * @pdOid bf0576eb-47da-4f8c-b06e-e72248382492 */

   private String applicant;

   //座机号
   /** @pdOid 3d9145cd-ce27-437d-a9bd-bb54dd053f93 */
   private String contact;
   //手机号
   private String mobile;

   /** 1: 物业报修设置                        2:IT网络报修设置
    * 
    * @pdOid 45a1f66b-fd5a-46a0-906e-86403b7f43bd */
   private short typeId;

   /*
   报修类型
    */
   @Transient
   private int repairType;

   @ManyToOne(targetEntity = SettingDict.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
   @JoinColumn(name = "repairType")
   @NotFound(action = NotFoundAction.IGNORE)
   private SettingDict repairTypeDetail;

   /*
   确认的报修类型
    */
   @Transient
   private int repairTypeConfm;

   @ManyToOne(targetEntity = SettingDict.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
   @JoinColumn(name = "repairTypeConfm")
   @NotFound(action = NotFoundAction.IGNORE)
   private SettingDict repairTypeConfmDetail;

   @Transient
   private int repairTypeConfmParentId;

   @Transient
   private int parkId;

   @ManyToOne(targetEntity = Park.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
   @JoinColumn(name = "parkId")
   @NotFound(action = NotFoundAction.IGNORE)
   private Park park;

   /** @pdOid fc612e2e-299e-40bc-a38e-edb89262a13c */
   @Transient
   private int buildingId;

   @ManyToOne(targetEntity = Building.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
   @JoinColumn(name = "buildingId")
   @NotFound(action = NotFoundAction.IGNORE)
   private Building building;

   @Transient
   private int buildingIdTypeConfm;

   @ManyToOne(targetEntity = Building.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
   @JoinColumn(name = "buildingIdTypeConfm")
   @NotFound(action = NotFoundAction.IGNORE)
   private Building buildingConfmDetail;

   /** @pdOid e7bc9402-30f7-40e4-9579-24acbb0fc78a */
   private String company;
   /** @pdOid f2694105-2f21-4ea8-82a1-a43f5812c566 */
   private String address;
   /** @pdOid e2e24f2f-0b0f-46c1-b389-caaf925d2af3 */
   private String description;

   private String descriptionConfm;

   /** @pdOid b0a1cfe9-0aa4-4acd-bdf6-1f8afb2d63e3 */
   private String photoUrl;
   /** @pdOid 1e194048-9b75-4486-937a-5d8f08b8670a */
   private String voiceUrl;
   /** @pdOid 8b8da235-8d9d-447f-8c41-7e0bcdbe1585 */
   private String memo;


   @Column(name = "chinese_name")
   private String chineseName;


   public int getObjectid() {
      return objectid;
   }

   public void setObjectid(int objectid) {
      this.objectid = objectid;
   }

   public String getSerialNumber() {
      return serialNumber;
   }

   public void setSerialNumber(String serialNumber) {
      this.serialNumber = serialNumber;
   }
   @Temporal(TemporalType.TIMESTAMP)
   @Column(nullable=false)
   @JsonSerialize(using = CustomDateSerializer.class)
   public Date getCreateDate() {
      return createDate;
   }

   public void setCreateDate(Date createDate) {
      this.createDate = createDate;
   }
   @Temporal(TemporalType.TIMESTAMP)
   @Column(nullable=false)
   @JsonSerialize (using = CustomDateSerializer.class)
   public Date getAcceptDate() {
      return acceptDate;
   }

   public void setAcceptDate(Date acceptDate) {
      this.acceptDate = acceptDate;
   }

   public String getApplicant() {
      return applicant;
   }

   public void setApplicant(String applicant) {
      this.applicant = applicant;
   }

   public String getContact() {
      return contact;
   }

   public void setContact(String contact) {
      this.contact = contact;
   }

   public short getTypeId() {
      return typeId;
   }

   public void setTypeId(short typeId) {
      this.typeId = typeId;
   }

   public int getRepairType() {
      if (repairTypeDetail != null){
         return repairTypeDetail.getObjectid();
      }else {
         return repairType;
      }
   }

   public void setRepairType(int repairType) {
      this.repairType = repairType;
   }

   public SettingDict getRepairTypeDetail() {
      return repairTypeDetail;
   }

   public void setRepairTypeDetail(SettingDict repairTypeDetail) {
      this.repairTypeDetail = repairTypeDetail;
   }

   public int getRepairTypeConfm() {
      if (repairTypeConfmDetail != null){
         return repairTypeConfmDetail.getObjectid();
      }else {
         return repairTypeConfm;
      }
   }

   public void setRepairTypeConfm(int repairTypeConfm) {
      this.repairTypeConfm = repairTypeConfm;
   }

   public SettingDict getRepairTypeConfmDetail() {
      return repairTypeConfmDetail;
   }

   public void setRepairTypeConfmDetail(SettingDict repairTypeConfmDetail) {
      this.repairTypeConfmDetail = repairTypeConfmDetail;
   }

   public int getParkId() {
      if (park != null){
         return park.getObjectid();
      }else {
         return parkId;
      }
   }

   public void setParkId(int parkId) {
      this.parkId = parkId;
   }

   public Park getPark() {
      return park;
   }

   public void setPark(Park park) {
      this.park = park;
   }

   public int getBuildingId() {
      if (building != null){
         return building.getObjectid();
      }else {
         return buildingId;
      }
   }

   public void setBuildingId(int buildingId) {
      this.buildingId = buildingId;
   }

   public Building getBuilding() {
      return building;
   }

   public void setBuilding(Building building) {
      this.building = building;
   }

   public String getCompany() {
      return company;
   }

   public void setCompany(String company) {
      this.company = company;
   }

   public String getAddress() {
      return address;
   }

   public void setAddress(String address) {
      this.address = address;
   }

   public String getDescription() {
      return description;
   }

   public void setDescription(String description) {
      this.description = description;
   }

   public String getDescriptionConfm() {
      return descriptionConfm;
   }

   public void setDescriptionConfm(String descriptionConfm) {
      this.descriptionConfm = descriptionConfm;
   }

   public String getPhotoUrl() {
      return photoUrl;
   }

   public void setPhotoUrl(String photoUrl) {
      this.photoUrl = photoUrl;
   }

   public String getVoiceUrl() {
      return voiceUrl;
   }

   public void setVoiceUrl(String voiceUrl) {
      this.voiceUrl = voiceUrl;
   }

   public String getMemo() {
      return memo;
   }

   public void setMemo(String memo) {
      this.memo = memo;
   }

   public void setRepairTypeConfmParentId(int repairTypeConfmParentId) {
      this.repairTypeConfmParentId = repairTypeConfmParentId;
   }

   public int getRepairTypeConfmParentId() {
      if (repairTypeConfmDetail != null){
         return repairTypeConfmDetail.getParentid();
      }
      return repairTypeConfmParentId;
   }

   public String getChineseName() {
      return chineseName;
   }

   public void setChineseName(String chineseName) {
      this.chineseName = chineseName;
   }

   public int getBuildingIdTypeConfm() {
      if (buildingConfmDetail != null){
         return buildingConfmDetail.getObjectid();
      }else {
         return buildingIdTypeConfm;
      }
   }

   public void setBuildingIdTypeConfm(int buildingIdTypeConfm) {
      this.buildingIdTypeConfm = buildingIdTypeConfm;
   }

   public Building getBuildingConfmDetail() {
      return buildingConfmDetail;
   }

   public void setBuildingConfmDetail(Building buildingConfmDetail) {
      this.buildingConfmDetail = buildingConfmDetail;
   }

   public String getMobile() {
      return mobile;
   }

   public void setMobile(String mobile) {
      this.mobile = mobile;
   }

   @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
   public Date getAppointDate() {
      return appointDate;
   }

   public void setAppointDate(String appointDate) {
      SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd HH:mm");
      try{
         if (appointDate==null){
            return;
         }
         Date da = sdf.parse(appointDate);
         this.appointDate = da;
      }catch (ParseException e){

      }
   }
}