package com.wiseonline.Controller.House;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.House;
import com.wiseonline.Service.Impl.HouseServiceImpl;
import com.wiseonline.Utils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by yanwj on 2016/3/16.
 */
@RestController
@RequestMapping("/House")
public class HouseController extends BaseController{

    @Autowired
    HouseServiceImpl houseService;
    @RequestMapping(value = "List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看房间列表", module = "前台-在线看房")
    public PageResult<House> getAll(@PathVariable int page,
                                        @PathVariable int pageSize, House Model) {
        PageResult<House> models = houseService.findAll(page, pageSize, Model);
        return models;
    }
    @RequestMapping(value = "Add", method = RequestMethod.POST)
    @PermissionInfo(name = "添加房间", module = "前台-在线看房")
    public ResultMessage Add(House Model) throws MyException {
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            boolean rst = houseService.save(Model);
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
    @PermissionInfo(name = "编辑房间", module = "前台-在线看房")
    public House Edit(@PathVariable int id) {
        House model = houseService.getbyId(id);
        return model;
    }
    @RequestMapping(value = "Update", method = RequestMethod.POST)
    @PermissionInfo(name = "更新房间", module = "前台-在线看房")
    public ResultMessage Update(House Model) throws MyException {
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            boolean rst = houseService.update(Model);
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
    @PermissionInfo(name = "删除房间", module = "前台-在线看房")
    public ResultMessage Delete(@PathVariable int id) {
        boolean rst = houseService.delete(id);
        if (rst) {
            return Msg(true, ConstClass.ResultDeleteSuccess);
        } else {
            return Msg(false, ConstClass.ResultDeleteFault);
        }
    }
}
