package com.wiseonline.Controller.Comment;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.SettingDict;
import com.wiseonline.Domain.UserComment;
import com.wiseonline.Domain.UserRepair;
import com.wiseonline.Service.Impl.UserCommentServiceImpl;
import com.wiseonline.Service.Impl.UserRepairServiceImpl;
import com.wiseonline.Service.SettingDictService;
import com.wiseonline.Utils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Wanx on 11/18/2015.
 */
@RestController
@RequestMapping("/Comment")
public class CommentController extends BaseController {
    @Autowired
    UserCommentServiceImpl userCommentService;
    @Autowired
    UserRepairServiceImpl userRepairService;
    @Autowired
    SettingDictService settingDictService;

    private static String WSP_SESSION_USERNAME = "WSP_SESSION_USERNAME";

    @RequestMapping(value = "{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看评论", module = "前台-评论管理")
    public PageResult<UserComment> getAll(@PathVariable int page,
                                            @PathVariable int pageSize, HttpServletRequest request, UserComment Model) {
        PageResult<UserComment> models = userCommentService.findAll(page,pageSize,Model);
        return models;
    }

    @RequestMapping(value = "ByUser/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看评论", module = "前台-评论管理")
    public PageResult<UserComment> getAllByUser(@PathVariable int page,
                                          @PathVariable int pageSize, UserComment Model) {
        String username = getUserName();
        if (!username.equals("anonymousUser")){
            PageResult<UserComment> models = userCommentService.findByOneField(page,pageSize,"userid",username,true,"createTime");
            return models;
        }else{
            PageResult<UserComment> models = userCommentService.findAll(page, pageSize, Model);
            return models;
        }
    }

    @RequestMapping(value = "Add", method = RequestMethod.POST)
    @PermissionInfo(name = "添加评论", module = "前台-评论管理")
    public ResultMessage Add(UserComment Model,HttpServletRequest request) throws MyException {
        String businessId = request.getParameter("businessId");
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            Model.setUserid(username);
            boolean rst = userCommentService.save(Model);
            if (rst) {
                String sql = "update main_business set commentflag = 2 where businessid='" + businessId + "' and business_type='"+Model.getBusinessType()+"'";
                userRepairService.execDataSql(sql);
                return Msg(true, ConstClass.ResultSaveSuccess);
            } else {
                return Msg(false, ConstClass.ResultSaveFault);
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }

    }

