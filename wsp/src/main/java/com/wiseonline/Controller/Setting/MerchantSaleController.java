package com.wiseonline.Controller.Setting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.*;
import com.wiseonline.Service.Impl.SettingDictServiceImpl;
import com.wiseonline.Service.MerchantSaleService;
import com.wiseonline.Service.MerchantService;
import com.wiseonline.Service.NotificationService;
import com.wiseonline.Service.ParkService;
import com.wiseonline.Utils.ConstClass;
import com.wiseonline.Utils.PageResult;
import com.wiseonline.Utils.PermissionInfo;
import com.wiseonline.Utils.ResultMessage;
import org.hibernate.Criteria;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by R7tech on 3/7/2016.
 */
@RestController
@RequestMapping("/Setting")
public class MerchantSaleController extends BaseController {
    @Autowired
    MerchantSaleService merchantSaleService;
    @Autowired
    MerchantService merchantService;

    @Autowired
    SettingDictServiceImpl settingDictService;

    @Autowired
    NotificationService notificationService;

    @Autowired
    ParkService parkService;

    @RequestMapping(value = "MerchantSale/GetSearchMenu", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "获取商户优惠搜索菜单", module = "后台、前台-后台商户优惠管理信息块管理")
    public List<SearchMenu> GetSearchMenuList(){
        List<SearchMenu> smList = new ArrayList<SearchMenu>();
        //优惠
        String sql = "select * from setting_dict where type = 'merchantSaleType' and isnull(en)=FALSE order by order_flag asc";
        List<SettingDict> yh = settingDictService.findByDataSQL(sql);
        List<ChildMenu> cmYhList = new ArrayList<ChildMenu>();
        SearchMenu sm = new SearchMenu();
        sm.setLabel("优惠");
        sm.setFieldName("discountType");
        ChildMenu cmYh = new ChildMenu();
        cmYh.setItems(yh);
        cmYhList.add(cmYh);
        sm.setChild(cmYhList);
        smList.add(sm);
        //商圈
        List<Park> pk = parkService.findAll();
        //List<SettingDict> sq = settingDictService.findByDataSQL(sql);
        List<SettingDict> sq = new ArrayList<SettingDict>();
        for (int i=0;i<pk.size();i++){
            SettingDict sd = new SettingDict();
            sd.setName(pk.get(i).getName());
            sd.setObjectid(pk.get(i).getObjectid());
            sq.add(sd);
        }
        List<ChildMenu> cmSqList = new ArrayList<ChildMenu>();
        SearchMenu ssq = new SearchMenu();
        ssq.setLabel("商圈");
        ssq.setFieldName("park");
        ChildMenu cmm = new ChildMenu();
        cmm.setItems(sq);
        cmSqList.add(cmm);
        ssq.setChild(cmSqList);
        smList.add(ssq);
        //类别
        sql = "select * from setting_dict where type = 'merchantType' and isnull(en)=FALSE and parentid=(select objectid from setting_dict where type='merchantType' and parentid=-1) order by order_flag asc";
        List<SettingDict> lb = settingDictService.findByDataSQL(sql);

        SearchMenu lbb = new SearchMenu();
        lbb.setLabel("类别");
        lbb.setFieldName("type");
        List<ChildMenu> childMenus = new ArrayList<ChildMenu>();

        for (int i=0;i<lb.size();i++){
            ChildMenu cmmm = new ChildMenu();
            SettingDict sd = lb.get(i);
            ChildMenu cmtMenu = new ChildMenu();
            String sqlChild = "select * from setting_dict where type = 'merchantType' and isnull(en)=FALSE and parentid="+sd.getObjectid()+" order by order_flag asc";
            List<SettingDict> childSCList = settingDictService.findByDataSQL(sqlChild);
            List<SettingDict> stList = new ArrayList<SettingDict>();
            stList.add(sd);
            if (childSCList.size()>0){
                cmtMenu.setItems(childSCList);
                cmmm.setChild(cmtMenu);
            }
            cmmm.setItems(stList);
            childMenus.add(cmmm);
        }

        lbb.setChild(childMenus);
        smList.add(lbb);

        return smList;
    }


    @RequestMapping(value = "MerchantSale/Edit/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看后台商户优惠信息", module = "后台、前台-后台商户优惠信息块管理")
    public MerchantSale BaseEdit(@PathVariable int objectid){
        MerchantSale model = merchantSaleService.getbyId(objectid);

        String sql = "select avg(t.env) as env,avg(t.service) as service,avg(t.taste) as taste from (select env,service,taste from merchant_evaluate where merchant="+model.getCompany().getObjectid()+") t";
        List<Object[]> obj = merchantService.findByCustomerSQL(sql);
        float env = 0;
        float service = 0;
        float taste = 0;
        if(obj.get(0)[0]==null){

        }
        else{
            env = Float.parseFloat(String.valueOf((obj.get(0))[0]));
            service = Float.parseFloat(String.valueOf((obj.get(0))[1]));
            taste = Float.parseFloat(String.valueOf((obj.get(0))[2]));
        }
        MerchantEvaluate me = new MerchantEvaluate();
        me.setEnv(env);
        me.setTaste(taste);
        me.setService(service);
        model.getCompany().setmEvaluate(me);
        return model;
    }

