package com.wiseonline.Controller.Setting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.SettingAutoComment;
import com.wiseonline.Service.Impl.SettingAutoCommentServiceImpl;
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

/**
 * Created by yanwj on 2016/4/14.
 */
@RestController
@RequestMapping("/Setting/SettingAutoComment")
public class SettingAutoCommentController extends BaseController{

    @Autowired
    SettingAutoCommentServiceImpl settingAutoCommentService;

    @RequestMapping(value = "Edit", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看自动评价时间配置", module = "后台-自动评价时间配置")
    public SettingAutoComment Edit(HttpServletRequest request){
        String type = request.getParameter("type");
        PageResult<SettingAutoComment> pageResult = settingAutoCommentService.findByOneField(0,0,"type",type,true,"objectid");
        if (0 < pageResult.getTotal()){
            return pageResult.getResult().get(0);
        }else {
            return null;
        }
    }
    @RequestMapping(value = "Update",method = RequestMethod.POST)
    @PermissionInfo(name = "更自动评价时间配置", module = "后台-自动评价时间配置")
    public ResultMessage Update(SettingAutoComment model){
        boolean rst = settingAutoCommentService.update(model);
        if (rst){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }
}
