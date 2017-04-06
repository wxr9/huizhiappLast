package com.wiseonline.Controller.Headhunting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.HeadhuntingJobs;
import com.wiseonline.Domain.MainBusiness;
import com.wiseonline.Domain.UserHeadhunting;
import com.wiseonline.Service.Impl.HeadhuntingJobsServiceImpl;
import com.wiseonline.Service.Impl.MainBusinessServiceImpl;
import com.wiseonline.Service.Impl.UserHeadhuntingServiceImpl;
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
@RequestMapping("/Headhunting/UserHeadhunting")
public class UserHeadhuntingController extends BaseController {

    @Autowired
    UserHeadhuntingServiceImpl userHeadhuntingService;
    @Autowired
    HeadhuntingJobsServiceImpl headhuntingJobsService;
    @Autowired
    WorkFlowUtils workFlowUtils;
    @Autowired
    MainBusinessServiceImpl mainBusinessService;

    @RequestMapping(value = "List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看猎聘申请列表", module = "前台-猎聘")
    public PageResult<UserHeadhunting> getAll(@PathVariable int page,
                                              @PathVariable int pageSize, UserHeadhunting Model) {
        PageResult<UserHeadhunting> models = userHeadhuntingService.findAll(page, pageSize, Model);
        return models;
    }

    @RequestMapping(value = "Add", method = RequestMethod.POST)
    @PermissionInfo(name = "添加猎聘申请", module = "前台-猎聘")
    public ResultMessage Add(UserHeadhunting Model, String[] jobsName, String[] jobObligation, String[] jobsCondition, String[] jobsMoney) throws MyException, ParseException {
        if (jobObligation.length == 0 || jobsCondition.length == 0 || jobsMoney.length == 0 || jobsName.length == 0) {
            return Msg(false, "请填写职位信息");
        } else {
            if ((jobObligation.length != jobsCondition.length) || (jobsMoney.length != jobsName.length) || (jobsCondition.length != jobsMoney.length)) {
                return Msg(false, "请填写职位信息");
            } else {
                CreateDomain createDomain = workFlowUtils.Create(4);
                String username = getUserName();
                if (!username.equals("anonymousUser")) {
                    if ("ok".equals(isUserInfoComplete())) {
                        Model.setSerialNumber(getMaxSN("LP"));
                        Model.setUsername(username);
                        boolean rst = userHeadhuntingService.saveGetID(Model);
                        MainBusiness mainBusiness = new MainBusiness();
                        mainBusiness.setSerialNumber(Model.getSerialNumber());
                        mainBusiness.setBusinessId(Model.getObjectid());
                        mainBusiness.setBusinessType("userHeadhunting");
                        mainBusiness.setBusinessTypeZh("猎聘申请");
                        mainBusiness.setChineseName(Model.getChineseName());
                        mainBusiness.setCommentFlag(1);
                        mainBusiness.setCompany(Model.getCompany());
                        mainBusiness.setEmail(Model.getEmail());
                        mainBusiness.setPhone(Model.getPhone());
                        mainBusiness.setUsername(Model.getUsername());
                        mainBusinessService.save(mainBusiness);
                        if (rst) {
                            try {
                                workFlowUtils.NewTransfer(createDomain, Model.getSerialNumber(), Model.getObjectid(), "lp");
                            } catch (MyException e) {
                                userHeadhuntingService.delete(Model.getObjectid());
                                e.printStackTrace();
                                return Msg(false, ConstClass.ResultSaveFault);
                            }
                            for (int i = 0; i < jobObligation.length; i++) {
                                HeadhuntingJobs headhuntingJobs = new HeadhuntingJobs();
                                headhuntingJobs.setConditions(jobsCondition[i]);
                                headhuntingJobs.setUserHeadhunting(Model);
                                headhuntingJobs.setName(jobsName[i]);
                                headhuntingJobs.setMoney(jobsMoney[i]);
                                headhuntingJobs.setObligation(jobObligation[i]);
                                headhuntingJobs.setCreateDate(new Date());
                                headhuntingJobs.setUpdateDate(new Date());
                                headhuntingJobsService.save(headhuntingJobs);
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
        }
    }

    @RequestMapping(value = "Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "编辑猎聘申请", module = "前台-猎聘")
    public UserHeadhunting Edit(@PathVariable int id) {
        UserHeadhunting model = userHeadhuntingService.getbyId(id);
        return model;
    }

    @RequestMapping(value = "Update", method = RequestMethod.POST)
    @PermissionInfo(name = "更新猎聘申请", module = "前台-猎聘")
    public ResultMessage Update(UserHeadhunting Model) throws MyException {
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            boolean rst = userHeadhuntingService.update(Model);
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
    @PermissionInfo(name = "删除猎聘申请", module = "前台-猎聘")
    public ResultMessage Delete(@PathVariable int id) {
        boolean rst = userHeadhuntingService.delete(id);
        if (rst) {
            return Msg(true, ConstClass.ResultDeleteSuccess);
        } else {
            return Msg(false, ConstClass.ResultDeleteFault);
        }
    }

    public String getMaxSN(String typeName) {
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
        String sql = "select CAST(ifnull(MAX(CAST(substring_index(serial_number,'-',-1) AS UNSIGNED INTEGER)),0) as UNSIGNED INTEGER) as num\n" +
                "from user_headhunting \n" +
                "where date_format(create_date,'%Y-%m-%d')= date_format(now(),'%Y-%m-%d')";
        int SN = userHeadhuntingService.getCountBySQL(sql);
        return typeName + "-" + df.format(new Date()) + "-" + String.format("%04d", SN + 1);
    }
}
