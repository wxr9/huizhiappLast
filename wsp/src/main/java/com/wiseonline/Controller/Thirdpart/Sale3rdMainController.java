package com.wiseonline.Controller.Thirdpart;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.RedPacket;
import com.wiseonline.Domain.Sale3rdMain;
import com.wiseonline.Service.Sale3rdMainService;
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
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * Created by R7tech on 2/25/2016.
 */
@RestController
@RequestMapping("/Thirdpart")
public class Sale3rdMainController extends BaseController {
    @Autowired
    Sale3rdMainService sale3rdMainService;

    private int isValidDate(Date beginDate, Date endDate, int ruleId){
        if (beginDate.getTime()>endDate.getTime()){
            return 1;
        }
        String bDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(beginDate);
        String eDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(endDate);
        String sql = "select * from sale_3rd_main where ((DATE_FORMAT('"+bDate+"','%Y-%m-%d %H:%i:%S') >= startDate and DATE_FORMAT('"+bDate+"','%Y-%m-%d %H:%i:%S') <= endDate) or (DATE_FORMAT('"+eDate+"','%Y-%m-%d %H:%i:%S') >= startDate and DATE_FORMAT('"+eDate+"','%Y-%m-%d %H:%i:%S') <= endDate))";
        if (ruleId!=-1){
            sql+=" and objectid!="+ruleId;
        }
        List<Sale3rdMain> rList = sale3rdMainService.findByDataSQL(sql);
        if (rList.size()>0){
            return 2;
        }
        return 3;
    }

    @RequestMapping(value = "SaleMain/Edit/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看商优惠信息", module = "后台、前台-商优惠信息块管理")
    public Sale3rdMain BaseEdit(@PathVariable int objectid){
        Sale3rdMain model = sale3rdMainService.getbyId(objectid);
        return model;
    }

    @RequestMapping(value = "SaleMain/Add", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加商优惠信息", module = "后台、前台-商优惠信息块管理")
    public ResultMessage BaseAdd(Sale3rdMain model){
//        switch (isValidDate(model.getStartDate(),model.getEndDate(),-1)){
//            case 1:
//                return Msg(false,"开始时间不能大于结束时间");
//            case 2:
//                return Msg(false,"时间段有误");
//        }
        boolean ret = sale3rdMainService.save(model);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "SaleMain/Update", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加红包信息", module = "后台、前台-红包信息块管理")
    public ResultMessage BaseUpdate(Sale3rdMain model){
//        switch (isValidDate(model.getStartDate(),model.getEndDate(),model.getId())){
//            case 1:
//                return Msg(false,"开始时间不能大于结束时间");
//            case 2:
//                return Msg(false,"时间段有误");
//        }
        Sale3rdMain sale3rdMain = sale3rdMainService.getbyId(model.getId());
        sale3rdMain.setName(model.getName());
        sale3rdMain.setStartDate(model.getStartDate());
        sale3rdMain.setEndDate(model.getEndDate());
        sale3rdMain.setType(model.getType());
        sale3rdMain.setContent(model.getContent());
        boolean ret = sale3rdMainService.update(sale3rdMain);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "SaleMain/Del/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "删除商优惠信息", module = "后台、前台-商优惠信息块管理")
    public ResultMessage BaseDel(@PathVariable int objectid){
        boolean ret = sale3rdMainService.delete(objectid);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "SaleMain/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "列表商优惠信息", module = "后台、前台-商优惠信息块管理")
    public PageResult<Sale3rdMain> BaseList(@PathVariable int page, @PathVariable int pageSize, HttpServletRequest request,Sale3rdMain model){
        return sale3rdMainService.findAll(page,pageSize,model,false,"createTime");
    }
}
