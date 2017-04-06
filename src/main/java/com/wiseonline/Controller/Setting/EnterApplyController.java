package com.wiseonline.Controller.Setting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.EnterApply;
import com.wiseonline.Domain.MainBusiness;
import com.wiseonline.Domain.Park;
import com.wiseonline.Domain.SettingDict;
import com.wiseonline.Service.EnterApplyService;
import com.wiseonline.Service.Impl.MainBusinessServiceImpl;
import com.wiseonline.Service.Impl.ParkServiceImpl;
import com.wiseonline.Service.Impl.SettingDictServiceImpl;
import com.wiseonline.Service.MerchantEvaluateService;
import com.wiseonline.Utils.*;
import org.hibernate.Criteria;
import org.hsqldb.Expression;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import sun.org.mozilla.javascript.internal.regexp.SubString;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * Created by R7tech on 3/9/2016.
 */
@RestController
@RequestMapping("/Setting")
public class EnterApplyController extends BaseController {
    @Autowired
    EnterApplyService enterApplyService;

    @Autowired
    ParkServiceImpl parkService;

    @Autowired
    SettingDictServiceImpl settingDictService;

    @Autowired
    WorkFlowUtils workFlowUtils;
    @Autowired
    MainBusinessServiceImpl mainBusinessService;

    @RequestMapping(value = "EnterApply/Edit/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看入驻申请信息", module = "后台、前台-入驻申请信息块管理")
    public EnterApply BaseEdit(@PathVariable int objectid) {
        EnterApply model = enterApplyService.getbyId(objectid);
        if (model != null) {
            String[] parkId = model.getPark().split(",");
            StringBuffer sb = new StringBuffer();
            for (String park : parkId) {
                if (!"".equals(park)) {
                    SettingDict p = settingDictService.getbyId(Integer.parseInt(park));
                    if (park != null) {
                        sb.append(p.getName() + ",");
                    }
                }
            }
            if (1 < sb.length()) {
                sb.deleteCharAt(sb.length() - 1);
            }
            model.setParkName(sb.toString());
        }
        return model;
    }

