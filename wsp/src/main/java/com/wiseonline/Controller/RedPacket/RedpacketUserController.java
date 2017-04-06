package com.wiseonline.Controller.RedPacket;
/**
 * Created by R7tech on 10/12/2016.
 */

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.RedpacketUser;
import com.wiseonline.Service.ActivityApplyService;
import com.wiseonline.Service.RedpacketUserService;
import com.wiseonline.Utils.ConstClass;
import com.wiseonline.Utils.PageResult;
import com.wiseonline.Utils.PermissionInfo;
import com.wiseonline.Utils.ResultMessage;
import org.json.JSONObject;
import org.junit.runners.Parameterized;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;


/**
 * Created by R7tech on 2/25/2016.
 */
@RestController
@RequestMapping("/RedPacket")
public class RedpacketUserController extends BaseController {
    @Autowired
    RedpacketUserService redPacketUserService;
    @Autowired
    ActivityApplyService activityApplyService;

    @RequestMapping(value = "User/Edit/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看红包信息", module = "后台、前台-红包信息块管理")
    public RedpacketUser BaseEdit(@PathVariable int objectid){
        RedpacketUser model = redPacketUserService.getbyId(objectid);
        return model;
    }

    @RequestMapping(value = "User/Add", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加红包信息", module = "后台、前台-红包信息块管理")
    public ResultMessage BaseAdd(RedpacketUser model){
        boolean ret = redPacketUserService.save(model);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "User/Update", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加红包信息", module = "后台、前台-红包信息块管理")
    public ResultMessage BaseUpdate(RedpacketUser model){
        boolean ret = redPacketUserService.update(model);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "User/Del/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "删除红包信息", module = "后台、前台-红包信息块管理")
    public ResultMessage BaseDel(@PathVariable int objectid){
        boolean ret = redPacketUserService.delete(objectid);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "User/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "列表红包信息", module = "后台、前台-红包信息块管理")
    public PageResult<RedpacketUser> BaseList(@PathVariable int page, @PathVariable int pageSize){
        PageResult<RedpacketUser> models = redPacketUserService.findByOneField(page,pageSize,"username",getUserName(),false,"createTime");
        return models;
    }

    @RequestMapping(value = "User/Valid/List", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "列表红包信息", module = "后台、前台-红包信息块管理")
    public List<RedpacketUser> BaseValidList(){
        String sql = "select * from redpacket_user where username='"+getUserName()+"' and didUse=false and validateDate > DATE_FORMAT(now(),'%Y-%m-%d %H:%i:%S') order by sum desc";
        List<RedpacketUser> models = redPacketUserService.findByDataSQL(sql);
        return models;
    }

    @RequestMapping(value = "User/Invalid/List", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "列表红包信息", module = "后台、前台-红包信息块管理")
    public List<RedpacketUser> BaseInvalidList(){
        String sql = "select * from redpacket_user where username='"+getUserName()+"' and (didUse=true or validateDate < DATE_FORMAT(now(),'%Y-%m-%d %H:%i:%S')) order by sum desc";
        List<RedpacketUser> models = redPacketUserService.findByDataSQL(sql);
        return models;
    }

    @RequestMapping(value = "User/StatisticGraphData", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "统计红包信息", module = "后台、前台-红包信息块管理")
    public void BaseStatistic(HttpServletRequest request, HttpServletResponse response){
            String beginDate = request.getParameter("beginDate");
            String endDate = request.getParameter("endDate");
        String ruleId = request.getParameter("ruleId");
            JSONObject jo = new JSONObject();
            String sqlDetails = "select SUM(sum) sums,COUNT(*) count, DATE_FORMAT(createTime,'%Y-%m-%d') day from redpacket_user where ruleId="+ruleId+" and createTime > '" + beginDate + "' and createTime < '" + endDate + "' GROUP BY day order by createTime asc";
        List<Object[]> uList = redPacketUserService.findByCustomerSQL(sqlDetails);
        if (uList.size()==0)
            return;

            String sqlTotalSum = "select SUM(sum) as tSum from redpacket_user where ruleId="+ruleId;
            List<Object[]> sList = redPacketUserService.findByCustomerSQL(sqlTotalSum);

        if (sList.size()==0)
            return;
        Object tSum = sList.get(0);

            int tCount = redPacketUserService.findByOneField(0,0,"ruleId",Integer.valueOf(ruleId),true,"createTime",new RedpacketUser()).getTotal();

            jo.put("TotalNumber", tCount);
            jo.put("TotalSum", tSum);

            String sqlMaxDayNum = "select count(*) as tCount,createTime from redpacket_user where ruleId="+ruleId+"  group by DATE_FORMAT(createTime,\"YYYY-MM-DD\") order by tCount desc";
            List<Object[]> mList = redPacketUserService.findByCustomerSQL(sqlMaxDayNum);
            Object[] objectt = mList.get(0);
            JSONObject js = new JSONObject();
            js.put("Date", new SimpleDateFormat("yyyy-MM-dd").format(objectt[1]));
            js.put("Count", objectt[0]);
            jo.put("TopCountDay", js);

            String sqlMaxDaySum = "select SUM(sum) as tSum,createTime from redpacket_user where ruleId="+ruleId+" group by DATE_FORMAT(createTime,\"YYYY-MM-DD\") order by tSum desc";
            List<Object[]> nList = redPacketUserService.findByCustomerSQL(sqlMaxDaySum);
            Object[] object = nList.get(0);
            JSONObject jn = new JSONObject();
            jn.put("Date", new SimpleDateFormat("yyyy-MM-dd").format(object[1]));
            jn.put("Sum", object[0]);
            jo.put("TopSumDay", jn);

        JSONObject jm = new JSONObject();
        List<Object> sum = new ArrayList();
        List<Object> count = new ArrayList();
        List<Object> day = new ArrayList();
        for (int m=0;m<uList.size();m++){

            try {
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                Date prevDay = sdf.parse(uList.get(m)[2].toString());
                ///////////////////////
                if (m==0){
                    Date beginD = sdf.parse(beginDate);
                    while (!beginD.equals(prevDay)){
                        sum.add(0);
                        count.add(0);
                        day.add(new SimpleDateFormat("yyyy-MM-dd").format(beginD));
                        beginD = getDateAfter(beginD,1);
                    }
                }
                ///////////////////////
                sum.add(uList.get(m)[0]);
                count.add(uList.get(m)[1]);
                day.add(uList.get(m)[2]);
                ////////////////////////
                if (m+1<uList.size()){
                    Date nextDay = sdf.parse(uList.get(m+1)[2].toString());
                    Date tempDate = getDateAfter(prevDay,1);
                    while (!tempDate.equals(nextDay)){
                        sum.add(0);
                        count.add(0);
                        day.add(new SimpleDateFormat("yyyy-MM-dd").format(tempDate));
                        tempDate = getDateAfter(tempDate,1);
                    }
                }
                ///////////////////////////
                if (m==uList.size()-1){
                    Date endD = sdf.parse(endDate);
                    while (!endD.equals(prevDay)){
                        prevDay = getDateAfter(prevDay,1);
                        sum.add(0);
                        count.add(0);
                        day.add(new SimpleDateFormat("yyyy-MM-dd").format(prevDay));
                    }
                }

            } catch (ParseException e) {
                e.printStackTrace();
            }
        }
        jm.put("sum",sum);
        jm.put("count",count);
        jm.put("day",day);
        jo.put("data",jm);

            try {
                response.getWriter().write(jo.toString());
                response.getWriter().close();
            } catch (IOException e) {
                e.printStackTrace();
            }

    }

    private Date getDateBefore(Date d, int day) {
        Calendar now = Calendar.getInstance();
        now.setTime(d);
        now.set(Calendar.DATE, now.get(Calendar.DATE) - day);
        return now.getTime();
    }

    private Date getDateAfter(Date d, int day) {
        Calendar now = Calendar.getInstance();
        now.setTime(d);
        now.set(Calendar.DATE, now.get(Calendar.DATE) + day);
        return now.getTime();
    }
}

