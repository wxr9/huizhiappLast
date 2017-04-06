package com.wiseonline.Controller.Setting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.Readme;
import com.wiseonline.Service.Impl.ReadmeServiceImpl;
import com.wiseonline.Utils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * Created by yanwj on 2016/3/25.
 */
@RestController
@RequestMapping("/Setting/Readme")
public class ReadmeController extends BaseController {

    @Autowired
    ReadmeServiceImpl readmeService;

    @RequestMapping(value = "List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看须知信息列表", module = "后台-须知信息")
    public PageResult<Readme> getAll(@PathVariable int page, @PathVariable int pageSize, Readme model) {
        PageResult<Readme> models = readmeService.findAll(page, pageSize, model);
        return models;
    }

    @RequestMapping(value = "Add", method = RequestMethod.POST)
    @PermissionInfo(name = "新增须知信息", module = "后台-须知信息")
    public ResultMessage Add(Readme model) {
        if (readmeService.IsExistName("name", model.getName(), model.getObjectid())) {
            return Msg(false, "须知信息名称已存在");
        } else {
            boolean rst = readmeService.save(model);
            if (rst) {
                return Msg(true, ConstClass.ResultSaveSuccess);
            } else {
                return Msg(false, ConstClass.ResultSaveFault);
            }
        }
    }

    @RequestMapping(value = "Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看须知信息", module = "后台-须知信息")
    public Readme Edit(@PathVariable int id) {
        Readme model = readmeService.getbyId(id);
        return model;
    }

    @RequestMapping(value = "Type/Edit", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看须知信息", module = "后台-须知信息")
    public Readme TypeEdit(HttpServletRequest request) throws MyException {
        String type = request.getParameter("type");
        String sql = "select * from readme where deleteflag != -1 and type = '" + type + "'";
        List<Readme> list = readmeService.findByDataSQL(sql);
        if (list != null) {
            if (0 < list.size()) {
                return list.get(0);
            } else {
                throw new MyException("未找到匹配数据");
            }
        } else {
            throw new MyException("数据异常");
        }
    }

    @RequestMapping(value = "Update", method = RequestMethod.POST)
    @PermissionInfo(name = "更新须知信息", module = "后台-须知信息")
    public ResultMessage Update(Readme model) {
        boolean rst = readmeService.update(model);
        if (rst) {
            return Msg(true, ConstClass.ResultSaveSuccess);
        } else {
            return Msg(false, ConstClass.ResultSaveFault);
        }

    }

    @RequestMapping(value = "Delete/{id}", method = RequestMethod.GET)
    @PermissionInfo(name = "删除须知信息", module = "后台-须知信息")
    public ResultMessage Delete(@PathVariable int id) {
        boolean rst = readmeService.delete(id);
        if (rst) {
            return Msg(true, ConstClass.ResultDeleteSuccess);
        } else {
            return Msg(false, ConstClass.ResultDeleteFault);
        }
    }
}