    @RequestMapping(value = "EnterApply/Add", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加入驻申请信息", module = "后台、前台-入驻申请信息块管理")
    public ResultMessage BaseAdd(EnterApply model,String[] parks) throws ParseException, MyException {
        StringBuffer sb = new StringBuffer();
        if (parks != null) {
            if (0 < parks.length) {
                for (String park : parks) {
                    sb.append(park + ",");
                }
                sb.deleteCharAt(sb.length()-1);
            }else {
                throw new MyException("请选择园区");
            }
        }else {
            throw new MyException("请选择园区");
        }
        model.setPark(sb.toString());
        if (model.getsStafffId() != 0) {
            SettingDict settingDict = settingDictService.getbyId(model.getsStafffId());
            model.setsStaff(settingDict);
        }
        if (model.getsTypeId() != 0) {
            SettingDict settingDict = settingDictService.getbyId(model.getsTypeId());
            model.setsType(settingDict);
        }
        model.setSerialNumber(getMaxSN("RZ"));
        String username = getUserName();
        model.setUsername(username);
        boolean ret = enterApplyService.saveGetID(model);
        if (ret) {
            MainBusiness mainBusiness = new MainBusiness();
            mainBusiness.setSerialNumber(model.getSerialNumber());
            mainBusiness.setBusinessId(model.getObjectid());
            mainBusiness.setBusinessType("enterApply");
            mainBusiness.setBusinessTypeZh("入驻申请");
            mainBusiness.setChineseName(model.getChineseName());
            mainBusiness.setCommentFlag(1);
            mainBusiness.setCompany(model.getCompany());
            mainBusiness.setEmail(model.getEmail());
            mainBusiness.setPhone(model.getContact());
            mainBusiness.setUsername(model.getUsername());
            mainBusinessService.save(mainBusiness);
            CreateDomain createDomain = workFlowUtils.Create(10);
            try {
                workFlowUtils.NewTransfer(createDomain, model.getSerialNumber(), model.getObjectid(), "rz");
            } catch (MyException e) {
                enterApplyService.delete(model.getObjectid());
                e.printStackTrace();
                return Msg(false, ConstClass.ResultSaveFault);
            }
            return Msg(true, ConstClass.ResultSaveSuccess);
        } else {
            return Msg(false, ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "EnterApply/Update", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加入驻申请信息", module = "后台、前台-入驻申请信息块管理")
    public ResultMessage BaseUpdate(EnterApply model) {
        boolean ret = enterApplyService.update(model);
        if (ret) {
            return Msg(true, ConstClass.ResultSaveSuccess);
        } else {
            return Msg(false, ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "EnterApply/Special/Update", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加入驻申请信息", module = "后台、前台-入驻申请信息块管理")
    public ResultMessage SpecialBaseUpdate(EnterApply model) {
        EnterApply enterApply = enterApplyService.getbyId(model.getObjectid());
        boolean ret = enterApplyService.update(enterApply);
        if (ret) {
            return Msg(true, ConstClass.ResultSaveSuccess);
        } else {
            return Msg(false, ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "EnterApply/Delete/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "删除入驻申请信息", module = "后台、前台-入驻申请信息块管理")
    public ResultMessage BaseDel(@PathVariable int objectid) {
        boolean ret = enterApplyService.delete(objectid);
        if (ret) {
            return Msg(true, ConstClass.ResultDeleteSuccess);
        } else {
            return Msg(false, ConstClass.ResultDeleteFault);
        }
    }

    @RequestMapping(value = "EnterApply/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "列表入驻申请信息", module = "后台、前台-入驻申请信息块管理")
    public PageResult<EnterApply> BaseList(HttpServletRequest request, @PathVariable int page, @PathVariable int pageSize, EnterApply Model) {
        String startTime = request.getParameter("startTime");
        String endTime = request.getParameter("endTime");
        String sql = "select * from enter_apply where create_date > '";
        String sql2 = sql;
        PageResult<EnterApply> models = new PageResult<EnterApply>();

        if (startTime != null && !startTime.equals("")) {
            sql += startTime + " 00:00:00'";
        }
        if (endTime != null && !endTime.equals("")) {
            sql += " and create_date < '" + endTime + " 23:59:59'";
        }

        if (sql2.equals(sql)) {
            models = enterApplyService.findAll(page, pageSize, Model, false, "createDate");
            return models;
        }

        sql += " order by create_date asc";
        List<EnterApply> eList = enterApplyService.findByDataSQL(sql);
        if (eList == null) {
            eList = new ArrayList<EnterApply>();
        }
        models.setResult(eList);
        models.setPagesize(pageSize);
        models.setPage(page);
        models.setTotal(eList.size());
        return models;


    }

    public String getMaxSN(String typeName) {
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
        String sql = "select CAST(ifnull(MAX(CAST(substring_index(serial_number,'-',-1) AS UNSIGNED INTEGER)),0) as UNSIGNED INTEGER) as num\n" +
                "from enter_apply \n" +
                "where date_format(create_date,'%Y-%m-%d')= date_format(now(),'%Y-%m-%d')";
        int SN = enterApplyService.getCountBySQL(sql);
        return typeName + "-" + df.format(new Date()) + "-" + String.format("%04d", SN + 1);
    }

    @RequestMapping(value = "EnterApply/Export/List", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "导出入驻申请情况", module = "后台-课程")
    public void ExportGetAll(HttpServletResponse response, HttpServletRequest request, EnterApply Model) {
        String startTime = request.getParameter("startTime");
        String endTime = request.getParameter("endTime");
        String sql = "select * from enter_apply where create_date between DATE_FORMAT('";
        String sql2 = sql;

        if (startTime != null && !startTime.equals("")) {
            sql += startTime + "','%Y-%m-%d')";
        }
        if (endTime != null && !endTime.equals("")) {
            sql += " and DATE_FORMAT('" + endTime + "','%Y-%m-%d')";
        }
        List<EnterApply> eList = new ArrayList<EnterApply>();
        if (sql2.equals(sql)) {
            eList = enterApplyService.findAll(0, 0, Model).getResult();
        } else {
            eList = enterApplyService.findByDataSQL(sql);
        }
        String[] str = new String[]{"申请人", "E-mail", "公司名称", "联系方式", "企业规模", "产业类别", "园区", "需求面积"};
        if (eList != null) {
            if (0 < eList.size()) {
                List<EnterApplyExcel> result = new ArrayList<EnterApplyExcel>();
                for (int i = 0; i < eList.size(); i++) {
                    EnterApplyExcel enterApplyExcel = new EnterApplyExcel();
                    enterApplyExcel.setArea(eList.get(i).getArea());
                    enterApplyExcel.setChineseName(eList.get(i).getChineseName());
                    enterApplyExcel.setCompany(eList.get(i).getCompany());
                    enterApplyExcel.setContact(eList.get(i).getContact());
                    enterApplyExcel.setEmail(eList.get(i).getEmail());
                    if (eList.get(i).getPark() != null) {
                        String[] parkId = eList.get(i).getPark().split(",");
                        StringBuffer sb = new StringBuffer();
                        for (String park:parkId){
                            SettingDict p = settingDictService.getbyId(Integer.parseInt(park));
                            if (park != null){
                                sb.append(p.getName()+",");
                            }
                        }
                        sb.substring(0,sb.length() - 2);
                        enterApplyExcel.setParkName(sb.toString());
                    }
                    if (eList.get(i).getsStaff() != null) {
                        enterApplyExcel.setsStafff(eList.get(i).getsStaff().getName());
                    }
                    if (eList.get(i).getsType() != null) {
                        enterApplyExcel.setsType(eList.get(i).getsType().getName());
                    }
                    result.add(enterApplyExcel);
                }
                SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd H:m:s");
                Calendar c1 = Calendar.getInstance();
                c1.setTime(new Date());
                ExportExcel.exportExcel(response, "入驻申请-" + format.format(c1.getTime()) + ".xls", str, result);
            }
        }
    }
}
