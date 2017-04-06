package com.wiseonline.Controller.Setting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Dao.BaseDao;
import com.wiseonline.Domain.*;
import com.wiseonline.Service.BuildingService;
import com.wiseonline.Service.Impl.RoleServiceImpl;
import com.wiseonline.Service.Impl.SettingRepairAutoConfigServiceImpl;
import com.wiseonline.Service.Impl.SettingRepairManConfigServiceImpl;
import com.wiseonline.Service.Impl.SettingRepairServiceImpl;
import com.wiseonline.Service.ParkService;
import com.wiseonline.Service.SettingDictService;
import com.wiseonline.Service.SettingRichTextService;
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
import java.util.List;

/**
 * Created by wanx on 2015/12/06.
 */
@RestController
@RequestMapping("/Setting")
public class RepairController extends BaseController{
    @Autowired
    SettingRepairServiceImpl settingRepairService;

    @Autowired
    RoleServiceImpl roleService;

    @Autowired
    private BaseDao baseDao;

    @Autowired
    SettingRichTextService settingRichTextService;

    @Autowired
    SettingRepairAutoConfigServiceImpl settingRepairAutoConfigService;

    @Autowired
    SettingRepairManConfigServiceImpl settingRepairManConfigService;

    @Autowired
    SettingDictService settingDictService;


    @Autowired
    ParkService parkService;

    @Autowired
    BuildingService buildingService;

    @RequestMapping(value = "SettingRepairBase/Edit/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看报修信息", module = "后台、前台-报修信息块管理")
    public SettingRepair BaseEdit(@PathVariable int objectid){
        SettingRepair model = settingRepairService.getbyId(objectid);
        if(model!=null) {
            SettingRichText srt = settingRichTextService.getbyId(model.getBaseTerm());
            if(srt!=null){
                model.setBaseTermName(srt.getTitle());
            }
        }
        return model;
    }
    @RequestMapping(value = "SettingRepairBase/Update",method = RequestMethod.POST)
    @PermissionInfo(name = "更新报修信息", module = "后台、前台-报修信息块管理")
    public ResultMessage BaseUpdate(SettingRepair model){
            SettingRepair sr = settingRepairService.getbyId((int) model.getObjectid());
            sr.setBaseTerm(model.getBaseTerm());
            sr.setBaseEnable(model.getBaseEnable());

            boolean rst = settingRepairService.update(sr);
            if (rst){
                return Msg(true, ConstClass.ResultSaveSuccess);
            }else{
                return Msg(false,ConstClass.ResultSaveFault);
            }
    }

