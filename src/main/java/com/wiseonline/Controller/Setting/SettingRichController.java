package com.wiseonline.Controller.Setting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.SettingRichText;
import com.wiseonline.Service.Impl.SettingRichTextServiceImpl;
import com.wiseonline.Utils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * Created by yanwj on 2015/11/26.
 */
@RestController
@RequestMapping("/Setting/RichText")
public class SettingRichController extends BaseController {
    @Autowired
    SettingRichTextServiceImpl settingRichTextService;

    @RequestMapping(value = "{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查询富文本列表", module = "后台-富文本管理")
    public PageResult<SettingRichText> getAll(HttpServletRequest request,@PathVariable int page,@PathVariable int pageSize,SettingRichText model){
        String doudouke = request.getParameter("searchName");
        String valid = request.getParameter("valid");
        if (doudouke != null){
            String sql = "SELECT * FROM setting_richtext WHERE memo LIKE '%"+doudouke+"%' or author LIKE '%"+doudouke+"%' or title LIKE '%"+doudouke+"%' or content LIKE '%"+doudouke+"%'";
            String sql2 = "";
            if (page == 1){
                sql2 = "SELECT * FROM setting_richtext WHERE memo LIKE '%"+doudouke+"%' or author LIKE '%"+doudouke+"%' or title LIKE '%"+doudouke+"%' or content LIKE '%"+doudouke+"%' limit 0,"+pageSize;
            }else if (page == 0){
                sql2 = sql;
            }else {
                sql2 = "SELECT * FROM setting_richtext WHERE memo LIKE '%"+doudouke+"%' or author LIKE '%"+doudouke+"%' or title LIKE '%"+doudouke+"%' or content LIKE '%"+doudouke+"%' limit "+(page-1)*pageSize+","+pageSize;
            }
            PageResult<SettingRichText> pageResult = new PageResult<SettingRichText>();
            List<SettingRichText> list = settingRichTextService.findByDataSQL(sql);
            if (list != null){
                pageResult.setTotal(list.size());
            }else {
                pageResult.setTotal(0);
            }
            List<SettingRichText> listObject = settingRichTextService.findByDataSQL(sql2);
            pageResult.setResult(listObject);
            pageResult.setPage(page);
            pageResult.setPagesize(pageSize);
            return pageResult;
        }else {
            if ("1".equals(valid)){
                Map map = new HashMap();
                map.put("deleteFlag",-1);
                PageResult<SettingRichText> models = settingRichTextService.findByOneField(page,pageSize,map,true,true,"objectid",model);
                return models;
            }else {
                PageResult<SettingRichText> models = settingRichTextService.findAll(page, pageSize, model);
                return models;
            }
        }
    }
    @RequestMapping(value = "Add",method = RequestMethod.POST)
    @PermissionInfo(name = "新增富文本", module = "后台-富文本管理")
    public ResultMessage Add(SettingRichText model){
        if (settingRichTextService.IsExistName("title",model.getTitle(),model.getObjectid())){
            return Msg(false,"富文本标题已存在");
        }else{
            model.setAuthor(getUserName());
            boolean rst = settingRichTextService.save(model);
            if (rst){
                return Msg(true, ConstClass.ResultSaveSuccess);
            }else{
                return Msg(false,ConstClass.ResultSaveFault);
            }
        }
    }
    @RequestMapping(value = "Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看富文本", module = "后台-富文本管理")
    public SettingRichText Edit(@PathVariable int id){
        SettingRichText model = settingRichTextService.getbyId(id);
        return model;
    }

