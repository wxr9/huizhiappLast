package com.wiseonline.Domain;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.wiseonline.Utils.CustomDateSerializer;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by yanwj on 2016/5/9.
 */
@Entity
@Table(name = "enter_apply_business")
public class EnterApplyBusiness extends BaseEntity{
    @Column(name = "manager_deal_date")
    public Date managerDealDate;//客户经理受理时间
    @Column(name = "manager_memo")
    public String managerMemo;//客户经理备注
    @Column(name = "discuss_date")
    public Date discussDate;//洽谈时间
    @Column(name = "discuss_deal_date")
    public Date discussDealDate;//安排洽谈受理时间
    @Column(name = "discuss_memo")
    public String discussMemo;//安排洽谈备注

    @ManyToOne(targetEntity = EnterApply.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
    @JoinColumn(name = "enter_apply_id")
    public EnterApply enterApply;

    @Transient
    public int enterApplyId;//入驻申请业务表主键

    @Temporal(TemporalType.TIMESTAMP)
    @JsonSerialize(using = CustomDateSerializer.class)
    public Date getManagerDealDate() {
        return managerDealDate;
    }

    public void setManagerDealDate(Date managerDealDate) {
        this.managerDealDate = managerDealDate;
    }

    public String getManagerMemo() {
        return managerMemo;
    }

    public void setManagerMemo(String managerMemo) {
        this.managerMemo = managerMemo;
    }

    @Temporal(TemporalType.TIMESTAMP)
    @JsonSerialize (using = CustomDateSerializer.class)
    public Date getDiscussDate() {
        return discussDate;
    }

    public void setDiscussDate(Date discussDate) {
        this.discussDate = discussDate;
    }
    @Temporal(TemporalType.TIMESTAMP)
    @JsonSerialize (using = CustomDateSerializer.class)
    public Date getDiscussDealDate() {
        return discussDealDate;
    }

    public void setDiscussDealDate(Date discussDealDate) {
        this.discussDealDate = discussDealDate;
    }

    public String getDiscussMemo() {
        return discussMemo;
    }

    public void setDiscussMemo(String discussMemo) {
        this.discussMemo = discussMemo;
    }

    public EnterApply getEnterApply() {
        return enterApply;
    }

    public void setEnterApply(EnterApply enterApply) {
        this.enterApply = enterApply;
    }

    public int getEnterApplyId() {
        if (enterApply != null){
            return enterApply.getObjectid();
        }else {
            return enterApplyId;
        }
    }

    public void setEnterApplyId(int enterApplyId) {
        this.enterApplyId = enterApplyId;
    }
}
