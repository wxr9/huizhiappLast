package com.wiseonline.Controller.HuizhiCard;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.CardAnnoucement;
import com.wiseonline.Domain.RedPacket;
import com.wiseonline.Service.CardAnnoucementService;
import com.wiseonline.Service.Impl.UserServiceImpl;
import com.wiseonline.Utils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created by R7tech on 3/7/2017.
 */
@RestController
@RequestMapping("/Payment")
public class AnnoucementController extends BaseController{
    @Autowired
    CardAnnoucementService cardAnnoucementService;
    @Autowired
    UserServiceImpl userService;

    @RequestMapping(value = "Annoucement/Edit/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看汇智卡公告信息", module = "后台、前台-活动报名信息块管理")
    public CardAnnoucement BaseEdit(@PathVariable int objectid){
        CardAnnoucement model = cardAnnoucementService.getbyId(objectid);
        return model;
    }

    @RequestMapping(value = "Annoucement/Add", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加汇智卡公告信息", module = "后台、前台-活动报名信息块管理")
    public ResultMessage BaseAdd(CardAnnoucement model){
        model.setUsername(getUserName());
        boolean ret = cardAnnoucementService.save(model);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "Annoucement/Del/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "删除汇智卡公告信息", module = "后台、前台-活动报名信息块管理")
    public ResultMessage BaseDel(@PathVariable int objectid){
        boolean ret = cardAnnoucementService.delete(objectid);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "Annoucement/Judge", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "删除汇智卡公告信息", module = "后台、前台-活动报名信息块管理")
    public List<CardAnnoucement> BaseJudge() throws MyException {
        String sql = "select * from card_annoucement where startTime<DATE_FORMAT(NOW(),'%Y-%m-%d %H:%i:%S') and endTime>DATE_FORMAT(NOW(),'%Y-%m-%d %H:%i:%S')";
        List<CardAnnoucement> rList = cardAnnoucementService.findByDataSQL(sql);
        if (rList.size()!=0){
            return rList;
        }else{
            throw new MyException("no valid data");
        }
    }

    @RequestMapping(value = "Annoucement/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "列表汇智卡公告信息", module = "后台、前台-活动报名信息块管理")
    public PageResult<CardAnnoucement> BaseList(@PathVariable int page, @PathVariable int pageSize, CardAnnoucement model){
        PageResult<CardAnnoucement> models = cardAnnoucementService.findAll(page, pageSize, model);
        return models;
    }
}
