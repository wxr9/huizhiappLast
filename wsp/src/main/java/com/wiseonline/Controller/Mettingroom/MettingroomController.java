package com.wiseonline.Controller.Mettingroom;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.Mettingroom;
import com.wiseonline.Service.Impl.MettingroomServiceImpl;
import com.wiseonline.Utils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by yanwj on 2016/3/28.
 */
@RestController
@RequestMapping("/Mettingroom/Mettingroom")
public class MettingroomController extends BaseController{

    @Autowired
    MettingroomServiceImpl mettingroomService;

    @RequestMapping(value = "List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看会议室列表", module = "前台-会议室")
    public PageResult<Mettingroom> getAll(@PathVariable int page,
                                        @PathVariable int pageSize, Mettingroom Model) {
        PageResult<Mettingroom> models = mettingroomService.findAll(page, pageSize, Model);
        return models;
    }
    @RequestMapping(value = "Enable/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看可用会议室列表", module = "后台-会议室")
    public PageResult<Mettingroom> getEnableAll(@PathVariable int page,
                                              @PathVariable int pageSize, Mettingroom Model) {
        PageResult<Mettingroom> models = mettingroomService.findByOneField(page, pageSize,
                "deleteFlag", 1, true, "objectid",Model);
        return models;
    }
    @RequestMapping(value = "Add", method = RequestMethod.POST)
    @PermissionInfo(name = "添加会议室", module = "前台-会议室")
    public ResultMessage Add(Mettingroom Model) throws MyException {
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            if (Model.getDeleteFlag() == 0){
                Model.setDeleteFlag(-1);
            }
            boolean rst = mettingroomService.save(Model);
            if (rst){
                return Msg(true, ConstClass.ResultSaveSuccess);
            }else {
                return Msg(false,ConstClass.ResultSaveFault);
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }
    @RequestMapping(value = "Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "编辑会议室", module = "前台-会议室")
    public Mettingroom Edit(@PathVariable int id) {
        Mettingroom model = mettingroomService.getbyId(id);
        return model;
    }
    @RequestMapping(value = "Update", method = RequestMethod.POST)
    @PermissionInfo(name = "更新会议室", module = "前台-会议室")
    public ResultMessage Update(Mettingroom Model) throws MyException {
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            boolean rst = mettingroomService.update(Model);
            if (rst){
                return Msg(true,ConstClass.ResultSaveSuccess);
            }else {
                return Msg(false,ConstClass.ResultSaveFault);
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }
    @RequestMapping(value = "Delete/{id}", method = RequestMethod.GET)
    @PermissionInfo(name = "删除会议室", module = "前台-会议室")
    public ResultMessage Delete(@PathVariable int id) {
        boolean rst = mettingroomService.delete(id);
        if (rst) {
            return Msg(true, ConstClass.ResultDeleteSuccess);
        } else {
            return Msg(false, ConstClass.ResultDeleteFault);
        }
    }

    @RequestMapping(value = "Enable/Delete/{id}/{flag}", method = RequestMethod.GET)
    @PermissionInfo(name = "禁用启用职位", module = "后台-职位")
    public ResultMessage EnableDelete(@PathVariable int id,@PathVariable int flag) {
        if (flag == 1 || flag == -1) {
            String sql = "update mettingroom set deleteflag = " + flag + " where objectid = " + id;
            boolean rst = mettingroomService.execDataSql(sql);
            if (rst) {
                return Msg(true, ConstClass.OperationSuccess);
            } else {
                return Msg(false, ConstClass.OperationFault);
            }
        }else {
            return Msg(false,"参数有误");
        }
    }

}
