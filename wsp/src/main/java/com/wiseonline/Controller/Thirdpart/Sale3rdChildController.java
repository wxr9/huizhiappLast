package com.wiseonline.Controller.Thirdpart;

import com.sun.deploy.net.URLEncoder;
import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.*;
import com.wiseonline.Service.Impl.UserServiceImpl;
import com.wiseonline.Service.NotificationService;
import com.wiseonline.Service.Sale3rdChildService;
import com.wiseonline.Service.Sale3rdMainService;
import com.wiseonline.Service.SettingDictService;
import com.wiseonline.Utils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Arrays;
import java.util.List;

/**
 * Created by R7tech on 2/25/2016.
 */
@RestController
@RequestMapping("/Thirdpart")
public class Sale3rdChildController extends BaseController {
    @Autowired
    Sale3rdChildService sale3rdChildService;

    @Autowired
    Sale3rdMainService sale3rdMainService;

    @Autowired
    UserServiceImpl userService;
    @Autowired
    NotificationService notificationService;

    @Autowired
    private SettingDictService settingDictService;

    @RequestMapping(value = "SaleChild/Edit/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看优惠信息", module = "后台、前台-优惠信息块管理")
    public Sale3rdChild BaseEdit(@PathVariable int objectid){
        Sale3rdChild model = sale3rdChildService.getbyId(objectid);
        return model;
    }

    @RequestMapping(value = "SaleChild/Add", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加优惠信息", module = "后台、前台-优惠信息块管理")
    public ResultMessage BaseAdd(Sale3rdChild model){
        boolean ret = sale3rdChildService.save(model);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "SaleChild/Del/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "删除优惠信息", module = "后台、前台-优惠信息块管理")
    public ResultMessage BaseDel(@PathVariable int objectid){
        boolean ret = sale3rdChildService.delete(objectid);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "SaleChild/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "列表优惠信息", module = "后台、前台-优惠信息块管理")
    public PageResult<Sale3rdChild> BaseList(@PathVariable int page, @PathVariable int pageSize, HttpServletRequest request,Sale3rdChild model){
        String main_id = request.getParameter("main_id");
        if (main_id!=null && main_id.trim()!=""){
            return sale3rdChildService.findByOneField(page,pageSize,"main_id",Integer.valueOf(main_id),false,"createTime",model);
        }
        return sale3rdChildService.findAll(page,pageSize,model,false,"createTime");
    }

    @RequestMapping(value = "SaleChild/GetTicket/{type}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "列表商优惠信息", module = "后台、前台-商优惠信息块管理")
    public synchronized ResultMessage GetTicket(@PathVariable int type,HttpServletRequest request,User user) throws Exception{
        String name = request.getParameter("name");
        String username = "";
        String phone = "";
        SettingDict settingDict = settingDictService.getbyId(type);
        if (settingDict.getEnglish().equals("asLogin")){
            username = getUserName();
            phone = userService.getbyId(getUserName()).getPhone();
        }
        if (settingDict.getEnglish().equals("asRegist")){
            username = user.getUsername();
            phone = user.getPhone();
        }
        if (getUserName()!=null || username!=null){
            String sqlMain = "select * from sale_3rd_main where type="+type+" and (startDate<DATE_FORMAT(NOW(),'%Y-%m-%d %H:%i:%S') and endDate>DATE_FORMAT(NOW(),'%Y-%m-%d %H:%i:%S'))";
            if (name!=null && name!=""){
                if (name.equals("all")){

                }else{
                    sqlMain+=" and name='"+ URLDecoder.decode(name)+"'";
                }

            }
            List<Sale3rdMain> rList = sale3rdMainService.findByDataSQL(sqlMain);
            if (rList.size()==0){
                throw new MyException("没有找到匹配的优惠规则");
            }

            for(int i=0;i<rList.size();i++)
            {
                Sale3rdMain s3m = rList.get(i);

                String sqlUser = "select * from sale_3rd_child where user='"+username+"' and main_id="+s3m.getId();
                List<Sale3rdChild> pUserRet = sale3rdChildService.findByDataSQL(sqlUser);
                if (pUserRet.size()>0){
                    throw new MyException("您已经领过优惠券!");
                }


                String sql = "select * from sale_3rd_child where status=false and main_id="+s3m.getId()+" order by objectid limit 1";
                List<Sale3rdChild> pRet = sale3rdChildService.findByDataSQL(sql);
                if (pRet.size()>0){
                    Sale3rdChild sm = pRet.get(0);
                    Sale3rdChild smc = sale3rdChildService.getbyId(sm.getId());
                    smc.setStatus(true);
                    smc.setUser(username);
                    boolean ret = sale3rdChildService.update(smc);
                    if(ret){
                        String msg = s3m.getContent();
                        msg = msg.replaceFirst("###",sm.getCode());
                        Noticfication noticfication = new Noticfication();
                        noticfication.setReadStatus(1);
                        noticfication.setAccepter(username);
                        noticfication.setAuthor("system");
                        noticfication.setContent(msg);
                        noticfication.setTitle("用户优惠券提醒");
                        notificationService.save(noticfication);
                        try {
                            SendToMessage(phone,msg);
                        }catch (UnsupportedEncodingException e){

                        }
                        return Msg(true,"领取成功！");
                    }
                    throw new MyException("当前没有可领优惠券!");
                }else{
                    throw new MyException("当前没有可领优惠券!");
                }
            }


        }
        throw new MyException("当前没有可领优惠券!");
    }

    @RequestMapping(value = "SaleChild/ExcelImport", method = RequestMethod.POST)
    @PermissionInfo(name = "信息", module = "后台、前台-活动申请信息块管理")
    public void BaseImport(MultipartFile file, HttpServletRequest request, HttpServletResponse response) throws IOException {
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
            if (!title.contains("验证码")){
                throw new IOException();
            }
            String titles[] = title.split("\\|");
            for (int i=0;i<titles.length;i++){
                if (titles[i].equals("验证码")){
                    SEQUENCE = i;
                }
            }

            for (int j=1;j<list.size();j++){
                String item = list.get(j);
                String items[] = item.split("\\|");

                Sale3rdChild ap = new Sale3rdChild();
                ap.setMain_id(Integer.valueOf(objectid));
                ap.setCode(items[SEQUENCE]);
                ap.setStatus(false);
                ret = sale3rdChildService.save(ap);

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

    private static String[] DOC_TYPE = {".xls", ".xlsx"};
    private boolean isDoc(String suffix) {
        return Arrays.asList(DOC_TYPE).contains(suffix);
    }
}
