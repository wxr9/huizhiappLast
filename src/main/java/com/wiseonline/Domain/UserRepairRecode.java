package com.wiseonline.Domain;

import com.fasterxml.jackson.annotation.JsonFormat;

import javax.persistence.*;
import java.util.Date;

/**  维修记录
 * Created by guhuinan on 2015-12-21.
 */

@Entity
@Table(name = "user_repair_recode")
public class UserRepairRecode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    /** @pdOid 03aebad3-f1b2-4edc-8229-39b4405547b1 */
    private int objectid;

    private Date createTime;

    private String memo;

    private Date deadline;

    @Transient
    private int repairId;

    @ManyToOne(targetEntity = UserRepair.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
    @JoinColumn(name = "repairId")
    public UserRepair userRepair;

    public UserRepair getUserRepair(){ return userRepair; }

    public void setUserRepair(UserRepair userRepair){ this.userRepair = userRepair; }


    public long getObjectid() {
        return objectid;
    }

    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    public Date getCreateTime() {
        return createTime;
    }

    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    public Date getDeadline() {
        return deadline;
    }

    public String getMemo() {
        return memo;
    }

    public int getRepairId() {
        if (userRepair != null){
            return userRepair.getObjectid();
        }else {
            return repairId;
        }
    }

    public void setObjectid(int objectid) {
        this.objectid = objectid;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public void setDeadline(Date deadline) {
        this.deadline = deadline;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public void setRepairId(int repairId) {
        this.repairId = repairId;
    }
}
