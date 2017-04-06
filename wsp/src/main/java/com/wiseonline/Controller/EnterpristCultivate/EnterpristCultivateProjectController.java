package com.wiseonline.Controller.EnterpristCultivate;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.EnterpristCultivateProject;
import com.wiseonline.Service.Impl.EnterpristCultivateProjectServiceImpl;
import com.wiseonline.Utils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created by yanwj on 2016/3/21.
 */
@RestController
@RequestMapping("/EnterpristCultivate/EnterpristCultivateProject")
public class EnterpristCultivateProjectController extends BaseController{
    @Autowired
    EnterpristCultivateProjectServiceImpl enterpristCultivateProjectService;

    @RequestMapping(value = "List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看企业培训申请项目列表", module = "前台-企业培训")
    public PageResult<EnterpristCultivateProject> getAll(@PathVariable int page,
                                                  @PathVariable int pageSize,  EnterpristCultivateProject Model) {
        PageResult<EnterpristCultivateProject> models = enterpristCultivateProjectService.findAll(page, pageSize, Model);
        return models;
    }
    @RequestMapping(value = "Add", method = RequestMethod.POST)
    @PermissionInfo(name = "添加企业培训项目申请", module = "前台-企业培训")
    public ResultMessage Add(EnterpristCultivateProject Model) throws MyException {
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            boolean rst = enterpristCultivateProjectService.save(Model);
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
    @PermissionInfo(name = "编辑企业培训项目申请", module = "前台-企业培训")
    public EnterpristCultivateProject Edit(@PathVariable int id) {
        EnterpristCultivateProject model = enterpristCultivateProjectService.getbyId(id);
        return model;
    }
    @RequestMapping(value = "Update", method = RequestMethod.POST)
    @PermissionInfo(name = "更新企业培训项目申请", module = "前台-企业培训")
    public ResultMessage Update(EnterpristCultivateProject Model) throws MyException {
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            boolean rst = enterpristCultivateProjectService.update(Model);
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
    @PermissionInfo(name = "删除企业培训项目申请", module = "前台-企业培训")
    public ResultMessage Delete(@PathVariable int id) {
        boolean rst = enterpristCultivateProjectService.delete(id);
        if (rst) {
            return Msg(true, ConstClass.ResultDeleteSuccess);
        } else {
            return Msg(false, ConstClass.ResultDeleteFault);
        }
    }
    @RequestMapping(value = "ByEnterpriseCultivateId/List/{page}/{pageSize}/{cultivateid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看企业培训申请项目列表", module = "前台-企业培训")
    public PageResult<EnterpristCultivateProject> ByEnterpriseCultivateIdGetAll(@PathVariable int cultivateid,@PathVariable int page,@PathVariable int pageSize,EnterpristCultivateProject model) {
        //String sql = "select * from enterprist_cultivate_project where enterprist_cultivate_id = "+cultivateid+" order by priojectid DESC limit " + (page - 1) * pageSize + "," + pageSize;
        //List<EnterpristCultivateProject> models = enterpristCultivateProjectService.findByDataSQL(sql);

        return enterpristCultivateProjectService.findByOneField(page,pageSize,"enterprist_cultivate_id",cultivateid,false,"enterprist_cultivate_id",model);
    }
}
