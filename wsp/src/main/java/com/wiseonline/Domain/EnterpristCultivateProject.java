package com.wiseonline.Domain;

import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;

/**
 * Created by yanwj on 2016/3/21.
 */
@Entity
@DynamicInsert(true)
@DynamicUpdate(true)
@Table(name = "enterprist_cultivate_project")
public class EnterpristCultivateProject extends BaseEntity{
    @ManyToOne(targetEntity = SettingDict.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
    @JoinColumn(name = "priojectid")
    public SettingDict project;
    @Transient
    public int priojectid;//培训项目id
    @ManyToOne(targetEntity = EnterpriseCultivate.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
    @JoinColumn(name = "enterprist_cultivate_id",insertable = false, updatable = false)
    public EnterpriseCultivate enterpriseCultivate;
    @Transient
    public int enterpristCultivateId;//企业培训申请表id
    public String peoples;//人数

    public int enterprist_cultivate_id;

    public SettingDict getProject() {
        return project;
    }

    public void setProject(SettingDict project) {
        this.project = project;
    }

    public int getPriojectid() {
        if (project != null){
            return project.getObjectid();
        }else {
            return priojectid;
        }
    }

    public void setPriojectid(int priojectid) {
        this.priojectid = priojectid;
    }

    public EnterpriseCultivate getEnterpriseCultivate() {
        return enterpriseCultivate;
    }

    public void setEnterpriseCultivate(EnterpriseCultivate enterpriseCultivate) {
        this.enterpriseCultivate = enterpriseCultivate;
    }

    public int getEnterpristCultivateId() {
        if (enterpriseCultivate != null){
            return enterpriseCultivate.getObjectid();
        }else {
            return enterpristCultivateId;
        }
    }

    public void setEnterpristCultivateId(int enterpristCultivateId) {
        this.enterpristCultivateId = enterpristCultivateId;
    }

    public String getPeoples() {
        return peoples;
    }

    public void setPeoples(String peoples) {
        this.peoples = peoples;
    }

    public int getEnterprist_cultivate_id() {
        return enterprist_cultivate_id;
    }

    public void setEnterprist_cultivate_id(int enterprist_cultivate_id) {
        this.enterprist_cultivate_id = enterprist_cultivate_id;
    }
}
