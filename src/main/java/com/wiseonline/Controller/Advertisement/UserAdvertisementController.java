package com.wiseonline.Controller.Advertisement;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.MainBusiness;
import com.wiseonline.Domain.UserAdvertisement;
import com.wiseonline.Service.Impl.MainBusinessServiceImpl;
import com.wiseonline.Service.Impl.UserAdvertisementServiceImpl;
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
@RequestMapping("/Commercialize/UserCommercialize")
public class UserAdvertisementController extends BaseController {

    @Autowired
    UserAdvertisementServiceImpl userAdvertisementService;

    @Autowired
    WorkFlowUtils workFlowUtils;

    @Autowired
    MainBusinessServiceImpl mainBusinessService;

    @RequestMapping(value = "List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看广告服务申请列表", module = "前台-广告服务")
    public PageResult<UserAdvertisement> getAll(@PathVariable int page,
                                                @PathVariable int pageSize, UserAdvertisement Model) {
        PageResult<UserAdvertisement> models = userAdvertisementService.findAll(page, pageSize, Model);
        return models;
    }

    @RequestMapping(value = "My/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看我的广告服务申请列表", module = "前台-广告服务")
    public PageResult<UserAdvertisement> MyGetAll(@PathVariable int page,
                                                  @PathVariable int pageSize, UserAdvertisement Model) {
        PageResult<UserAdvertisement> models = userAdvertisementService.findByOneField(page, pageSize, "username", getUserName(), true, "objectid");
        return models;
    }

    @RequestMapping(value = "Add", method = RequestMethod.POST)
    @PermissionInfo(name = "添加广告服务申请", module = "前台-广告服务")
    public ResultMessage Add(UserAdvertisement Model) throws MyException, ParseException {
        CreateDomain createDomain = workFlowUtils.Create(7);
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            if ("ok".equals(isUserInfoComplete())) {
                Model.setSerialNumber(getMaxSN("GG"));
                Model.setUsername(username);
                boolean rst = userAdvertisementService.saveGetID(Model);
                MainBusiness mainBusiness = new MainBusiness();
                mainBusiness.setSerialNumber(Model.getSerialNumber());
                mainBusiness.setBusinessId(Model.getObjectid());
                mainBusiness.setBusinessType("commercialize");
                mainBusiness.setBusinessTypeZh("广告服务申请");
                mainBusiness.setChineseName(Model.getChineseName());
                mainBusiness.setCommentFlag(1);
                mainBusiness.setCompany(Model.getCompany());
                mainBusiness.setEmail(Model.getEmail());
                mainBusiness.setPhone(Model.getPhone());
                mainBusiness.setUsername(Model.getUsername());
                mainBusinessService.save(mainBusiness);
                if (rst) {
                    try {
                        workFlowUtils.NewTransfer(createDomain, Model.getSerialNumber(), Model.getObjectid(), "gg");
                    } catch (MyException e) {
                        userAdvertisementService.delete(Model.getObjectid());
                        e.printStackTrace();
                        return Msg(false, ConstClass.ResultSaveFault);
                    }
                    return Msg(true, ConstClass.ResultSaveSuccess);
                } else {
                    throw new MyException(ConstClass.ResultSaveFault);
                }
            }else {
                throw new MyException("请完善个人资料");
            }
        } else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }

    @RequestMapping(value = "Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "编辑广告服务申请", module = "前台-广告服务")
    public UserAdvertisement Edit(@PathVariable int id) {
        UserAdvertisement model = userAdvertisementService.getbyId(id);
        return model;
    }

    @RequestMapping(value = "Update", method = RequestMethod.POST)
    @PermissionInfo(name = "更新广告服务申请", module = "前台-广告服务")
    public ResultMessage Update(UserAdvertisement Model) throws MyException {
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            boolean rst = userAdvertisementService.update(Model);
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
    @PermissionInfo(name = "删除广告服务申请", module = "前台-广告服务")
    public ResultMessage Delete(@PathVariable int id) {
        boolean rst = userAdvertisementService.delete(id);
        if (rst) {
            return Msg(true, ConstClass.ResultDeleteSuccess);
        } else {
            return Msg(false, ConstClass.ResultDeleteFault);
        }
    }

    public String getMaxSN(String typeName) {
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
        String sql = "select CAST(ifnull(MAX(CAST(substring_index(serial_number,'-',-1) AS UNSIGNED INTEGER)),0) as UNSIGNED INTEGER) as num\n" +
                "from user_advertisement \n" +
                "where date_format(create_date,'%Y-%m-%d')= date_format(now(),'%Y-%m-%d')";
        int SN = userAdvertisementService.getCountBySQL(sql);
        return typeName + "-" + df.format(new Date()) + "-" + String.format("%04d", SN + 1);
    }
}
