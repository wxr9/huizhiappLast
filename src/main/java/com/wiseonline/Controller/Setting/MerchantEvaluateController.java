package com.wiseonline.Controller.Setting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.*;
import com.wiseonline.Service.MerchantEvaluateService;
import com.wiseonline.Service.MerchantReplyService;
import com.wiseonline.Service.MerchantService;
import com.wiseonline.Service.NotificationService;
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

/**
 * Created by R7tech on 3/9/2016.
 */
@RestController
@RequestMapping("/Setting")
public class MerchantEvaluateController  extends BaseController {
    @Autowired
    MerchantEvaluateService merchantEvaluateService;
    @Autowired
    MerchantReplyService merchantReplyService;
    @Autowired
    NotificationService notificationService;
    @Autowired
    MerchantService merchantService;


    @RequestMapping(value = "MerchantEvaluate/Edit/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看商户点评信息", module = "后台、前台-商户点评信息块管理")
    public MerchantEvaluate BaseEdit(@PathVariable int objectid){
        MerchantEvaluate model = merchantEvaluateService.getbyId(objectid);
        String sql = "select * from merchant_reply where eid = "+objectid+" and merchant = "+model.getMerchant();
        List<MerchantReply> mrList = merchantReplyService.findByDataSQL(sql);
        model.setReplyList(mrList);
        return model;
    }

    @RequestMapping(value = "MerchantEvaluate/Add", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加商户点评信息", module = "后台、前台-商户点评信息块管理")
    public ResultMessage BaseAdd(MerchantEvaluate model){
        Merchant mc = merchantService.getbyId(model.getMerchant());
        if (mc.getUsername().equals(getUserName())){
            return Msg(false,"抱歉,不能给自己评论!");
        }

        boolean ret = merchantEvaluateService.save(model);
        if (ret){
            Noticfication noticfication = new Noticfication();
            noticfication.setReadStatus(1);
            noticfication.setAccepter(merchantService.getbyId(model.getMerchant()).getUsername());
            noticfication.setAuthor("system");
            noticfication.setContent("用户 "+model.getCustomer()+" 评价了您："+model.getComment());
            noticfication.setTitle("用户评价提醒");
            notificationService.save(noticfication);
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "MerchantEvaluate/Update", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加商户点评信息", module = "后台、前台-商户点评信息块管理")
    public ResultMessage BaseUpdate(MerchantEvaluate model){
        boolean ret = merchantEvaluateService.update(model);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "MerchantEvaluate/Delete/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "删除商户点评信息", module = "后台、前台-商户点评信息块管理")
    public ResultMessage BaseDel(@PathVariable int objectid){
        boolean ret = merchantEvaluateService.delete(objectid);
        if (ret){
            return Msg(true, ConstClass.ResultDeleteSuccess);
        }else{
            return Msg(false,ConstClass.ResultDeleteFault);
        }
    }

    @RequestMapping(value = "MerchantEvaluate/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "列表商户点评信息", module = "后台、前台-商户点评信息块管理")
    public PageResult<MerchantEvaluate> BaseList(HttpServletRequest request,@PathVariable int page, @PathVariable int pageSize, MerchantEvaluate Model){
        String username = request.getParameter("username");
        String merchant = request.getParameter("merchant");
        String sql = "select * from merchant_evaluate where 1 ";
        int count = 0;
        String sqlPage = " limit "+(page-1)*pageSize+","+pageSize;

        if (username!=null){
            if (username.equals("customer")){
                sql+= "and customer ='"+getUserName()+"'";
            }else {
                sql+= "and merchant = (select objectid from merchant where username='"+getUserName()+"')";
            }
        }

        if (merchant!=null){
            sql+="and merchant="+merchant;
        }

        sql+=" order by createTime desc";
        count = merchantEvaluateService.findByDataSQL(sql).size();

        //开始分页
        sql+=sqlPage;
        PageResult<MerchantEvaluate> models = new PageResult<MerchantEvaluate>();

        List<MerchantEvaluate> mList = merchantEvaluateService.findByDataSQL(sql);
        for (int i=0;i<mList.size();i++){
            String sqlE = "select * from merchant_reply where eid = "+mList.get(i).getObjectid()+" and merchant = "+mList.get(i).getMerchant();
            List<MerchantReply> mrList = merchantReplyService.findByDataSQL(sqlE);
            mList.get(i).setReplyList(mrList);
        }

        models.setPagesize(pageSize);
        models.setPage(page);
        models.setResult(mList);
        models.setTotal(count);
        return models;
    }
}
