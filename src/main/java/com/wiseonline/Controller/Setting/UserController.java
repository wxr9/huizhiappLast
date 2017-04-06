package com.wiseonline.Controller.Setting;

import com.wiseonline.Controller.BaseController;
import com.wiseonline.Dao.UserDao;
import com.wiseonline.Domain.*;
import com.wiseonline.Service.Impl.*;
import com.wiseonline.Utils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by yanwj on 2015/11/6.
 */
@RestController
@RequestMapping("/Setting/User")
public class UserController extends BaseController {
    @Autowired
    UserServiceImpl userService;
    @Autowired
    RoleServiceImpl roleService;
    @Autowired
    SettingDictServiceImpl settingDictService;
    @Autowired
    SettingCityServiceImpl settingCityService;
    @Autowired
    EnterpriseServiceImpl enterpriseService;
    @Autowired
    UserEnterpriseApplyInfoServiceImpl userEnterpriseApplyInfoService;

    @Autowired
    NotificationServiceImpl notificationService;

    @Autowired
    UserDao userDao;


    private static String[] FILE_TYPE = {".jpg", ".png", ".gif", ".bmp"};
    private static int FILE_MAX_SIZE = 1024 * 1024 * 3;
    private static String WSP_SESSION_USERNAME = "WSP_SESSION_USERNAME";
    private static final String VALIDATE_PHONE_CODE = "VALIDATE_PHONE_CODE";
    private static final String VALIDATE_PHONE = "VALIDATE_PHONE";
    private static final String SEND_CODE_TIME = "SEND_CODE_TIME";

