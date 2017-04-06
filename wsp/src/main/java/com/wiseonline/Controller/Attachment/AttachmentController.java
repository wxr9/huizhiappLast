package com.wiseonline.Controller.Attachment;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.Attachment;
import com.wiseonline.Domain.UserComment;
import com.wiseonline.Service.Impl.AttachmentServiceImpl;
import com.wiseonline.Service.Impl.UserCommentServiceImpl;
import com.wiseonline.Utils.ConstClass;
import com.wiseonline.Utils.PageResult;
import com.wiseonline.Utils.PermissionInfo;
import com.wiseonline.Utils.ResultMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by Wanx on 11/18/2015.
 */
@RestController
@RequestMapping("/Attachment")
public class AttachmentController extends BaseController {
    @Autowired
    AttachmentServiceImpl attachmentService;

    @RequestMapping(value = "{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看附件", module = "前台-附件管理")
    public PageResult<Attachment> getAll(@PathVariable int page,
                                            @PathVariable int pageSize, Attachment Model) {
        PageResult<Attachment> models = attachmentService.findAll(page, pageSize, Model);
        return models;
    }

    @RequestMapping(value = "Add", method = RequestMethod.POST)
    @PermissionInfo(name = "添加附件", module = "前台-附件管理")
    public ResultMessage Add(Attachment Model) {
        return Update(Model);

    }

    @RequestMapping(value = "Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "编辑附件", module = "前台-附件管理")
    public Attachment Edit(@PathVariable String id) {
        Attachment model = attachmentService.getbyId(id);
        return model;
    }

    @RequestMapping(value = "Update", method = RequestMethod.POST)
    @PermissionInfo(name = "更新附件", module = "前台-附件管理")
    public ResultMessage Update(Attachment Model) {
        boolean rst = attachmentService.saveOrUpdate(Model);
        if (rst) {
            return Msg(true, ConstClass.ResultSaveSuccess);
        } else {
            return Msg(false, ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "Delete/{id}", method = RequestMethod.GET)
    @PermissionInfo(name = "删除附件", module = "前台-附件管理")
    public ResultMessage Delete(@PathVariable String id) {
        boolean rst = attachmentService.delete(id);
        if (rst) {
            return Msg(true, ConstClass.ResultDeleteSuccess);
        } else {
            return Msg(false, ConstClass.ResultDeleteFault);
        }
    }
}
