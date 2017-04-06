package com.wiseonline.Controller.Notification;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.Noticfication;
import com.wiseonline.Service.Impl.NotificationServiceImpl;
import com.wiseonline.Service.Impl.PermissionServiceImpl;
import com.wiseonline.Utils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created by Wanx on 11/18/2015.
 */
@RestController
@RequestMapping("/Notification")
public class NotificationController extends BaseController {
    @Autowired
    NotificationServiceImpl notificationService;

    @Autowired
    PermissionServiceImpl permissionService;

    @RequestMapping(value = "/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看通知", module = "前台-通知管理")
    public PageResult<Noticfication> getAll(@PathVariable int page,
                                            @PathVariable int pageSize, Noticfication Model) throws MyException {
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            String sql = "select * from noticfication where title!='商户回复提醒' and accepter='"+username+"' order by createTime DESC ";
            List<Noticfication> nList = notificationService.findByDataSQL(sql);
            PageResult<Noticfication> models = new PageResult<Noticfication>();
            models.setTotal(nList.size());

            sql+=" limit " + (page - 1) * pageSize + "," + pageSize;
            nList = notificationService.findByDataSQL(sql);
            models.setPage(page);
            models.setPagesize(pageSize);
            models.setResult(nList);
            return models;
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }

    @RequestMapping(value = "/ReplyList/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看商户回应列表", module = "前台-通知管理")
    public PageResult<Noticfication> getReplyList(@PathVariable int page,
                                            @PathVariable int pageSize, Noticfication Model) throws MyException {
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            String sql = "select * from noticfication where title='商户回复提醒' and accepter='"+username+"'  order by createTime DESC ";
            //PageResult<Noticfication> models = notificationService.findByOneField(page,pageSize,"accepter",username,true,"objectid");
            List<Noticfication> nList = notificationService.findByDataSQL(sql);
            PageResult<Noticfication> models = new PageResult<Noticfication>();
            models.setTotal(nList.size());

            sql+=" limit " + (page - 1) * pageSize + "," + pageSize;
            nList = notificationService.findByDataSQL(sql);
            models.setPage(page);
            models.setPagesize(pageSize);
            models.setResult(nList);
            return models;
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }

    @RequestMapping(value = "/Add", method = RequestMethod.POST)
    @PermissionInfo(name = "添加通知", module = "前台-通知管理")
    public ResultMessage Add(Noticfication Model) {
        //新增时设成未读状态
        Model.setReadStatus(1);
        boolean rst = notificationService.save(Model);
        if (rst) {
            return Msg(true, ConstClass.ResultSaveSuccess);
        } else {
            return Msg(false, ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "/Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "编辑通知", module = "前台-通知管理")
    public Noticfication Edit(@PathVariable int id) {
        Noticfication model = notificationService.getbyId(id);
        return model;
    }

    @RequestMapping(value = "/Update", method = RequestMethod.POST)
    @PermissionInfo(name = "更新通知", module = "前台-通知管理")
    public ResultMessage Update(Noticfication Model) {
        boolean rst = notificationService.saveOrUpdate(Model);
        if (rst) {
            return Msg(true, ConstClass.ResultSaveSuccess);
        } else {
            return Msg(false, ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "/Delete/{id}", method = RequestMethod.GET)
    @PermissionInfo(name = "删除通知", module = "前台-通知管理")
    public ResultMessage Delete(@PathVariable String id) {
        boolean rst = notificationService.delete(id);
        if (rst) {
            return Msg(true, ConstClass.ResultDeleteSuccess);
        } else {
            return Msg(false, ConstClass.ResultDeleteFault);
        }
    }

    @RequestMapping(value = "/SetReadStatus/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "更新读状态", module = "前台-通知管理")
    public ResultMessage Read(@PathVariable int id) {
        Noticfication model = notificationService.getbyId(id);
        //设成已读
        model.setReadStatus(2);
        boolean rst = notificationService.update(model);
        if (rst) {
            return Msg(true, ConstClass.ResultSaveSuccess);
        } else {
            return Msg(false, ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "/GetUnReadCount", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "获取通知未读总数", module = "前台-通知管理")
    public ResultMessage UnReadCount() {

        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            String sql = "select * from noticfication where title!='商户回复提醒'  and accepter='"+username+"' and readStatus=1 order by createTime DESC";
            //PageResult<Noticfication> models = notificationService.findByOneField(page,pageSize,"accepter",username,true,"objectid");
            List<Noticfication> nList = notificationService.findByDataSQL(sql);
            return Msg(true,String.valueOf(nList.size()));
        }
        return Msg(false,"0");
    }

    @RequestMapping(value = "/Total/GetUnReadCount", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "获取通知未读总数", module = "前台-通知管理")
    public ResultMessage TotalUnReadCount() {

        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            String sql = "select * from noticfication where accepter='"+username+"' and readStatus=1 order by createTime DESC";
            //PageResult<Noticfication> models = notificationService.findByOneField(page,pageSize,"accepter",username,true,"objectid");
            List<Noticfication> nList = notificationService.findByDataSQL(sql);
            return Msg(true,String.valueOf(nList.size()));
        }
        return Msg(false,"0");
    }

    @RequestMapping(value = "/ReplyList/GetUnReadCount", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "获取回应未读总数", module = "前台-通知管理")
    public ResultMessage ReplyListUnReadCount() {

        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            String sql = "select * from noticfication where title='商户回复提醒' and accepter='"+username+"' and readStatus=1 order by createTime DESC";
            //PageResult<Noticfication> models = notificationService.findByOneField(page,pageSize,"accepter",username,true,"objectid");
            List<Noticfication> nList = notificationService.findByDataSQL(sql);
            return Msg(true,String.valueOf(nList.size()));
        }
        return Msg(false,"0");
    }

}