    @RequestMapping(value = "MerchantSale/Add", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加后台商户优惠信息", module = "后台、前台-后台商户优惠信息块管理")
    public ResultMessage BaseAdd(MerchantSale model){
        model.setIsCheck(1);
        model.setIsBan(1);
        boolean ret = merchantSaleService.save(model);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "MerchantSale/Update", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加后台商户优惠信息", module = "后台、前台-后台商户优惠信息块管理")
    public ResultMessage BaseUpdate(MerchantSale model){
        boolean ret = merchantSaleService.update(model);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "MerchantSale/Delete/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "删除后台商户优惠信息", module = "后台、前台-后台商户优惠信息块管理")
    public ResultMessage BaseDel(@PathVariable int objectid){
        boolean ret = merchantSaleService.delete(objectid);
        if (ret){
            return Msg(true, ConstClass.ResultDeleteSuccess);
        }else{
            return Msg(false,ConstClass.ResultDeleteFault);
        }
    }

    @RequestMapping(value = "MerchantSale/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "列表后台商户优惠信息", module = "后台、前台-后台商户优惠信息块管理")
    public PageResult<MerchantSale> BaseList(@PathVariable int page, @PathVariable int pageSize, MerchantSale Model,HttpServletRequest request){
        String paramDiscount = request.getParameter("discountType");
        String paramPark = request.getParameter("park");
        String parentType = request.getParameter("type");
        String childType = request.getParameter("childType");
        String username = request.getParameter("username");
        String isCheck = request.getParameter("isCheck");
        String paramName = request.getParameter("name");

        boolean flag = false;
        int count = 0;
        String sql = "";
        if(username==null && paramDiscount==null && paramPark==null && parentType==null && paramName==null){
            if (isCheck!=null){
                sql = "select * from merchant_sale s left join merchant m on s.companyId = m.objectid where m.status=1 and m.bCheck=2 and s.isBan=1 and s.bCheck="+isCheck;
            }else{
                sql = "select * from merchant_sale s";
            }

        }else{
            sql = "select * from merchant_sale s left join merchant m on s.companyId = m.objectid  where 1 ";
            if (isCheck!=null){
                sql += " and s.isBan=1 and m.status=1 and m.bCheck=2 and s.bCheck="+isCheck;
            }
            if (username!=null){
                sql += " and m.username='"+getUserName()+"'";
            }
            if (paramName!=null){
                sql+=" and m.name like '%"+paramName+"%'";
            }
            if (paramDiscount!=null) {
                sql += " and s.type="+paramDiscount.trim();
            }
            if (paramPark!=null){
                sql += " and m.park="+paramPark.trim();
            }
            if (parentType!=null){
                sql += " and m.type="+parentType.trim();
                if (childType!=null){
                    sql += " and m.childType="+childType.trim();
                }
            }
        }

        count = merchantSaleService.findByDataSQL(sql).size();
        if(page!=0&&pageSize!=0){
            sql += " order by s.objectid desc limit "+(page-1)*pageSize+","+pageSize;
        }
        List<MerchantSale> mList = merchantSaleService.findByDataSQL(sql);


        for (int i=0;i<mList.size();i++){
            String sqlE = "select avg(t.env) as env,avg(t.service) as service,avg(t.taste) as taste from (select env,service,taste from merchant_evaluate where merchant="+mList.get(i).getCompany().getObjectid()+") t";
            List<Object[]> obj = merchantService.findByCustomerSQL(sqlE);
            float env = 0;
            float service = 0;
            float taste = 0;
            if(obj.get(0)[0]==null){

            }
            else{
                env = Float.parseFloat(String.valueOf((obj.get(0))[0]));
                service = Float.parseFloat(String.valueOf((obj.get(0))[1]));
                taste = Float.parseFloat(String.valueOf((obj.get(0))[2]));
            }

            MerchantEvaluate me = new MerchantEvaluate();
            me.setEnv(env);
            me.setTaste(taste);
            me.setService(service);
            mList.get(i).getCompany().setmEvaluate(me);
        }
        PageResult<MerchantSale> models = new PageResult<MerchantSale>();
        models.setResult(mList);
        models.setTotal(count);
        models.setPage(page);
        models.setPagesize(pageSize);
        return models;
    }

    @RequestMapping(value = "MerchantSale/Audit", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "商户优惠审核", module = "后台、前台-后台商户优惠审核块管理")
    public ResultMessage BaseAudit(HttpServletRequest request){
        int id = Integer.valueOf(request.getParameter("objectid"));
        int bCheck = Integer.valueOf(request.getParameter("bCheck"));
        String memo = request.getParameter("memo");

        MerchantSale mc = merchantSaleService.getbyId(id);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String dateString = sdf.format(new Date());
        if (bCheck==2){
            mc.setPublishDate(dateString);
        }
        mc.setIsCheck(bCheck);
        if(memo!=null){
            mc.setMemo(memo);
        }
        boolean ret = merchantSaleService.update(mc);
        if (ret){
            Noticfication noticfication = new Noticfication();
            noticfication.setReadStatus(1);
            noticfication.setAccepter(mc.getCompany().getUsername());
            noticfication.setAuthor("system");
            if (bCheck==3){
                noticfication.setContent("尊敬的商户 "+mc.getCompany().getName()+" 您的优惠审核未通过。");
            }
            else if (bCheck==2)
            {
                noticfication.setContent("尊敬的商户 "+mc.getCompany().getName()+" 您的优惠审核已通过。");
            }

            noticfication.setTitle("商户优惠审核提醒");
            notificationService.save(noticfication);
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "MerchantSale/BanSet", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "禁用优惠信息", module = "后台、前台-后台商户优惠审核块管理")
    public ResultMessage BaseBan(HttpServletRequest request){
        int objectid = Integer.valueOf(request.getParameter("objectid"));
        int isBan = Integer.valueOf(request.getParameter("isBan"));
        MerchantSale model = merchantSaleService.getbyId(objectid);
        model.setIsBan(isBan);
        boolean ret = merchantSaleService.update(model);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }
}