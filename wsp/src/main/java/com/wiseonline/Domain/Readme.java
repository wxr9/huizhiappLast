package com.wiseonline.Domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by yanwj on 2016/3/25.
 */
@Entity
@Table(name = "readme")
public class Readme extends BaseEntity{
    public String name;//须知标题
    public String type;//须知类别
    @Column(name = "is_read")
    public int isRead;//是否需要已读确认
    @Column(name = "is_popup")
    public int isPopup;//是否弹窗
    public String content;//内容
    public int deleteflag;// 禁用启用（-1,1）

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getIsRead() {
        return isRead;
    }

    public void setIsRead(int isRead) {
        this.isRead = isRead;
    }

    public int getIsPopup() {
        return isPopup;
    }

    public void setIsPopup(int isPopup) {
        this.isPopup = isPopup;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getDeleteflag() {
        return deleteflag;
    }

    public void setDeleteflag(int deleteflag) {
        this.deleteflag = deleteflag;
    }
}
