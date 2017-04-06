package com.wiseonline.Domain;

import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by yanwj on 2016/1/8.
 */
@Entity
@DynamicInsert(true)
@DynamicUpdate(true)
@Table(name = "setting_helps")
public class SettingHelps extends BaseEntity{
    public String content;

    public String flag;

    public String getContent(){
        return content;
    }

    public void setContent(String content){
        this.content = content;
    }

    public String getFlag() {
        return flag;
    }

    public void setFlag(String flag) {
        this.flag = flag;
    }
}
