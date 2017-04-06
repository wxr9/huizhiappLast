package com.wiseonline.Domain;

import javax.persistence.*;

/**
 * Created by huizhisoft on 15/12/18.
 */
@Entity
@Table(name = "user_enterprise_applyinfo")
public class UserEnterpriseApplyInfo extends BaseEntity{

    @Column(name = "applyflag")
    public int applyFlag;

    @ManyToOne(targetEntity = User.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
    @JoinColumn(name = "username")
    public User user;

    @Transient
    public String username;

    @ManyToOne(targetEntity = Enterprise.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
    @JoinColumn(name = "enterpriseid")
    public Enterprise enterprise;

    @Transient
    public int enterpriseId;

    public int getApplyFlag() {
        return applyFlag;
    }

    public void setApplyFlag(int applyFlag) {
        this.applyFlag = applyFlag;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getUsername() {
        if (user != null){
            return user.getUsername();
        }else {
            return username;
        }
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Enterprise getEnterprise() {
        return enterprise;
    }

    public void setEnterprise(Enterprise enterprise) {
        this.enterprise = enterprise;
    }

    public int getEnterpriseId() {
        if (enterprise != null){
            return enterprise.getObjectid();
        }else {
            return enterpriseId;
        }
    }

    public void setEnterpriseId(int enterpriseId) {
        this.enterpriseId = enterpriseId;
    }
}
