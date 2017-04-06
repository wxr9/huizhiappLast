package com.wiseonline.Controller.HuizhiCard;
/**
 * Created by R7tech on 10/12/2016.
 */

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.HuizhiCardEnterpise;
import com.wiseonline.Domain.HuizhiCardPerson;
import com.wiseonline.Domain.Role;
import com.wiseonline.Domain.User;
import com.wiseonline.Service.HuizhiCardPersonService;
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
public class ApplyByPersonController extends BaseController {
    @Autowired
    HuizhiCardPersonService huizhiCardPersonService;
    @Autowired
    UserServiceImpl userService;
    @Autowired
    RoleService roleService;

    @RequestMapping(value = "Person/Edit/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看红包信息", module = "后台、前台-红包信息块管理")
    public HuizhiCardPerson BaseEdit(@PathVariable int objectid){
        HuizhiCardPerson model = huizhiCardPersonService.getbyId(objectid);
        return model;
    }

    @RequestMapping(value = "Person/Add", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加红包信息", module = "后台、前台-红包信息块管理")
    public ResultMessage BaseAdd(HuizhiCardPerson model){
        if(huizhiCardPersonService.findByOneField(1, 5,"username",getUserName(),true,"createTime").getTotal()>0){
            return Msg(false,"您已经审请过汇智卡!");
        }
        model.setSn(new SimpleDateFormat("yyyyMMddHHmmssSSS").format(new Date()));
        boolean ret = huizhiCardPersonService.save(model);
        if (ret){
            String sql = "select * from role_user where rolename='HzCardApplyAdmin'";
            List<Object[]> rList = roleService.findByCustomerSQL(sql);
            for (Object[] o:rList){
                String username = o[1].toString();
                User user = userService.getbyId(username);
                String sendMessage = "用户"+ getUserName() + "于" + new SimpleDateFormat("yyyy年MM月dd日 HH时mm分").format(new Date()) + "申请办理个人汇智卡。";
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

    @RequestMapping(value = "Person/Update", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "更新红包信息", module = "后台、前台-红包信息块管理")
    public ResultMessage BaseUpdate(HuizhiCardPerson model){
        boolean ret = huizhiCardPersonService.update(model);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "Person/Status/Update", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "更新红包信息", module = "后台、前台-红包信息块管理")
    public ResultMessage BaseStatusUpdate(HuizhiCardPerson model){
        HuizhiCardPerson hcp = huizhiCardPersonService.getbyId(model.getId());
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
        boolean ret = huizhiCardPersonService.update(hcp);
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

    @RequestMapping(value = "Person/Del/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "删除红包信息", module = "后台、前台-红包信息块管理")
    public ResultMessage BaseDel(@PathVariable int objectid){
        boolean ret = huizhiCardPersonService.delete(objectid);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "Person/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "列表红包信息", module = "后台、前台-红包信息块管理")
    public PageResult<HuizhiCardPerson> BaseList(@PathVariable int page, @PathVariable int pageSize, HuizhiCardPerson model){
        PageResult<HuizhiCardPerson> models = huizhiCardPersonService.findAll(page, pageSize, model,true,"createTime");
        return models;
    }

    @RequestMapping(value = "Person/Me/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "列表红包信息", module = "后台、前台-红包信息块管理")
    public PageResult<HuizhiCardPerson> BaseMeList(@PathVariable int page, @PathVariable int pageSize){
        PageResult<HuizhiCardPerson> models = huizhiCardPersonService.findByOneField(page, pageSize,"username",getUserName(),true,"createTime");
        return models;
    }
}