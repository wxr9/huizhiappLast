package com.wiseonline.Controller.Setting;

import com.fasterxml.jackson.databind.deser.Deserializers;
import com.sun.xml.internal.ws.api.config.management.policy.ManagementAssertion;
import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.*;
import com.wiseonline.Service.*;
import com.wiseonline.Service.Impl.RoleServiceImpl;
import com.wiseonline.Service.Impl.SettingDictServiceImpl;
import com.wiseonline.Utils.ConstClass;
import com.wiseonline.Utils.PageResult;
import com.wiseonline.Utils.PermissionInfo;
import com.wiseonline.Utils.ResultMessage;
import org.hibernate.Criteria;
import org.hibernate.criterion.SimpleExpression;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by R7tech on 3/7/2016.
 */
@RestController
@RequestMapping("/Setting")
public class MerchantController extends BaseController {
    @Autowired
    MerchantService merchantService;

    @Autowired
    MerchantHistoryService merchantHistoryService;

    @Autowired
    MerchantSaleService merchantSaleService;

    @Autowired
    MerchantSaleForMeService merchantSaleForMeService;

    @Autowired
    UserService userService;

    @Autowired
    SettingDictServiceImpl settingDictService;
    @Autowired
    RoleServiceImpl roleService;

    @Autowired
    ParkService parkService;

    @Autowired
    NotificationService notificationService;

    @RequestMapping(value = "Merchant/GetMerchantCenterInfo", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "获取商户中心信息", module = "后台、前台-后台商户管理信息块管理")
    public List<Merchant> GetMerchantCenterInfo(){
        String username = getUserName();
        String sqlm = "select * from merchant where username='"+username+"'";
        List<Merchant> mList = merchantService.findByDataSQL(sqlm);
        for (int i=0;i<mList.size();i++){
            Merchant merchant = mList.get(i);
            String sqlSale = "";


            sqlSale = "select * from merchant_sale where companyId="+merchant.getObjectid();


            List<MerchantSaleForMe> msList = merchantSaleForMeService.findByDataSQL(sqlSale);
            for (int j=0;j<msList.size();j++){
                MerchantSaleForMe msfm = msList.get(j);
                SettingDict sd = settingDictService.getbyId(msfm.getType());
                msfm.setsDict(sd);
            }
            merchant.setSaleList(msList);

            //是否新商户
            int days = getDateInterval(merchant.getCreateTime());
            if (days<30){
                merchant.setIsNew(1);
            }
            //商户评分
            String sql = "select avg(t.env) as env,avg(t.service) as service,avg(t.taste) as taste from (select env,service,taste from merchant_evaluate where merchant="+merchant.getObjectid()+") t;";
            List<Object[]> obj = merchantService.findByCustomerSQL(sql);
            MerchantEvaluate me = new MerchantEvaluate();
            if (obj.size()==0){
            }
            else
            {
                try{
                    float env = Float.parseFloat(String.valueOf((obj.get(0))[0]));
                    float service = Float.parseFloat(String.valueOf((obj.get(0))[1]));
                    float taste = Float.parseFloat(String.valueOf((obj.get(0))[2]));
                    me.setEnv(env);
                    me.setTaste(taste);
                    me.setService(service);
                }catch (NumberFormatException e)
                {

                }

                merchant.setmEvaluate(me);
            }
        }
        return mList;
    }

