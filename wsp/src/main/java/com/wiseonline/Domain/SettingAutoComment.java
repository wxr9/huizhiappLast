package com.wiseonline.Domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by yanwj on 2016/4/14.
 */
@Entity
@Table(name = "setting_auto_comment")
public class SettingAutoComment extends BaseEntity{
    @Column(name = "auto_comment_deadline")
    public int autoCommentDeadline;//自动评价期限 单位:分钟
    public String type;//类别（广告-commercialize、教室-classroom、版权-copyright、会议室-meetingroom、企业-enterpristCultivate、猎聘-headhunting、入驻-enterApply，测试-testApplyfor）

    public String content;//自动评价内容

    @Column(name = "auto_comment_speed")
    public int autoCommentSpeed;
    @Column(name = "auto_comment_attitude")
    public int autoCommentAttitude;
    @Column(name = "auto_comment_quality")
    public int autoCommentQuality;



    public int getAutoCommentDeadline() {
        return autoCommentDeadline;
    }

    public void setAutoCommentDeadline(int autoCommentDeadline) {
        this.autoCommentDeadline = autoCommentDeadline;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getAutoCommentSpeed() {
        return autoCommentSpeed;
    }

    public void setAutoCommentSpeed(int autoCommentSpeed) {
        this.autoCommentSpeed = autoCommentSpeed;
    }

    public int getAutoCommentAttitude() {
        return autoCommentAttitude;
    }

    public void setAutoCommentAttitude(int autoCommentAttitude) {
        this.autoCommentAttitude = autoCommentAttitude;
    }

    public int getAutoCommentQuality() {
        return autoCommentQuality;
    }

    public void setAutoCommentQuality(int autoCommentQuality) {
        this.autoCommentQuality = autoCommentQuality;
    }
}
