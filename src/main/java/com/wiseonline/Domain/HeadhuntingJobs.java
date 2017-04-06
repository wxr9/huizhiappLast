package com.wiseonline.Domain;

import javax.persistence.*;

/**
 * Created by yanwj on 2016/3/18.
 */
@Entity
@Table(name = "headhunting_jobs")
public class HeadhuntingJobs extends BaseEntity{
    public String name;
    public String obligation;
    public String conditions;
    public String money;
    @ManyToOne(targetEntity = UserHeadhunting.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
    @JoinColumn(name = "headhunting_id")
    UserHeadhunting userHeadhunting;
    @Transient
    public int headhuntingId;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getObligation() {
        return obligation;
    }

    public void setObligation(String obligation) {
        this.obligation = obligation;
    }

    public String getConditions() {
        return conditions;
    }

    public void setConditions(String conditions) {
        this.conditions = conditions;
    }

    public String getMoney() {
        return money;
    }

    public void setMoney(String money) {
        this.money = money;
    }

    public UserHeadhunting getUserHeadhunting() {
        return userHeadhunting;
    }

    public void setUserHeadhunting(UserHeadhunting userHeadhunting) {
        this.userHeadhunting = userHeadhunting;
    }

    public int getHeadhuntingId() {
        if (userHeadhunting != null){
            return userHeadhunting.getObjectid();
        }else {
            return headhuntingId;
        }
    }

    public void setHeadhuntingId(int headhuntingId) {
        this.headhuntingId = headhuntingId;
    }
}
