package com.wiseonline.Controller.Setting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.PayLog;
import com.wiseonline.Domain.RechargeManage;
import com.wiseonline.Service.PayLogService;
import com.wiseonline.Service.RechargeManageService;
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

/**
 * Created by R7tech on 2/25/2016.
 */
@RestController
@RequestMapping("/Setting")
public class RechargeManageController extends BaseController {
    @Autowired
    RechargeManageService rechargeManageService;

    @RequestMapping(value = "RechargeManage/Edit/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看汇智卡充值信息", module = "后台、前台-汇智卡充值信息块管理")
    public RechargeManage BaseEdit(@PathVariable int objectid){
        RechargeManage model = rechargeManageService.getbyId(objectid);
        return model;
    }

    @RequestMapping(value = "RechargeManage/Add", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加汇智卡充值信息", module = "后台、前台-汇智卡充值信息块管理")
    public ResultMessage BaseAdd(RechargeManage model){
        boolean ret = rechargeManageService.save(model);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "RechargeManage/Del/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "删除汇智卡充值信息", module = "后台、前台-汇智卡充值信息块管理")
    public ResultMessage BaseDel(@PathVariable int objectid){
        boolean ret = rechargeManageService.delete(objectid);
        if (ret){
            return Msg(true, ConstClass.ResultDeleteSuccess);
        }else{
            return Msg(false,ConstClass.ResultDeleteFault);
        }
    }

    @RequestMapping(value = "RechargeManage/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "列表汇智卡充值信息", module = "后台、前台-汇智卡充值信息块管理")
    public PageResult<RechargeManage> BaseList(HttpServletRequest request,@PathVariable int page, @PathVariable int pageSize, RechargeManage model){
        String searchName = request.getParameter("searchName");
        if (searchName!=null && searchName!=""){
            if (searchName.length()>6){
                return rechargeManageService.findByOneField(page,pageSize,"orderNo",searchName,false,"createTime");
            }
            return rechargeManageService.findByOneField(page,pageSize,"checkCode",searchName,false,"createTime");
        }
        return rechargeManageService.findAll(page,pageSize,model,true,"createTime");
    }

    @RequestMapping(value = "RechargeManage/GetCheck/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "领取汇智卡充值发票信息", module = "后台、前台-汇智卡充值信息块管理")
    public ResultMessage GetCheck(@PathVariable int objectid){
        RechargeManage rm = rechargeManageService.getbyId(objectid);
        rm.setCheckGet(2);
        boolean ret = rechargeManageService.update(rm);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }
}
