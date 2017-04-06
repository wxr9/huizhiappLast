package com.wiseonline.Domain;

import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import javax.persistence.*;

/**
 * Created by huizhisoft on 15/12/17.
 */
@Entity
@DynamicInsert(true)
@DynamicUpdate(true)
@Table(name = "setting_help")
public class SettingHelp extends BaseEntity{

    public String title;

    @Column(name = "deleteflag")
    public int deleteFlag;

    @ManyToOne(targetEntity = SettingRichText.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
    @JoinColumn(name = "richtextid")
    @NotFound(action = NotFoundAction.IGNORE)
    public SettingRichText settingRichText;

    @Transient
    public int richTextId;

    @ManyToOne(targetEntity = SettingHelp.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
    @JoinColumn(name = "parentid")
    @NotFound(action = NotFoundAction.IGNORE)
    public SettingHelp settingHelp;

    @Transient
    public int parentid;

    public int type;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getDeleteFlag() {
        return deleteFlag;
    }

    public void setDeleteFlag(int deleteFlag) {
        this.deleteFlag = deleteFlag;
    }

    public SettingRichText getSettingRichText() {
        return settingRichText;
    }

    public void setSettingRichText(SettingRichText settingRichText) {
        this.settingRichText = settingRichText;
    }

    public int getRichTextId() {
        if (settingRichText != null){
            return settingRichText.getObjectid();
        }
        return richTextId;
    }

    public void setRichTextId(int richTextId) {
        this.richTextId = richTextId;
    }

    public SettingHelp getSettingHelp() {
        return settingHelp;
    }

    public void setSettingHelp(SettingHelp settingHelp) {
        this.settingHelp = settingHelp;
    }

    public int getParentid() {
        return parentid;
    }

    public void setParentid(int parentid) {
        this.parentid = parentid;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }
}
