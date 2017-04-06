package com.wiseonline.Domain;

import javax.persistence.*;

/**
 * Created by yanwj on 2015/12/3.
 */
@Entity
@Table(name = "setting_about")
public class SettingAbout extends BaseEntity{

    @ManyToOne(targetEntity = SettingRichText.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
    @JoinColumn(name = "richtextid")
    public SettingRichText settingRichText;

    @Transient
    public int richtextid;

    public int flag;

    public SettingRichText getSettingRichText() {
        return settingRichText;
    }

    public void setSettingRichText(SettingRichText settingRichText) {
        this.settingRichText = settingRichText;
    }

    public int getRichtextid() {
        if (settingRichText != null){
            return settingRichText.getObjectid();
        }else {
            return richtextid;
        }
    }

    public void setRichtextid(int richtextid) {
        this.richtextid = richtextid;
    }

    public int getFlag() {
        return flag;
    }

    public void setFlag(int flag) {
        this.flag = flag;
    }
}