    @RequestMapping(value = "{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "用户查看", module = "后台-用户管理")
    public PageResult<User> getAll(@PathVariable int page,
                                   @PathVariable int pageSize, User Model) {
        PageResult<User> models = userService.findAll(page, pageSize, Model);
        return models;
    }

    @RequestMapping(method = RequestMethod.GET, headers = "Accept=application/json")
    public List<User> getAll() {
        List<User> models = userService.findAll();
        return models;
    }

    @RequestMapping(value = "Add", method = RequestMethod.POST)
    @PermissionInfo(name = "用户新增", module = "后台-用户管理")
    public ResultMessage Add(User Model) {
        List<User> users = userService.findByOneField(0, 0,
                "username", Model.getUsername(), true, "username").getResult();
        List<User> users2 = userService.findByOneField(0, 0,
                "phone", Model.getPhone(), true, "username").getResult();
        if (0 < users.size()) {
            return Msg(false, "用户登录名称已重复");
        } else if(0 < users2.size()){
            return Msg(false, "手机号已注册");
        }
        else {
            if (Model.getName().equals("")){
                Model.setName(Model.getUsername());
            }
            if (Model.getRealName().equals("")){
                Model.setRealName(Model.getUsername());
            }
            if (Model.getSex() == 0){
                Model.setSex(2);
            }
            if (Model.getMarital() == 0){
                Model.setMarital(1);
            }
            if (Model.getDeleteFlag() == 0){
                Model.setDeleteFlag(1);
            }
            if (Model.getEnterpriseRoot() == 0){
                Model.setEnterpriseRoot(1);
            }
            if (Model.getUserFlag() == 0){
                Model.setUserFlag(2);
            }
            if (Model.getEmailFlag() == 0){
                Model.setEmailFlag(1);
            }
            boolean rst = userService.insertNewUser(Model);
            if (rst) {
                return Msg(true, ConstClass.ResultSaveSuccess);
            } else {
                return Msg(false, ConstClass.ResultSaveFault);
            }
        }
    }

    @RequestMapping(value = "Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看他人用户信息", module = "后台-用户管理")
    public User Edit(@PathVariable String id) {
        User model = userService.getbyId(id);
        return model;
    }

    @RequestMapping(value = "UpdateAvar", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "查看他人用户信息", module = "后台-用户管理")
    public ResultMessage UpdateAvar(HttpServletRequest request) {
        String username = getUserName();
        String avar = request.getParameter("avar");
        String sql = "update users set userface='"+avar+"' where username='"+username+"'";
        boolean ret = userService.execDataSql(sql);
        if (ret){
            return Msg(true,ConstClass.ResultSaveSuccess);
        }
        return Msg(true,ConstClass.ResultSaveFault);
    }

    @RequestMapping(value = "Update", method = RequestMethod.POST)
    @PermissionInfo(name = "用户修改", module = "后台-用户管理")
    public ResultMessage Update(User Model) {
        Set<Role> roles = new HashSet<Role>();
        if (Model.getRoleArray().equals("")){
            roles.add(null);
        }else {
            String[] a = Model.getRoleArray().split(",");
            if (a.length == 1){
                Role r = roleService.getbyId(a[0]);
                roles.add(r);
            }else {
                for (String s : a) {
                    Role r = roleService.getbyId(s);
                    roles.add(r);
                }
            }
        }
        Model.setRoleList(roles);
        if (Model.getNation() != 0){
            Model.setSettingNation(settingDictService.getbyId(Model.getNation()));
        }
        if (Model.getApartmentCity() != 0){
            Model.setSettingApartmentCity(settingCityService.getbyId(Model.getApartmentCity()));
        }
        if (Model.getHometownCity() != 0){
            Model.setSettingHometowntCity(settingCityService.getbyId(Model.getHometownCity()));
        }
        if (Model.getEducation() != 0){
            Model.setSettingDict(settingDictService.getbyId(Model.getEducation()));
        }else {
            Model.setSettingDict(null);
        }
        if (Model.getEnterpriseId() != 0){
            Model.setEnterprise(enterpriseService.getbyId(Model.getEnterpriseId()));
        }else{
            Model.setEnterprise(null);
        }
        if (Model.getDepartment() != 0){
            Model.setSettingDepartmentDict(settingDictService.getbyId(Model.getDepartment()));
        }

        if (Model.getName().equals("")){
            Model.setName(Model.getUsername());
        }
        if (Model.getRealName().equals("")){
            Model.setRealName(Model.getUsername());
        }
        if (Model.getSex() == 0){
            Model.setSex(2);
        }
        if (Model.getMarital() == 0){
            Model.setMarital(1);
        }
        if (Model.getDeleteFlag() == 0){
            Model.setDeleteFlag(1);
        }
        if (Model.getEnterpriseRoot() == 0){
            Model.setEnterpriseRoot(1);
        }
        if (Model.getUserFlag() == 0){
            Model.setUserFlag(2);
        }
        boolean rst = userService.update(Model);
        if (rst) {
            return Msg(true, ConstClass.ResultSaveSuccess);
        } else {
            return Msg(false, ConstClass.ResultSaveFault);
        }
    }

    @RequestMapping(value = "Delete/{id}", method = RequestMethod.GET)
    @PermissionInfo(name = "用户删除", module = "后台-用户管理")
    public ResultMessage Delete(@PathVariable String id) {
        boolean rst = userService.delete(id);
        if (rst) {
            return Msg(true, ConstClass.ResultDeleteSuccess);
        } else {
            return Msg(false, ConstClass.ResultDeleteFault);
        }
    }

    @RequestMapping(value = "ChangePassword", method = RequestMethod.POST)
    @PermissionInfo(name = "用户修改密码", module = "后台-用户管理")
    public ResultMessage ChangePassword(HttpServletRequest request) {
        String username = request.getParameter("username");
        String oldpassword = request.getParameter("oldpassword");
        String password = request.getParameter("password");
        boolean rst = userService.ChangePassword(username, oldpassword,password);
        if (rst) {
            return Msg(true, ConstClass.ResultSaveSuccess);
        } else {
            return Msg(false, ConstClass.ResultSaveFault);
        }
    }
    @RequestMapping(value = "SetNewPassword", method = RequestMethod.POST)
    @PermissionInfo(name = "用户忘记密码", module = "后台-用户管理")
    public ResultMessage SetNewPassword(HttpServletRequest request) {
        String username = request.getParameter("username");
        String phone = request.getParameter("phone");
        String password = request.getParameter("password");
        boolean rst = userService.SetNewPassword(username, phone, password);
        if (rst) {
            return Msg(true, ConstClass.ResultSaveSuccess);
        } else {
            return Msg(false, ConstClass.ResultSaveFault);
        }
    }
    @RequestMapping(value = "EnableUser/{username}/{flag}")
    @PermissionInfo(name = "禁用解禁用户", module = "后台-内部会员管理")
    public ResultMessage EnableUser(@PathVariable String username,@PathVariable String flag){
        if (flag.equals("0")){
            //禁用用户
            boolean rst = userService.enableUser(username,"-1");
            if (rst){
                return Msg(true,ConstClass.DisableUserSuccess);
            }else{
                return Msg(false,ConstClass.DisableUserFault);
            }
        }else{
            //启用用户
            boolean rst = userService.enableUser(username,"1");
            if (rst){
                return Msg(true,ConstClass.EnableUserSuccess);
            }else{
                return Msg(true,ConstClass.EnableUserFault);
            }
        }
    }
    @RequestMapping(value = "ResetPassword/{username}")
    @PermissionInfo(name = "重置用户密码", module = "后台-内部会员管理")
    public ResultMessage ResetPassword(@PathVariable String username){
        User user = userService.getbyId(username);
        boolean rst = userService.ResetPassword(user);
        if (rst){
            return Msg(true,ConstClass.RestPasswordSuccess);
        }else{
            return Msg(false,ConstClass.RestPasswordFault);
        }
    }
//    @RequestMapping(value = "UpdateUserFace/{username}")
//    @PermissionInfo(name = "用户修改头像", module = "公共-用户中心")
//    public ResultMessage UpdateUserFace(@PathVariable String username,HttpServletRequest request){
//        String url = request.getParameter("url");
//        User user = userService.getbyId(username);
//        if (user != null){
//            user.setUserFace(url);
//            boolean rst = userService.update(user);
//            if (rst){
//                return Msg(true,ConstClass.ResultSaveSuccess);
//            }else{
//                return Msg(false,ConstClass.ResultSaveFault);
//            }
//        }else {
//            return Msg(false,ConstClass.NoUser);
//        }
//    }
    @RequestMapping(value = "UserFace")
    @PermissionInfo(name = "获取用户头像", module = "公共-用户中心")
    public ResultMessage UserFace(HttpServletRequest request) throws MyException {
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            User user = userService.getbyId(username);
            if (user != null) {
                return Msg(true, user.getUserFace());
            } else {
                return Msg(false, "error");
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }

    @RequestMapping(value = "ChangeUserFace", method = RequestMethod.POST,produces = "text/html;charset=UTF-8")
    @PermissionInfo(name = "更改用户头像", module = "公用-头像管理")
    public void ChangeUserFace(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setHeader("Content-ype", "text/html;charset=UTF-8");
        response.setStatus(200);
        //response.setHeader("Content-type", "text/html;charset=UTF-8");
       //response.setContentType("text/html;charset=UTF-8");
        String username = getUserName();
        //String referrer = request.getHeader("referer");
        String x = request.getParameter("x");
        String y = request.getParameter("y");
        String w = request.getParameter("w");
        String h = request.getParameter("h");
        if (!username.equals("anonymousUser")) {
            CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver(
                    request.getSession().getServletContext());
            String fileNames = "";
            String filePath = "";
            String t = "";
            if (multipartResolver.isMultipart(request)) {
                MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) request;
                Iterator<String> iter = multiRequest.getFileNames();
                int index = 0;
                while (iter.hasNext() && index == 0) {
                    String fd = new SimpleDateFormat("yyyyMMdd").format(new Date());
                    String fm = new SimpleDateFormat("yyyyMMddHHmmssSSS").format(new Date());
                    MultipartFile file = multiRequest.getFile((String) iter.next());
                    if (file != null) {
                        String suffix = file.getOriginalFilename().substring
                                (file.getOriginalFilename().lastIndexOf("."));
                        if (!isPic(suffix)) {
                            String jason = "{\"msg\":\"文件格式不正确（必须为.jpg/.gif/.bmp/.png文件）\",\"success\":false}";
                            response.getWriter().write(jason);
                            response.getWriter().flush();
                            response.getWriter().close();
                        }
                        if (!isMax(file.getSize())) {
                            String jason = "{\"msg\":\"上传文件大于3M!\",\"success\":false}";
                            response.getWriter().write(jason);
                            response.getWriter().flush();
                            response.getWriter().close();
                        }
                        filePath = request.getSession().getServletContext().getRealPath("/") + "static/uploads/images/" + fd + "/";
                        //  下面的加的日期是为了防止上传的名字一样
                        t = new SimpleDateFormat("yyyyMMddHHmmssSSS")
                                .format(new Date()) + suffix;
                        String path = filePath
                                + t;
                        File folder = new File(filePath);
                        if (!(folder.exists() && folder.isDirectory()))
                            folder.mkdirs();
                        if (fileNames.length() > 0) {
                            fileNames += ";";
                        }
                        String temp = folder.getPath() + "\\" + new SimpleDateFormat("yyyyMMddHHmmssSSS")
                                .format(new Date()) + suffix;

                        try {
                            File localFile = new File(path);

                            file.transferTo(localFile);
                            ImageHelper.cutImage(folder.getPath() + "/"+t,folder.getPath() + "/cut" +t,Integer.parseInt(x),Integer.parseInt(y),Integer.parseInt(w),Integer.parseInt(h));
                            System.out.println("trans");
                            User user = userService.getbyId(username);
                            if (user != null) {
                                user.setUserFace("/static/uploads/images/"+fd+"/cut" + t);
                                boolean rst = userService.update(user);
                                if (rst) {
                                    String jason = "{\"msg\":\""+ConstClass.ResultSaveSuccess+"\",\"success\":true}";
                                    response.getWriter().write(jason);
                                    response.getWriter().flush();
                                    response.getWriter().close();
                                } else {
                                    String jason = "{\"msg\":\""+ConstClass.ResultSaveFault+"\",\"success\":false}";
                                    response.getWriter().write(jason);
                                    response.getWriter().flush();
                                    response.getWriter().close();
                                }
                            } else {
                                String jason = "{\"msg\":\""+ConstClass.NoUser+"\",\"success\":false}";
                                response.getWriter().write(jason);
                                response.getWriter().flush();
                                response.getWriter().close();
                            }

                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                        fileNames += temp;


                    } else {
                        String jason = "{\"msg\":\"上传失败!\",\"success\":false}";
                        response.getWriter().write(jason);
                        response.getWriter().flush();
                        response.getWriter().close();
                    }
                    index++;
                }
            }
            String jason = "{\"msg\":\"请选择文件\",\"success\":false}";
            response.getWriter().write(jason);
            response.getWriter().flush();
            response.getWriter().close();
        }else {
            String jason = "{\"msg\":\""+ConstClass.LoginTimeOut+"\",\"success\":false}";
            response.getWriter().write(jason);
            response.getWriter().flush();
            response.getWriter().close();
        }
    }

    @RequestMapping(value = "CompleteUserInfo")
    @PermissionInfo(name = "用户修改完善个人资料", module = "公共-用户中心")
    public ResultMessage CompleteUserInfo(User user,HttpServletRequest request){
        String username = getUserName();
        if (!username.equals("anonymousUser")){
            User oldUser = userService.getbyId(username);
            if (user.getBirthday() != null){
                oldUser.setBirthday(user.getBirthday());
            }
            if (user.getApartmentCity() != 0 ){
                SettingCity settingCity = settingCityService.getbyId(user.getApartmentCity());
                if (settingCity != null){
                    oldUser.setSettingApartmentCity(settingCity);
                }else {
                    oldUser.setSettingApartmentCity(null);
                }
            }else {
                oldUser.setSettingApartmentCity(null);
            }
            if (user.getApartmentDetail() != null){
                oldUser.setApartmentCity(user.getApartmentCity());
            }
            if (user.getEducation() != 0){
                SettingDict settingDict = settingDictService.getbyId(user.getEducation());
                if (settingDict.getType().equals(SettingDictString.education)){
                    oldUser.setSettingDict(settingDict);
                }
            }else{
                oldUser.setSettingDict(null);
            }
            if (user.getHometownCity() != 0){
                SettingCity settingCity = settingCityService.getbyId(user.getHometownCity());
                if (settingCity != null){
                    oldUser.setSettingHometowntCity(settingCity);
                }else {
                    oldUser.setSettingHometowntCity(null);
                }
            }else {
                oldUser.setSettingHometowntCity(null);
            }
            if (user.getHometownDetail() != null){
                oldUser.setHometownDetail(user.getHometownDetail());
            }
            if (user.getName() != null){
                oldUser.setName(user.getName());
            }
            if (user.getNation() != 0){
                SettingDict settingDict = settingDictService.getbyId(user.getNation());
                if (settingDict.getType().equals(SettingDictString.nation)){
                    oldUser.setSettingNation(settingDict);
                }else {
                    oldUser.setSettingNation(null);
                }
            }else {
                oldUser.setSettingNation(null);
            }
            if (user.getRealName() != null){
                oldUser.setRealName(user.getRealName());
            }
            if (user.getSettingApartmentCity() != null){
                oldUser.setSettingApartmentCity(user.getSettingApartmentCity());
            }
            if (user.getSex() >= 0 ){
                oldUser.setSex(user.getSex());
            }
            if (user.getSignature() != null){
                oldUser.setSignature(user.getSignature());
            }
            if (user.getWorkYears() >= 0){
                oldUser.setWorkYears(user.getWorkYears());
            }
            if (user.getMarital() > 0){
                oldUser.setMarital(user.getMarital());
            }
            if (user.getEnterpriseInput() != null){
                oldUser.setEnterpriseInput(user.getEnterpriseInput());
            }
            boolean rst = userService.CompleteUserInfo(oldUser);
            if (rst){
                return Msg(true,ConstClass.ResultSaveSuccess);
            }else{
                return Msg(false,ConstClass.ResultSaveFault);
            }
        }else {
            return Msg(false,ConstClass.LoginTimeOut);
        }
    }
    @RequestMapping(value = "ChangePhone",method = RequestMethod.POST)
    @PermissionInfo(name = "用户变更手机号码", module = "公共-用户中心")
    public ResultMessage ChangePhone(HttpServletRequest request){
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            String phone = request.getParameter("phone");
            String code = request.getParameter("code");

            HttpSession session = request.getSession();
            String vCode = (String) session.getAttribute(VALIDATE_PHONE_CODE);
            String vPhone = (String) session.getAttribute(VALIDATE_PHONE);
            Long vTime = (Long) session.getAttribute(SEND_CODE_TIME);
            Long sendTime = vTime;//Long.parseLong(vTime);
            Long reduceResult = new Date().getTime() - sendTime;
            if (((reduceResult / 1000) / 60) > 30) {
                return Msg(false,"验证码已失效");
            }
            if (!vCode.equals(code)){
                return Msg(false,"验证码不正确");
            }
            if (!vPhone.equals(phone)){
                return Msg(false,"手机号码和验证码不匹配");
            }
            if (code != null) {
                boolean rst = userService.ChangePhone(username, phone);
                if (rst) {
                    return Msg(true, ConstClass.ResultSaveSuccess);
                } else {
                    return Msg(false, ConstClass.ResultSaveFault);
                }
            } else {
                return Msg(false, "请填写验证码");
            }
        }else {
            return Msg(false,ConstClass.LoginTimeOut);
        }
    }

    @RequestMapping(value = "BindingEnterprise/{enterpriseId}")
    @PermissionInfo(name = "用户绑定企业", module = "公共-用户中心")
    public ResultMessage BindingEnterprise(@PathVariable int enterpriseId,HttpServletRequest request){
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            User user = userService.getbyId(username);
            if (user != null) {
                Enterprise enterprise = enterpriseService.getbyId(enterpriseId);
                if (enterprise != null) {
                    UserEnterpriseApplyInfo userEnterpriseApplyInfo = new UserEnterpriseApplyInfo();
                    userEnterpriseApplyInfo.setEnterprise(enterprise);
                    userEnterpriseApplyInfo.setUser(user);
                    userEnterpriseApplyInfo.setApplyFlag(1);
                    boolean rst = userEnterpriseApplyInfoService.save(userEnterpriseApplyInfo);
                    if (rst) {
                        return Msg(true, ConstClass.ResultSaveSuccess);
                    } else {
                        return Msg(false, ConstClass.RestPasswordFault);
                    }
                } else {
                    return Msg(false, ConstClass.NoEnterprise);
                }
            } else {
                return Msg(false, ConstClass.NoUser);
            }
        }else {
            return Msg(false,ConstClass.LoginTimeOut);
        }
    }

