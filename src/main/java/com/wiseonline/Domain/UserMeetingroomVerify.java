package com.wiseonline.Domain;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.wiseonline.Utils.CustomDateSerializer;
import com.wiseonline.Utils.CustomDateSerializerJustDate;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by yanwj on 2016/4/1.
 */
@Entity
@Table(name = "user_meetingroom_verify")
public class UserMeetingroomVerify extends BaseEntity{
    @Column(name = "apply_date")
    public Date applyDate;//日期
    @Column(name = "begin_time")
    public String beginTime;//开始时间
    @Column(name = "end_time")
    public String endTime;//结束时间
    @ManyToOne(targetEntity = UserMeetingroom.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
    @JoinColumn(name = "user_meetingroom_id")
    public UserMeetingroom userMeetingroom;
    @Transient
    public int userMeetingroomId;//用户申请会议室表id

    @ManyToOne(targetEntity = Mettingroom.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
    @JoinColumn(name = "meetingroom_id")
    public Mettingroom mettingroom;
    @Transient
    public int meetingroomId;//会议室表id

    @Temporal(TemporalType.TIMESTAMP)
    @JsonSerialize(using = CustomDateSerializerJustDate.class)
    public Date getApplyDate() {
        return applyDate;
    }

    public void setApplyDate(Date applyDate) {
        this.applyDate = applyDate;
    }

    public String getBeginTime() {
        return beginTime;
    }

    public void setBeginTime(String beginTime) {
        this.beginTime = beginTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public UserMeetingroom getUserMeetingroom() {
        return userMeetingroom;
    }

    public void setUserMeetingroom(UserMeetingroom userMeetingroom) {
        this.userMeetingroom = userMeetingroom;
    }

    public int getUserMeetingroomId() {
        if (userMeetingroom != null){
            return userMeetingroom.getObjectid();
        }
        return userMeetingroomId;
    }

    public void setUserMeetingroomId(int userMeetingroomId) {
        this.userMeetingroomId = userMeetingroomId;
    }

    public Mettingroom getMettingroom() {
        return mettingroom;
    }

    public void setMettingroom(Mettingroom mettingroom) {
        this.mettingroom = mettingroom;
    }

    public int getMeetingroomId() {
        if (mettingroom != null){
            return mettingroom.getObjectid();
        }
        return meetingroomId;
    }

    public void setMeetingroomId(int meetingroomId) {
        this.meetingroomId = meetingroomId;
    }
}
