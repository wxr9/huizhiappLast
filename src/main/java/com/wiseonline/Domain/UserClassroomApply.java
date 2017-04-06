package com.wiseonline.Domain;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.wiseonline.Utils.CustomDateSerializer;
import com.wiseonline.Utils.CustomDateSerializerJustDate;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by yanwj on 2016/3/25.
 */
@Entity
@Table(name = "user_classroom_apply")
public class UserClassroomApply extends BaseEntity {
    @Column(name = "apply_date")
    public Date applyDate;//日期
    @Column(name = "half_day")
    public String halfDay;//上午下午（a-上午，p-下午）
    @ManyToOne(targetEntity = UserClassroom.class, fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
    @JoinColumn(name = "user_classroom_id")
    public UserClassroom userClassroom;
    @Transient
    public int userClassroomId;//用户申请教室表id
    @ManyToOne(targetEntity = Classroom.class, fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
    @JoinColumn(name = "classroom_id")
    public Classroom classroom;
    @Transient
    public int classroomId;//教室表id
    @Temporal(TemporalType.TIMESTAMP)
    @JsonSerialize(using = CustomDateSerializerJustDate.class)
    public Date getApplyDate() {
        return applyDate;
    }

    public void setApplyDate(Date applyDate) {
        this.applyDate = applyDate;
    }

    public String getHalfDay() {
        return halfDay;
    }

    public void setHalfDay(String halfDay) {
        this.halfDay = halfDay;
    }

    public UserClassroom getUserClassroom() {
        return userClassroom;
    }

    public void setUserClassroom(UserClassroom userClassroom) {
        this.userClassroom = userClassroom;
    }

    public int getUserClassroomId() {
        if (userClassroom != null) {
            return userClassroom.getObjectid();
        } else {
            return userClassroomId;
        }
    }

    public void setUserClassroomId(int userClassroomId) {
        this.userClassroomId = userClassroomId;
    }

    public Classroom getClassroom() {
        return classroom;
    }

    public void setClassroom(Classroom classroom) {
        this.classroom = classroom;
    }

    public int getClassroomId() {
        if (classroom != null) {
            return classroom.getObjectid();
        } else {
            return classroomId;
        }
    }

    public void setClassroomId(int classroomId) {
        this.classroomId = classroomId;
    }
}
