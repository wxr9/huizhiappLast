package com.wiseonline.Controller.Incubator;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.UserCultivate;
import com.wiseonline.Domain.UserIncubator;
import com.wiseonline.Service.Impl.UserIncubatorServiceImpl;
import com.wiseonline.Utils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * Created by yanwj on 2016/3/17.
 */
@RestController
@RequestMapping("/Incubator/UserIncubator")
public class UserIncubatorController extends BaseController {
    @Autowired
    UserIncubatorServiceImpl userIncubatorService;

    @RequestMapping(value = "List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看孵化注册预约列表", module = "前台-孵化预约")
    public PageResult<UserIncubator> getAll(@PathVariable int page,
                                            @PathVariable int pageSize, UserIncubator Model) {
        PageResult<UserIncubator> models = userIncubatorService.findByOneField(page,pageSize,"deleteFlag",1,true,"objectid",Model);
        return models;
    }

    @RequestMapping(value = "My/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "我的孵化注册预约列表", module = "前台-孵化预约")
    public PageResult<UserIncubator> MyGetAll(@PathVariable int page,
                                              @PathVariable int pageSize, UserIncubator Model) {
        String sql = "select * from user_incubator where username='" + getUserName() + "'";
        String sql2 = "";
        if (page == 1) {
            sql2 = "select * from user_incubator where username='" + getUserName() + "' ORDER BY create_date DESC limit 0," + pageSize;
        } else if ((page == 0)) {
            sql2 = sql;
        } else {
            sql2 = "select * from user_incubator where username='" + getUserName() + "'  ORDER BY create_date DESC limit " + (page - 1) * pageSize + "," + pageSize;
        }
        PageResult<UserIncubator> pageResult = new PageResult<UserIncubator>();
        List<UserIncubator> list = userIncubatorService.findByDataSQL(sql);
        if (list != null) {
            pageResult.setTotal(list.size());
        } else {
            pageResult.setTotal(0);
        }
        List<UserIncubator> listObject = userIncubatorService.findByDataSQL(sql2);
        pageResult.setResult(listObject);
        pageResult.setPage(0);
        pageResult.setPagesize(pageSize);
        return pageResult;
    }

    @RequestMapping(value = "Search/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "我的孵化注册预约列表", module = "前台-孵化预约")
    public PageResult<UserIncubator> SearchGetAll(@PathVariable int page,
                                                  @PathVariable int pageSize, UserIncubator Model, HttpServletRequest request) {
        String beginDate = request.getParameter("beginDate");
        String endDate = request.getParameter("endDate");
        if ("".equals(beginDate) || "".equals(endDate)){
            PageResult<UserIncubator> models = userIncubatorService.findAll(page, pageSize, Model);
            return models;
        }else {
            String sql = "select * from user_incubator where appointment_date >= '" + beginDate + " 00:00:00' and appointment_date <= '" + endDate + " 23:59:59' and deleteflag = 1";
            String sql2 = "";
            if (page == 1) {
                sql2 = "select * from user_incubator where appointment_date >= '" + beginDate + " 00:00:00' and appointment_date <= '" + endDate + " 23:59:59' and deleteflag = 1 ORDER BY create_date DESC limit 0," + pageSize;
            } else if ((page == 0)) {
                sql2 = sql;
            } else {
                sql2 = "select * from user_incubator where appointment_date >= '" + beginDate + " 00:00:00' and appointment_date <= '" + endDate + " 23:59:59' and deleteflag = 1 ORDER BY create_date DESC limit " + (page - 1) * pageSize + "," + pageSize;
            }
            PageResult<UserIncubator> pageResult = new PageResult<UserIncubator>();
            List<UserIncubator> list = userIncubatorService.findByDataSQL(sql);
            if (list != null) {
                pageResult.setTotal(list.size());
            } else {
                pageResult.setTotal(0);
            }
            List<UserIncubator> listObject = userIncubatorService.findByDataSQL(sql2);
            pageResult.setResult(listObject);
            pageResult.setPage(0);
            pageResult.setPagesize(pageSize);
            return pageResult;
        }
    }

    @RequestMapping(value = "Add", method = RequestMethod.POST)
    @PermissionInfo(name = "添加孵化预约", module = "前台-孵化预约")
    public ResultMessage Add(UserIncubator Model) throws MyException {
        if (IsDateAvailable(Model.getAppointmentDate())) {
            if (Model.getDeleteFlag() == 0) {
                Model.setDeleteFlag(1);
            }
            Model.setSerialNumber(getMaxSN("FH"));
            String username = getUserName();
            Model.setUsername(username);
            if (!username.equals("anonymousUser")) {
                if ("ok".equals(isUserInfoComplete())) {
                    Calendar cal = Calendar.getInstance();
                    cal.setTime(Model.getAppointmentDate());
                    int year = cal.get(Calendar.YEAR);//获取年份
                    int month = cal.get(Calendar.MONTH)+1;//获取月份
                    int day = cal.get(Calendar.DATE);//获取日
                    String sql = "select * from user_incubator where deleteflag=1 and appointment_date >= '" + year + "-" + month + "-" + day + "' and appointment_date < '" + year + "-" + month + "-" + (day + 1) + "'";
                    List<UserIncubator> userIncubatorList = userIncubatorService.findByDataSQL(sql);
                    int flag = 0;
                    if (userIncubatorList != null) {
                        if (userIncubatorList.size() >= 10) {
                            flag = 1;
                        }
                    }
                    if (flag == 0) {
                        boolean rst = userIncubatorService.save(Model);
                        if (rst) {
                            return Msg(true, ConstClass.ResultSaveSuccess);
                        } else {
                            return Msg(false, ConstClass.ResultSaveFault);
                        }
                    } else {
                        return Msg(false, "当日预约人数已超过10人，请更换日期。");
                    }
                } else {
                    throw new MyException("请完善个人资料");
                }
            } else {
                throw new MyException(ConstClass.LoginTimeOut);
            }
        } else {
            return Msg(false, "预约时间不正确（本周或者下周周二/周四）");
        }
    }

    @RequestMapping(value = "Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "编辑孵化预约", module = "前台-孵化预约")
    public UserIncubator Edit(@PathVariable int id) {
        UserIncubator model = userIncubatorService.getbyId(id);
        return model;
    }

    @RequestMapping(value = "Update", method = RequestMethod.POST)
    @PermissionInfo(name = "更新孵化预约", module = "前台-孵化预约")
    public ResultMessage Update(UserIncubator Model) throws MyException {
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            boolean rst = userIncubatorService.update(Model);
            if (rst) {
                return Msg(true, ConstClass.ResultSaveSuccess);
            } else {
                return Msg(false, ConstClass.ResultSaveFault);
            }
        } else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }

    @RequestMapping(value = "Delete/{id}", method = RequestMethod.GET)
    @PermissionInfo(name = "取消孵化预约", module = "前台-孵化预约")
    public ResultMessage Delete(@PathVariable int id) {
        UserIncubator userIncubator = userIncubatorService.getbyId(id);
        if (CanRecycle(userIncubator.getAppointmentDate())) {
            userIncubator.setDeleteFlag(-1);
            boolean rst = userIncubatorService.update(userIncubator);
            if (rst) {
                return Msg(true, "取消预约成功");
            } else {
                return Msg(false, "取消预约失败");
            }
        } else {
            return Msg(false, "无法取消预约");
        }
    }

    private boolean IsDateAvailable(Date date) {
        Calendar dateOne = Calendar.getInstance(), dateTwo = Calendar.getInstance();
        dateOne.setTime(new Date());    //设置为当前系统时间
        dateTwo.setTime(date);    //设置为2015年1月15日
        long timeOne = dateOne.getTimeInMillis();
        long timeTwo = dateTwo.getTimeInMillis();
        long minute = (timeTwo - timeOne) / (1000 * 60);//转化minute

        int myweekday = date.getDay();
        int myhour = date.getHours();
        int myMinute = date.getMinutes();
        if (myweekday == 2 || myweekday == 4) {
            /*if (myhour >= 13 && myhour <= 16) {
                if (myhour == 16) {
                    if (myMinute == 0) {
                        if (0 < minute && minute < 15840) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                } else {
                    if (0 < minute && minute < 15840) {
                        return true;
                    } else {
                        return false;
                    }
                }
            } else {
                return false;
            }*/
            return true;
        } else {
            return false;
        }
    }

    private boolean CanRecycle(Date date) {
        Calendar dateOne = Calendar.getInstance(), dateTwo = Calendar.getInstance();
        dateOne.setTime(new Date());    //设置为当前系统时间
        dateTwo.setTime(date);    //设置为2015年1月15日
        long timeOne = dateOne.getTimeInMillis();
        long timeTwo = dateTwo.getTimeInMillis();
        long minute = (timeTwo - timeOne) / (1000 * 60);//转化minute
        System.out.println(date);
        System.out.println(timeOne);
        System.out.println(timeTwo);
        if (minute > 720) {
            return true;
        } else {
            return false;
        }
    }

    public String getMaxSN(String typeName) {
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
        String sql = "select CAST(ifnull(MAX(CAST(substring_index(serial_number,'-',-1) AS UNSIGNED INTEGER)),0) as UNSIGNED INTEGER) as num\n" +
                "from user_incubator \n" +
                "where date_format(create_date,'%Y-%m-%d')= date_format(now(),'%Y-%m-%d')";
        int SN = userIncubatorService.getCountBySQL(sql);
        return typeName + "-" + df.format(new Date()) + "-" + String.format("%04d", SN + 1);
    }

    @RequestMapping(value = "Export/List", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "导出孵化预约申请情况", module = "后台-孵化")
    public void ExportGetAll(HttpServletResponse response,HttpServletRequest request,UserIncubator Model) {
        String beginDate = request.getParameter("beginDate");
        String endDate = request.getParameter("endDate");
        String sql = "";
        if ("".equals(beginDate) || "".equals(endDate)){
            sql  = "select * from user_incubator where appointment_date >= '" + beginDate + "' and appointment_date <= '" + endDate + "'and deleteflag = 1";
        }else {
            sql  = "select * from user_incubator where deleteflag = 1";
        }
        List<UserIncubator> list = userIncubatorService.findByDataSQL(sql);
        String[] str = new String[]{"预约人","公司名称","联系方式","E-mail","租赁类别","预约时间"};
        if (list != null) {
            if ( 0 < list.size()) {
                List<IncubatorExcel> result = new ArrayList<IncubatorExcel>();
                for (UserIncubator userIncubator : list) {
                    IncubatorExcel incubatorExcel = new IncubatorExcel();
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                    incubatorExcel.setAppointmentDate(sdf.format(userIncubator.getAppointmentDate()));
                    incubatorExcel.setCompany(userIncubator.getCompany());
                    incubatorExcel.setChineseName(userIncubator.getChineseName());
                    incubatorExcel.setEmail(userIncubator.getEmail());
                    incubatorExcel.setPhone(userIncubator.getPhone());
                    if (userIncubator.getRentType() == 1) {
                        incubatorExcel.setRentType("新租一年");
                    } else if (userIncubator.getRentType() == 2){
                        incubatorExcel.setRentType("续租一年");
                    }else {
                        incubatorExcel.setRentType("续租两年");
                    }
                    result.add(incubatorExcel);
                }
                SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd H:m:s");
                Calendar c1 = Calendar.getInstance();
                c1.setTime(new Date());
                ExportExcel.exportExcel(response, "孵化预约-" + format.format(c1.getTime()) + ".xls", str, result);
            }
        }
    }
}
