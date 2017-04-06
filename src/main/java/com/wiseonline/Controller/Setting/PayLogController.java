package com.wiseonline.Controller.Setting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.EnterApply;
import com.wiseonline.Domain.LoginLog;
import com.wiseonline.Domain.PayLog;
import com.wiseonline.Service.LoginLogService;
import com.wiseonline.Service.PayLogService;
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
import java.util.ArrayList;
import java.util.List;

/**
 * Created by R7tech on 2/25/2016.
 */
@RestController
@RequestMapping("/Setting")
public class PayLogController extends BaseController {
    @Autowired
    PayLogService payLogService;

    @RequestMapping(value = "PayLog/Edit/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看汇智卡信息", module = "后台、前台-汇智卡信息块管理")
    public PayLog BaseEdit(@PathVariable int objectid){
        PayLog model = payLogService.getbyId(objectid);
        return model;
    }

    @RequestMapping(value = "PayLog/Add", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加汇智卡信息", module = "后台、前台-汇智卡信息块管理")
    public ResultMessage BaseAdd(PayLog model){
        boolean ret = payLogService.save(model);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "PayLog/Del/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "删除汇智卡信息", module = "后台、前台-汇智卡信息块管理")
    public ResultMessage BaseDel(@PathVariable int objectid){
        boolean ret = payLogService.delete(objectid);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "PayLog/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "列表汇智卡信息", module = "后台、前台-汇智卡信息块管理")
    public PageResult<PayLog> BaseList(HttpServletRequest request,@PathVariable int page, @PathVariable int pageSize, PayLog model){
        //return payLogService.findAll(page,pageSize,model,true,"createTime");

        String startTime = request.getParameter("startDate");
        String endTime = request.getParameter("endDate");
        String cardNo = request.getParameter("cardNo");
        String mobile = request.getParameter("mobile");
        String sql = "select * from pay_log where 1 ";
        String sql2 = sql;
        PageResult<PayLog> models = new PageResult<PayLog>();

        if (startTime!=null && !startTime.equals("")){
            sql+=" and createTime > '"+startTime+" 00:00:00'";
        }
        if (endTime!=null && !endTime.equals("")){
            sql+=" and createTime < '"+endTime+" 23:59:59'";
        }
        if (cardNo!=null && !cardNo.equals("")){
            sql+=" and cardNo='"+cardNo+"'";
        }
        if (mobile!=null && !mobile.equals("")){
            sql+=" and mobile= '"+mobile+"'";
        }

        if (sql2.equals(sql)){
            models = payLogService.findAll(page, pageSize, model,true,"createTime");
            return models;
        }

        sql+=" order by createTime desc";
        List<PayLog> eList = payLogService.findByDataSQL(sql);
        if (eList==null){
            eList = new ArrayList<PayLog>();
        }
        models.setResult(eList);
        models.setPagesize(pageSize);
        models.setPage(page);
        models.setTotal(eList.size());
        return models;
    }

    @RequestMapping(value = "PayLogById/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "列表汇智卡在线充值信息", module = "后台、前台-汇智卡信息块管理")
    public PageResult<PayLog> BaseListById(HttpServletRequest request,@PathVariable int page, @PathVariable int pageSize, PayLog model){
        String sqlMain = "select * from pay_log where member='"+getUserName()+"' and type=1 and cardNo=(select cardid from users where username='"+getUserName()+"')";
        PageResult<PayLog> models = new PageResult<PayLog>();
        List<PayLog> mList = payLogService.findByDataSQL(sqlMain);
        models.setTotal(mList.size());
        if(page!=0&&pageSize!=0){
            sqlMain+=" limit "+(page-1)*pageSize+","+pageSize;
            mList = payLogService.findByDataSQL(sqlMain);
        }
        models.setResult(mList);

        models.setPage(page);
        models.setPagesize(pageSize);

        return models;
    }
}
