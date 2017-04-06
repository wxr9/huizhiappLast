package com.wiseonline.Controller.TestApplyfor;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.MainBusiness;
import com.wiseonline.Domain.SettingDict;
import com.wiseonline.Domain.UserTestApplyfor;
import com.wiseonline.Service.Impl.MainBusinessServiceImpl;
import com.wiseonline.Service.Impl.SettingDictServiceImpl;
import com.wiseonline.Service.Impl.UserTestApplyforServiceImpl;
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
 * Created by yanwj on 2016/2/22.
 */
@RestController
@RequestMapping("/TestApplyfor/UserTestApplyfor")
public class UserTestApplyforController extends BaseController{
    @Autowired
    UserTestApplyforServiceImpl userTestApplyforService;
    @Autowired
    SettingDictServiceImpl settingDictService;

    @Autowired
    WorkFlowUtils workFlowUtils;
    @Autowired
    MainBusinessServiceImpl mainBusinessService;

    @RequestMapping(value = "List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看测试申请列表", module = "前台-测试")
    public PageResult<UserTestApplyfor> getAll(@PathVariable int page,
                                     @PathVariable int pageSize, UserTestApplyfor Model) {
        PageResult<UserTestApplyfor> models = userTestApplyforService.findAll(page, pageSize, Model);
        return models;
    }
    @RequestMapping(value = "Add", method = RequestMethod.POST)
    @PermissionInfo(name = "添加测试申请", module = "前台-测试")
    public ResultMessage Add(UserTestApplyfor Model) throws MyException, ParseException {
        CreateDomain createDomain = workFlowUtils.Create(8);
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            Model.setSerialNumber(getMaxSN("CS"));
            Model.setUsername(username);
            if (Model.getTestTypeId() != 0){
                SettingDict settingDict = settingDictService.getbyId(Model.getTestTypeId());
                Model.setTestType(settingDict);
            }
            boolean rst = userTestApplyforService.saveGetID(Model);
            MainBusiness mainBusiness = new MainBusiness();
            mainBusiness.setSerialNumber(Model.getSerialNumber());
            mainBusiness.setBusinessId(Model.getObjectid());
            mainBusiness.setBusinessType("userTestApplyfor");
            mainBusiness.setBusinessTypeZh("测试申请");
            mainBusiness.setChineseName(Model.getChineseName());
            mainBusiness.setCommentFlag(1);
            mainBusiness.setCompany(Model.getCompany());
            mainBusiness.setEmail(Model.getEmail());
            mainBusiness.setPhone(Model.getPhone());
            mainBusiness.setUsername(Model.getUsername());
            mainBusinessService.save(mainBusiness);
            if (rst){
                try {
                    workFlowUtils.NewTransfer(createDomain, Model.getSerialNumber(), Model.getObjectid(), "cs");
                } catch (MyException e) {
                    userTestApplyforService.delete(Model.getObjectid());
                    e.printStackTrace();
                    return Msg(false, ConstClass.ResultSaveFault);
                }
                return Msg(true, ConstClass.ResultSaveSuccess);
            }else {
                return Msg(false,ConstClass.ResultSaveFault);
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }
    @RequestMapping(value = "Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "编辑测试申请", module = "前台-测试")
    public UserTestApplyfor Edit(@PathVariable int id) {
        UserTestApplyfor model = userTestApplyforService.getbyId(id);
        return model;
    }
    @RequestMapping(value = "Update", method = RequestMethod.POST)
    @PermissionInfo(name = "更新测试申请", module = "前台-测试")
    public ResultMessage Update(UserTestApplyfor Model) throws MyException {
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            boolean rst = userTestApplyforService.update(Model);
            if (rst){
                return Msg(true,ConstClass.ResultSaveSuccess);
            }else {
                return Msg(false,ConstClass.ResultSaveFault);
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }
    @RequestMapping(value = "Delete/{id}", method = RequestMethod.GET)
    @PermissionInfo(name = "删除测试申请", module = "前台-测试")
    public ResultMessage Delete(@PathVariable int id) {
        boolean rst = userTestApplyforService.delete(id);
        if (rst) {
            return Msg(true, ConstClass.ResultDeleteSuccess);
        } else {
            return Msg(false, ConstClass.ResultDeleteFault);
        }
    }

    public String getMaxSN(String typeName) {
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
        String sql = "select CAST(ifnull(MAX(CAST(substring_index(serial_number,'-',-1) AS UNSIGNED INTEGER)),0) as UNSIGNED INTEGER) as num\n" +
                "from user_test_applyfor \n" +
                "where date_format(create_date,'%Y-%m-%d')= date_format(now(),'%Y-%m-%d')";
        int SN = userTestApplyforService.getCountBySQL(sql);
        return typeName + "-" + df.format(new Date()) + "-" + String.format("%04d", SN + 1);
    }
}
