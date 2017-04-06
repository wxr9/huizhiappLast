package com.wiseonline.Controller.Setting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.Building;
import com.wiseonline.Domain.ClmSearchLog;
import com.wiseonline.Service.Impl.ClmSearchLogServiceImpl;
import com.wiseonline.Utils.PageResult;
import com.wiseonline.Utils.PermissionInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * 综合账单查询日志
 * Created by yanwj on 2016/4/13.
 */
@RestController
@RequestMapping("/Setting/ClmSearchLog")
public class ClmSearchLogController extends BaseController {
    @Autowired
    ClmSearchLogServiceImpl clmSearchLogService;

    @RequestMapping(value = "List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查询日志", module = "后台-配置管理")
    public PageResult<ClmSearchLog> getAll(@PathVariable int page, @PathVariable int pageSize, ClmSearchLog model) {
        PageResult<ClmSearchLog> models = clmSearchLogService.findAll(page, pageSize, model, true, "createDate");
        return models;
    }

    @RequestMapping(value = "Search/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查询日志", module = "后台-配置管理")
    public PageResult<ClmSearchLog> SearchgetAll(@PathVariable int page, @PathVariable int pageSize, ClmSearchLog model, HttpServletRequest request) {
        String endDate = request.getParameter("endDate");
        String beginDate = request.getParameter("beginDate");
        if (endDate == null || beginDate == null || "".equals(beginDate) || "".equals(endDate)) {
            PageResult<ClmSearchLog> models = clmSearchLogService.findAll(page, pageSize, model);
            return models;
        } else {
            String sql = "FROM clm_search_log WHERE create_date >= '" + beginDate + " 00:00:00' and create_date <= '" + endDate + " 23:59:59' order by create_date desc ";
            String sql_count = "SELECT count(*) " + sql;
            String sql_list = "SELECT * " + sql;
            if (page != 0) {
                sql_list = sql_list + " limit " + (page - 1) * pageSize + "," + pageSize;
            }
            PageResult<ClmSearchLog> pageResult = new PageResult<ClmSearchLog>();
            int count = clmSearchLogService.getCountBySQL(sql_count);
            pageResult.setTotal(count);
            List<ClmSearchLog> listObject = clmSearchLogService.findByDataSQL(sql_list);
            pageResult.setResult(listObject);
            pageResult.setPage(page);
            pageResult.setPagesize(pageSize);
            return pageResult;
        }
    }

}
