package com.wiseonline.Controller.Setting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.LoginLog;
import com.wiseonline.Service.LoginLogService;
import com.wiseonline.Utils.ConstClass;
import com.wiseonline.Utils.PageResult;
import com.wiseonline.Utils.PermissionInfo;
import com.wiseonline.Utils.ResultMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by R7tech on 2/25/2016.
 */
@RestController
@RequestMapping("/Setting")
public class LoginLogController extends BaseController {
    @Autowired
    LoginLogService loginLogService;

    @RequestMapping(value = "LoginLog/Edit/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看登录信息", module = "后台、前台-登录信息块管理")
    public LoginLog BaseEdit(@PathVariable int objectid){
        LoginLog model = loginLogService.getbyId(objectid);
        return model;
    }

    @RequestMapping(value = "LoginLog/Add", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加登录信息", module = "后台、前台-登录信息块管理")
    public ResultMessage BaseAdd(LoginLog model){
        boolean ret = loginLogService.save(model);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "LoginLog/Del/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "删除登录信息", module = "后台、前台-登录信息块管理")
    public ResultMessage BaseDel(@PathVariable int objectid){
        boolean ret = loginLogService.delete(objectid);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "LoginLog/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "列表登录信息", module = "后台、前台-登录信息块管理")
    public PageResult<LoginLog> BaseList(@PathVariable int page, @PathVariable int pageSize, HttpServletRequest request){
        String userName = "";
        String startDate = "";
        String endDate = "";

        if(request.getParameter("userName")!=null){
            userName = request.getParameter("userName").trim();
        }

        if(request.getParameter("startDate")!=null){
            startDate = request.getParameter("startDate").trim();
        }

        if(request.getParameter("endDate")!=null){
            endDate = request.getParameter("endDate").trim();
        }


        String sqlCount = "Select count(*) From login_log";
        String sqlList = "Select * From login_log";
        String sql = "";
        boolean bFlag = false;

        if(!userName.equals("")){
            bFlag = true;
            sql+=" where userName LIKE '%"+userName+"%'";
        }

        if (!startDate.equals("")){
            if (bFlag){
                sql+=" and createTime > '" + startDate + " 00:00:00'";
            }else{
                bFlag = true;
                sql+=" where createTime > '" + startDate + " 00:00:00'";
            }
        }

        if (!endDate.equals("")){
            if (bFlag){
                sql+=" and createTime < '" + endDate  + " 23:59:59'";
            }else{
                bFlag = true;
                sql+=" where createTime < '" + endDate  + " 23:59:59'";
            }
        }

        Integer count = loginLogService.getCountBySQL(sqlCount+sql);
        sql += " order by createTime desc";
        sql+=" LIMIT " + (page - 1) * pageSize + "," + pageSize;

        List<LoginLog> list = loginLogService.findByDataSQL(sqlList+sql);


        PageResult<LoginLog> models = new PageResult<LoginLog>();
        models.setPage(page);
        models.setPagesize(pageSize);
        models.setResult(list);
        models.setTotal(count);
        return models;
    }
}
