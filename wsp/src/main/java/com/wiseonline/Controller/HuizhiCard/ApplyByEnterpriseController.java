package com.wiseonline.Controller.HuizhiCard;
/**
 * Created by R7tech on 10/12/2016.
 */

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.HuizhiCardEnterpise;
import com.wiseonline.Domain.HuizhiCardPerson;
import com.wiseonline.Domain.User;
import com.wiseonline.Service.HuizhiCardEnterpriseService;
import com.wiseonline.Service.Impl.UserServiceImpl;
import com.wiseonline.Service.RoleService;
import com.wiseonline.Utils.ConstClass;
import com.wiseonline.Utils.PageResult;
import com.wiseonline.Utils.PermissionInfo;
import com.wiseonline.Utils.ResultMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;


/**
 * Created by R7tech on 2/25/2016.
 */
@RestController
@RequestMapping("/CardApply")
public class ApplyByEnterpriseController extends BaseController {
    @Autowired
    HuizhiCardEnterpriseService huizhiCardEnterpriseService;

    @Autowired
    UserServiceImpl userService;

    @Autowired
    RoleService roleService;

    @RequestMapping(value = "Enterprise/Edit/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看红包信息", module = "后台、前台-红包信息块管理")
    public HuizhiCardEnterpise BaseEdit(@PathVariable int objectid){
        HuizhiCardEnterpise model = huizhiCardEnterpriseService.getbyId(objectid);
        return model;
    }

    @RequestMapping(value = "Enterprise/Add", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加红包信息", module = "后台、前台-红包信息块管理")
    public ResultMessage BaseAdd(HuizhiCardEnterpise model){
        model.setSn(new SimpleDateFormat("yyyyMMddHHmmssSSS").format(new Date()));
        boolean ret = huizhiCardEnterpriseService.save(model);
        if (ret){
            String sql = "select * from role_user where rolename='HzCardApplyAdmin'";
            List<Object[]> rList = roleService.findByCustomerSQL(sql);
            for (Object[] o:rList){
                String username = o[1].toString();
                User user = userService.getbyId(username);
                String sendMessage = "用户"+ getUserName() + "于" + new SimpleDateFormat("yyyy年MM月dd日 HH时mm分").format(new Date()) + "申请办理企业汇智卡。";
                try{
                    boolean rst = SendToMessage(user.getPhone(), sendMessage);
//                if (rst){
//                    return Msg(true, "验证码已发送");
//                }else{
//                    return Msg(false, "验证码发送失败");
//                }
                }catch (UnsupportedEncodingException e){
                    e.printStackTrace();
                    //return Msg(false, "验证码发送失败");
                }
            }
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "Enterprise/Update", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加红包信息", module = "后台、前台-红包信息块管理")
    public ResultMessage BaseUpdate(HuizhiCardEnterpise model){
        boolean ret = huizhiCardEnterpriseService.update(model);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "Enterprise/Status/Update", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "更新状态信息", module = "后台、前台-红包信息块管理")
    public ResultMessage BaseStatusUpdate(HuizhiCardEnterpise model){
        HuizhiCardEnterpise hcp = huizhiCardEnterpriseService.getbyId(model.getId());
        if (hcp==null){
            return Msg(false, "无此记录");
        }
        if (model.getStatus()!=0){
            hcp.setStatus(model.getStatus());
        }
        if (model.getMark()!=null){
            hcp.setMark(model.getMark());
        }
        if (model.getGetTime()!=null){
            hcp.setGetTime(model.getGetTime());
        }
        boolean ret = huizhiCardEnterpriseService.update(hcp);
        if (ret){
            if (model.getStatus()==2)
            {
                User user = userService.getbyId(hcp.getUsername());
                String sendMessage = "请于" + new SimpleDateFormat("yyyy年MM月dd日 HH时mm分").format(model.getGetTime()) + "持办理汇智卡工本费现金人民币20元/张前往就近一卡通办理。";
                try{
                    boolean rst = SendToMessage(user.getPhone(), sendMessage);
//                if (rst){
//                    return Msg(true, "验证码已发送");
//                }else{
//                    return Msg(false, "验证码发送失败");
//                }
                }catch (UnsupportedEncodingException e){
                    e.printStackTrace();
                    //return Msg(false, "验证码发送失败");
                }
            }
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "Enterprise/Del/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "删除红包信息", module = "后台、前台-红包信息块管理")
    public ResultMessage BaseDel(@PathVariable int objectid){
        boolean ret = huizhiCardEnterpriseService.delete(objectid);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "Enterprise/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "列表红包信息", module = "后台、前台-红包信息块管理")
    public PageResult<HuizhiCardEnterpise> BaseList(@PathVariable int page, @PathVariable int pageSize, HuizhiCardEnterpise model){
        PageResult<HuizhiCardEnterpise> models = huizhiCardEnterpriseService.findAll(page, pageSize, model,true,"createTime");
        return models;
    }

    @RequestMapping(value = "Enterprise/Me/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "列表红包信息", module = "后台、前台-红包信息块管理")
    public PageResult<HuizhiCardEnterpise> BaseMeList(@PathVariable int page, @PathVariable int pageSize, HuizhiCardEnterpise model){
        PageResult<HuizhiCardEnterpise> models = huizhiCardEnterpriseService.findByOneField(page, pageSize,"username",getUserName(),true,"createTime");
        return models;
    }
}

