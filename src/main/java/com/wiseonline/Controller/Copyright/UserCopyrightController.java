package com.wiseonline.Controller.Copyright;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.MainBusiness;
import com.wiseonline.Domain.SettingDict;
import com.wiseonline.Domain.UserCopyright;
import com.wiseonline.Service.Impl.MainBusinessServiceImpl;
import com.wiseonline.Service.Impl.SettingDictServiceImpl;
import com.wiseonline.Service.Impl.UserCopyrightServiceImpl;
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
 * Created by yanwj on 2016/3/22.
 */
@RestController
@RequestMapping("/Copyright/UserCopyright")
public class UserCopyrightController extends BaseController {
    @Autowired
    UserCopyrightServiceImpl userCopyrightService;

    @Autowired
    SettingDictServiceImpl settingDictService;
    @Autowired
    WorkFlowUtils workFlowUtils;
    @Autowired
    MainBusinessServiceImpl mainBusinessService;

    @RequestMapping(value = "List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看著作权登记列表", module = "前台-著作权登记")
    public PageResult<UserCopyright> getAll(@PathVariable int page,
                                            @PathVariable int pageSize, UserCopyright Model) {
        PageResult<UserCopyright> models = userCopyrightService.findAll(page, pageSize, Model);
        return models;
    }

    @RequestMapping(value = "Add", method = RequestMethod.POST)
    @PermissionInfo(name = "添加著作权登记", module = "前台-著作权登记")
    public ResultMessage Add(UserCopyright Model) throws MyException, ParseException {
        CreateDomain createDomain = workFlowUtils.Create(9);
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            if ("ok".equals(isUserInfoComplete())) {
                Model.setSerialNumber(getMaxSN("ZZ"));
                Model.setUsername(username);
                if (Model.getCopyrightTypeId() != 0) {
                    SettingDict settingDict = settingDictService.getbyId(Model.getCopyrightTypeId());
                    Model.setCopyrightType(settingDict);
                }
                if (Model.getPeriodId() != 0) {
                    SettingDict settingDict = settingDictService.getbyId(Model.getPeriodId());
                    Model.setPeriod(settingDict);
                }
                if (Model.getCopyrightBusinessTypeId() != 0) {
                    SettingDict settingDict = settingDictService.getbyId(Model.getCopyrightBusinessTypeId());
                    Model.setCopyrightBusinessType(settingDict);
                }
                boolean rst = userCopyrightService.saveGetID(Model);
                MainBusiness mainBusiness = new MainBusiness();
                mainBusiness.setSerialNumber(Model.getSerialNumber());
                mainBusiness.setBusinessId(Model.getObjectid());
                mainBusiness.setBusinessType("userCopyright");
                mainBusiness.setBusinessTypeZh("著作权登记");
                mainBusiness.setChineseName(Model.getChineseName());
                mainBusiness.setCommentFlag(1);
                mainBusiness.setCompany(Model.getCompany());
                mainBusiness.setEmail(Model.getEmail());
                mainBusiness.setPhone(Model.getPhone());
                mainBusiness.setUsername(Model.getUsername());
                mainBusinessService.save(mainBusiness);
                if (rst) {
                    try {
                        workFlowUtils.NewTransfer(createDomain, Model.getSerialNumber(), Model.getObjectid(), "zzqdj");
                    } catch (MyException e) {
                        userCopyrightService.delete(Model.getObjectid());
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
    }

    @RequestMapping(value = "Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "编辑著作权登记", module = "前台-著作权登记")
    public UserCopyright Edit(@PathVariable int id) {
        UserCopyright model = userCopyrightService.getbyId(id);
        return model;
    }

    @RequestMapping(value = "Update", method = RequestMethod.POST)
    @PermissionInfo(name = "更新著作权登记", module = "前台-著作权登记")
    public ResultMessage Update(UserCopyright Model) throws MyException {
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            boolean rst = userCopyrightService.update(Model);
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
    @PermissionInfo(name = "删除著作权登记", module = "前台-著作权登记")
    public ResultMessage Delete(@PathVariable int id) {
        boolean rst = userCopyrightService.delete(id);
        if (rst) {
            return Msg(true, ConstClass.ResultDeleteSuccess);
        } else {
            return Msg(false, ConstClass.ResultDeleteFault);
        }
    }

    public String getMaxSN(String typeName) {
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
        String sql = "select CAST(ifnull(MAX(CAST(substring_index(serial_number,'-',-1) AS UNSIGNED INTEGER)),0) as UNSIGNED INTEGER) as num\n" +
                "from user_copyright \n" +
                "where date_format(create_date,'%Y-%m-%d')= date_format(now(),'%Y-%m-%d')";
        int SN = userCopyrightService.getCountBySQL(sql);
        return typeName + "-" + df.format(new Date()) + "-" + String.format("%04d", SN + 1);
    }
}