    @RequestMapping(value = "Merchant/GetSearchMenu", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "获取商户搜索菜单", module = "后台、前台-后台商户管理信息块管理")
    public List<SearchMenu> GetSearchMenuList(){
        List<SearchMenu> smList = new ArrayList<SearchMenu>();
        //优惠
        String sql = "select * from setting_dict where type = 'merchantSaleType' and isnull(en)=FALSE order by order_flag asc";
        List<SettingDict> yh = settingDictService.findByDataSQL(sql);
        List<ChildMenu> cmYhList = new ArrayList<ChildMenu>();
        SearchMenu sm = new SearchMenu();
        sm.setLabel("优惠");
        sm.setFieldName("discountType");
        ChildMenu cm = new ChildMenu();
        cm.setItems(yh);
        cmYhList.add(cm);
        sm.setChild(cmYhList);
        smList.add(sm);
        //商圈
        //sql = "select * from park order by objectid asc";
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
        sql = "select * from setting_dict where type = 'merchantType' and parentid=(select objectid from setting_dict where type='merchantType' and parentid=-1) and isnull(en)=FALSE order by order_flag asc";
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
        //汇智卡特约商户
        List<ChildMenu> cmHzList = new ArrayList<ChildMenu>();
        SettingDict ty1 = new SettingDict();
        ty1.setObjectid(1);
        ty1.setName("是");
        ty1.setOrderFlag(1);
        ty1.setType("invite");
        ty1.setEnglish("yes");
        SettingDict ty2 = new SettingDict();
        ty2.setObjectid(0);
        ty2.setName("否");
        ty2.setOrderFlag(2);
        ty2.setType("invite");
        ty2.setEnglish("no");
        List<SettingDict> ty = new ArrayList<SettingDict>();
        ty.add(ty1);
        ty.add(ty2);
        SearchMenu tyy = new SearchMenu();
        tyy.setLabel("特约商户");
        tyy.setFieldName("isInvite");

        ChildMenu cmmmm = new ChildMenu();
        cmmmm.setItems(ty);
        cmHzList.add(cmmmm);
        tyy.setChild(cmHzList);
        smList.add(tyy);
        return smList;
    }

