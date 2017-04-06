package com.wiseonline.Controller.Setting;

import com.wiseonline.Controller.BaseController;

import com.wiseonline.Service.IndexCreateService;
import com.wiseonline.Utils.ConstClass;
import com.wiseonline.Utils.PermissionInfo;
import com.wiseonline.Utils.ResultMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;


/**
 * Created by kelsey on 2016/7/28.
 */
@RestController("indexCreateController")
@RequestMapping("/Setting/Index")
public class IndexCreateController extends BaseController {

    @Autowired
    IndexCreateService indexCreateService;

    @RequestMapping(value = "Create", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "生成首页", module = "后台-首页管理")
    public ResultMessage create(HttpServletRequest request) {
        String filePath = request.getSession().getServletContext().getRealPath("/web/index.html");
        boolean flag =  indexCreateService.createHtml(filePath);
        if (flag){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }
        else{
            return Msg(false, ConstClass.ResultSaveFault);
        }
    }
}