/***********************************************************************
 * Module:  SettingRepairManConfig.java
 * Author:  R7tech
 * Purpose: Defines the Class SettingRepairManConfig
 ***********************************************************************/
package com.wiseonline.Domain;

import javax.persistence.*;

/** 维修工程师设置
 * 
 * @pdOid 1193c31c-a28b-4065-8867-3669668f6722 */
@Entity
@Table(name = "setting_repair_manconfig")
public class SettingRepairManConfig {
   /** @pdOid f7c6b791-bad3-44c5-8850-be416c9b7f8a */
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private int objectid;
   /** 0: 物业报修设置
    *             1:IT网络报修设置
    * 
    * @pdOid b8ef1d3a-e55e-4e46-8740-7285b103c9da */
   public int repairType;
   /** @pdOid 91b79a3a-0e8f-468b-9920-07aa51ff8591 */
   private java.lang.String name;
   /** @pdOid 5d9a20e5-1349-44b9-b32a-5b632938416c */
   private java.lang.String mobile;
   /** @pdOid d099158c-6fbd-4324-bf5b-ad41263b63d1 */
   private String jobType;
   /**
    * 所属部门
    */
   private String department;
   

   
   /** @pdOid 0de3e83a-20ca-4ca2-a858-ec4855e8e005 */
   public int getObjectid() {
      return objectid;
   }
   
   /** @param newObjectid
    * @pdOid 9629a2d0-498d-42d0-b99c-a93f35e99710 */
   public void setObjectid(int newObjectid) {
      objectid = newObjectid;
   }
   
   /** @pdOid 8ee64cf7-b4f9-43e6-a3c5-92ea2f0e835e */
   public int getRepairType() {
      return repairType;
   }
   
   /** @param newRepairType
    * @pdOid 0ae16296-32d5-427f-b632-6eebe8feec74 */
   public void setRepairType(int newRepairType) {
      repairType = newRepairType;
   }
   
   /** @pdOid fa0e3b5e-1cd0-48b1-8fa9-0e2dce956432 */
   public java.lang.String getName() {
      return name;
   }
   
   /** @param newName
    * @pdOid 3cb96857-ec66-4ea3-a4d2-1a508d4696d2 */
   public void setName(java.lang.String newName) {
      name = newName;
   }
   
   /** @pdOid f8dfdbb0-2668-4d84-8af6-dde2a50dcd5e */
   public java.lang.String getMobile() {
      return mobile;
   }
   
   /** @param newMobile
    * @pdOid 8eb1dcf0-c407-4e98-937f-0f199fd321f5 */
   public void setMobile(java.lang.String newMobile) {
      mobile = newMobile;
   }
   
   /** @pdOid 5ed54eb0-5f67-4d9d-80e5-8e6e69ae769a */
   public String[] getJobType() {
      return jobType.split(",");
   }
   
   /** @param newJobType
    * @pdOid b8c79666-5bdf-4b50-8616-c9e1406c2a2b */
   public void setJobType(String[] newJobType) {
      StringBuffer sb = new StringBuffer();
      for(int i =0;i<newJobType.length;i++){
         if(i!=0 && i<newJobType.length)
         {
            sb.append(",");
         }
         sb.append(newJobType[i]);
      }
      jobType = sb.toString();
   }

   public String getDepartment() {
      return department;
   }

   public void setDepartment(String department) {
      this.department = department;
   }
}