    @RequestMapping(value = "SettingRepairComment/Edit/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看报修信息", module = "后台、前台-报修信息块管理")
    public SettingRepair CommentEdit(@PathVariable int objectid){
        SettingRepair model = settingRepairService.getbyId(objectid);
        return model;
    }
    @RequestMapping(value = "SettingRepairComment/Update",method = RequestMethod.POST)
    @PermissionInfo(name = "更新报修信息", module = "后台、前台-报修信息块管理")
    public ResultMessage CommentUpdate(SettingRepair model){
        SettingRepair sr = settingRepairService.getbyId((int) model.getObjectid());
        sr.setAutoCommentAttitude(model.getAutoCommentAttitude());
        sr.setAutoCommentDeadline(model.getAutoCommentDeadline());
        sr.setAutoCommentInfo(model.getAutoCommentInfo());
        sr.setAutoCommentQuality(model.getAutoCommentQuality());
        sr.setAutoCommentSpeed(model.getAutoCommentSpeed());
        boolean rst = settingRepairService.update(sr);
        if (rst){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "SettingRepairValidDate/Edit/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看报修信息", module = "后台、前台-报修信息块管理")
    public SettingRepair ValidDateEdit(@PathVariable int objectid){
        SettingRepair model = settingRepairService.getbyId(objectid);
        return model;
    }
    @RequestMapping(value = "SettingRepairValidDate/Update",method = RequestMethod.POST)
    @PermissionInfo(name = "更新报修信息", module = "后台、前台-报修信息块管理")
    public ResultMessage ValidDateUpdate(SettingRepair model){
        SettingRepair sr = settingRepairService.getbyId((int) model.getObjectid());
        sr.setWorkStartTime(model.getWorkStartTime());
        sr.setWorkEndTime(model.getWorkEndTime());
        sr.setNonWorkStartTime(model.getNonWorkStartTime());
        sr.setNonWorkEndTime(model.getNonWorkEndTime());
        sr.setAlertInfo(model.getAlertInfo());
        boolean rst = settingRepairService.update(sr);
        if (rst){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "SettingAutoDispatch/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看报修自动分配信息", module = "后台、前台-报修自动分配信息块管理")
    public PageResult<SettingRepairAutoConfig> AutoDispatchList(@PathVariable int page,@PathVariable int pageSize,HttpServletRequest request){
        String paramParkName = request.getParameter("searchName").trim();
        String sqlLimit,sqlCount;
        if (paramParkName!=null){
            sqlLimit = "SELECT CASE WHEN c.objectid IS NOT NULL THEN c.objectid ELSE -a.objectid END AS objectid,\n" +
                    "b.objectid AS parkId,a.objectid AS buildingId,c.acceptorId\n" +
                    "FROM building a INNER JOIN park b ON a.parkid = b.objectid AND b.name LIKE '%"+paramParkName+"%'\n" +
                    "LEFT JOIN setting_repair_autoconfig c ON a.objectid = c.buildingId AND b.objectid = c.parkId\n" +
                    "LIMIT " + (page - 1) * pageSize + "," + pageSize;
            sqlCount = "SELECT COUNT(*)\n" +
                    "FROM building a INNER JOIN park b ON a.parkid = b.objectid  AND b.name LIKE '%"+paramParkName+"%'\n" +
                    "LEFT JOIN setting_repair_autoconfig c ON a.objectid = c.buildingId AND b.objectid = c.parkId";
        }
        else
        {
            sqlLimit = "SELECT CASE WHEN c.objectid IS NOT NULL THEN c.objectid ELSE -a.objectid END AS objectid,\n" +
                    "b.objectid AS parkId,a.objectid AS buildingId,c.acceptorId\n" +
                    "FROM building a INNER JOIN park b ON a.parkid = b.objectid\n" +
                    "LEFT JOIN setting_repair_autoconfig c ON a.objectid = c.buildingId AND b.objectid = c.parkId\n" +
                    "LIMIT " + (page - 1) * pageSize + "," + pageSize;
            sqlCount = "SELECT COUNT(*)\n" +
                    "FROM building a INNER JOIN park b ON a.parkid = b.objectid \n" +
                    "LEFT JOIN setting_repair_autoconfig c ON a.objectid = c.buildingId AND b.objectid = c.parkId";
        }

        Integer count = settingRepairAutoConfigService.getCountBySQL(sqlCount);
        List<SettingRepairAutoConfig> settingRepairAutoConfigList = settingRepairAutoConfigService.findByDataSQL(sqlLimit);
        for (int i = 0;i < settingRepairAutoConfigList.size(); i++){
            Park park = parkService.getbyId(settingRepairAutoConfigList.get(i).getParkId());
            Building building = buildingService.getbyId(settingRepairAutoConfigList.get(i).getBuildingId());
            settingRepairAutoConfigList.get(i).setParkName(park.getName());
            settingRepairAutoConfigList.get(i).setBuildingName(building.getName());
        }
        PageResult<SettingRepairAutoConfig> models = new PageResult<SettingRepairAutoConfig>();
        models.setPage(page);
        models.setPagesize(pageSize);
        models.setResult(settingRepairAutoConfigList);
        models.setTotal(count);
        return models;
    }

    @RequestMapping(value = "SettingAutoDispatch/Edit/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看单个报修自动分配信息", module = "后台、前台-报修自动分配信息块管理")
    public SettingRepairAutoConfig AutoDispatchEdit(@PathVariable int objectid, HttpServletRequest request){
        SettingRepairAutoConfig settingRepairAutoConfig = new SettingRepairAutoConfig();
        String parkId = request.getParameter("parkId");
        String buildingId = request.getParameter("buildingId");
        if (objectid < 0){
            if (parkId != null && buildingId != null){
                Park pk = parkService.getbyId(Integer.parseInt(parkId));
                Building bd = buildingService.getbyId(Integer.parseInt(buildingId));
                settingRepairAutoConfig.setParkName(pk.getName());
                settingRepairAutoConfig.setParkId(Integer.parseInt(parkId));
                settingRepairAutoConfig.setBuildingName(bd.getName());
                settingRepairAutoConfig.setBuildingId(Integer.parseInt(buildingId));
                settingRepairAutoConfig.setObjectid(objectid);
            }
        }else{
            settingRepairAutoConfig = settingRepairAutoConfigService.getbyId(objectid);
            Park pk = parkService.getbyId(settingRepairAutoConfig.getParkId());
            Building bd = buildingService.getbyId(settingRepairAutoConfig.getBuildingId());
            settingRepairAutoConfig.setParkName(pk.getName());
            settingRepairAutoConfig.setBuildingName(bd.getName());
        }
        return settingRepairAutoConfig;
    }

    @RequestMapping(value = "SettingAutoDispatch/Update",method = RequestMethod.POST)
    @PermissionInfo(name = "更新报修自动分配信息", module = "后台、前台-报修自动分配信息块管理")
    public ResultMessage AutoDispatchUpdate(SettingRepairAutoConfig model){
        boolean rst;
        if (model.getObjectid() < 0){
            rst = settingRepairAutoConfigService.save(model);
        }else {
            rst = settingRepairAutoConfigService.update(model);
        }
        if (rst){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "SettingMaintainer/JobType/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看维修人员工种信息", module = "后台、前台-维修人员工种管理")
    public PageResult<SettingDict> SettingMaintainerList(@PathVariable int page,@PathVariable int pageSize,SettingDict model){
        PageResult<SettingDict> models = settingDictService.findByOneField(page,pageSize,"type","worktype",false,"objectid");
        return models;
    }

    @RequestMapping(value = "SettingMaintainer/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看维修人员信息", module = "后台、前台-维修人员块管理")
    public PageResult<SettingRepairManConfig> SettingMaintainerList(HttpServletRequest request,@PathVariable int page,@PathVariable int pageSize,SettingRepairManConfig model){
        String doudouke = request.getParameter("searchName");
        String repairType = request.getParameter("repairType");
        String username = getUserName();
        String sqlRole = "SELECT rolename FROM `role_user` WHERE username='"+username+"'";
        List<String> roles = baseDao.findByCustomerSQL(sqlRole);
        if (!"".equals(doudouke)) {
            if (doudouke != null) {
                String sql = "SELECT * FROM setting_repair_manconfig WHERE name LIKE '%" + doudouke + "%' or mobile LIKE '%" + doudouke +
                        "%' and repairType = " + repairType;
                String sql2 = "";
                if (page == 1) {
                    sql2 = "SELECT * FROM setting_repair_manconfig WHERE name LIKE '%" + doudouke + "%' or mobile LIKE '%" + doudouke +
                            "%'  and repairType = " + repairType + " limit 0," + pageSize;
                } else if (page == 0) {
                    sql2 = sql;
                } else {
                    sql2 = "SELECT * FROM setting_repair_manconfig WHERE name LIKE '%" + doudouke + "%' or mobile LIKE '%" + doudouke +
                            "%'  and repairType = " + repairType + " limit " + (page - 1) * pageSize + "," + pageSize;
                }
                PageResult<SettingRepairManConfig> pageResult = new PageResult<SettingRepairManConfig>();
                List<SettingRepairManConfig> list = settingRepairManConfigService.findByDataSQL(sql);
                if (list != null) {
                    pageResult.setTotal(list.size());
                } else {
                    pageResult.setTotal(0);
                }
                List<SettingRepairManConfig> listObject = settingRepairManConfigService.findByDataSQL(sql2);
                pageResult.setResult(listObject);
                pageResult.setPage(0);
                pageResult.setPagesize(pageSize);
                return pageResult;
            } else {
                PageResult<SettingRepairManConfig> models = settingRepairManConfigService.findAll(page, pageSize, model);
                return models;
            }
        }else {
            PageResult<SettingRepairManConfig> models = settingRepairManConfigService.findAll(page, pageSize, model);
            return models;
        }
    }

    @RequestMapping(value = "SettingMaintainer/Role/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "按角色查看维修人员信息", module = "后台、前台-维修人员块管理")
    public PageResult<SettingRepairManConfig> SettingMaintainerListForRole(HttpServletRequest request,@PathVariable int page,@PathVariable int pageSize,SettingRepairManConfig model){
        String repairType = request.getParameter("repairType");
        String username = getUserName();
        String sqlRole = "SELECT rolename FROM `role_user` WHERE username='"+username+"'";
        List<String> roles = baseDao.findByCustomerSQL(sqlRole);

        //ServDispatcher 这个角色特殊处理
        if (roles.contains("ServDispatcher")){
            PageResult<SettingRepairManConfig> pageResult = settingRepairManConfigService.findByOneField(page,pageSize,"repairType",Integer.valueOf(repairType),true,"objectid",model);
            return pageResult;
        }

        String roleStr = listToString(roles,',');
        String sql = "select * from setting_repair_manconfig where find_in_set(department,'"+roleStr+"') and repairType = " + repairType;
        List<SettingRepairManConfig> list = settingRepairManConfigService.findByDataSQL(sql);

        PageResult<SettingRepairManConfig> pageResult = new PageResult<SettingRepairManConfig>();
        pageResult.setResult(list);
        pageResult.setPagesize(list.size());
        pageResult.setPage(1);
        pageResult.setTotal(list.size());
        return pageResult;
    }

    @RequestMapping(value = "SettingMaintainer/Add", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "新增维修人员", module = "后台、前台-维修人员块管理")
    public ResultMessage SettingMaintainerAdd(SettingRepairManConfig model){
        System.out.println("===============================");
        if (settingRepairManConfigService.IsExistName("name",model.getName(), (int)model.getObjectid())) {
            return Msg(false, "维修人员已存在");
        }
        else {
            boolean rst = settingRepairManConfigService.save(model);
            if (rst){
                return Msg(true, ConstClass.ResultSaveSuccess);
            }else{
                return Msg(false,ConstClass.ResultSaveFault);
            }
        }
        /*boolean rst = settingRepairManConfigService.save(model);
            if (rst){
                return Msg(true, ConstClass.ResultSaveSuccess);
            }else{
                return Msg(false,ConstClass.ResultSaveFault);
            }*/
    }
    @RequestMapping(value = "SettingMaintainer/Edit/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "编辑维修人员", module = "后台、前台-维修人员块管理")
    public SettingRepairManConfig SettingMaintainerEdit(@PathVariable int objectid){
        SettingRepairManConfig model = settingRepairManConfigService.getbyId(objectid);
        return model;
    }
    @RequestMapping(value = "SettingMaintainer/Update",method = RequestMethod.POST)
    @PermissionInfo(name = "更新维修人员", module = "后台、前台-维修人员管理")
    public ResultMessage SettingMaintainerUpdate(SettingRepairManConfig model){
        if (settingRepairManConfigService.IsExistName("name",model.getName(), (int)model.getObjectid())) {
            return Msg(false, "维修人员已存在");
        }
        else {
            boolean rst = settingRepairManConfigService.update(model);
            if (rst) {
                return Msg(true, ConstClass.ResultSaveSuccess);
            } else {
                return Msg(false, ConstClass.ResultSaveFault);
            }
        }
    }

    @RequestMapping(value = "SettingMaintainer/Delete/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "删除维修人员", module = "后台、前台-维修人员块管理")
    public ResultMessage SettingMaintainerDelete(@PathVariable int objectid){
        boolean rst = settingRepairManConfigService.delete(objectid);
        if (rst){
            return Msg(true,ConstClass.ResultDeleteSuccess);
        }else{
            return Msg(false,ConstClass.ResultDeleteFault);
        }
    }

    private String listToString(List list, char separator) {    StringBuilder sb = new StringBuilder();    for (int i = 0; i < list.size(); i++) {        sb.append(list.get(i)).append(separator);    }    return sb.toString().substring(0,sb.toString().length()-1);}
}
