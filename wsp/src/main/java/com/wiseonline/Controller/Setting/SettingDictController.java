package com.wiseonline.Controller.Setting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.SettingDict;
import com.wiseonline.Service.Impl.SettingDictServiceImpl;
import com.wiseonline.Utils.ConstClass;
import com.wiseonline.Utils.PageResult;
import com.wiseonline.Utils.PermissionInfo;
import com.wiseonline.Utils.ResultMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created by yanwj on 2015/11/11.
 */
@RestController
@RequestMapping("/Setting/SettingDict")
public class SettingDictController extends BaseController{
    @Autowired
    SettingDictServiceImpl settingEducationService;

    @RequestMapping(value = "{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看数据字典列表", module = "后台、前台-配置管理")
    public PageResult<SettingDict> getAll(@PathVariable int page,@PathVariable int pageSize,SettingDict model){
        if (model.getType() != null)
        {
            String sqlP = "SELECT * FROM setting_dict WHERE type = '"+model.getType()+"' and parentid != -1";
            if(model.getParentid()>0){
                sqlP+=" and parentid="+model.getParentid();
            }

            PageResult<SettingDict> pageResult = new PageResult<SettingDict>();
            List<SettingDict> list = settingEducationService.findByDataSQL(sqlP);
            if (list != null) {
                pageResult.setTotal(list.size());
            }else {
                pageResult.setTotal(0);
            }

            sqlP += "   order by order_flag asc";
            if (page!=0){
                sqlP += "   limit "+(page-1)*pageSize+","+pageSize;
            }

            List<SettingDict> listObject = settingEducationService.findByDataSQL(sqlP);
            pageResult.setResult(listObject);
            pageResult.setPage(page);
            pageResult.setPagesize(pageSize);
            return pageResult;
        }
        PageResult<SettingDict> models = settingEducationService.findAll(page,pageSize,model,true,"orderFlag");
        return models;
    }
    @RequestMapping(value = "Add",method = RequestMethod.POST)
    @PermissionInfo(name = "新增数据字典", module = "后台、前台-配置管理")
    public ResultMessage Add(SettingDict model){
        String sqls = "select * from setting_dict where name='"+model.getName()+"' and type = '"+model.getType()+"'";
        List<SettingDict> settingDictList = settingEducationService.findByDataSQL(sqls);
        int flag = 0;
        if (settingDictList != null){
            if (0 < settingDictList.size()){
                flag = 1;
            }
        }
        if (flag == 1){
            return Msg(false,"数据字典名已存在");
        }else{
            String sql = "";
            int temp = model.getParentid();

            if(temp > 0){
                //sql = "insert into setting_dict (name,type,parentid,order_flag)value ('"+model.getName()+"','"+model.getType()+"',"+model.getParentid()+","+model.getOrderFlag()+")";
                SettingDict settingDict = settingEducationService.getbyId(model.getParentid());
                model.setSettingDict(settingDict);
                boolean rst = settingEducationService.save(model);
                if (rst){
                    return Msg(true, ConstClass.ResultSaveSuccess);
                }else{
                    return Msg(false,ConstClass.ResultSaveFault);
                }
            }else {
                sql = "insert into setting_dict (name,type,parentid,order_flag) value ('"+model.getName()+"','"+model.getType()+"',-1,"+model.getOrderFlag()+")";
                boolean rst = settingEducationService.execDataSql(sql);
                if (rst){
                    return Msg(true, ConstClass.ResultSaveSuccess);
                }else{
                    return Msg(false,ConstClass.ResultSaveFault);
                }
            }
        }
    }
    @RequestMapping(value = "Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看数据字典", module = "后台、前台-配置管理")
    public SettingDict Edit(@PathVariable int id){
        SettingDict model = settingEducationService.getbyId(id);
        return model;
    }
    @RequestMapping(value = "Update",method = RequestMethod.POST)
    @PermissionInfo(name = "更新数据字典", module = "后台、前台-配置管理")
    public ResultMessage Update(SettingDict model){
        String sqls = "select * from setting_dict where name='"+model.getName()+"' and type = '"+model.getType()+"' and objectid !="+model.getObjectid();
        List<SettingDict> settingDictList = settingEducationService.findByDataSQL(sqls);
        int flag = 0;
        if (settingDictList != null){
            if (0 < settingDictList.size()){
                flag = 1;
            }
        }
        if (flag == 1){
            return Msg(false,"数据字典名已存在");
        }else{
            String sql = "";
            if(model.getParentid() > 0){
                //sql = "update setting_dict  set name='"+model.getName()+"',type='"+model.getType()+"',parentid="+model.getParentid()+",order_flag = "+model.getOrderFlag()+" where objectid = "+model.getObjectid();
                SettingDict settingDict = settingEducationService.getbyId(model.getParentid());
                model.setSettingDict(settingDict);
                boolean rst = settingEducationService.update(model);
                if (rst){
                    return Msg(true, ConstClass.ResultSaveSuccess);
                }else{
                    return Msg(false,ConstClass.ResultSaveFault);
                }
            }else {
                sql = "update setting_dict set name='"+model.getName()+"',type='"+model.getType()+"',parentid=-1 ,order_flag = "+model.getOrderFlag()+" where objectid="+model.getObjectid();
                boolean rst = settingEducationService.execDataSql(sql);
                if (rst){
                    return Msg(true, ConstClass.ResultSaveSuccess);
                }else{
                    return Msg(false,ConstClass.ResultSaveFault);
                }
            }
        }
    }
    @RequestMapping(value = "Delete/{id}",method = RequestMethod.GET)
    @PermissionInfo(name = "删除数据字典", module = "后台、前台-配置管理")
    public ResultMessage Delete(@PathVariable int id){
        boolean rst = settingEducationService.delete(id);
        if (rst){
            return Msg(true,ConstClass.ResultDeleteSuccess);
        }else{
            return Msg(false,ConstClass.ResultDeleteFault);
        }
    }

