package com.wiseonline.Domain;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import javax.persistence.*;
import java.util.Set;

/**
 * Created by yanwj on 2016/3/10.
 */
@Entity
@Table(name = "jobs")
public class Jobs extends BaseEntity{
    public String name;
    @ManyToOne(targetEntity = SettingDict.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
    @JoinColumn(name = "money_type")
    public SettingDict moneyType;
    @Transient
    public int moneyTypeId;
    public String money;
    public String content;
    @Column(name = "deleteflag")
    public int deleteFlag;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public SettingDict getMoneyType() {
        return moneyType;
    }

    public void setMoneyType(SettingDict moneyType) {
        this.moneyType = moneyType;
    }

    public int getMoneyTypeId() {
        if (moneyType != null){
            return moneyType.getObjectid();
        }else {
            return moneyTypeId;
        }
    }

    public void setMoneyTypeId(int moneyTypeId) {
        this.moneyTypeId = moneyTypeId;
    }

    public String getMoney() {
        return money;
    }

    public void setMoney(String money) {
        this.money = money;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getDeleteFlag() {
        return deleteFlag;
    }

    public void setDeleteFlag(int deleteFlag) {
        this.deleteFlag = deleteFlag;
    }
}
