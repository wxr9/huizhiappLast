package com.wiseonline.Controller.Setting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.*;
import com.wiseonline.Service.*;
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
 * Created by R7tech on 3/9/2016.
 */
@RestController
@RequestMapping("/Setting")
public class MerchantReplyController extends BaseController {
    @Autowired
    MerchantReplyService merchantReplyService;
    @Autowired
    MerchantReplySetService merchantReplySetService;
    @Autowired
    NotificationService notificationService;
    @Autowired
    MerchantEvaluateService merchantEvaluateService;


    @RequestMapping(value = "MerchantReply/Edit/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看商户回复互动信息", module = "后台、前台-商户回复互动信息块管理")
    public MerchantReply BaseEdit(@PathVariable int objectid){
        MerchantReply model = merchantReplyService.getbyId(objectid);
        return model;
    }

    @RequestMapping(value = "MerchantReply/Add", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加商户回复互动信息", module = "后台、前台-商户回复互动信息块管理")
    public ResultMessage BaseAdd(MerchantReply model){
        boolean ret = merchantReplyService.save(model);
        if (ret){
            MerchantEvaluate me = merchantEvaluateService.getbyId(model.getEid());
            Noticfication noticfication = new Noticfication();
            noticfication.setReadStatus(1);
            noticfication.setAccepter(me.getCustomer());
            noticfication.setAuthor("system");
            noticfication.setContent("商户 "+me.getmMerchant().getName()+" 回复了您："+model.getContent());
            noticfication.setTitle("商户回复提醒");
            notificationService.save(noticfication);
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "MerchantReply/Update", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加商户回复互动信息", module = "后台、前台-商户回复互动信息块管理")
    public ResultMessage BaseUpdate(MerchantReply model){
        boolean ret = merchantReplyService.update(model);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "MerchantReply/Delete/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "删除商户回复互动信息", module = "后台、前台-商户回复互动信息块管理")
    public ResultMessage BaseDel(@PathVariable int objectid){
        boolean ret = merchantReplyService.delete(objectid);
        if (ret){
            return Msg(true, ConstClass.ResultDeleteSuccess);
        }else{
            return Msg(false,ConstClass.ResultDeleteFault);
        }
    }

    @RequestMapping(value = "MerchantReply/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "列表商户回复互动信息", module = "后台、前台-商户回复互动信息块管理")
    public PageResult<MerchantReply> BaseList(HttpServletRequest request,@PathVariable int page, @PathVariable int pageSize, MerchantReply Model){
        String startTime = request.getParameter("startTime");
        String endTime = request.getParameter("endTime");
        String sql = "select * from merchant_reply where createTime > '";
        String sql2 = sql;
        PageResult<MerchantReply> models = new PageResult<MerchantReply>();

        if (startTime!=null && !startTime.equals("")){
            sql+=startTime+" 00:00:00'";
        }
        if (endTime!=null && !endTime.equals("")){
            sql+=" and createTime < '"+endTime+" 23:59:59'";
        }

        if (sql2.equals(sql)){
            models = merchantReplyService.findAll(page, pageSize, Model,false,"createTime");
            return models;
        }

        sql+=" order by createTime asc";
        List<MerchantReply> eList = merchantReplyService.findByDataSQL(sql);
        if (eList==null){
            eList = new ArrayList<MerchantReply>();
        }
        models.setTotal(eList.size());
        sql+= " limit "+(page-1)*pageSize+","+pageSize;
        eList = merchantReplyService.findByDataSQL(sql);
        models.setResult(eList);
        models.setPagesize(pageSize);
        models.setPage(page);

        return models;
    }

    @RequestMapping(value = "MerchantReply/BlockReply", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "商户回复禁用", module = "后台、前台-商户回复互动信息块管理")
    public ResultMessage BlockReply(HttpServletRequest request){
        String objectid = request.getParameter("objectid");
        //String blockStr = request.getParameter("blockStr");
        String blockStr = merchantReplySetService.findByDataSQL("select * from merchant_reply_set LIMIT 0,1").get(0).getContent();
        MerchantReply mr = merchantReplyService.getbyId(Integer.valueOf(objectid));
        mr.setIsBlock(1);
        mr.setbContent(mr.getContent());
        mr.setContent(blockStr);
        boolean ret = merchantReplyService.update(mr);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }
}
