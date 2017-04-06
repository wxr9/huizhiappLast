package com.wiseonline.Domain;

import com.fasterxml.jackson.annotation.JsonFormat;

import javax.persistence.*;
import java.util.*;

/** 报修派工表
 * Created by guhuinan on 2015-12-21.
 */

@Entity
@Table(name = "user_repair_assign")
public class UserRepairAssign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    /** @pdOid 03aebad3-f1b2-4edc-8229-39b4405547b1 */
    private int objectid;


    private Date assignTime;

    private Date arriveTime;

    @ManyToOne(targetEntity = SettingRepairManConfig.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
    @JoinColumn(name = "engineer")
    public SettingRepairManConfig engineerDetail;

    @Transient
    private int engineer;

    @ManyToOne(targetEntity = UserRepair.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
    @JoinColumn(name = "repairId")
    public UserRepair repairDetail;


    @Transient
    private int repairId;

    public int getObjectid() {
        return objectid;
    }

    public void setObjectid(int objectid) {
        this.objectid = objectid;
    }

    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    public Date getAssignTime() {
        return assignTime;
    }

    public void setAssignTime(Date assignTime) {
        this.assignTime = assignTime;
    }

    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    public Date getArriveTime() {
        return arriveTime;
    }

    public void setArriveTime(Date arriveTime) {
        this.arriveTime = arriveTime;
    }

    public SettingRepairManConfig getEngineerDetail() {
        return engineerDetail;
    }

    public void setEngineerDetail(SettingRepairManConfig engineerDetail) {
        this.engineerDetail = engineerDetail;
    }

    public int getEngineer() {
        if (engineerDetail != null && engineerDetail.getObjectid() != 0){
            return engineerDetail.getObjectid();
        }else {
            return engineer;
        }
    }

    public void setEngineer(int engineer) {
        this.engineer = engineer;
    }

    public UserRepair getRepairDetail() {
        return repairDetail;
    }

    public void setRepairDetail(UserRepair repairDetail) {
        this.repairDetail = repairDetail;
    }

    public int getRepairId() {
        if (repairDetail != null && repairDetail.getObjectid() != 0){
            return repairDetail.getObjectid();
        }else {
            return repairId;
        }
    }

    public void setRepairId(int repairId) {
        this.repairId = repairId;
    }
}
