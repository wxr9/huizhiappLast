package com.wiseonline.Controller.Setting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.CheerDay;
import com.wiseonline.Domain.SettingRepair;
import com.wiseonline.Service.Impl.CheerDayServiceImpl;
import com.wiseonline.Service.Impl.SettingRepairServiceImpl;
import com.wiseonline.Utils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * Created by huizhisoft on 15/12/20.
 */
@RestController
@RequestMapping("/Setting/CheerDay")
public class CheerDayServiceController extends BaseController{
    @Autowired
    CheerDayServiceImpl cheerDayService;

    @Autowired
    SettingRepairServiceImpl settingRepairService;

    @RequestMapping(value = "{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查询节假日列表", module = "后台-配置管理")
    public PageResult<CheerDay> getAll(@PathVariable int page, @PathVariable int pageSize, CheerDay model){
        PageResult<CheerDay> models = cheerDayService.findAll(page,pageSize,model);
        return models;
    }
    @RequestMapping(value = "Add",method = RequestMethod.POST)
    @PermissionInfo(name = "新增节假日", module = "后台-配置管理")
    public ResultMessage Add(CheerDay model){
            boolean rst = cheerDayService.save(model);
            if (rst){
                return Msg(true, ConstClass.ResultSaveSuccess);
            }else{
                return Msg(false,ConstClass.ResultSaveFault);
            }
    }
    @RequestMapping(value = "Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "编辑节假日", module = "后台-配置管理")
    public CheerDay Edit(@PathVariable int id){
        CheerDay model = cheerDayService.getbyId(id);
        return model;
    }
    @RequestMapping(value = "Update",method = RequestMethod.POST)
    @PermissionInfo(name = "更新节假日", module = "后台-配置管理")
    public ResultMessage Update(CheerDay model){
            boolean rst = cheerDayService.save(model);
            if (rst){
                return Msg(true, ConstClass.ResultSaveSuccess);
            }else{
                return Msg(false,ConstClass.ResultSaveFault);
            }
    }
    @RequestMapping(value = "Delete/{id}",method = RequestMethod.GET)
    @PermissionInfo(name = "删除节假日", module = "后台-配置信息管理")
    public ResultMessage Delete(@PathVariable int id){
        boolean rst = cheerDayService.delete(id);
        if (rst){
            return Msg(true,ConstClass.ResultDeleteSuccess);
        }else{
            return Msg(false,ConstClass.ResultDeleteFault);
        }
    }
    @RequestMapping(value = "IsCheerDay",method = RequestMethod.GET)
    @PermissionInfo(name = "是否放假", module = "前台-报修判断")
    public ResultMessage IsCheerDay(){
        Date date = new Date();
        SimpleDateFormat dateformat1=new SimpleDateFormat("yyyy-MM-dd");
        String dateString = dateformat1.format(new Date());
        String sql = "select cd.* from cheer_day as cd where cd.cheer_date >='"+dateString+" 00:00:00' and cd.cheer_date <='"+dateString+" 23:59:59'";
        List<CheerDay> cheerDayList = cheerDayService.findByDataSQL(sql);
        if (cheerDayList != null){
            if (0 < cheerDayList.size()){
                return Msg(true,"法定假日");
            }else {
                String weekString = DateUtils.getWeekOfDate(date);
                if (weekString.equals("星期六")||weekString.equals("星期日")){
                    return Msg(true,"休息日");
                }else {
                    return Msg(false,"工作日");
                }
            }
        }else {
            String weekString = DateUtils.getWeekOfDate(date);
            if (weekString.equals("星期六")||weekString.equals("星期日")){
                return Msg(true,"休息日");
            }else {
                return Msg(false,"工作日");
            }
        }
    }
    @RequestMapping(value = "IsRepairEnable/{repairType}",method = RequestMethod.GET)
    @PermissionInfo(name = "是否可以报修", module = "前台-报修判断")
    public ResultMessage IsRepairEnable(@PathVariable int repairType,SettingRepair Model) throws MyException {
        String sql = "select * from setting_repair where repairType="+repairType;
        List<SettingRepair> list = settingRepairService.findByDataSQL(sql);
        String workStart = "";
        String workEnd = "";
        String noWorkStart = "";
        String noWorkEnd = "";
        String message = "不能报修";
        if (list != null){
            if (0 < list.size()) {
                SettingRepair settingRepair = list.get(0);
                if (settingRepair.getBaseEnable() != 0) {
                    workStart = settingRepair.getWorkStartTime();
                    workEnd = settingRepair.getWorkEndTime();
                    noWorkStart = settingRepair.getNonWorkStartTime();
                    noWorkEnd = settingRepair.getNonWorkEndTime();
                    message = settingRepair.getAlertInfo();
                }else {
                    throw new MyException(message);
                }
            }else {
                throw new MyException(message);
            }
        }else {
            throw new MyException(message);
        }
        Date date = new Date();
        SimpleDateFormat dateformat1=new SimpleDateFormat("yyyy-MM-dd");
        String dateString = dateformat1.format(new Date());
        String sql2 = "select cd.* from cheer_day as cd where cd.cheer_date >='"+dateString+" 00:00:00' and cd.cheer_date <='"+dateString+" 23:59:59'";
        List<CheerDay> cheerDayList = cheerDayService.findByDataSQL(sql2);
        if (cheerDayList != null){
            if (0 < cheerDayList.size()){
                try {
                    if (isInTime(date,noWorkStart,noWorkEnd)){
                        return Msg(true,"可以报修");
                    } else {
                        throw new MyException(message);
                    }
                }catch (ParseException e){
                    throw new MyException(message);
                }
            }else {
                String weekString = DateUtils.getWeekOfDate(date);
                if (weekString.equals("星期六")||weekString.equals("星期日")){
                    try {
                        if (isInTime(date,noWorkStart,noWorkEnd)){
                            return Msg(true,"可以报修");
                        } else {
                            throw new MyException(message);
                        }
                    }catch (ParseException e){
                        throw new MyException(message);
                    }
                }else {
                    try {
                        if (isInTime(date,workStart,workEnd)){
                            return Msg(true,"可以报修");
                        } else {
                            throw new MyException(message);
                        }
                    }catch (ParseException e){
                        throw new MyException(message);
                    }
                }
            }
        }else {
            String weekString = DateUtils.getWeekOfDate(date);
            if (weekString.equals("星期六")||weekString.equals("星期日")){
                try {
                    if (isInTime(date,noWorkStart,noWorkEnd)){
                        return Msg(true,"可以报修");
                    } else {
                        throw new MyException(message);
                    }
                }catch (ParseException e){
                    throw new MyException(message);
                }
            }else {
                try {
                    if (isInTime(date,workStart,workEnd)){
                        return Msg(true,"可以报修");
                    } else {
                        throw new MyException(message);
                    }
                }catch (ParseException e){
                    throw new MyException(message);
                }
            }
        }
    }

    private boolean isInTime(Date serverDate,String startTime,String endTime) throws ParseException {
        try {
            Calendar cal = Calendar.getInstance();
            int year = cal.get(Calendar.YEAR);//获取年份
            int month=cal.get(Calendar.MONTH)+1;//获取月份
            int day=cal.get(Calendar.DATE);//获取日
            System.out.println(year+"-----"+month+"======"+day);
            String tStart = year + "-"+month+"-"+day+" "+startTime;
            String tEnd = year + "-"+month+"-"+day+" "+endTime;
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
            long time1 = sdf.parse(tStart).getTime();
            long time2 = sdf.parse(tEnd).getTime();
            long serverTime = serverDate.getTime();
            if (serverTime - time1 > 0 && time2 - serverTime > 0){
                return true;
            }else {
                return false;
            }
        }catch (ParseException e){
            e.printStackTrace();
            return  false;
        }
    }
}
