package com.wiseonline.Controller.Setting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.Enterprise;
import com.wiseonline.Domain.User;
import com.wiseonline.Domain.Noticfication;
import com.wiseonline.Domain.UserEnterpriseApplyInfo;
import com.wiseonline.Service.Impl.EnterpriseServiceImpl;
import com.wiseonline.Service.Impl.NotificationServiceImpl;
import com.wiseonline.Service.Impl.UserEnterpriseApplyInfoServiceImpl;
import com.wiseonline.Service.Impl.UserServiceImpl;
import com.wiseonline.Utils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.List;

/**
 * Created by huizhisoft on 15/12/18.
 */
@RestController
@RequestMapping("/Setting/UserEnterpriseApplyInfo")
public class UserEnterpriseApplyInfoController extends BaseController{
    @Autowired
    UserEnterpriseApplyInfoServiceImpl userEnterpriseApplyInfoService;
    @Autowired
    EnterpriseServiceImpl enterpriseService;
    @Autowired
    UserServiceImpl userService;

    @Autowired
    NotificationServiceImpl notificationService;

    private static String WSP_SESSION_USERNAME = "WSP_SESSION_USERNAME";

    @RequestMapping(value = "{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "企业管理员查看企业用户申请表", module = "后台-企业管理")
    public PageResult<UserEnterpriseApplyInfo> getAll(@PathVariable int page, @PathVariable int pageSize, UserEnterpriseApplyInfo model){
        PageResult<UserEnterpriseApplyInfo> models = userEnterpriseApplyInfoService.findAll(page,pageSize,model);
        return models;
    }
    @RequestMapping(value = "Add",method = RequestMethod.POST)
    @PermissionInfo(name = "新增用户申请", module = "前台-用户中心")
    public ResultMessage Add(UserEnterpriseApplyInfo model, HttpServletRequest request){
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            if (model.getEnterpriseId() != 0) {
                Enterprise enterprise = enterpriseService.getbyId(model.getEnterpriseId());
                model.setEnterprise(enterprise);
            }
            User user = userService.getbyId(username);
            model.setUser(user);
            model.setApplyFlag(1);
            boolean rst = userEnterpriseApplyInfoService.save(model);
            if (rst) {
                Noticfication noticfication = new Noticfication();
                noticfication.setAuthor(username);
                noticfication.setAccepter(username);
                noticfication.setContent("成功申请企业,等待企业管理员处理");
                noticfication.setCreateTime(new Date());
                noticfication.setTitle(ConstClass.EnterpriseApplyInfo);
                noticfication.setReadStatus(1);
                boolean r = notificationService.save(noticfication);

                Noticfication noticfication2 = new Noticfication();
                noticfication2.setAuthor(username);
                noticfication2.setAccepter(model.getEnterprise().getUsername());
                noticfication2.setContent("有新用户申请加入贵企业,请及时处理");
                noticfication2.setCreateTime(new Date());
                noticfication2.setTitle(ConstClass.EnterpriseApplyInfo);
                noticfication2.setReadStatus(1);
                boolean r2 = notificationService.save(noticfication2);
                return Msg(true, ConstClass.ResultSaveSuccess);
            } else {
                Noticfication noticfication = new Noticfication();
                noticfication.setAuthor(username);
                noticfication.setAccepter(username);
                noticfication.setContent("申请企业失败,请冲重新申请");
                noticfication.setCreateTime(new Date());
                noticfication.setTitle(ConstClass.EnterpriseApplyInfo);
                noticfication.setReadStatus(1);
                notificationService.save(noticfication);
                return Msg(false, ConstClass.ResultSaveFault);
            }
        }else {
            return Msg(false,ConstClass.LoginTimeOut);
        }
    }
    @RequestMapping(value = "EnableEnterpriseApply/{object}/{flag}",method = RequestMethod.POST)
    @PermissionInfo(name = "处理申请", module = "前台-用户中心")
    public ResultMessage EnableEnterpriseApply(@PathVariable int object,@PathVariable int flag,HttpServletRequest request){
        String author = getUserName();
        UserEnterpriseApplyInfo userEnterpriseApplyInfo = userEnterpriseApplyInfoService.getbyId(object);
        String username = userEnterpriseApplyInfo.getUsername();
        int enterpriseId = userEnterpriseApplyInfo.getEnterpriseId();
        if (flag == 0){
            //不同意
            userEnterpriseApplyInfo.setApplyFlag(3);
            boolean rst = userEnterpriseApplyInfoService.update(userEnterpriseApplyInfo);
            if (rst){
                Noticfication noticfication = new Noticfication();
                noticfication.setAuthor(author);
                noticfication.setAccepter(username);
                noticfication.setContent(ConstClass.EnterpriseRootNo);
                noticfication.setCreateTime(new Date());
                noticfication.setTitle(ConstClass.EnterpriseApplyInfo);
                noticfication.setReadStatus(1);
                notificationService.save(noticfication);
                return Msg(true,ConstClass.OperationSuccess);
            }else {
                return Msg(false,ConstClass.OperationFault);
            }
        }else {
            //同意
            userEnterpriseApplyInfo.setApplyFlag(2);
            boolean rst = userEnterpriseApplyInfoService.update(userEnterpriseApplyInfo);
            if (rst){
                User user = userService.getbyId(username);
                Enterprise enterprise = enterpriseService.getbyId(enterpriseId);
                user.setEnterprise(enterprise);
                user.setEnterpriseRoot(1);
                boolean r = userService.update(user);
                if (r){
                    Noticfication noticfication = new Noticfication();
                    noticfication.setAuthor(author);
                    noticfication.setAccepter(username);
                    noticfication.setContent(ConstClass.EnterpriseRootYes);
                    noticfication.setCreateTime(new Date());
                    noticfication.setTitle(ConstClass.EnterpriseApplyInfo);
                    noticfication.setReadStatus(1);
                    notificationService.save(noticfication);
                    return Msg(true,ConstClass.OperationSuccess);
                }else {
                    userEnterpriseApplyInfo.setApplyFlag(1);
                    userEnterpriseApplyInfoService.update(userEnterpriseApplyInfo);
                    return Msg(false,ConstClass.OperationFault);
                }
            }else {
                return Msg(false,ConstClass.OperationFault);
            }
        }
    }

