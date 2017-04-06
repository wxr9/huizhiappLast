package com.wiseonline.Controller.Business;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.ClmSearchLog;
import com.wiseonline.Domain.Enterprise;
import com.wiseonline.Service.Impl.ClmSearchLogServiceImpl;
import com.wiseonline.Service.Impl.EnterpriseServiceImpl;
import com.wiseonline.Utils.ConstClass;
import com.wiseonline.Utils.CustomerServiceStub;
import com.wiseonline.Utils.CustomerServiceStub.*;
import com.wiseonline.Utils.MyException;
import com.wiseonline.Utils.PageResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.rmi.RemoteException;
import java.util.List;

/**
 * Created by yanwj on 2016/4/13.
 */
@RestController
@RequestMapping("/Buiness/CLMBusiness")
public class CLMBusinessController extends BaseController{

    @Autowired
    EnterpriseServiceImpl enterpriseService;
    @Autowired
    ClmSearchLogServiceImpl clmSearchLogService;

    @RequestMapping(value = "CheckTheBill/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    public GetEffectiveAccountsResponse CheckTheBill(HttpServletRequest request) throws MyException {
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            PageResult<Enterprise> pageResult = enterpriseService.findByOneField(0, 0, "username", username, true, "objectid");
            if (0 < pageResult.getTotal()) {
                Enterprise enterprise = pageResult.getResult().get(0);
                String corpId = String.valueOf(enterprise.getClmId());
                ClmSearchLog clmSearchLog = new ClmSearchLog();
                clmSearchLog.setName(enterprise.getName());
                clmSearchLog.setUsername(username);
                clmSearchLogService.save(clmSearchLog);
                String typeId = request.getParameter("typeId");
                String year = request.getParameter("year");
                String month = request.getParameter("month");
                if ("".equals(corpId) || "".equals(typeId) || "".equals(year)) {
                    throw new MyException("数据有误");
                } else {
                    try {
                        GetEffectiveAccounts getEffectiveAccounts = new GetEffectiveAccounts();
                        getEffectiveAccounts.setCorpId(corpId);
                        getEffectiveAccounts.setMonth(month);
                        getEffectiveAccounts.setTypeId(typeId);
                        getEffectiveAccounts.setYear(year);
                        GetEffectiveAccountsResponse result = getStub().getEffectiveAccounts(getEffectiveAccounts, GetHeader());
                        return result;
                    } catch (RemoteException e) {
                        e.printStackTrace();
                    }
                }
                return null;
            }else {
                throw new MyException("未查询到数据");
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }
}
