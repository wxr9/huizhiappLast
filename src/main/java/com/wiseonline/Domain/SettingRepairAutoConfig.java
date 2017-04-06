/***********************************************************************
 * Module:  SettingRepairAutoConfig.java
 * Author:  R7tech
 * Purpose: Defines the Class SettingRepairAutoConfig
 ***********************************************************************/
package com.wiseonline.Domain;
import javax.persistence.*;

/** 物业报修自动分配设置
 * 
 * @pdOid 2e261e41-4fca-4cf2-bc0b-28e847417740 */
@Entity
@Table(name = "setting_repair_autoconfig")
public class SettingRepairAutoConfig {
   /** @pdOid 356288e0-1a18-42c9-8f8a-da319aa99a50 */
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   public int objectid;

   public int parkId;

   public int buildingId;

   @Transient
   public String buildingName;

   @Transient
   public String parkName;

   @Transient
   public String acceptor;

   public String acceptorId;


   public int getObjectid() {
      return objectid;
   }

   public void setObjectid(int objectid) {
      this.objectid = objectid;
   }

   public int getParkId() {
      return parkId;
   }

   public void setParkId(int parkId) {
      this.parkId = parkId;
   }

   public int getBuildingId() {
      return buildingId;
   }

   public void setBuildingId(int buildingId) {
      this.buildingId = buildingId;
   }

   public String getAcceptorId() {
      return acceptorId;
   }

   public void setAcceptorId(String acceptorId) {
      this.acceptorId = acceptorId;
   }

   public String getParkName() {
      return parkName;
   }

   public void setParkName(String parkName) {
      this.parkName = parkName;
   }

   public String getBuildingName() {
      return buildingName;
   }

   public void setBuildingName(String buildingName) {
      this.buildingName = buildingName;
   }

   public String getAcceptor() {
      return acceptor;
   }

   public void setAcceptor(String acceptor) {
      this.acceptor = acceptor;
   }
}