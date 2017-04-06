package com.wiseonline.Controller.Repair;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.*;
import com.wiseonline.Service.Impl.*;
import com.wiseonline.Service.UserService;
import com.wiseonline.Utils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;


/**
 * Created by Wanx on 11/18/2015.
 */
@RestController
@RequestMapping("/UserRepair")
public class UserRepairController extends BaseController {
    @Autowired
    UserRepairServiceImpl userRepairService;

    @Autowired
    BuildingServiceImpl buildingService;

    @Autowired
    ParkServiceImpl parkService;

    @Autowired
    SettingDictServiceImpl settingDictService;

    private static String WSP_SESSION_USERNAME = "WSP_SESSION_USERNAME";

    @Autowired
    UserService userService;

    @Autowired
    MainBusinessServiceImpl mainBusinessService;

    @RequestMapping(value = "{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看报修", module = "前台-报修管理")
    public PageResult<UserRepair> getAll(@PathVariable int page,
                                         @PathVariable int pageSize, UserRepair Model) {
        PageResult<UserRepair> models = userRepairService.findAll(page, pageSize, Model);
        return models;
    }

    @RequestMapping(value = "Add", method = RequestMethod.POST)
    @PermissionInfo(name = "添加报修", module = "前台-报修管理")
    public ResultMessageSpecial Add(UserRepair Model) throws MyException {
        //Model.setSerialNumber(UUID.randomUUID().toString());
        if (Model.getTypeId() == 1) {
            Model.setSerialNumber(getMaxSN(1, "WY"));
        } else if (Model.getTypeId() == 2) {
            Model.setSerialNumber(getMaxSN(2, "IT"));
        }
        String username = getUserName();
        ResultMessageSpecial resultMessageSpecial = new ResultMessageSpecial();
        String CompleteInfo = isUserInfoComplete();
        if (!username.equals("anonymousUser")) {
            if ("ok".equals(CompleteInfo)) {
                List<User> usr = (List<User>) userService.findByDataSQL("select * from users where username='" + username + "'");
                if (usr != null) {
                    if (Model.getTypeId() == 2) {
                        if (usr.get(0).getEnterpriseId() == 0) {
                            //throw new MyException(ConstClass.NotEnterpriseUser);
                        }
                    }
                    if (Model.getRepairType() != 0) {
                        SettingDict repairType = settingDictService.getbyId(Model.getRepairType());
                        Model.setRepairTypeDetail(repairType);
                    }
                    if (Model.getRepairTypeConfm() != 0) {
                        SettingDict repairType = settingDictService.getbyId(Model.getRepairTypeConfm());
                        Model.setRepairTypeDetail(repairType);
                    }
                    if (Model.getBuildingId() != 0) {
                        Building building = buildingService.getbyId(Model.getBuildingId());
                        Model.setBuilding(building);
                    }
                    if (Model.getParkId() != 0) {
                        Park park = parkService.getbyId(Model.getParkId());
                        Model.setPark(park);
                    }

                    Model.setChineseName(usr.get(0).getRealName());
                    boolean rst;
                    if (userRepairService.getbyId(Model.getObjectid()) != null) {
                        rst = userRepairService.update(Model);
                    } else {
                        rst = userRepairService.saveGetID(Model);
                    }
                    MainBusiness mainBusiness = new MainBusiness();
                    mainBusiness.setSerialNumber(Model.getSerialNumber());
                    mainBusiness.setBusinessId(Model.getObjectid());
                    if (Model.getTypeId() == 1) {
                        mainBusiness.setBusinessType("WY");
                        mainBusiness.setBusinessTypeZh("物业报修");
                    } else {
                        mainBusiness.setBusinessType("IT");
                        mainBusiness.setBusinessTypeZh("IT网络报修");
                    }
                    mainBusiness.setChineseName(Model.getChineseName());
                    mainBusiness.setCommentFlag(1);

                    mainBusiness.setCompany(Model.getCompany());
                    mainBusiness.setEmail(usr.get(0).getEmail());
                    mainBusiness.setPhone(usr.get(0).getPhone());
                    mainBusiness.setUsername(usr.get(0).getUsername());
                    mainBusinessService.save(mainBusiness);
                    if (rst) {
                        resultMessageSpecial.setObjectid(String.valueOf(Model.getObjectid()));
                        resultMessageSpecial.setSn(Model.getSerialNumber());
                        resultMessageSpecial.setSuccess(true);
                        return resultMessageSpecial;
                    } else {
                        throw new MyException(ConstClass.ResultSaveFault);
                    }
                } else {
                    throw new MyException(ConstClass.DataError);
                }
            } else {
                throw new MyException(CompleteInfo);
            }
        } else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }

