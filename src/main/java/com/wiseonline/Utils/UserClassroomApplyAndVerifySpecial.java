package com.wiseonline.Utils;

import com.wiseonline.Domain.UserClassroomApplyAndVerify;

import java.util.List;

/**
 * Created by yanwj on 2016/4/26.
 */
public class UserClassroomApplyAndVerifySpecial {
    public int classroomId;
    public int userClassroomId;
    List<UserClassroomApplyAndVerify> result;

    public int getClassroomId() {
        return classroomId;
    }

    public void setClassroomId(int classroomId) {
        this.classroomId = classroomId;
    }

    public int getUserClassroomId() {
        return userClassroomId;
    }

    public void setUserClassroomId(int userClassroomId) {
        this.userClassroomId = userClassroomId;
    }

    public List<UserClassroomApplyAndVerify> getResult() {
        return result;
    }

    public void setResult(List<UserClassroomApplyAndVerify> result) {
        this.result = result;
    }
}
