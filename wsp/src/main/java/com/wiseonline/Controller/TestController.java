package com.wiseonline.Controller;

import com.wiseonline.Domain.UserCultivate;
import com.wiseonline.Service.Impl.UserCultivateServiceImpl;
import com.wiseonline.Utils.ExportExcel;
import com.wiseonline.Utils.PageResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by yanwj on 2015/11/5.
 */

@Controller
@RequestMapping("/test")
public class TestController extends BaseController{
    @Autowired
    UserCultivateServiceImpl userCultivateService;
    @RequestMapping("/abc")
    @ResponseBody
    public List<String> abc(){
        List<String> list = new ArrayList<String>();
        list.add("啦啦啦啦啦");
        list.add("11111111");
        list.add("来来来来来");
        list.add("￥@#￥%￥#……%￥#%");
        list.add("fsffwefwefew");
        return  list;
    }
    @RequestMapping("/jade")
    public ModelAndView test2(){
        List<String> list = new ArrayList<String>();
        list.add("你好");
        list.add("我好");
        list.add("大家好");
        list.add("见证奇迹的时刻");
        list.add("真的能见证奇迹么");
        Map<String, Object> variables = new HashMap<String, Object>();
        variables.put("version", "0.2.14");
        variables.put("list",list);
        return new ModelAndView("jade", variables);
    }
    @RequestMapping("/mm")
    public void testExcel(HttpServletResponse response,UserCultivate Model){
        String[] str = new String[]{"aaaa","bbbb","cccc"};
        PageResult<UserCultivate> models = userCultivateService.findByOneField(0, 0, "course.objectid", 2, true, "objectid",Model);
        List<UserCultivate> objectList = models.getResult();
        ExportExcel.exportExcel(response,"kkkkkkk.xls",str,objectList);
    }
}