    @RequestMapping(value = "ParentId/{page}/{pageSize}/{id}")
    @PermissionInfo(name = "根据parentID查询数据字典", module = "前台-数据字典")
    public PageResult<SettingDict> ParentId(@PathVariable int page,@PathVariable int pageSize,@PathVariable int id,SettingDict model){
        PageResult<SettingDict> result = settingEducationService.findByOneField(page, pageSize,
                "settingDict.objectid", id, true, "objectid",model);
        return result;
    }

    @RequestMapping(value = "cultivateProject/List", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看培训需求项目数据字典列表", module = "后台、前台-配置管理")
    public List<SettingDict> CultivateProjectGetAll(SettingDict model){
        String sql = "select * from setting_dict where type = 'cultivateProject' and parentid != -1";
        List<SettingDict> models = settingEducationService.findByDataSQL(sql);
        return models;
    }

    @RequestMapping(value = "Top/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看数据字典列表", module = "后台、前台-配置管理")
    public PageResult<SettingDict> getTopAll(@PathVariable int page,@PathVariable int pageSize,SettingDict model){

            return settingEducationService.findByOneField(page,pageSize,"settingDict.objectid",-1,true,"objectid",model);

    }

    @RequestMapping(value = "ParentIdExceptTop/List/{page}/{pageSize}")
    @PermissionInfo(name = "根据parentID查询数据字典", module = "前台-数据字典")
    public PageResult<SettingDict> ParentIdExceptTop(@PathVariable int page,@PathVariable int pageSize,SettingDict model){
        String sql = "select * from setting_dict where parentid = -1 and type = '"+model.getType()+"'";
        List<SettingDict> list = settingEducationService.findByDataSQL(sql);
        if (list != null){
            if (0 < list.size()) {
                SettingDict settingDict = list.get(0);
                PageResult<SettingDict> result = settingEducationService.findByOneField(page, pageSize,
                        "settingDict.objectid", settingDict.getObjectid(), false, "objectid", model);
                return result;
            }else {
                return new PageResult<SettingDict>();
            }
        }
        return new PageResult<SettingDict>();
    }
}
