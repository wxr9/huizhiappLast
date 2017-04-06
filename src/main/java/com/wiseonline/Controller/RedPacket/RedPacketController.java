package com.wiseonline.Controller.RedPacket;
/**
 * Created by R7tech on 10/12/2016.
 */

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.RedPacket;
import com.wiseonline.Service.ActivityApplyService;
import com.wiseonline.Service.RedPacketService;
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
import javax.servlet.http.HttpServletResponse;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;


/**
 * Created by R7tech on 2/25/2016.
 */
@RestController
@RequestMapping("/RedPacket/Setting")
public class RedPacketController extends BaseController {
    @Autowired
    RedPacketService redPacketService;
    @Autowired
    ActivityApplyService activityApplyService;

    private int isValidDate(Date beginDate, Date endDate,int ruleId){
        if (beginDate.getTime()>endDate.getTime()){
            return 1;
        }
        String bDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(beginDate);
        String eDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(endDate);
        String sql = "select * from red_packet where ((DATE_FORMAT('"+bDate+"','%Y-%m-%d %H:%i:%S') >= startDate and DATE_FORMAT('"+bDate+"','%Y-%m-%d %H:%i:%S') <= endDate) or (DATE_FORMAT('"+eDate+"','%Y-%m-%d %H:%i:%S') >= startDate and DATE_FORMAT('"+eDate+"','%Y-%m-%d %H:%i:%S') <= endDate))";
        if (ruleId!=-1){
            sql+=" and id!="+ruleId;
        }
        List<RedPacket> rList = redPacketService.findByDataSQL(sql);
        if (rList.size()>0){
            return 2;
        }
        return 3;
    }

    @RequestMapping(value = "RedPacket/Edit/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看红包信息", module = "后台、前台-红包信息块管理")
    public RedPacket BaseEdit(@PathVariable int objectid){
        RedPacket model = redPacketService.getbyId(objectid);
        return model;
    }

    @RequestMapping(value = "RedPacket/Add", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加红包信息", module = "后台、前台-红包信息块管理")
    public ResultMessage BaseAdd(RedPacket model){
        switch (isValidDate(model.getStartDate(),model.getEndDate(),-1)){
            case 1:
                return Msg(false,"开始时间不能大于结束时间");
            case 2:
                return Msg(false,"时间段有误");
        }
        model.setEnableRule(true);
        model.setHitPersent(model.getHitPersent()/100);
        boolean ret = redPacketService.save(model);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "RedPacket/Update", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加红包信息", module = "后台、前台-红包信息块管理")
    public ResultMessage BaseUpdate(RedPacket model){
        switch (isValidDate(model.getStartDate(),model.getEndDate(),model.getId())){
            case 1:
                return Msg(false,"开始时间不能大于结束时间");
            case 2:
                return Msg(false,"时间段有误");
        }
        RedPacket redPacket = redPacketService.getbyId(model.getId());
        redPacket.setName(model.getName());
        redPacket.setTotalSum(model.getTotalSum());
        redPacket.setStartDate(model.getStartDate());
        redPacket.setEndDate(model.getEndDate());
        redPacket.setValidDate(model.getValidDate());
        redPacket.setHitPersent(model.getHitPersent()/100);
        redPacket.setDotEnable(model.getDotEnable());
        redPacket.setMinSum(model.getMinSum());
        redPacket.setMaxSum(model.getMaxSum());
        boolean ret = redPacketService.update(redPacket);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "RedPacket/Del/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "删除红包信息", module = "后台、前台-红包信息块管理")
    public ResultMessage BaseDel(@PathVariable int objectid){
        boolean ret = redPacketService.delete(objectid);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "RedPacket/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "列表红包信息", module = "后台、前台-红包信息块管理")
    public PageResult<RedPacket> BaseList(@PathVariable int page, @PathVariable int pageSize, RedPacket model){
        PageResult<RedPacket> models = redPacketService.findAll(page, pageSize, model,true,"endDate");
        return models;
    }

    @RequestMapping(value = "RedPacket/BanSet", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "禁用红包信息", module = "后台、前台-红包信息块管理")
    public ResultMessage BaseBan(HttpServletRequest request){
        int objectid = Integer.valueOf(request.getParameter("objectId"));
        Boolean isBan = Boolean.valueOf(request.getParameter("isBan"));
        RedPacket model = redPacketService.getbyId(objectid);
        model.setEnableRule(isBan);
        boolean ret = redPacketService.update(model);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "RedPacket/StatisticGraphData", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "统计红包信息", module = "后台、前台-红包信息块管理")
    public void BaseStatistic(HttpServletResponse response){
        
    }
}

