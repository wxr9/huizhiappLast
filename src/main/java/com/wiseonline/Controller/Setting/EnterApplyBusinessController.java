package com.wiseonline.Controller.Setting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.EnterApply;
import com.wiseonline.Domain.EnterApplyBusiness;
import com.wiseonline.Service.EnterApplyBusinessService;
import com.wiseonline.Service.EnterApplyService;
import com.wiseonline.Utils.ConstClass;
import com.wiseonline.Utils.PermissionInfo;
import com.wiseonline.Utils.ResultMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created by yanwj on 2016/5/10.
 */
@RestController
@RequestMapping("/Setting/EnterApplyBusiness")
public class EnterApplyBusinessController extends BaseController {

    @Autowired
    EnterApplyBusinessService enterApplyBusinessService;

    @Autowired
    EnterApplyService enterApplyService;

    @RequestMapping(value = "Manager/Add", method = RequestMethod.POST)
    @PermissionInfo(name = "新增分配项目经理项", module = "后台-业务处理")
    public ResultMessage ManagerAdd(EnterApplyBusiness model) {
        if (model.getEnterApplyId() != 0){
            EnterApply enterApply = enterApplyService.getbyId(model.getEnterApplyId());
            model.setEnterApply(enterApply);
        }
        if (model.getObjectid() == 0) {
            boolean rst = enterApplyBusinessService.save(model);
            if (rst) {
                return Msg(true, ConstClass.ResultSaveSuccess);
            } else {
                return Msg(false, ConstClass.ResultSaveFault);
            }
        }else {
            EnterApplyBusiness enterApplyBusiness = enterApplyBusinessService.getbyId(model.getObjectid());
            enterApplyBusiness.setManagerDealDate(model.getManagerDealDate());
            enterApplyBusiness.setManagerMemo(model.getManagerMemo());
            boolean rst = enterApplyBusinessService.update(enterApplyBusiness);
            if (rst) {
                return Msg(true, ConstClass.ResultSaveSuccess);
            } else {
                return Msg(false, ConstClass.ResultSaveFault);
            }
        }
    }

    @RequestMapping(value = "Discuss/Add", method = RequestMethod.POST)
    @PermissionInfo(name = "新增安排洽谈项", module = "后台-业务处理")
    public ResultMessage DiscussAdd(EnterApplyBusiness model) {
        EnterApplyBusiness enterApplyBusiness = enterApplyBusinessService.getbyId(model.getObjectid());
        enterApplyBusiness.setDiscussDate(model.getDiscussDate());
        enterApplyBusiness.setDiscussDealDate(model.getDiscussDealDate());
        enterApplyBusiness.setDiscussMemo(model.getDiscussMemo());
        boolean rst = enterApplyBusinessService.update(enterApplyBusiness);
        if (rst) {
            return Msg(true, ConstClass.ResultSaveSuccess);
        } else {
            return Msg(false, ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "编辑入驻信息", module = "后台-业务处理")
    public EnterApplyBusiness Edit(@PathVariable int id) {
        String sql = "select * from enter_apply_business where enter_apply_id = "+id;
        List<EnterApplyBusiness> enterApplyBusinessList =enterApplyBusinessService.findByDataSQL(sql);
        if (enterApplyBusinessList != null){
            if (0 < enterApplyBusinessList.size()){
                return enterApplyBusinessList.get(0);
            }else {
                EnterApplyBusiness enterApplyBusiness = new EnterApplyBusiness();
                enterApplyBusiness.setEnterApplyId(-207);
                return  enterApplyBusiness;
            }
        }else {
            EnterApplyBusiness enterApplyBusiness = new EnterApplyBusiness();
            enterApplyBusiness.setEnterApplyId(-207);
            return  enterApplyBusiness;
        }
    }
}
