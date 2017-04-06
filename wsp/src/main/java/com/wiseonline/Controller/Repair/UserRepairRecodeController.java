package com.wiseonline.Controller.Repair;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.UserRepair;
import com.wiseonline.Domain.UserRepairRecode;
import com.wiseonline.Service.UserRepairRecodeService;
import com.wiseonline.Service.UserRepairService;
import com.wiseonline.Utils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * Created by guhuinan on 2015-12-21.
 */
@RestController
@RequestMapping("/UserRepairRecode")
public class UserRepairRecodeController extends BaseController{

    @Autowired
    UserRepairRecodeService userRepairRecodeService;

    @Autowired
    UserRepairService userRepairService;

    @RequestMapping(value = "Add", method = RequestMethod.POST)
    @PermissionInfo(name = "新增维修记录", module = "后台-报修管理")
    public ResultMessage Add(UserRepairRecode Model, HttpServletRequest request){
        if (Model.getRepairId() != 0){
            UserRepair userRepair = userRepairService.getbyId(Model.getRepairId());
            Model.setUserRepair(userRepair);
        }
        if (!"".equals(Model.getMemo())) {
            if (Model.getObjectid() != 0){
                Boolean rst = userRepairRecodeService.update(Model);
                if (rst) {
                    return Msg(true, ConstClass.ResultSaveSuccess);
                } else {
                    return Msg(false, ConstClass.ResultSaveFault);
                }
            }else {
                Boolean rst = userRepairRecodeService.save(Model);
                if (rst) {
                    return Msg(true, ConstClass.ResultSaveSuccess);
                } else {
                    return Msg(false, ConstClass.ResultSaveFault);
                }
            }
        }else {
            return Msg(true, ConstClass.ResultSaveSuccess);
        }
    }

    @RequestMapping(value = "Bid/{id}", method = RequestMethod.GET)
    @PermissionInfo(name = "返回repairId的特殊字符", module = "后台-报修管理")
    public UserRepairRecode Bid(@PathVariable int id,UserRepairRecode Model){
        //long objectid = Model.getObjectid();
        if (id == 0) {
            UserRepairRecode userRepairRecode = new UserRepairRecode();
            userRepairRecode.setRepairId(-207);
            return userRepairRecode;
        }else {
            String sql = "select * from user_repair_recode where repairId = "+id+" order by objectid desc";
            List<UserRepairRecode> list = userRepairRecodeService.findByDataSQL(sql);
            if (list != null) {
                if (0 < list.size()) {
                    return list.get(0);
                }else{
                    UserRepairRecode userRepairRecode = new UserRepairRecode();
                    userRepairRecode.setRepairId(-207);
                    return userRepairRecode;
                }
            }else {
                UserRepairRecode userRepairRecode = new UserRepairRecode();
                userRepairRecode.setRepairId(-207);
                return userRepairRecode;
            }
        }
    }


    @RequestMapping(value = "Update", method = RequestMethod.POST)
    @PermissionInfo(name = "更新维修记录", module = "后台-报修管理")
    public ResultMessage Update(UserRepairRecode Model) {
        if (Model.getRepairId() != 0){
            UserRepair userRepair = userRepairService.getbyId(Model.getRepairId());
            Model.setUserRepair(userRepair);
        }
        boolean rst = userRepairRecodeService.saveOrUpdate(Model);
        if (rst) {
            return Msg(true, ConstClass.ResultSaveSuccess);
        } else {
            return Msg(false, ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "Delete/{id}", method = RequestMethod.GET)
    @PermissionInfo(name = "删除维修记录", module = "后台-报修管理")
    public ResultMessage Delete(@PathVariable int id) {
        boolean rst = userRepairRecodeService.delete(id);
        if (rst) {
            return Msg(true, ConstClass.ResultDeleteSuccess);
        } else {
            return Msg(false, ConstClass.ResultDeleteFault);
        }
    }

    @RequestMapping(value = "{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看维修记录", module = "后台-报修管理")
    public PageResult<UserRepairRecode> getALL(@PathVariable int page,
                                               @PathVariable int pageSize, HttpServletRequest request, UserRepairRecode Model) throws MyException {
        String repairIdString = request.getParameter("repairId");
        if (repairIdString != null)
            try {
                int repairId = Integer.parseInt(repairIdString);
                PageResult<UserRepairRecode> userRepairRecodePageResult = userRepairRecodeService.findByOneField(page,pageSize,"userRepair.objectid",repairId,false,"createTime",Model);
                return userRepairRecodePageResult;
            }catch (Exception e){
                throw new MyException(ConstClass.DataError);
            }else{
            PageResult<UserRepairRecode> userRepairRecodePageResult = userRepairRecodeService.findAll(page,pageSize,Model);
            return userRepairRecodePageResult;
        }
    }
}