    @RequestMapping(value = "Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "编辑报修", module = "前台-报修管理")
    public UserRepair Edit(@PathVariable int id) {
        UserRepair model = userRepairService.getbyId(id);
        return model;
    }

    @RequestMapping(value = "EditForAdmin/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "编辑报修（需要返回默认值等处理）", module = "后台-报修管理")
    public UserRepair EditForAdmin(@PathVariable int id) {
        UserRepair model = userRepairService.getbyId(id);
        //默认值处理
        if (model.getRepairTypeConfmDetail() == null && model.getRepairTypeDetail() != null) {
            model.setRepairTypeConfmDetail(model.getRepairTypeDetail());
            model.setRepairTypeConfm(model.getRepairTypeDetail().getObjectid());
            model.setRepairTypeConfmParentId(model.getRepairTypeDetail().getParentid());
        }
        if (model.getDescriptionConfm() == null) {
            model.setDescriptionConfm(model.getDescription());
        }
        System.out.println(model.getBuildingConfmDetail());
        if (model.getBuildingConfmDetail() == null) {
            model.setBuildingIdTypeConfm(model.getBuildingId());
            model.setBuildingConfmDetail(model.getBuilding());
        }
        System.out.println(model.getBuildingIdTypeConfm());
        return model;
    }

    @RequestMapping(value = "Update", method = RequestMethod.POST)
    @PermissionInfo(name = "更新报修", module = "前台-报修管理")
    public ResultMessage Update(UserRepair Model) {
        if (Model.getBuildingId() != 0) {
            Building building = buildingService.getbyId(Model.getBuildingId());
            Model.setBuilding(building);
        }
        if (Model.getParkId() != 0) {
            Park park = parkService.getbyId(Model.getParkId());
            Model.setPark(park);
        }
        if (Model.getRepairType() != 0) {
            SettingDict settingDict = settingDictService.getbyId(Model.getRepairType());
            Model.setRepairTypeDetail(settingDict);
        }
        if (Model.getRepairTypeConfm() != 0) {
            SettingDict settingDict = settingDictService.getbyId(Model.getRepairTypeConfm());
            Model.setRepairTypeConfmDetail(settingDict);
        }
        if (Model.getBuildingIdTypeConfm() != 0) {
            Building building = buildingService.getbyId(Model.getBuildingIdTypeConfm());
            Model.setBuildingConfmDetail(building);
        }
        boolean rst = userRepairService.saveOrUpdate(Model);
        if (rst) {
            return Msg(true, ConstClass.ResultSaveSuccess);
        } else {
            return Msg(false, ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "Delete/{id}", method = RequestMethod.GET)
    @PermissionInfo(name = "删除报修", module = "前台-报修管理")
    public ResultMessage Delete(@PathVariable int id) {
        boolean rst = userRepairService.delete(id);
        if (rst) {
            return Msg(true, ConstClass.ResultDeleteSuccess);
        } else {
            return Msg(false, ConstClass.ResultDeleteFault);
        }
    }

    public String getMaxSN(int type, String typeName) {
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
        String sql = "select CAST(ifnull(MAX(CAST(substring_index(serialNumber,'-',-1) AS UNSIGNED INTEGER)),0) as UNSIGNED INTEGER) as num\n" +
                "from user_repair \n" +
                "where typeId = " + String.valueOf(type) + "\n" +
                "and date_format(createDate,'%Y-%m-%d')= date_format(now(),'%Y-%m-%d')";
        int SN = userRepairService.getCountBySQL(sql);
        return typeName + "-" + df.format(new Date()) + "-" + String.format("%04d", SN + 1);
    }

    @RequestMapping(value = "noComment/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "未评价报修", module = "前台-报修管理")
    public PageResult<UserRepair> noComment(@PathVariable int page,
                                            @PathVariable int pageSize, UserRepair Model) throws MyException {
        String sql = "";
        String sql2 = "";
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            sql = "select * from user_repair where  completeDate != '' and  commentflag = 1 and applicant = '" + username + "'";
            if (page == 0) {
                sql2 = sql;
            } else if (page == 1) {
                sql2 = "select * from user_repair where completeDate != '' and commentflag = 1 and applicant = '" + username + "' limit 0," + pageSize;
            } else {
                sql2 = "select * from user_repair where completeDate != '' and commentflag = 1 and applicant = '" + username + "' limit " + (page - 1) * pageSize + "," + pageSize;
            }
            PageResult<UserRepair> pageResult = new PageResult<UserRepair>();
            List<UserRepair> list = userRepairService.findByDataSQL(sql);
            if (list != null) {
                pageResult.setTotal(list.size());
            } else {
                pageResult.setTotal(0);
            }
            List<UserRepair> listObject = userRepairService.findByDataSQL(sql2);
            pageResult.setResult(listObject);
            pageResult.setPage(page);
            pageResult.setPagesize(pageSize);
            return pageResult;
        } else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }
}