    @RequestMapping(value = "BindingEnterpriseByName", method = RequestMethod.POST, headers = "Accept=application/json")
    @PermissionInfo(name = "用户绑定企业", module = "公共-用户中心")
    public ResultMessage BindingEnterpriseByName(HttpServletRequest request) {
        String enterpriseName = request.getParameter("EnterpriseName");
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            User user = userService.getbyId(username);
            if (user != null) {

                user.setEnterpriseInput(enterpriseName);
                boolean rst = userService.update(user);
                if (rst) {
                    return Msg(true, ConstClass.ResultSaveSuccess);
                } else {
                    return Msg(false, ConstClass.RestPasswordFault);
                }

            } else {
                return Msg(false, ConstClass.NoUser);
            }
        } else {
            return Msg(false, ConstClass.LoginTimeOut);
        }
    }

    @RequestMapping(value = "EnterpriseAdminShowUser/{page}/{pageSize}")
    @PermissionInfo(name = "企业管理员查看企业用户", module = "企业管理员-企业管理")
    public PageResult<User> EnterpriseAdminShowUser(HttpServletRequest request,@PathVariable int page,@PathVariable int pageSize, User Model) throws MyException {
        String username = getUserName();
        if (!username.equals("anonymousUser")){
            User user = userService.getbyId(username);
            int enterpriseId = user.getEnterpriseId();
            if (user.getEnterpriseRoot() == 2) {
                PageResult<User> result = userService.findByOneField(page, pageSize,
                        "enterprise.objectid", enterpriseId, true, "username", Model);
                return result;
            }else {
                throw new MyException(ConstClass.NotEnterpriseRoot);
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }

    }

    @RequestMapping(value = "InsideUser/{page}/{pageSize}")
    @PermissionInfo(name = "内部用户列表", module = "后台管理-用户管理")
    public PageResult<User> InsideUser(HttpServletRequest request,@PathVariable int page,@PathVariable int pageSize, User Model){
        String doudouke = request.getParameter("searchName");
        if (doudouke != null){
            String sql = "";
            String sql2 ="";
            System.out.println(doudouke);
            if (doudouke.equals("男")){
                sql = "SELECT * FROM users WHERE (username LIKE '%"+doudouke+"%' or name LIKE '%"+doudouke+
                        "%' OR realname LIKE '%"+doudouke+"%' OR sex = 1 OR phone LIKE '%"+doudouke+"%' or cardid LIKE '%"+doudouke+"%') and userflag=1";
                if (page == 1) {
                    sql2 = "SELECT * FROM users WHERE (username LIKE '%" + doudouke + "%' or name LIKE '%" + doudouke +
                            "%' OR realname LIKE '%" + doudouke + "%' OR sex = 1 OR phone LIKE '%" + doudouke + "%' or cardid LIKE '%" + doudouke + "%') and userflag=1 limit 0,"+pageSize;
                }else if (page == 0){
                    sql2 = sql;
                }else {
                    sql2 = "SELECT * FROM users WHERE (username LIKE '%" + doudouke + "%' or name LIKE '%" + doudouke +
                            "%' OR realname LIKE '%" + doudouke + "%' OR sex = 1 OR phone LIKE '%" + doudouke + "%' or cardid LIKE '%" + doudouke + "%') and userflag=1 limit "+(page-1)*pageSize+","+pageSize;
                }
            }else if (doudouke.equals("女")){
                sql = "SELECT * FROM users WHERE (username LIKE '%"+doudouke+"%' or name LIKE '%"+doudouke+
                        "%' OR realname LIKE '%"+doudouke+"%' OR sex = 2 OR phone LIKE '%"+doudouke+"%' or cardid LIKE '%"+doudouke+"%') and userflag=1";
                if (page == 1) {
                    sql2 = "SELECT * FROM users WHERE (username LIKE '%" + doudouke + "%' or name LIKE '%" + doudouke +
                            "%' OR realname LIKE '%" + doudouke + "%' OR sex = 2 OR phone LIKE '%" + doudouke + "%' or cardid LIKE '%" + doudouke + "%') and userflag=1 limit 0,"+pageSize;
                }else if (page == 0){
                    sql2 = sql;
                }else {
                    sql2 = "SELECT * FROM users WHERE (username LIKE '%" + doudouke + "%' or name LIKE '%" + doudouke +
                            "%' OR realname LIKE '%" + doudouke + "%' OR sex = 2 OR phone LIKE '%" + doudouke + "%' or cardid LIKE '%" + doudouke + "%') and userflag=1 limit "+(page-1)*pageSize+","+pageSize;
                }
            }else {
                sql = "SELECT * FROM users WHERE (username LIKE '%"+doudouke+"%' or name LIKE '%"+doudouke+
                        "%' OR realname LIKE '%"+doudouke+"%' OR phone LIKE '%"+doudouke+"%' or cardid LIKE '%"+doudouke+"%') and userflag=1";
                if (page == 1) {
                    sql2 = "SELECT * FROM users WHERE (username LIKE '%" + doudouke + "%' or name LIKE '%" + doudouke +
                            "%' OR realname LIKE '%" + doudouke + "%'  OR phone LIKE '%" + doudouke + "%' or cardid LIKE '%" + doudouke + "%') and userflag=1 limit 0,"+pageSize;
                }else if (page == 0){
                    sql2 = sql;
                }else {
                    sql2 = "SELECT * FROM users WHERE (username LIKE '%" + doudouke + "%' or name LIKE '%" + doudouke +
                            "%' OR realname LIKE '%" + doudouke + "%'  OR phone LIKE '%" + doudouke + "%' or cardid LIKE '%" + doudouke + "%') and userflag=1 limit "+(page-1)*pageSize+","+pageSize;
                }
            }
            PageResult<User> pageResult = new PageResult<User>();
            List<User> list = userService.findByDataSQL(sql);
            if (list != null){
                pageResult.setTotal(list.size());
            }else {
                pageResult.setTotal(0);
            }
            List<User> listObject = userService.findByDataSQL(sql2);
            pageResult.setResult(listObject);
            pageResult.setPage(page);
            pageResult.setPagesize(pageSize);
            return pageResult;
        }else {
            PageResult<User> pageResult = userService.findByOneField(page, pageSize,
                    "userFlag", 1, true, "username", Model);
            return pageResult;
        }
    }
    @RequestMapping(value = "CommonUser/{page}/{pageSize}")
    @PermissionInfo(name = "普通用户列表", module = "后台管理-用户管理")
    public PageResult<User> CommonUser(HttpServletRequest request,@PathVariable int page,@PathVariable int pageSize, User Model){
        String doudouke = request.getParameter("searchName");
        if (doudouke != null){
            String sql = "";
            String sql2 ="";
            System.out.println(doudouke);
            if (doudouke.equals("男")){
                sql = "SELECT * FROM users WHERE (username LIKE '%"+doudouke+"%' or name LIKE '%"+doudouke+
                        "%' OR realname LIKE '%"+doudouke+"%' OR sex = 1 OR phone LIKE '%"+doudouke+"%' or cardid LIKE '%"+doudouke+"%') and userflag=2";
                if (page == 1) {
                    sql2 = "SELECT * FROM users WHERE (username LIKE '%" + doudouke + "%' or name LIKE '%" + doudouke +
                            "%' OR realname LIKE '%" + doudouke + "%' OR sex = 1 OR phone LIKE '%" + doudouke + "%' or cardid LIKE '%" + doudouke + "%') and userflag=2 limit 0,"+pageSize;
                }else if (page == 0){
                    sql2 = sql;
                }else {
                    sql2 = "SELECT * FROM users WHERE (username LIKE '%" + doudouke + "%' or name LIKE '%" + doudouke +
                            "%' OR realname LIKE '%" + doudouke + "%' OR sex = 1 OR phone LIKE '%" + doudouke + "%' or cardid LIKE '%" + doudouke + "%') and userflag=2 limit "+(page-1)*pageSize+","+pageSize;
                }
            }else if (doudouke.equals("女")){
                sql = "SELECT * FROM users WHERE (username LIKE '%"+doudouke+"%' or name LIKE '%"+doudouke+
                        "%' OR realname LIKE '%"+doudouke+"%' OR sex = 2 OR phone LIKE '%"+doudouke+"%' or cardid LIKE '%"+doudouke+"%') and userflag=2";
                if (page == 1) {
                    sql2 = "SELECT * FROM users WHERE (username LIKE '%" + doudouke + "%' or name LIKE '%" + doudouke +
                            "%' OR realname LIKE '%" + doudouke + "%' OR sex = 2 OR phone LIKE '%" + doudouke + "%' or cardid LIKE '%" + doudouke + "%') and userflag=2 limit 0,"+pageSize;
                }else if (page == 0){
                    sql2 = sql;
                }else {
                    sql2 = "SELECT * FROM users WHERE (username LIKE '%" + doudouke + "%' or name LIKE '%" + doudouke +
                            "%' OR realname LIKE '%" + doudouke + "%' OR sex = 2 OR phone LIKE '%" + doudouke + "%' or cardid LIKE '%" + doudouke + "%') and userflag=2 limit "+(page-1)*pageSize+","+pageSize;
                }
            }else {
                sql = "SELECT * FROM users WHERE (username LIKE '%"+doudouke+"%' or name LIKE '%"+doudouke+
                        "%' OR realname LIKE '%"+doudouke+"%' OR phone LIKE '%"+doudouke+"%' or cardid LIKE '%"+doudouke+"%') and userflag=2";
                if (page == 1) {
                    sql2 = "SELECT * FROM users WHERE (username LIKE '%" + doudouke + "%' or name LIKE '%" + doudouke +
                            "%' OR realname LIKE '%" + doudouke + "%'  OR phone LIKE '%" + doudouke + "%' or cardid LIKE '%" + doudouke + "%') and userflag=2 limit 0,"+pageSize;
                }else if (page == 0){
                    sql2 = sql;
                }else {
                    sql2 = "SELECT * FROM users WHERE (username LIKE '%" + doudouke + "%' or name LIKE '%" + doudouke +
                            "%' OR realname LIKE '%" + doudouke + "%'  OR phone LIKE '%" + doudouke + "%' or cardid LIKE '%" + doudouke + "%') and userflag=2 limit "+(page-1)*pageSize+","+pageSize;
                }
            }
            PageResult<User> pageResult = new PageResult<User>();
            List<User> list = userService.findByDataSQL(sql);
            if (list != null){
                pageResult.setTotal(list.size());
            }else {
                pageResult.setTotal(0);
            }
            List<User> listObject = userService.findByDataSQL(sql2);
            pageResult.setResult(listObject);
            pageResult.setPage(page);
            pageResult.setPagesize(pageSize);
            return pageResult;
        }else {
            PageResult<User> pageResult = userService.findByOneField(page, pageSize,
                    "userFlag", 2, true, "username", Model);
            return pageResult;
        }
    }

    @RequestMapping(value = "EnterpriseBind/Delete/{username}/{enterpriseid}")
    @PermissionInfo(name = "企业管理员删除内部用户", module = "企业管理-用户管理")
    public ResultMessage DeleteEnterpriseBind(@PathVariable String username,@PathVariable int enterpriseid) throws MyException {
        String currentUser = getUserName();
        if (!currentUser.equals("anonymousUser")) {
            if (!currentUser.equals(username)) {
                String sql = "select u.* from users as u where u.username = '" + username + "' and u.enterpriseid = " + enterpriseid;
                List<User> list = userService.findByDataSQL(sql);
                if (list != null) {
                    if (0 < list.size()) {
                        User user = list.get(0);
                        user.setEnterprise(null);
                        boolean rst = userService.update(user);
                        String dsql = "delete from user_enterprise_applyinfo where username = '" + username + "' and enterpriseid = " + enterpriseid;
                        rst = userEnterpriseApplyInfoService.execDataSql(dsql);
                        if (rst) {
                            Noticfication noticfication = new Noticfication();
                            noticfication.setAuthor(currentUser);
                            noticfication.setAccepter(username);
                            noticfication.setContent(ConstClass.EnterpriseRootNo);
                            noticfication.setCreateTime(new Date());
                            noticfication.setTitle(ConstClass.EnterpriseDeleteInfo);
                            noticfication.setReadStatus(1);
                            notificationService.save(noticfication);
                            return Msg(true, ConstClass.OperationSuccess);
                        } else {
                            return Msg(false, ConstClass.OperationFault);
                        }
                    } else {
                        return Msg(false, ConstClass.DataError);
                    }
                } else {
                    return Msg(false, ConstClass.DataError);
                }
            }else {
                throw new MyException("不能删除自己");
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }

    @RequestMapping(value = "IsBindEnterprise")
    @PermissionInfo(name = "用户是否绑定企业", module = "企业管理-用户管理")
    public ResultMessage IsBindEnterprise(HttpServletRequest request){
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            String sql = "select u.* from users as u where u.username = '" + username + "' and u.enterpriseid != 'NULL'";
            List<User> list = userService.findByDataSQL(sql);
            if (list != null) {
                if (0 < list.size()) {
                    return Msg(true, ConstClass.BindStatusOk);
                }else {
                    String sql2 = "select ueai.* from user_enterprise_applyinfo as ueai where ueai.username='"+username+"'";
                    List<UserEnterpriseApplyInfo> userEnterpriseApplyInfos = userEnterpriseApplyInfoService.findByDataSQL(sql2);
                    int flag = 0;
                    if (userEnterpriseApplyInfos != null) {
                        if (0 < userEnterpriseApplyInfos.size()) {
                            for (int i = 0;i < userEnterpriseApplyInfos.size();i++){
                                if (userEnterpriseApplyInfos.get(i).getApplyFlag() == 1) {
                                    flag = 1;
                                }
                            }
                        }
                    }
                    if (flag == 1){
                        return Msg(false, "审核中");
                    }else {
                        return Msg(false, ConstClass.BindStatusNo);
                    }
                }
            } else {
                String sql2 = "select ueai.* from user_enterprise_applyinfo as ueai where ueai.username='"+username+"'";
                List<UserEnterpriseApplyInfo> userEnterpriseApplyInfos = userEnterpriseApplyInfoService.findByDataSQL(sql2);
                int flag = 0;
                if (userEnterpriseApplyInfos != null) {
                    if (0 < userEnterpriseApplyInfos.size()) {
                        for (int i = 0;i < userEnterpriseApplyInfos.size();i++){
                            if (userEnterpriseApplyInfos.get(i).getApplyFlag() == 1) {
                                flag = 1;
                            }
                        }
                    }
                }
                if (flag == 1){
                    return Msg(false, "审核中");
                }else {
                    return Msg(false, ConstClass.BindStatusNo);
                }
            }
        }else{
            return Msg(false,ConstClass.LoginTimeOut);
        }
    }

    @RequestMapping(value = "TotalUser")
    @PermissionInfo(name = "所有注册用户数", module = "前台-数据统计")
    public ResultMessage TotalUser(){
        String sql =  "select count(*) from users as u where userflag = 2";
        int count = userService.getCountBySQL(sql);
        return Msg(true,String.valueOf(count));
    }
    @RequestMapping(value = "MonthUser")
    @PermissionInfo(name = "本月注册用户数", module = "前台-数据统计")
    public ResultMessage MonthUser(){
        Date nowDate = new Date();
        SimpleDateFormat dateformat = new SimpleDateFormat("yyyy-MM");
        String dateString = dateformat.format(nowDate);
        String[] dataStringArray = dateString.split("-");
        System.out.println(dataStringArray[0]);
        String begin = dataStringArray[0]+"-"+dataStringArray[1]+"-01"+" 00:00:00";
        String end = "";
        if (dataStringArray[1].equals("12")){
            end = String.valueOf((Integer.parseInt(dataStringArray[0]) + 1))+"-01-01 00:00:00";
        }else {
            end = dataStringArray[0]+"-"+String.valueOf(Integer.parseInt(dataStringArray[1])+1)+"-01"+" 00:00:00";
        }
        String sql =  "select count(*) from users as u where userflag = 2 and u.create_date >= '"+begin + "' and u.create_date < '"+end+"'";
        int count = userService.getCountBySQL(sql);
        return Msg(true,String.valueOf(count));
    }
    @RequestMapping(value = "TodayUser")
    @PermissionInfo(name = "今日注册用户数", module = "前台-数据统计")
    public ResultMessage TodayUser(){
        Date nowDate = new Date();
        SimpleDateFormat dateformat = new SimpleDateFormat("yyyy-MM-dd");
        String dateString = dateformat.format(nowDate);
        String[] dataStringArray = dateString.split("-");
        System.out.println(dataStringArray[0]);
        String begin = dataStringArray[0]+"-"+dataStringArray[1]+"-"+dataStringArray[2]+" 00:00:00";
        String end = dataStringArray[0]+"-"+dataStringArray[1]+"-"+dataStringArray[2]+" 23:59:59";
        String sql =  "select count(*) from users as u where userflag = 2 and u.create_date >= '"+begin + "' and u.create_date < '"+end+"'";
        int count = userService.getCountBySQL(sql);
        return Msg(true,String.valueOf(count));
    }

    @RequestMapping(value = "StatisticsData")
    @PermissionInfo(name = "统计注册用户数据", module = "后台-数据统计")
    public StatisticsData StatisticsData(HttpServletRequest request){
        String beginDate = request.getParameter("beginDate");
        String endDate = request.getParameter("endDate");
        String flag = request.getParameter("flag");
        StatisticsData statisticsData = new StatisticsData();
       /*String a = "SELECT group_concat(dt) AS DATE,group_concat(count) AS COUNT \n" +
               "FROM ( \n" +
               "select CONCAT(u1.date) AS dt,ifnull(count,0) as count  \n" +
               "FROM time_dimension u1 \n" +
               "left join (SELECT DATE_FORMAT(create_date,'%Y-%m-%d') AS dt,COUNT(*) AS count FROM users \n" +
               "WHERE create_date > '2015-06-09 00:00:00' AND create_date < '2015-12-31 00:00:00' \n" +
               "GROUP BY DATE_FORMAT(create_date,'%Y-%m-%d') ) u2 on u1.date= u2.dt \n" +
               "where u1.date > '2015-06-09 00:00:00' and u1.date < '2015-12-31 00:00:00'\n" +
               "GROUP BY u1.date\n" +
               ") BB ";*/
        String sql = "";
        if (flag.equals("d")){
            sql = "SELECT group_concat(dt) AS DATE,group_concat(count) AS COUNT \n" +
                    "FROM ( \n" +
                    "select CONCAT(u1.date) AS dt,ifnull(count,0) as count  \n" +
                    "FROM time_dimension u1 \n" +
                    "left join (SELECT DATE_FORMAT(create_date,'%Y-%m-%d') AS dt,COUNT(*) AS count FROM users \n" +
                    "WHERE userflag = 2 and  create_date >= '"+beginDate+" 00:00:00' AND create_date <= '"+endDate+" 23:59:59' \n" +
                    "GROUP BY DATE_FORMAT(create_date,'%Y-%m-%d') ) u2 on u1.date= u2.dt \n" +
                    "where u1.date >= '"+beginDate+" 00:00:00' and u1.date <= '"+endDate+" 23:59:59'\n" +
                    "GROUP BY u1.date\n" +
                    ") BB ";
        }else {
            sql = "SELECT   group_concat(dt) AS DATE,group_concat(count) AS COUNT \n" +
                    "FROM ( \n" +
                    "select  distinct CONCAT(DATE_FORMAT(u1.date,'%Y-%m') ) AS dt,ifnull(count,0) as count  \n" +
                    "FROM time_dimension u1 \n" +
                    "left join (SELECT DATE_FORMAT(create_date,'%Y-%m') AS dt,COUNT(*) AS count FROM users \n" +
                    "WHERE userflag = 2 and create_date >= '"+beginDate+" 00:00:00' AND create_date <= '"+endDate+" 23:59:59' \n" +
                    "GROUP BY DATE_FORMAT(create_date,'%Y-%m') ) u2 on DATE_FORMAT(u1.date,'%Y-%m') = u2.dt \n" +
                    "where u1.date >= '"+beginDate+" 00:00:00' and u1.date <= '"+endDate+" 23:59:59'\n" +
                    "GROUP BY u1.date\n" +
                    ") BB ";
        }
        List<Object[]> list = userService.findByCustomerSQL(sql);
        DataAndType dataAndType1 = new DataAndType();
        DataAndType dataAndType2 = new DataAndType();
        String[] s1 = String.valueOf(list.get(0)[0]).split(",");
        String[] s2 = String.valueOf(list.get(0)[1]).split(",");
        List<String> stringList1 = new ArrayList<String>();
        List<String> stringList2 = new ArrayList<String>();
        for (int i = 0;i < s1.length;i++){
            stringList1.add(s1[i]);
            stringList2.add(s2[i]);
        }
        dataAndType1.setData(stringList1);
        dataAndType2.setData(stringList2);
        List<DataAndType> list1 = new ArrayList<DataAndType>();
        List<DataAndType> list2 = new ArrayList<DataAndType>();
        list1.add(dataAndType1);
        list2.add(dataAndType2);
        statisticsData.setxAxis(list1);
        statisticsData.setSeries(list2);
        return statisticsData;
    }

    @RequestMapping(value = "ForgetPasswordStepOne")
    @PermissionInfo(name = "普通用户忘记密码第一步", module = "前台-会员中心")
    public ResultMessage ForgetPasswordStepOne(HttpServletRequest request) throws MyException {
        String username = request.getParameter("username");
        String code = request.getParameter("code");
        User user = userService.getbyId(username);
        if(user==null){
            user = userService.getbyId("hz"+username);
        }
        if (user==null){
            List<User> users = this.userDao.queryUserByMobile(username);
            if (users.size()>0){
                user = users.get(0);
            }
        }
        if (user != null) {
            String phone = user.getPhone();
            String sessionCode = getSessionCode(request, "VALIDATE_PHONE_CODE");
            String sessionPhone = getSessionCode(request, "VALIDATE_PHONE");
            if (code.equals(sessionCode) && phone.equals(sessionPhone)) {
                return Msg(true, "success");
            } else {
                return Msg(false, "验证码错误");
            }
        }else {
            throw new MyException(ConstClass.NoUser);
        }
    }
    @RequestMapping(value = "ForgetPasswordStepTwo")
    @PermissionInfo(name = "普通用户忘记密码第二步", module = "前台-会员中心")
    public ResultMessage ForgetPasswordStepTwo(HttpServletRequest request){
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String vcode = request.getParameter("vcode");

        User user = userService.getbyId(username);
        if(user==null){
            user = userService.getbyId("hz"+username);
        }
        if (user==null){
            List<User> users = this.userDao.queryUserByMobile(username);
            if (users.size()>0){
                user = users.get(0);
            }
        }

        if (user==null){
            return Msg(true,"无此用户信息");
        }

        username = user.getUsername();

        String sessionCode = getSessionCode(request, "VALIDATE_PHONE_CODE");
        if (!vcode.equals(sessionCode)){
            return Msg(false, "验证码错误");
        }
        boolean rst = userService.ChangePassword(username,password);
        if (rst){
            return Msg(true,"修改成功");
        }else {
            rst = userService.ChangePassword("hz"+username,password);
            if(rst){
                return Msg(true,"修改成功");
            }
            return Msg(false,"修改失败");
        }
    }

    @RequestMapping(value = "LeaveEnterprise")
    @PermissionInfo(name = "企业内部用户离开企业", module = "前台-会员中心")
    public ResultMessage LeaveEnterprise(HttpServletRequest request){
        String username = getUserName();
        if (!username.equals("anonymousUser")){
            User user = userService.getbyId(username);
            if (user != null){
                if (user.getEnterpriseRoot() != 2) {
                    user.setEnterprise(null);
                    boolean rst = userService.update(user);
                    if (rst) {
                        return Msg(true, "成功离开企业");
                    } else {
                        return Msg(false, "离开企业失败");
                    }
                }else {
                    return Msg(false,"您是该企业的管理者无法离开");
                }
            }else {
                return Msg(false,ConstClass.UnknownError);
            }
        }else {
            return Msg(false,ConstClass.LoginTimeOut);
        }
    }

    @RequestMapping(value = "SendCode/{username}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "发送短信验证码", module = "公共-用户注册")
    public ResultMessage sendCode(@PathVariable String username, HttpServletRequest request){
        User user = userService.getbyId(username);
        if (user==null){
            List<User> users = this.userDao.queryUserByMobile(username);
            if (users.size()>0){
                user = users.get(0);
            }
        }
        if (user != null){
            StringBuilder code = new StringBuilder();
            Random random = new Random();
            //6位验证码
            for(int i = 0;i < 6;i++){
                code.append(String.valueOf(random.nextInt(10)));
            }
            HttpSession session = request.getSession();
            session.setAttribute(VALIDATE_PHONE,user.getPhone());
            session.setAttribute(VALIDATE_PHONE_CODE,code.toString());
            session.setAttribute(SEND_CODE_TIME,new Date().getTime());
            String sendMessage = "验证码为:"+code+"，请在页面中输入以完成验证！";
            try{
                boolean rst = SendToMessage(user.getPhone(), sendMessage);
                if (rst){
                    return Msg(true, "验证码已发送");
                }else{
                    return Msg(false, "验证码发送失败");
                }
            }catch (UnsupportedEncodingException e){
                e.printStackTrace();
                return Msg(false, "验证码发送失败");
            }
        }else {
            return Msg(false,ConstClass.NoUser);
        }

    }

    @RequestMapping(value = "MyInfo", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "个人信息", module = "前台-用户管理")
    public User MyInfo(HttpServletRequest request,HttpServletResponse response) throws MyException {
        String username = getUserName();
        if (username != null ) {
            User model = userService.getbyId(username);
            if(model == null){
                throw new MyException(ConstClass.LoginTimeOut);
            }else {
                response.setHeader("Cache-Control","no-cache");
                return model;
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }

    /**
     * 通过角色返回用户列表
     *
     * @return
     */
    @RequestMapping(value = "getUserByRoleName")
    public List<User> getUserByRoleName(HttpServletResponse response,HttpServletRequest request) throws MyException {
        String roleName = request.getParameter("roleName");
        if (roleName != null){
            StringBuffer sb = new StringBuffer();
            String[] roleNameArray = roleName.split(",");

            for (int i = 0;i < roleNameArray.length;i++){
                sb.append("\'"+roleNameArray[i]+"\',");
            }
            sb.deleteCharAt(sb.length()-1);
            String sql = "SELECT DISTINCT u.* FROM users as u LEFT JOIN role_user as ru on ru.username = u.username WHERE ru.rolename in (" + sb +") and u.deleteflag > 0";
            List<User> list = userService.findByDataSQL(sql);
            return list;
        }else {
            response.setStatus(404);
            throw new MyException("未传roleName");
        }
    }
    @RequestMapping(value = "IsEnterpriseAdminUser", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "是否为企业管理员", module = "前台-用户管理")
    public ResultMessage IsEnterpriseAdminUser(HttpServletRequest request) throws MyException {
        String username = getUserName();
        if (!username.equals("anonymousUser")) {
            User model = userService.getbyId(username);
            if (model.getEnterpriseRoot() == 2){
                return Msg(true,"是企业管理员");
            }else {
                return Msg(false,"不是企业管理员");
            }
        }else {
            throw new MyException(ConstClass.LoginTimeOut);
        }
    }
    /**
     * 判断是否超过上传文件大小限制
     *
     * @param fileSize
     * @return
     */
    private boolean isMax(long fileSize) {
        if (fileSize > FILE_MAX_SIZE) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * 是否为图像文件
     *
     * @param suffix
     * @return
     */
    private boolean isPic(String suffix) {
        suffix = suffix.toLowerCase();
        return Arrays.asList(FILE_TYPE).contains(suffix);
    }

    @RequestMapping(value = "IsUsernameUsed/Edit/{Username}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "用户查看", module = "后台-用户管理")
    public ResultMessage IsUsernameUsed(@PathVariable String Username) {
        PageResult<User> models = userService.findByOneField(0,0,"username",Username,true,"username");
        if (0 < models.getTotal()){
            return Msg(true,"已注册");
        }else {
            return Msg(false,"未注册");
        }
    }

    @RequestMapping(value = "IsCompleteInfo", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "用户查看", module = "后台-用户管理")
    public ResultMessage IsCompleteInfo() {
        if ("ok".equals(isUserInfoComplete())){
            return Msg(true,"已完善人资料");
        }else {
            return Msg(false,isUserInfoComplete());
        }
    }

    @RequestMapping(value = "MobileUserNumber", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "移动端用户注册数", module = "后台-用户管理")
    public ResultMessage MobileUserNumber() {
        String sql = "select * from users where username like 'hz%'";
        List<User> list = userService.findByDataSQL(sql);
        return Msg(true,String.valueOf(list.size()));
    }
}