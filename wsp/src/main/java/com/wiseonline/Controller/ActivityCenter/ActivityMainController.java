package com.wiseonline.Controller.ActivityCenter;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.ActivityMain;
import com.wiseonline.Domain.LoginLog;
import com.wiseonline.Service.ActivityApplyService;
import com.wiseonline.Service.ActivityMainService;
import com.wiseonline.Service.LoginLogService;
import com.wiseonline.Utils.ConstClass;
import com.wiseonline.Utils.PageResult;
import com.wiseonline.Utils.PermissionInfo;
import com.wiseonline.Utils.ResultMessage;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

/**
 * Created by R7tech on 2/25/2016.
 */
@RestController
@RequestMapping("/ActivityCenter")
public class ActivityMainController extends BaseController {
    @Autowired
    ActivityMainService activityMainService;
    @Autowired
    ActivityApplyService activityApplyService;

    @RequestMapping(value = "ActivityMain/Edit/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看活动信息", module = "后台、前台-活动信息块管理")
    public ActivityMain BaseEdit(@PathVariable int objectid){
        ActivityMain model = activityMainService.getbyId(objectid);
        return model;
    }

    @RequestMapping(value = "ActivityMain/Add", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加活动信息", module = "后台、前台-活动信息块管理")
    public ResultMessage BaseAdd(ActivityMain model){
        model.setIsBan(1);
        boolean ret = activityMainService.save(model);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "ActivityMain/Update", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加活动信息", module = "后台、前台-活动信息块管理")
    public ResultMessage BaseUpdate(ActivityMain model){
        boolean ret = activityMainService.update(model);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "ActivityMain/Del/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "删除活动信息", module = "后台、前台-活动信息块管理")
    public ResultMessage BaseDel(@PathVariable int objectid){
        boolean ret = activityMainService.delete(objectid);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "ActivityMain/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "列表活动信息", module = "后台、前台-活动信息块管理")
    public PageResult<ActivityMain> BaseList(@PathVariable int page, @PathVariable int pageSize, ActivityMain model){
        PageResult<ActivityMain> models = activityMainService.findAll(page, pageSize, model,true,"createTime");
        return models;
    }

    @RequestMapping(value = "ActivityMain/BanSet", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "禁用活动信息", module = "后台、前台-活动信息块管理")
    public ResultMessage BaseBan(HttpServletRequest request){
        int objectid = Integer.valueOf(request.getParameter("objectId"));
        int isBan = Integer.valueOf(request.getParameter("isBan"));
        ActivityMain model = activityMainService.getbyId(objectid);
        model.setIsBan(isBan);
        boolean ret = activityMainService.update(model);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "ActivityMain/StatisticGraphData", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "统计活动信息", module = "后台、前台-活动信息块管理")
    public void BaseStatistic(HttpServletResponse response){
        String totalActivitySql = "select count(*) from activity_main";
        String totalApplySql = "select count(*) from activity_apply";
        String byTypeSql = "SELECT s.name,count(m.type) FROM setting_dict s  LEFT JOIN activity_main m ON m.type = s.objectid WHERE s.type='activityType' and parentid=(select objectid from setting_dict where type='activityType' and parentid=-1) GROUP BY s.objectid";

        int totalActivity = activityMainService.getCountBySQL(totalActivitySql);
        int totalApply = activityApplyService.getCountBySQL(totalApplySql);

        JSONObject jo = new JSONObject();
        jo.put("TotalActivities",totalActivity);
        jo.put("TotalApply",totalApply);

        List<Object[]> objects = activityMainService.findByCustomerSQL(byTypeSql);
        JSONArray ja = new JSONArray();
        for (int i=0;i<objects.size();i++){
            JSONObject en = new JSONObject();
            en.put("name",objects.get(i)[0].toString());
            en.put("value",objects.get(i)[1].toString());
            ja.put(en);
        }
        jo.put("GetActivityByType",ja);


        try {
            response.getWriter().write(jo.toString());
            response.getWriter().flush();
            response.getWriter().close();
        } catch (IOException ee) {

        }
    }
}
