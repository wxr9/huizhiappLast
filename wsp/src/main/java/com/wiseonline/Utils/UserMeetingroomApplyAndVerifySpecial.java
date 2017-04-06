package com.wiseonline.Utils;

import com.wiseonline.Domain.UserClassroomApplyAndVerify;
import com.wiseonline.Domain.UserMeetingroomApply;
import com.wiseonline.Domain.UserMeetingroomApplyAndVerify;

import java.util.List;

/**
 * Created by yanwj on 2016/4/28.
 */
public class UserMeetingroomApplyAndVerifySpecial {
    public int meetingroomId;
    public int userMeetingroomId;
    List<UserMeetingroomApplyAndVerify> result;

    public int getMeetingroomId() {
        return meetingroomId;
    }

    public void setMeetingroomId(int meetingroomId) {
        this.meetingroomId = meetingroomId;
    }

    public int getUserMeetingroomId() {
        return userMeetingroomId;
    }

    public void setUserMeetingroomId(int userMeetingroomId) {
        this.userMeetingroomId = userMeetingroomId;
    }

    public List<UserMeetingroomApplyAndVerify> getResult() {
        return result;
    }

    public void setResult(List<UserMeetingroomApplyAndVerify> result) {
        this.result = result;
    }
}