    @RequestMapping(value = "ByTitle/Edit", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看富文本", module = "后台-富文本管理")
    public SettingRichText TitleEdit(HttpServletRequest request){
        String title = request.getParameter("title");
        String sql = "select * from setting_richtext where title = '"+title+"'";
        List<SettingRichText> list = settingRichTextService.findByDataSQL(sql);
        if (list != null){
            if (0 < list.size()){
                return list.get(0);
            }
        }
        return new SettingRichText();
    }
    @RequestMapping(value = "Update",method = RequestMethod.POST)
    @PermissionInfo(name = "更新富文本", module = "后台-富文本管理")
    public ResultMessage Update(SettingRichText model){
        if (settingRichTextService.IsExistName("title",model.getTitle(),model.getObjectid())){
            return Msg(false,"富文本标题已存在");
        }else{
            model.setAuthor(getUserName());
            boolean rst = settingRichTextService.update(model);
            if (rst){
                return Msg(true, ConstClass.ResultSaveSuccess);
            }else{
                return Msg(false,ConstClass.ResultSaveFault);
            }
        }
    }
    @RequestMapping(value = "EnableRichText/{objectid}/{flag}")
    @PermissionInfo(name = "禁用解禁富文本", module = "后台-富文本管理")
    public ResultMessage EnableRichText(@PathVariable int objectid,@PathVariable String flag){
        if (flag.equals("0")){
            //禁用富文本
            boolean rst = settingRichTextService.enableRichText(objectid, "-1");
            if (rst){
                return Msg(true,ConstClass.DisableRichTextSuccess);
            }else{
                return Msg(false,ConstClass.DisableRichTextFault);
            }
        }else{
            //启用富文本
            boolean rst = settingRichTextService.enableRichText(objectid,"1");
            if (rst){
                return Msg(true,ConstClass.EnableRichTextSuccess);
            }else{
                return Msg(true,ConstClass.EnableRichTextFault);
            }
        }
    }
    @RequestMapping(value = "Special/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查询富文本列表", module = "后台-富文本管理")
    public PageResultObject Special(HttpServletRequest request,@PathVariable int page,@PathVariable int pageSize,SettingRichText model){
        String doudouke = request.getParameter("searchName");
        String valid = request.getParameter("valid");
        if (doudouke != null){
            String sql = "SELECT title,objectid FROM setting_richtext WHERE title LIKE '%"+doudouke+"%' or content LIKE '%"+doudouke+"%'";
            String sql2 = "";
            if (page == 1){
                sql2 = "SELECT title,objectid FROM setting_richtext WHERE title LIKE '%"+doudouke+"%' or content LIKE '%"+doudouke+"%' limit 0,"+pageSize;
            }else if (page == 0){
                sql2 = sql;
            }else {
                sql2 = "SELECT title,objectid FROM setting_richtext WHERE title LIKE '%"+doudouke+"%' or content LIKE '%"+doudouke+"%' limit "+(page-1)*pageSize+","+pageSize;
            }
            PageResultObject pageResult = new PageResultObject();
            List<Object[]> list = settingRichTextService.findByCustomerSQL(sql);
            if (list != null){
                pageResult.setTotal(list.size());
            }else {
                pageResult.setTotal(0);
            }
            List<Object[]> listObject = settingRichTextService.findByCustomerSQL(sql2);
            pageResult.setResult(listObject);
            pageResult.setPage(page);
            pageResult.setPagesize(pageSize);
            return pageResult;
        }else {
            if ("1".equals(valid)){
                String sql = "SELECT title,objectid FROM setting_richtext WHERE deleteflag != -1";
                String sql2 = "";
                if (page == 1){
                    sql2 = "SELECT title,objectid FROM setting_richtext WHERE deleteflag != -1 limit 0,"+pageSize;
                }else if (page == 0){
                    sql2 = sql;
                }else {
                    sql2 = "SELECT title,objectid FROM setting_richtext WHERE deleteflag != -1 limit "+(page-1)*pageSize+","+pageSize;
                }
                PageResultObject pageResult = new PageResultObject();
                List<Object[]> list = settingRichTextService.findByCustomerSQL(sql);
                if (list != null){
                    pageResult.setTotal(list.size());
                }else {
                    pageResult.setTotal(0);
                }
                List<Object[]> listObject = settingRichTextService.findByCustomerSQL(sql2);
                pageResult.setResult(listObject);
                pageResult.setPage(page);
                pageResult.setPagesize(pageSize);
                return pageResult;
            }else {
                String sql = "SELECT title,objectid FROM setting_richtext where deleteflag != -1";
                String sql2 = "";
                if (page == 1){
                    sql2 = "SELECT title,objectid FROM setting_richtext where deleteflag != -1 limit 0,"+pageSize;
                }else if (page == 0){
                    sql2 = sql;
                }else {
                    sql2 = "SELECT title,objectid FROM setting_richtext where deleteflag != -1 limit "+(page-1)*pageSize+","+pageSize;
                }
                PageResultObject pageResult = new PageResultObject();
                List<Object[]> list = settingRichTextService.findByCustomerSQL(sql);
                if (list != null){
                    pageResult.setTotal(list.size());
                }else {
                    pageResult.setTotal(0);
                }
                List<Object[]> listObject = settingRichTextService.findByCustomerSQL(sql2);
                pageResult.setResult(listObject);
                pageResult.setPage(page);
                pageResult.setPagesize(pageSize);
                return pageResult;
            }
        }
    }
}
