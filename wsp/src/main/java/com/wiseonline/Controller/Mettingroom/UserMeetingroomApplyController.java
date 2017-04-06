package com.wiseonline.Controller.Mettingroom;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.UserMeetingroomApply;
import com.wiseonline.Service.Impl.UserMeetingroomApplyServiceImpl;
import com.wiseonline.Utils.PermissionInfo;
import com.wiseonline.Utils.UserMeetingroomApplySpecial;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created by yanwj on 2016/4/5.
 */
@RestController
@RequestMapping("/Mettingroom/UserMeetingroomApply")
public class UserMeetingroomApplyController extends BaseController{

    @Autowired
    UserMeetingroomApplyServiceImpl userMeetingroomApplyService;

    @RequestMapping(value = "UserMeetingroom/Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "根据申请id查看申请会议室列表", module = "前台-会议室")
    public UserMeetingroomApplySpecial UserClassroomEdit(@PathVariable int id) {
        UserMeetingroomApplySpecial userMeetingroomApplySpecial = new UserMeetingroomApplySpecial();
        String sql = "select * from user_meetingroom_apply where user_meetingroom_id = "+id;
        List<UserMeetingroomApply> userMeetingroomApplyList = userMeetingroomApplyService.findByDataSQL(sql);
        userMeetingroomApplySpecial.setResult(userMeetingroomApplyList);
        return userMeetingroomApplySpecial;
    }
}