    @RequestMapping(value = "ApplyList/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "企业管理员查看企业用户申请表", module = "后台-企业管理")
    public PageResult<UserEnterpriseApplyInfo> ApplyList(@PathVariable int page, @PathVariable int pageSize,
                                                         UserEnterpriseApplyInfo model,HttpServletRequest request)
                                                        throws MyException {
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            User user = userService.getbyId(username);
            int enterpriseId = user.getEnterpriseId();
            if (user.getEnterpriseRoot() == 2) {
                if (user != null) {
                    int enterpriseid = user.getEnterpriseId();
                    PageResult<UserEnterpriseApplyInfo> pageResult = new PageResult<UserEnterpriseApplyInfo>();
                    if (page == 0) {
                        String sql = "select ueai.* from user_enterprise_applyinfo as ueai where ueai.applyflag=1 " +
                                "and ueai.enterpriseid=" + enterpriseid;
                        List<UserEnterpriseApplyInfo> userEnterpriseApplyInfoList = userEnterpriseApplyInfoService.findByDataSQL(sql);
                        pageResult.setPage(page);
                        pageResult.setPagesize(pageSize);
                        pageResult.setResult(userEnterpriseApplyInfoList);
                        if (userEnterpriseApplyInfoList != null) {
                            pageResult.setTotal(userEnterpriseApplyInfoList.size());
                        }
                    } else {
                        String sql = "select ueai.* from user_enterprise_applyinfo as ueai where ueai.applyflag=1 " +
                                "and ueai.enterpriseid=" + enterpriseid;
                        List<UserEnterpriseApplyInfo> userEnterpriseApplyInfoList = userEnterpriseApplyInfoService.findByDataSQL(sql);
                        if (userEnterpriseApplyInfoList != null) {
                            if (page == 1) {
                                String sql2 = "select ueai.* from user_enterprise_applyinfo as ueai where ueai.applyflag=1 " +
                                        "and ueai.enterpriseid=" + enterpriseid + " limit 0," + pageSize;
                                List<UserEnterpriseApplyInfo> userEnterpriseApplyInfoList2 = userEnterpriseApplyInfoService.findByDataSQL(sql);
                                pageResult.setPage(page);
                                pageResult.setPagesize(pageSize);
                                pageResult.setResult(userEnterpriseApplyInfoList2);
                                if (userEnterpriseApplyInfoList2 != null) {
                                    pageResult.setTotal(userEnterpriseApplyInfoList2.size());
                                }
                            } else {
                                String sql2 = "select ueai.* from user_enterprise_applyinfo as ueai where ueai.applyflag=1 " +
                                        "and ueai.enterpriseid=" + enterpriseid + " limit " + (page - 1) * pageSize + "," + page * pageSize;
                                List<UserEnterpriseApplyInfo> userEnterpriseApplyInfoList2 = userEnterpriseApplyInfoService.findByDataSQL(sql);
                                pageResult.setPage(page);
                                pageResult.setPagesize(pageSize);
                                pageResult.setResult(userEnterpriseApplyInfoList2);
                                if (userEnterpriseApplyInfoList2 != null) {
                                    pageResult.setTotal(userEnterpriseApplyInfoList2.size());
                                }
                            }
                        } else {
                            pageResult.setPage(page);
                            pageResult.setPagesize(pageSize);
                            pageResult.setResult(userEnterpriseApplyInfoList);
                            pageResult.setTotal(0);
                        }
                    }

                    return pageResult;
                } else {
                    throw new MyException(ConstClass.NoUser);
                }
            }else {
                throw new MyException(ConstClass.NotEnterpriseRoot);
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }
}