    @RequestMapping(value = "Edit/{userid}/{serialNumber}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "编辑评论", module = "前台-评论管理")
    public UserComment Edit(@PathVariable String userid,@PathVariable String serialNumber) {
        String sql = "select objectid, userid, serialNumber,businessId ,content, duration, attitude, quality, businessType, createTime from user_comment where userid='"+userid+"' and serialNumber='"+serialNumber+"'";
        List<UserComment> models = (List<UserComment>)userCommentService.findByDataSQL(sql);
        return models.get(0);
    }

    @RequestMapping(value = "Update", method = RequestMethod.POST)
    @PermissionInfo(name = "更新评论", module = "前台-评论管理")
    public ResultMessage Update(UserComment Model) {
        boolean rst = userCommentService.saveOrUpdate(Model);
        if (rst) {
            return Msg(true, ConstClass.ResultSaveSuccess);
        } else {
            return Msg(false, ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "Delete/{id}", method = RequestMethod.GET)
    @PermissionInfo(name = "删除评论", module = "前台-评论管理")
    public ResultMessage Delete(@PathVariable String id) {
        boolean rst = userCommentService.delete(id);
        if (rst) {
            return Msg(true, ConstClass.ResultDeleteSuccess);
        } else {
            return Msg(false, ConstClass.ResultDeleteFault);
        }
    }

    @RequestMapping(value = "Info", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看评论", module = "前台-评论管理")
    public UserComment Edit(HttpServletRequest request) throws MyException {
        int id =Integer.parseInt(request.getParameter("id"));
        String type = request.getParameter("type");
        String userid = getUserName();
        if (!userid.equals("anonymousUser")) {
            String sql = "select objectid, userid, serialNumber,businessId, content, duration, attitude, quality, businessType, createTime from user_comment where businessId='" + id + "' and businessType='"+type+"'";
            List<UserComment> models = (List<UserComment>) userCommentService.findByDataSQL(sql);
            if (models != null) {
                if (0 < models.size()) {
                    return models.get(0);
                }else {
                    throw new MyException("未评价");
                }
            }else {
                throw new MyException("未评价");
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }

    @RequestMapping(value = "StatisticsNumber")
    @PermissionInfo(name = "评价统计", module = "后台-数据统计")
    public List<Object[]> StatisticsNumber(){
        String sql = "SELECT COUNT(*) as total,AVG(attitude) as attitude,AVG(quality) as quality,AVG(duration) as duration FROM user_comment";
        List<Object[]> list = userCommentService.findByCustomerSQL(sql);
        return list;
    }

    @RequestMapping(value = "StatisticsData")
    @PermissionInfo(name = "评价数据", module = "后台-数据统计")
    public StatisticsData StatisticsData(HttpServletRequest request){
        String beginDate = request.getParameter("beginDate")+" 00:00:00";
        String endDate = request.getParameter("endDate")+" 23:59:59";
        String query = request.getParameter("query");
        String flag = request.getParameter("flag");
        StatisticsData statisticsData = new StatisticsData();
        String sql = "";
        if (flag.equals("d")){
            String type = "";
            int sqlFlag = 0;
            if (query.equals("a")){
                sqlFlag = 1;
            }else if (query.equals("1")){
                type = "WY";
            }else if (query.equals("2")){
                type = "IT";
            }else if (query.equals("3")){
                type = "enterpriseCultivate";
            }else if (query.equals("4")){
                type = "userHeadhunting";
            }else if (query.equals("5")){
                type = "userClassroom";
            }else if (query.equals("6")){
                type = "userMeetingroom";
            }else if (query.equals("7")){
                type = "commercialize";
            }else if (query.equals("8")){
                type = "userTestApplyfor";
            }else if (query.equals("9")){
                type = "userCopyright";
            }else if (query.equals("10")){
                type = "enterApply";
            }
            if (sqlFlag == 1) {
                sql = "SELECT group_concat(dt) AS DATE,group_concat(count) AS COUNT,group_concat(attitude) AS ATTITUDE,group_concat(duration) AS DURATION,group_concat(quality) AS QUALITY\n" +
                        "FROM (\n" +

                        "SELECT DATE_FORMAT(createTime,'%Y-%m-%d') AS dt,COUNT(*) AS count,AVG(attitude) AS attitude,AVG(duration) AS duration,AVG(quality) AS quality FROM user_comment\n" +
                        "WHERE createTime > '" + beginDate + "' AND createTime < '" + endDate + "'\n" +
                        "GROUP BY DATE_FORMAT(createTime,'%Y-%m-%d')"+
                        ") BB";
            }else {
                sql = "SELECT group_concat(dt) AS DATE,group_concat(count) AS COUNT,group_concat(attitude) AS ATTITUDE,group_concat(duration) AS DURATION,group_concat(quality) AS QUALITY\n" +
                        "FROM (\n" +
                        "SELECT DATE_FORMAT(createTime,'%Y-%m-%d') AS dt,COUNT(*) AS count,AVG(attitude) AS attitude,AVG(duration) AS duration,AVG(quality) AS quality FROM user_comment\n" +
                        "WHERE createTime > '" + beginDate + "' AND createTime < '" + endDate + "' AND businessType='" + type + "'\n" +
                        "GROUP BY DATE_FORMAT(createTime,'%Y-%m-%d')\n" +
                        ") BB";
            }
        }else {
            String type = "";
            int sqlFlag = 0;
            if (query.equals("a")){
                sqlFlag = 1;
            }else if (query.equals("1")){
                type = "WY";
            }else if (query.equals("2")){
                type = "IT";
            }else if (query.equals("3")){
                type = "enterpriseCultivate";
            }else if (query.equals("4")){
                type = "userHeadhunting";
            }else if (query.equals("5")){
                type = "userClassroom";
            }else if (query.equals("6")){
                type = "userMeetingroom";
            }else if (query.equals("7")){
                type = "commercialize";
            }else if (query.equals("8")){
                type = "userTestApplyfor";
            }else if (query.equals("9")){
                type = "userCopyright";
            }else if (query.equals("10")){
                type = "enterApply";
            }
            if (sqlFlag == 1) {
                sql = "SELECT   group_concat(dt) AS DATE,group_concat(count) AS COUNT ,group_concat(attitude) AS ATTITUDE,group_concat(duration) AS DURATION,group_concat(quality) AS QUALITY" +
                        "  FROM ( " +
                        " SELECT DATE_FORMAT(createTime,'%Y-%m') AS dt,COUNT(*) AS count ,AVG(attitude) AS attitude,AVG(duration) AS duration,AVG(quality) AS quality FROM user_comment " +
                        "  WHERE createTime >= '" + beginDate + "' AND createTime <= '" + endDate + "'" +
                        "  GROUP BY DATE_FORMAT(createTime,'%Y-%m')"+
                        "  ) BB ";
            }else {
                sql = "SELECT   group_concat(dt) AS DATE,group_concat(count) AS COUNT ,group_concat(attitude) AS ATTITUDE,group_concat(duration) AS DURATION,group_concat(quality) AS QUALITY" +
                        "  FROM ( " +
                        "  SELECT DATE_FORMAT(createTime,'%Y-%m') AS dt,COUNT(*) AS count ,AVG(attitude) AS attitude,AVG(duration) AS duration,AVG(quality) AS quality FROM user_comment " +
                        "  WHERE createTime >= '" + beginDate + "' AND createTime <= '" + endDate + "' AND businessType='"+type+"'" +
                        "  GROUP BY DATE_FORMAT(createTime,'%Y-%m')" +
                        "  ) BB ";

            }
        }
        List<Object[]> list = userCommentService.findByCustomerSQL(sql);
        DataAndType dataAndType1 = new DataAndType();
        DataAndType dataAndType2 = new DataAndType();
        DataAndType dataAndType3 = new DataAndType();
        DataAndType dataAndType4 = new DataAndType();
        DataAndType dataAndType5 = new DataAndType();
        String[] s1 = String.valueOf(list.get(0)[0]).split(",");
        String[] s2 = String.valueOf(list.get(0)[1]).split(",");
        String[] s3 = String.valueOf(list.get(0)[2]).split(",");
        String[] s4 = String.valueOf(list.get(0)[3]).split(",");
        String[] s5 = String.valueOf(list.get(0)[4]).split(",");
        List<String> stringList1 = new ArrayList<String>();
        List<String> stringList2 = new ArrayList<String>();
        List<String> stringList3 = new ArrayList<String>();
        List<String> stringList4 = new ArrayList<String>();
        List<String> stringList5 = new ArrayList<String>();
        for (int i = 0;i < s1.length;i++){
            stringList1.add(s1[i]);
            stringList2.add(s2[i]);
            stringList3.add(s3[i]);
            stringList4.add(s4[i]);
            stringList5.add(s5[i]);
        }
        dataAndType1.setData(stringList1);
        dataAndType2.setData(stringList2);
        dataAndType3.setData(stringList3);
        dataAndType4.setData(stringList4);
        dataAndType5.setData(stringList5);
        List<DataAndType> list1 = new ArrayList<DataAndType>();
        List<DataAndType> list2 = new ArrayList<DataAndType>();
        list1.add(dataAndType1);
        list2.add(dataAndType2);
        list2.add(dataAndType3);
        list2.add(dataAndType4);
        list2.add(dataAndType5);
        statisticsData.setxAxis(list1);
        statisticsData.setSeries(list2);
        return statisticsData;
    }


}