    @RequestMapping(value = "Merchant/GetMenuList/{parentid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "获取商户子类别列表", module = "后台、前台-后台商户管理信息块管理")
    public List<SettingDict> GetChildMenuList(@PathVariable int parentid){

        String sqlParent = "";
        if (parentid==-1){
            sqlParent = "select * from setting_dict where type = 'merchantType' and isnull(en)=FALSE  and parentid= (select objectid from setting_dict where type='merchantType' and parentid=-1) order by order_flag asc";
        }else{
            sqlParent = "select * from setting_dict where type = 'merchantType' and isnull(en)=FALSE  and parentid="+parentid+ " order by order_flag asc";
        }

        List<SettingDict> parentList = settingDictService.findByDataSQL(sqlParent);
        return parentList;
    }

    @RequestMapping(value = "Merchant/GetSearchLivingMenu", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "获取商户搜索菜单", module = "后台、前台-后台商户管理信息块管理")
    public List<SearchMenu> GetSearchLivingMenuList(){
        List<SearchMenu> smList = new ArrayList<SearchMenu>();
        String sqlParent = "select * from setting_dict where type = 'merchantType' and isnull(en)=FALSE order by order_flag asc";
        List<SettingDict> parentList = settingDictService.findByDataSQL(sqlParent);
        for (int i=0;i<parentList.size();i++){
            if (parentList.get(i).getEnglish().equals("food")){
                //美食
                String sql = "select * from setting_dict where type = 'merchantType' and isnull(en)=FALSE and parentid="+parentList.get(i).getObjectid()+" order by order_flag asc";
                List<SettingDict> ms = settingDictService.findByDataSQL(sql);
                List<ChildMenu> cmMsList = new ArrayList<ChildMenu>();
                parentList.get(i).setName("美食");
                //ms.add(0,parentList.get(i));
                SearchMenu sm = new SearchMenu();
                sm.setLabel("美食");
                sm.setFieldName("type");
                //sm.setChild(yh);
                ChildMenu cmMs = new ChildMenu();
                List<SettingDict> main = new ArrayList<SettingDict>();
                main.add(parentList.get(i));
                cmMs.setItems(main);

                ChildMenu cmChildMs = new ChildMenu();
                cmChildMs.setItems(ms);

                cmMs.setChild(cmChildMs);
                cmMsList.add(cmMs);
                sm.setChild(cmMsList);
                smList.add(sm);
            }

            if (parentList.get(i).getEnglish().equals("play")){
                //娱乐
                List<SettingDict> yl = new ArrayList<SettingDict>();
                List<ChildMenu> cmYlList = new ArrayList<ChildMenu>();
                yl.add(parentList.get(i));
                SearchMenu sm = new SearchMenu();
                sm.setLabel("休闲娱乐");
                sm.setFieldName("type");
                //sm.setChild(yl);
                ChildMenu cmYl = new ChildMenu();
                cmYl.setItems(yl);
                cmYlList.add(cmYl);
                sm.setChild(cmYlList);
                smList.add(sm);
            }

            if (parentList.get(i).getEnglish().equals("children")){
                //亲子
                List<SettingDict> qz = new ArrayList<SettingDict>();
                List<ChildMenu> cmQzList = new ArrayList<ChildMenu>();
                qz.add(parentList.get(i));
                SearchMenu sm = new SearchMenu();
                sm.setLabel("亲子");
                sm.setFieldName("type");
                //sm.setChild(qz);
                ChildMenu cmQz = new ChildMenu();
                cmQz.setItems(qz);
                cmQzList.add(cmQz);
                sm.setChild(cmQzList);
                smList.add(sm);
            }

            if (parentList.get(i).getEnglish().equals("shopping")){
                //购物
                List<SettingDict> gw = new ArrayList<SettingDict>();
                List<ChildMenu> cmGwList = new ArrayList<ChildMenu>();
                gw.add(parentList.get(i));
                SearchMenu sm = new SearchMenu();
                sm.setLabel("购物");
                sm.setFieldName("type");
                //sm.setChild(gw);
                ChildMenu cmGw = new ChildMenu();
                cmGw.setItems(gw);
                cmGwList.add(cmGw);
                sm.setChild(cmGwList);
                smList.add(sm);
            }

            if (parentList.get(i).getEnglish().equals("living")){
                //生活
                List<SettingDict> sh = new ArrayList<SettingDict>();
                List<ChildMenu> cmShList = new ArrayList<ChildMenu>();
                sh.add(parentList.get(i));
                SearchMenu sm = new SearchMenu();
                sm.setLabel("生活");
                sm.setFieldName("type");
                //sm.setChild(sh);
                ChildMenu cmSh = new ChildMenu();
                cmSh.setItems(sh);
                cmShList.add(cmSh);
                sm.setChild(cmShList);
                smList.add(sm);
            }
        }
        return smList;
    }

    @RequestMapping(value = "MerchantHistory/Edit/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看后台商户历史信息", module = "后台、前台-后台商户管理信息块管理")
    public MerchantHistory BaseHistoryEdit(@PathVariable int objectid){
        MerchantHistory mh = merchantHistoryService.getbyId(objectid);
        return mh;
    }

    @RequestMapping(value = "Merchant/Edit/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看后台商户管理信息", module = "后台、前台-后台商户管理信息块管理")
    public Merchant BaseEdit(@PathVariable int objectid){
        Merchant model = merchantService.getbyId(objectid);
        String sql = "select avg(t.env) as env,avg(t.service) as service,avg(t.taste) as taste from (select env,service,taste from merchant_evaluate where merchant="+objectid+") t";
        List<Object[]> obj = merchantService.findByCustomerSQL(sql);
        MerchantEvaluate me = new MerchantEvaluate();
        try{
            float env = Float.parseFloat(String.valueOf((obj.get(0))[0]));
            float service = Float.parseFloat(String.valueOf((obj.get(0))[1]));
            float taste = Float.parseFloat(String.valueOf((obj.get(0))[2]));
            BigDecimal bEnv = new BigDecimal(env);
            float env2 = bEnv.setScale(1, BigDecimal.ROUND_HALF_UP).floatValue();
            BigDecimal bService = new BigDecimal(service);
            float ser2 = bService.setScale(1, BigDecimal.ROUND_HALF_UP).floatValue();
            BigDecimal bTaste = new BigDecimal(taste);
            float tast2 = bTaste.setScale(1, BigDecimal.ROUND_HALF_UP).floatValue();
            me.setEnv(env2);
            me.setTaste(tast2);
            me.setService(ser2);
            model.setmEvaluate(me);
        }catch (Exception e){
            me.setEnv(0);
            me.setTaste(0);
            me.setService(0);
            model.setmEvaluate(me);
        }


        String sqlSale = "select * from merchant_sale where isBan=1 and bCheck=2 and companyId="+objectid;
        List<MerchantSaleForMe> msList = merchantSaleForMeService.findByDataSQL(sqlSale);
        for (int i=0;i<msList.size();i++){
            MerchantSaleForMe msfm = msList.get(i);
            SettingDict sd = settingDictService.getbyId(msfm.getType());
            msfm.setsDict(sd);
        }
        model.setSaleList(msList);

        //是否新商户
        //是否新商户
        int days = getDateInterval(model.getCreateTime());
        if (days<30){
            model.setIsNew(1);
        }
        return model;
    }

    @RequestMapping(value = "Merchant/Add", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加后台商户管理信息", module = "后台、前台-后台商户管理信息块管理")
    public ResultMessage BaseAdd(Merchant model){
        List<User> users = userService.findByOneField(0, 0,
                "username", model.getUsername(), true, "username").getResult();
        List<User> users2 = userService.findByOneField(0, 0,
                "phone", model.getPhone(), true, "username").getResult();
        if (0 < users.size()) {
            return Msg(false, "商户用户名已被使用");
        }else if(0 < users2.size()){
            return Msg(false, "手机号已被注册");
        } else {
            User user = new User();
            user.setUsername(model.getUsername());
            user.setPassword("1bbd886460827015e5d605ed44252251");
            user.setName(model.getUsername());
            user.setRealName(model.getUsername());
            user.setEnterpriseRoot(1);
            user.setUserFlag(4);
            user.setSex(2);
            user.setMarital(1);
            user.setDeleteFlag(1);
            user.setEmailFlag(1);

            boolean rst = userService.insertNewUser(user);
            if (rst) {
                String sql = "insert into role_user (rolename,username) values ('Common','"+model.getUsername()+"')";
                roleService.execDataSql(sql);
                if (merchantService.IsExistName("name", model.getName(), model.getObjectid())) {
                    return Msg(false, "商户名已存在");
                } else {
                    boolean ret = merchantService.save(model);
                    if (ret){
                        return Msg(true, ConstClass.ResultSaveSuccess);
                    }else{
                        return Msg(false,ConstClass.ResultSaveFault);
                    }
                }
            } else {
                return Msg(false, ConstClass.ResultSaveFault);
            }
        }

    }

    @RequestMapping(value = "Merchant/Update", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "添加后台商户管理信息", module = "后台、前台-后台商户管理信息块管理")
    public ResultMessage BaseUpdate(Merchant model){
//        Merchant merchant = merchantService.getbyId(model.getObjectid());
//        merchant.setName(model.getName());
//        merchant.setWorkStartTime(model.getWorkStartTime());
//        merchant.setWorkEndTime(model.getWorkEndTime());
//        merchant.setType(model.getType());
//        merchant.setAddress(model.getAddress());
//        merchant.setPhone(model.getPhone());
//        merchant.setAvar(model.getAvar());
//        merchant.setIntroduce(model.getIntroduce());
//        merchant.setPark(model.getPark());
//        merchant.setParkType(model.getParkType());
//        merchant.setMemo(model.getMemo());
//        merchant.setChildType(model.getChildType());
//        merchant.setIsCheck(model.getIsCheck());
//        boolean ret = merchantService.update(merchant);
        //String typeStr = settingDictService.getbyId(model.getType()).getName();
        MerchantHistory mh = new MerchantHistory();
        mh.setName(model.getName());
        mh.setAddress(model.getAddress());
        mh.setIsCheck(model.getIsCheck());
        mh.setPhone(model.getPhone());
        mh.setWorkStartTime(model.getWorkStartTime());
        mh.setWorkEndTime(model.getWorkEndTime());
        mh.setType(model.getType());
        mh.setMid(model.getObjectid());
        mh.setChildType(model.getChildType());
        mh.setShortIntro(model.getShortIntro());
        mh.setPark(model.getPark());
        mh.setIsInvite(model.getIsInvite());
        mh.setIntroduce(model.getIntroduce());
        mh.setParkType(model.getParkType());
        mh.setAvar(model.getAvar());
        boolean ret = merchantHistoryService.save(mh);
        if (ret){
            Merchant merchant = merchantService.getbyId(model.getObjectid());
            merchant.setIsCheck(model.getIsCheck());
            merchantService.update(merchant);
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "Merchant/Delete/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "删除后台商户管理信息", module = "后台、前台-后台商户管理信息块管理")
    public ResultMessage BaseDel(@PathVariable int objectid){
        boolean ret = merchantService.delete(objectid);
        if (ret){
            return Msg(true, ConstClass.ResultDeleteSuccess);
        }else{
            return Msg(false,ConstClass.ResultDeleteFault);
        }
    }

    @RequestMapping(value = "Merchant/History/List/{mid}/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "获取商户历史信息", module = "后台、前台-后台商户管理信息块管理")
    public PageResult<MerchantHistory> BaseHistory(@PathVariable int mid,@PathVariable int page, @PathVariable int pageSize,MerchantHistory model){
        PageResult<MerchantHistory> models = merchantHistoryService.findByOneField(page,pageSize,"mid",mid,true,"createTime",model);
        return models;
    }

    @RequestMapping(value = "Merchant/Auth/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "获取商户审核列表", module = "后台、前台-后台商户管理信息块管理")
    public PageResult<MerchantHistory> BaseAuthHistoryList(@PathVariable int page, @PathVariable int pageSize,MerchantHistory model,HttpServletRequest request){
        String paramIsCheck = request.getParameter("isCheck");
        //String sql = "select distinct * from merchant_history where bCheck="+paramIsCheck+" order by createTime desc";
        PageResult<MerchantHistory> models = merchantHistoryService.findByOneField(page,pageSize,"isCheck",Integer.valueOf(paramIsCheck),true,"createTime",model);
        return models;
    }

    @RequestMapping(value = "Merchant/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "列表后台商户管理信息", module = "后台、前台-后台商户管理信息块管理")
    public PageResult<Merchant> BaseList(@PathVariable int page, @PathVariable int pageSize, Merchant Model,HttpServletRequest request){
        String paramDiscount = request.getParameter("discountType");
        String paramHit = request.getParameter("paramHit");
        String paramPark = request.getParameter("park");
        String paramType = request.getParameter("type");
        String paramChildType = request.getParameter("childType");
        String paramIsInvite = request.getParameter("isInvite");
        String paramIsCheck = request.getParameter("isCheck");
        String paramName = request.getParameter("name");
        List<Merchant> mList = new ArrayList<Merchant>();
        PageResult<Merchant> models = new PageResult<Merchant>();

        String sqlMain = "";
        if (paramDiscount!=null){
            sqlMain = "select * from merchant m left join merchant_sale s on m.objectid=s.companyId where s.bCheck=2 and s.isBan=1 and s.type="+Integer.valueOf(paramDiscount.trim());
        }else {
            sqlMain = "select * from merchant m where 1";
        }
        if (paramIsCheck!=null){
            //sqlMain+=" and m.status=1 and m.bCheck="+paramIsCheck;
            sqlMain+=" and m.status=1";
        }

        if (paramName!=null){
            sqlMain+=" and m.name like '%"+paramName+"%'";
        }

        if (paramPark!=null){
            sqlMain+=" and m.park="+paramPark;
        }

        if (paramType!=null){
            sqlMain+=" and m.type="+paramType;
        }

        if (paramChildType!=null){
            sqlMain+=" and m.childType="+paramChildType;
        }

        if (paramIsInvite!=null){
            sqlMain+=" and m.isInvite="+paramIsInvite;
        }

        if (paramHit!=null){
            if(Boolean.parseBoolean(paramHit)){
                sqlMain += " group by m.objectid order by m.hitCount asc,m.objectid desc";
            }else{
                sqlMain += " group by m.objectid order by m.hitCount desc,m.objectid asc";
            }
        }
        else {
            sqlMain+=" group by m.objectid order by m.createTime desc";
        }

        mList = merchantService.findByDataSQL(sqlMain);
        models.setTotal(mList.size());
        if(page!=0&&pageSize!=0){
            sqlMain+=" limit "+(page-1)*pageSize+","+pageSize;
            mList = merchantService.findByDataSQL(sqlMain);
        }
        models.setResult(mList);

        models.setPage(page);
        models.setPagesize(pageSize);


        for (int i=0;i<mList.size();i++){
            Merchant merchant = mList.get(i);
            String sqlSale = "";
            //判断是否有优惠产品
            if (paramDiscount!=null){
                sqlSale = "select * from merchant_sale where bCheck=2 and isBan=1 and companyId="+merchant.getObjectid()+" and type="+Integer.valueOf(paramDiscount.trim());
            }else{
                sqlSale = "select * from merchant_sale where bCheck=2 and isBan=1 and companyId="+merchant.getObjectid();
            }

            List<MerchantSaleForMe> msList = merchantSaleForMeService.findByDataSQL(sqlSale);
            for (int j=0;j<msList.size();j++){
                MerchantSaleForMe msfm = msList.get(j);
                SettingDict sd = settingDictService.getbyId(msfm.getType());
                msfm.setsDict(sd);
            }
            merchant.setSaleList(msList);

            //是否新商户
            int days = getDateInterval(merchant.getCreateTime());
            if (days<30){
                merchant.setIsNew(1);
            }
            //商户评分
            String sql = "select avg(t.env) as env,avg(t.service) as service,avg(t.taste) as taste from (select env,service,taste from merchant_evaluate where merchant="+merchant.getObjectid()+") t;";
            List<Object[]> obj = merchantService.findByCustomerSQL(sql);
            MerchantEvaluate me = new MerchantEvaluate();
            if (obj.size()==0){

            }
            else
            {
                try{
                    float env = Float.parseFloat(String.valueOf((obj.get(0))[0]));
                    float service = Float.parseFloat(String.valueOf((obj.get(0))[1]));
                    float taste = Float.parseFloat(String.valueOf((obj.get(0))[2]));
                    BigDecimal bEnv = new BigDecimal(env);
                    float env2 = bEnv.setScale(1, BigDecimal.ROUND_HALF_UP).floatValue();
                    BigDecimal bService = new BigDecimal(service);
                    float ser2 = bService.setScale(1, BigDecimal.ROUND_HALF_UP).floatValue();
                    BigDecimal bTaste = new BigDecimal(taste);
                    float tast2 = bTaste.setScale(1, BigDecimal.ROUND_HALF_UP).floatValue();
                    me.setEnv(env2);
                    me.setTaste(tast2);
                    me.setService(ser2);
                }catch (NumberFormatException e)
                {

                }

                merchant.setmEvaluate(me);
            }
        }

        return models;
    }

    @RequestMapping(value = "Merchant/Audit", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "商户审核", module = "后台、前台-后台商户审核块管理")
    public ResultMessage BaseAudit(HttpServletRequest request){
        int id = Integer.valueOf(request.getParameter("objectid"));
        int bCheck = Integer.valueOf(request.getParameter("bCheck"));
        String memo = request.getParameter("memo");

        MerchantHistory mh = merchantHistoryService.getbyId(id);
        Merchant merchant = merchantService.getbyId(mh.getMid());
        mh.setIsCheck(bCheck);
        if(memo!=null){
            mh.setMemo(memo);
        }
        boolean ret = merchantHistoryService.update(mh);
        if (ret){
//            String sql = "update merchant_history set bCheck="+bCheck+" where mid="+id+ " ORDER BY createTime DESC LIMIT 1";
//            boolean bl = merchantHistoryService.execDataSql(sql);

            Noticfication noticfication = new Noticfication();
            noticfication.setAccepter(merchant.getUsername());
            noticfication.setAuthor("system");
            if (bCheck==3){
                merchant.setMemo(mh.getMemo());
                merchant.setIsCheck(mh.getIsCheck());
                merchantService.update(merchant);
                noticfication.setReadStatus(1);
                noticfication.setContent("尊敬的商户 "+mh.getName()+" 您的审核未通过。");
            }
            else if (bCheck==2)
            {
                //更新到显示表

                merchant.setName(mh.getName());
                merchant.setWorkStartTime(mh.getWorkStartTime());
                merchant.setWorkEndTime(mh.getWorkEndTime());
                merchant.setType(mh.getType());
                merchant.setAddress(mh.getAddress());
                merchant.setPhone(mh.getPhone());
                merchant.setAvar(mh.getAvar());
                merchant.setShortIntro(mh.getShortIntro());
                merchant.setIsInvite(mh.getIsInvite());
                merchant.setIntroduce(mh.getIntroduce());
                merchant.setPark(mh.getPark());
                merchant.setParkType(mh.getParkType());
                merchant.setMemo(mh.getMemo());
                merchant.setChildType(mh.getChildType());
                merchant.setIsCheck(mh.getIsCheck());
                boolean rett = merchantService.update(merchant);
                noticfication.setReadStatus(1);
                noticfication.setContent("尊敬的商户 "+mh.getName()+" 您的审核已通过。");
            }

            noticfication.setTitle("商户审核提醒");
            notificationService.save(noticfication);
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "Merchant/Activity", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "商户热度", module = "后台、前台-后台商户审核块管理")
    public ResultMessage BaseActivity(HttpServletRequest request){
        int id = Integer.valueOf(request.getParameter("objectid"));
        int activity = Integer.valueOf(request.getParameter("activity"));

        Merchant mc = merchantService.getbyId(id);
        mc.setActivity(activity);
        boolean ret = merchantService.update(mc);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "Merchant/Status", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "查看后台商户状态信息", module = "后台、前台-后台商户状态信息块管理")
    public ResultMessage BaseStatus(HttpServletRequest request){
        int id = Integer.valueOf(request.getParameter("objectid"));
        int status = Integer.valueOf(request.getParameter("status"));

        Merchant mc = merchantService.getbyId(id);
        mc.setStatus(status);
        boolean ret = merchantService.update(mc);
        if (ret){
            if (status==-1){
                String sql = "update users set deleteflag=-1 where username='"+mc.getUsername()+"'";
                ret = userService.execDataSql(sql);
            }else{
                String sql = "update users set deleteflag=1 where username='"+mc.getUsername()+"'";
                ret = userService.execDataSql(sql);
            }
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "Merchant/Hit/{objectid}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看后台商户状态信息", module = "后台、前台-后台商户状态信息块管理")
    public ResultMessage BaseHit(@PathVariable int objectid){
        Merchant mc = merchantService.getbyId(objectid);
        int count = mc.getHitCount();
        count++;
        mc.setHitCount(count);
        boolean ret = merchantService.update(mc);
        if (ret){
            return Msg(true, ConstClass.ResultSaveSuccess);
        }else{
            return Msg(false,ConstClass.ResultSaveFault);
        }
    }

    private int getDateInterval(Date startDate)
            throws RuntimeException {
        long t = (new Date().getTime() - startDate.getTime())/(1000 * 60 * 60 * 24);
        return (int)t;
    }

    @RequestMapping(value = "Merchant/StatisticsGraphData", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看后台商户统计数据图", module = "后台、前台-后台商户状态信息块管理")
    public void BaseStatistics(HttpServletRequest request, HttpServletResponse response){
        String sqlGetMerchantByType = "SELECT s.name,count(m.objectid) FROM setting_dict s  LEFT JOIN merchant m ON m.type = s.objectid WHERE m.status=1 and s.type='merchantType' and parentid=(select objectid from setting_dict where type='merchantType' and parentid=-1) GROUP BY s.objectid";

        String sqlGetMerchantByPark = "SELECT p.name,count(m.objectid) FROM park p  LEFT JOIN merchant m ON m.park = p.objectid where m.status=1 GROUP BY p.objectid;";

        String sqlGetMerchantSaleByType = "select d.name,count(DISTINCT s.companyId),s.type from setting_dict d,merchant m,merchant_sale s where m.objectid = s.companyId and s.type = d.objectid and m.status=1  and s.bCheck=2 and s.isBan=1 GROUP BY d.name;";

        int total = merchantService.getCountBySQL("select count(*) from merchant where  status=1");

        int noSale = merchantService.getCountBySQL("select  count(*) from merchant WHERE status=1 and objectid NOT IN (SELECT companyId FROM merchant_sale where bCheck=2 and isBan=1)");

        JSONObject jo = new JSONObject();
        jo.put("TotalMerchants",total);

        List<Object[]> objects = merchantService.findByCustomerSQL(sqlGetMerchantByType);
        JSONArray ja = new JSONArray();
        for (int i=0;i<objects.size();i++){
            JSONObject en = new JSONObject();
            en.put("name",objects.get(i)[0].toString());
            en.put("value",objects.get(i)[1].toString());
            ja.put(en);
        }
        jo.put("GetMerchantByType",ja);

        List<Object[]> objectss = merchantService.findByCustomerSQL(sqlGetMerchantByPark);
        JSONArray jaa = new JSONArray();
        for (int i=0;i<objectss.size();i++){
            JSONObject en = new JSONObject();
            en.put("name",objectss.get(i)[0].toString());
            en.put("value",objectss.get(i)[1].toString());
            jaa.put(en);
        }
        jo.put("GetMerchantByPark",jaa);

        List<Object[]> objectsss = merchantService.findByCustomerSQL(sqlGetMerchantSaleByType);
        JSONArray jaaa = new JSONArray();
        for (int i=0;i<objectsss.size();i++){
            JSONObject en = new JSONObject();
            en.put("name",objectsss.get(i)[0].toString());
            en.put("value",objectsss.get(i)[1].toString());
            jaaa.put(en);
        }

        JSONObject en = new JSONObject();
        en.put("name","无优惠");
        en.put("value",noSale);
        jaaa.put(en);
        jo.put("GetMerchantSaleByType",jaaa);

        try {
            response.getWriter().write(jo.toString());
            response.getWriter().flush();
            response.getWriter().close();
        } catch (IOException ee) {

        }
    }

    @RequestMapping(value = "Merchant/GetClassifiedProducts", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "获取分类商品", module = "后台、前台-后台商户管理信息块管理")
    public ResultMessage GetClassifiedProducts(HttpServletResponse response){
        String sql = "select * from setting_dict where en IN ('food','living','shopping','children','play')";
        List<SettingDict> tList = settingDictService.findByDataSQL(sql);
        JSONObject jo = new JSONObject();

        for (int i=0;i<tList.size();i++){
            String msql = "select * from merchant_sale s LEFT JOIN  merchant m ON s.companyId=m.objectid  where s.bCheck=2 and s.isBan=1 and m.type="+tList.get(i).getObjectid()+" ORDER BY m.hitCount DESC LIMIT 4";
            List<MerchantSale> mList = merchantSaleService.findByDataSQL(msql);
            for (int j=0;j<mList.size();j++){
                MerchantSale ms = mList.get(j);
                ms.setCompany(null);
            }

            JSONArray ja = new JSONArray(mList);
            for (int m=0;m<ja.length();m++){
                ja.getJSONObject(m).put("typeEn",mList.get(m).getsDict().getEnglish());
            }
            JSONObject jchild = new JSONObject();

            jchild.put("value",ja);
            jchild.put("typeId",tList.get(i).getObjectid());
            jchild.put("name",tList.get(i).getName());

            jo.put(tList.get(i).getEnglish(),jchild);
        }
        try {
            response.getWriter().write(jo.toString());
            response.getWriter().flush();
            response.getWriter().close();
        } catch (IOException ee) {

        }
        return Msg(true,"success");
    }

    @RequestMapping(value = "Merchant/GetClassifiedMerchant", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "获取分类商品", module = "后台、前台-后台商户管理信息块管理")
    public ResultMessage GetClassifiedMerchant(HttpServletResponse response){
        String sql = "select * from setting_dict where en IN ('food','living','shopping','children','play')";
        List<SettingDict> tList = settingDictService.findByDataSQL(sql);
        JSONObject jo = new JSONObject();

        for (int i=0;i<tList.size();i++){
            String msql = "select * from merchant where type="+tList.get(i).getObjectid()+" ORDER BY hitCount DESC LIMIT 4";
            List<Merchant> mList = merchantService.findByDataSQL(msql);

            JSONArray ja = new JSONArray(mList);

            for (int m=0;m<ja.length();m++){
                //商户评分
                String esql = "select avg(t.env) as env,avg(t.service) as service,avg(t.taste) as taste from (select env,service,taste from merchant_evaluate where merchant="+mList.get(m).getObjectid()+") t;";
                List<Object[]> obj = merchantService.findByCustomerSQL(esql);
                MerchantEvaluate me = new MerchantEvaluate();
                if (obj.size()==0){

                }
                else
                {
                    try{
                        float env = Float.parseFloat(String.valueOf((obj.get(0))[0]));
                        float service = Float.parseFloat(String.valueOf((obj.get(0))[1]));
                        float taste = Float.parseFloat(String.valueOf((obj.get(0))[2]));
                        BigDecimal bEnv = new BigDecimal(env);
                        float env2 = bEnv.setScale(1, BigDecimal.ROUND_HALF_UP).floatValue();
                        BigDecimal bService = new BigDecimal(service);
                        float ser2 = bService.setScale(1, BigDecimal.ROUND_HALF_UP).floatValue();
                        BigDecimal bTaste = new BigDecimal(taste);
                        float tast2 = bTaste.setScale(1, BigDecimal.ROUND_HALF_UP).floatValue();
                        me.setEnv(env2);
                        me.setTaste(tast2);
                        me.setService(ser2);
                    }catch (NumberFormatException e)
                    {

                    }
                    mList.get(m).setmEvaluate(me);
                }
                JSONObject jm = new JSONObject(me);
                ja.getJSONObject(m).put("merchantEvaluate",jm);
            }
            JSONObject jchild = new JSONObject();

            jchild.put("value",ja);
            jchild.put("typeId",tList.get(i).getObjectid());
            jchild.put("name",tList.get(i).getName());

            jo.put(tList.get(i).getEnglish(),jchild);
        }
        try {
            response.getWriter().write(jo.toString());
            response.getWriter().flush();
            response.getWriter().close();
        } catch (IOException ee) {

        }
        return Msg(true,"success");
    }
}