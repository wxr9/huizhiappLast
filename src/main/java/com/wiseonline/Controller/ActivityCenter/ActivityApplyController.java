package com.wiseonline.Controller.ActivityCenter;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.ActivityApply;
import com.wiseonline.Service.ActivityApplyService;
import com.wiseonline.Utils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.fail;
import static org.testng.AssertJUnit.assertNotNull;

/**
 * Created by R7tech on 2/25/2016.
 */
@RestController
@RequestMapping("/ActivityCenter")
public class ActivityApplyController extends BaseController {
    @Autowired
    ActivityApplyService activityApplyService;

    private static String[] DOC_TYPE = {".xls", ".xlsx"};

    @RequestMapping(value = "ActivityApply/Edit/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看活动申请信息", module = "后台、前台-活动申请信息块管理")
    public ActivityApply BaseEdit(@PathVariable int objectid){
        ActivityApply model = activityApplyService.getbyId(objectid);
        return model;
    }

    @RequestMapping(value = "ActivityApply/Add", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加活动申请信息", module = "后台、前台-活动申请信息块管理")
    public ResultMessage BaseAdd(ActivityApply model){
        boolean ret = activityApplyService.save(model);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "ActivityApply/Del/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "删除活动申请信息", module = "后台、前台-活动申请信息块管理")
    public ResultMessage BaseDel(@PathVariable int objectid){
        boolean ret = activityApplyService.delete(objectid);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "ActivityApply/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "列表活动申请信息", module = "后台、前台-活动申请信息块管理")
    public PageResult<ActivityApply> BaseList(@PathVariable int page, @PathVariable int pageSize, ActivityApply model){
        PageResult<ActivityApply> models = activityApplyService.findAll(page, pageSize, model);
        return models;
    }

    @RequestMapping(value = "ActivityApply/ExcelImport", method = RequestMethod.POST)
    @PermissionInfo(name = "信息", module = "后台、前台-活动申请信息块管理")
    public void BaseImport(MultipartFile file, HttpServletRequest request,HttpServletResponse response) throws IOException{
        response.setHeader("Content-type", "text/html;charset=UTF-8");
        String objectid = request.getParameter("objectid");
        if (objectid==null||objectid.equals("")){
            String jason = "{\"msg\":\"活动ID不能为空!\",\"success\":false}";
            response.getWriter().write(jason);
            response.getWriter().flush();
            response.getWriter().close();
        }
        boolean ret = false;
        List<String> list = null;
        String suffix = file.getOriginalFilename().substring
                (file.getOriginalFilename().lastIndexOf("."));
        if (!isDoc(suffix)) {
            //return Msg(false,"文件格式不正确（必须为.xls/.xlsx文件）");
            String jason = "{\"msg\":\"文件格式不正确（必须为.xls/.xlsx文件）!\",\"success\":false}";
            response.getWriter().write(jason);
            response.getWriter().flush();
            response.getWriter().close();
        }
        int SEQUENCE = 0;
        int TICKETTYPE = 0;
        int TICKETPRICE = 0;
        int NAME = 0;
        int EMAIL = 0;
        int MOBILE = 0;
        int SIGNTIME = 0;
        int JOINTIME = 0;
        int STATUS = 0;
        try {
            list = ExcelHelper.exportListFromExcel(file.getInputStream(),suffix,0);
            String title = list.get(0);
            String titles[] = title.split("\\|");
            for (int i=0;i<titles.length;i++){
                if (titles[i].equals("报名编号")){
                    SEQUENCE = i;
                }
                if (titles[i].equals("票种")){
                    TICKETTYPE = i;
                }
                if (titles[i].equals("票价")){
                    TICKETPRICE = i;
                }
                if (titles[i].equals("姓名")){
                    NAME = i;
                }
                if (titles[i].equals("电子邮箱")){
                    EMAIL = i;
                }
                if (titles[i].equals("手机号码")){
                    MOBILE =i;
                }
                if (titles[i].equals("报名时间")){
                    JOINTIME = i;
                }
                if (titles[i].equals("签到时间")){
                    SIGNTIME = i;
                }
                if (titles[i].equals("状态")){
                    STATUS = i;
                }
            }

            for (int j=1;j<list.size();j++){
                String item = list.get(j);
                String items[] = item.split("\\|");

                    ActivityApply ap = new ActivityApply();
                    ap.setSequenceNo(items[SEQUENCE]);
                    ap.setTicketType(items[TICKETTYPE]);
                    ap.setTicketPrice(items[TICKETPRICE]);
                    ap.setName(items[NAME]);
                    ap.setEmail(items[EMAIL]);
                    ap.setMobile(items[MOBILE]);
                    ap.setJoinTime(items[JOINTIME]);
                    ap.setSignTime(items[SIGNTIME]);
                    ap.setTicketStatus(items[STATUS]);
                    ap.setActivityMainId(Integer.valueOf(objectid));
                    ret = activityApplyService.save(ap);

            }
        } catch (IOException e) {
            //return Msg(false,"数据格式不正确");
            String jason = "{\"msg\":\"数据格式不正确!\",\"success\":false}";
            response.getWriter().write(jason);
            response.getWriter().flush();
            response.getWriter().close();
        }
        if (ret){
            String jason = "{\"msg\":\"导入成功!!\",\"success\":true}";
            response.getWriter().write(jason);
            response.getWriter().flush();
            response.getWriter().close();
        }else{
            //return Msg(false,ConstClass.ResultSaveFault);
            String jason = "{\"msg\":\"导入失败!\",\"success\":false}";
            response.getWriter().write(jason);
            response.getWriter().flush();
            response.getWriter().close();
        }
    }

    private boolean isDoc(String suffix) {
        return Arrays.asList(DOC_TYPE).contains(suffix);
    }
}
