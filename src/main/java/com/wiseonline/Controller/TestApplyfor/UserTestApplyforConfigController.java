package com.wiseonline.Controller.TestApplyfor;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.UserTestApplyforConfig;
import com.wiseonline.Service.Impl.UserTestApplyforConfigServiceImpl;
import com.wiseonline.Utils.ConstClass;
import com.wiseonline.Utils.MyException;
import com.wiseonline.Utils.PermissionInfo;
import com.wiseonline.Utils.ResultMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created by yanwj on 2016/4/12.
 */
@RestController
@RequestMapping("/TestApplyfor/UserTestApplyforConfig")
public class UserTestApplyforConfigController extends BaseController{
    @Autowired
    UserTestApplyforConfigServiceImpl userTestApplyforConfigService;

    @RequestMapping(value = "Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看测试申请配置信息", module = "后台-测试申请配置")
    public UserTestApplyforConfig Edit(@PathVariable int id) {
        String sql = "select * from user_test_applyfor_config where type = "+id;
        List<UserTestApplyforConfig> model = userTestApplyforConfigService.findByDataSQL(sql);
        if (model != null){
            if (0 < model.size()){
                return model.get(0);
            }else {
                return null;
            }
        }else {
            return null;
        }
    }
    @RequestMapping(value = "Update", method = RequestMethod.POST)
    @PermissionInfo(name = "更新测试申请配置信息", module = "后台-测试申请配置")
    public ResultMessage Update(UserTestApplyforConfig Model) throws MyException {
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            boolean rst = userTestApplyforConfigService.update(Model);
            if (rst){
                return Msg(true, ConstClass.ResultSaveSuccess);
            }else {
                return Msg(false,ConstClass.ResultSaveFault);
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }
}
