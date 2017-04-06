package com.wiseonline.Controller.Setting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.MainBusiness;
import com.wiseonline.Service.Impl.MainBusinessServiceImpl;
import com.wiseonline.Utils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * Created by yanwj on 2016/4/19.
 */
@RestController
@RequestMapping("/Setting/MainBusiness")
public class MainBusinessController extends BaseController{

    @Autowired
    MainBusinessServiceImpl mainBusinessService;

    @RequestMapping(value = "noComment/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "未评价报修", module = "前台-报修管理")
    public PageResult<MainBusiness> noComment(@PathVariable int page,
                                            @PathVariable int pageSize, MainBusiness Model) throws MyException {
        String sql = "";
        String sql2 = "";
        String username = getUserName();
        if (!username.equals("anonymousUser")){
            sql = "select * from main_business where  complete_date != '' and  commentflag = 1 and username = '"+username+"' ORDER BY create_date DESC";
            if (page == 0){
                sql2 = sql;
            }else if (page == 1){
                sql2 = "select * from main_business where complete_date != '' and commentflag = 1 and username = '"+username+"' ORDER BY create_date DESC limit 0,"+pageSize;
            }else {
                sql2 = "select * from main_business where complete_date != '' and commentflag = 1 and username = '"+username+"' ORDER BY create_date DESC limit "+(page-1)*pageSize+","+pageSize;
            }
            PageResult<MainBusiness> pageResult = new PageResult<MainBusiness>();
            List<MainBusiness> list = mainBusinessService.findByDataSQL(sql);
            if (list != null){
                pageResult.setTotal(list.size());
            }else {
                pageResult.setTotal(0);
            }
            List<MainBusiness> listObject = mainBusinessService.findByDataSQL(sql2);
            pageResult.setResult(listObject);
            pageResult.setPage(page);
            pageResult.setPagesize(pageSize);
            return pageResult;
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }

    @RequestMapping(value = "IsComplete/Edit", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "是否完成", module = "前台-报修管理")
    public ResultMessage IsComplete(HttpServletRequest request) throws MyException {
        String sn = request.getParameter("sn");
        PageResult<MainBusiness> mainBusinessPageResult =  mainBusinessService.findByOneField(0, 0, "serialNumber", sn, true, "objectid");
        if (0 < mainBusinessPageResult.getTotal()){
            MainBusiness mainBusiness = mainBusinessPageResult.getResult().get(0);
            if (mainBusiness.getCompleteDate() != null){
                return Msg(true,"已经完成");
            }
        }
        return Msg(false,"未完成");
    }
}
