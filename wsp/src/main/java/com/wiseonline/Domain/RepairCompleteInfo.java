package com.wiseonline.Domain;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import javax.persistence.*;

/**
 * Created by huizhisoft on 15/12/24.
 */
@Entity
@Table(name = "repair_complete_info")
public class RepairCompleteInfo extends BaseEntity{

    public String content;

    public String memo;

    @ManyToOne(targetEntity = UserRepair.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
    @JoinColumn(name = "repairid")
    @NotFound(action = NotFoundAction.IGNORE)
    UserRepair userRepair;

    @Transient
    public int repairId;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public UserRepair getUserRepair() {
        return userRepair;
    }

    public void setUserRepair(UserRepair userRepair) {
        this.userRepair = userRepair;
    }

    public int getRepairId() {
        return repairId;
    }

    public void setRepairId(int repairId) {
        this.repairId = repairId;
    }
}
