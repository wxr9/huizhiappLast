package com.wiseonline.Controller.EnterpristCultivate;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.EnterpriseCultivate;
import com.wiseonline.Domain.EnterpristCultivateProject;
import com.wiseonline.Domain.MainBusiness;
import com.wiseonline.Domain.SettingDict;
import com.wiseonline.Service.Impl.EnterpriseCultivateServiceImpl;
import com.wiseonline.Service.Impl.EnterpristCultivateProjectServiceImpl;
import com.wiseonline.Service.Impl.MainBusinessServiceImpl;
import com.wiseonline.Service.Impl.SettingDictServiceImpl;
import com.wiseonline.Utils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by yanwj on 2016/3/21.
 */
@RestController
@RequestMapping("/EnterpriseCultivate/EnterpriseCultivate")
public class EnterpriseCultivateController extends BaseController {
    @Autowired
    EnterpriseCultivateServiceImpl enterpriseCultivateService;
    @Autowired
    SettingDictServiceImpl settingDictService;
    @Autowired
    EnterpristCultivateProjectServiceImpl enterpristCultivateProjectService;
    @Autowired
    WorkFlowUtils workFlowUtils;
    @Autowired
    MainBusinessServiceImpl mainBusinessService;


    @RequestMapping(value = "List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看企业培训申请列表", module = "前台-企业培训")
    public PageResult<EnterpriseCultivate> getAll(@PathVariable int page,
                                                  @PathVariable int pageSize, EnterpriseCultivate Model) {
        PageResult<EnterpriseCultivate> models = enterpriseCultivateService.findAll(page, pageSize, Model);
        return models;
    }

    @RequestMapping(value = "Add", method = RequestMethod.POST)
    @PermissionInfo(name = "添加企业培训申请", module = "前台-企业培训")
    public ResultMessage Add(EnterpriseCultivate Model, String[] priojectidArray, String[] peoplesArray) throws MyException, ParseException {
        CreateDomain createDomain = workFlowUtils.Create(3);
        if (priojectidArray.length == peoplesArray.length) {
            String username = getUserName();
            if (!username.equals("anonymousUser")) {
                if ("ok".equals(isUserInfoComplete())) {
                    Model.setSerialNumber(getMaxSN("PX"));
                    Model.setUsername(username);
                    boolean rst = enterpriseCultivateService.saveGetID(Model);
                    MainBusiness mainBusiness = new MainBusiness();
                    mainBusiness.setSerialNumber(Model.getSerialNumber());
                    mainBusiness.setBusinessId(Model.getObjectid());
                    mainBusiness.setBusinessType("enterpriseCultivate");
                    mainBusiness.setBusinessTypeZh("企业培训");
                    mainBusiness.setChineseName(Model.getChineseName());
                    mainBusiness.setCommentFlag(1);
                    mainBusiness.setCompany(Model.getCompany());
                    mainBusiness.setEmail(Model.getEmail());
                    mainBusiness.setPhone(Model.getPhone());
                    mainBusiness.setUsername(Model.getUsername());
                    mainBusinessService.save(mainBusiness);
                    if (rst) {
                        for (int i = 0; i < priojectidArray.length; i++) {
                            EnterpristCultivateProject enterpristCultivateProject = new EnterpristCultivateProject();
                            SettingDict settingDict = settingDictService.getbyId(Integer.parseInt(priojectidArray[i]));
                            enterpristCultivateProject.setProject(settingDict);
                            enterpristCultivateProject.setPeoples(peoplesArray[i]);
                            enterpristCultivateProject.setEnterpriseCultivate(Model);
                            enterpristCultivateProject.setEnterprist_cultivate_id(Model.getObjectid());
                            enterpristCultivateProjectService.save(enterpristCultivateProject);
                        }
                        try {
                            workFlowUtils.NewTransfer(createDomain, Model.getSerialNumber(), Model.getObjectid(), "qypx");
                        } catch (MyException e) {
                            enterpriseCultivateService.delete(Model.getObjectid());
                            e.printStackTrace();
                            return Msg(false, ConstClass.ResultSaveFault);
                        }
                        return Msg(true, ConstClass.ResultSaveSuccess);
                    } else {
                        return Msg(false, ConstClass.ResultSaveFault);
                    }
                } else {
                    throw new MyException("请完善个人资料");
                }
            } else {
                throw new MyException(ConstClass.LoginTimeOut);
            }
        } else {
            return Msg(false, "提交数据有误");
        }
    }

    @RequestMapping(value = "Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "编辑企业培训申请", module = "前台-企业培训")
    public EnterpriseCultivate Edit(@PathVariable int id) {
        EnterpriseCultivate model = enterpriseCultivateService.getbyId(id);
        String busType = model.getBusinessType();
        if (!"".equals(busType)){
            SettingDict settingDict = settingDictService.getbyId(Integer.parseInt(busType));
            model.setBusinessTypeString(settingDict.getName());
        }
        return model;
    }

    @RequestMapping(value = "Update", method = RequestMethod.POST)
    @PermissionInfo(name = "更新企业培训申请", module = "前台-企业培训")
    public ResultMessage Update(EnterpriseCultivate Model) throws MyException {
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            boolean rst = enterpriseCultivateService.update(Model);
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
    @PermissionInfo(name = "删除企业培训申请", module = "前台-企业培训")
    public ResultMessage Delete(@PathVariable int id) {
        boolean rst = enterpriseCultivateService.delete(id);
        if (rst) {
            return Msg(true, "取消预约成功");
        } else {
            return Msg(false, "取消预约失败");
        }
    }

    public String getMaxSN(String typeName) {
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
        String sql = "select CAST(ifnull(MAX(CAST(substring_index(serial_number,'-',-1) AS UNSIGNED INTEGER)),0) as UNSIGNED INTEGER) as num\n" +
                "from enterprist_cultivate \n" +
                "where date_format(create_date,'%Y-%m-%d')= date_format(now(),'%Y-%m-%d')";
        int SN = enterpriseCultivateService.getCountBySQL(sql);
        return typeName + "-" + df.format(new Date()) + "-" + String.format("%04d", SN + 1);
    }
}
