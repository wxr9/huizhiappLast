package com.wiseonline.Controller.Setting;
import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.Permission;
import com.wiseonline.Service.Impl.PermissionServiceImpl;
import com.wiseonline.Utils.*;
import org.springframework.beans.factory.BeanFactoryUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerMapping;
import org.springframework.web.servlet.mvc.condition.PatternsRequestCondition;
import org.springframework.web.servlet.mvc.condition.RequestMethodsRequestCondition;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import java.util.*;
/**
 * Created by yanwj on 2015/11/6.
 */
@RestController
@RequestMapping("/Setting/User/Permission")
public class PermissionController extends BaseController {
    @Autowired
    PermissionServiceImpl permissionService;

    @RequestMapping(value = "/List/{page}/{pageSize}", method = RequestMethod.GET, headers = "Accept=application/json")
    @PermissionInfo(name = "查看权限", module = "后台-权限管理")
    public PageResult<Permission> getAll(@PathVariable int page,
                                         @PathVariable int pageSize, Permission Model,HttpServletRequest request) {
        String doudouke = request.getParameter("searchName");
        String sql = "";
        String sql2 ="";
        if (doudouke != null){
            sql = "SELECT * FROM permissions WHERE name LIKE '%"+doudouke+"%'";
            if (page == 1){
                sql2 = "SELECT * FROM permissions WHERE name LIKE '%"+doudouke+"%' limit 0,"+pageSize;
            }else if (page == 0){
                sql2 = sql;
            }else {
                sql2 = "SELECT * FROM permissions WHERE name LIKE '%"+doudouke+"%' limit "+(page-1)*pageSize+","+pageSize;
            }
        }else {
            sql = "SELECT * FROM permissions";
            if (page == 1){
                sql2 = "SELECT * FROM permissions limit 0,"+pageSize;
            }else if (page == 0){
                sql2 = sql;
            }else {
                sql2 = "SELECT * FROM permissions limit "+(page-1)*pageSize+","+pageSize;
            }
        }
        PageResult<Permission> pageResult = new PageResult<Permission>();
        List<Permission> list = permissionService.findByDataSQL(sql);
        if (list != null) {
            pageResult.setTotal(list.size());
        }else {
            pageResult.setTotal(0);
        }
        List<Permission> listObject = permissionService.findByDataSQL(sql2);
        pageResult.setResult(listObject);
        pageResult.setPage(0);
        pageResult.setPagesize(pageSize);
        return pageResult;
    }

    @RequestMapping(value = "Add", method = RequestMethod.POST)
    public ResultMessage Add(Permission Model) {
        if (permissionService.IsExistName("name", Model.getName(), 0)) {
            return Msg(false, "权限名称已重复");
        } else {
            boolean rst = permissionService.save(Model);
            if (rst) {
                return Msg(true, ConstClass.ResultSaveSuccess);
            } else {
                return Msg(false, ConstClass.ResultSaveFault);
            }
        }
    }

    @RequestMapping(value = "Edit/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
    public Permission Edit(@PathVariable int id) {
        Permission model = permissionService.getbyId(id);
        return model;
    }

    @RequestMapping(value = "Update", method = RequestMethod.POST)
    public ResultMessage Update(Permission Model) {
        if (permissionService.IsExistName("name", Model.getName(),
                Model.getObjectid())) {
            return Msg(false, "权限名称已重复");
        } else {
            boolean rst = permissionService.saveOrUpdate(Model);
            if (rst) {
                return Msg(true, ConstClass.ResultSaveSuccess);
            } else {
                return Msg(false, ConstClass.ResultSaveFault);
            }
        }
    }

    @RequestMapping(value = "Delete/{id}", method = RequestMethod.GET)
    public ResultMessage Delete(@PathVariable int id) {
        boolean rst = permissionService.delete(id);
        if (rst) {
            return Msg(true, ConstClass.ResultDeleteSuccess);
        } else {
            return Msg(false, ConstClass.ResultDeleteFault);
        }
    }

    /**
     * 获取可选权限
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "GetPermissionList", method = RequestMethod.GET, headers = "Accept=application/json")
    public List<RequestToMethod> GetPermissionList(HttpServletRequest request) {
        ServletContext servletContext = request.getSession()
                .getServletContext();
        if (servletContext == null) {
            return null;
        }
        WebApplicationContext appContext = WebApplicationContextUtils
                .getWebApplicationContext(servletContext);
        // 请求url和处理方法的映射
        List<RequestToMethod> requestToMethodItemList = new ArrayList<RequestToMethod>();
        // 获取所有的RequestMapping
        Map<String, HandlerMapping> allRequestMappings = BeanFactoryUtils
                .beansOfTypeIncludingAncestors(appContext,
                        HandlerMapping.class, true, false);
        // 数据库权限
        List<Permission> permissionList = permissionService.findAll();
        Map<String, Permission> mp = new HashMap<String, Permission>();
        for (Permission p : permissionList) {
            mp.put(p.getUrl(), p);
        }

        // handlerMapping
        for (HandlerMapping handlerMapping : allRequestMappings.values()) {
            // 本项目只需要RequestMappingHandlerMapping中的URL映射
            if (handlerMapping instanceof RequestMappingHandlerMapping) {
                RequestMappingHandlerMapping requestMappingHandlerMapping = (RequestMappingHandlerMapping) handlerMapping;
                Map<RequestMappingInfo, HandlerMethod> handlerMethods = requestMappingHandlerMapping
                        .getHandlerMethods();
                for (Map.Entry<RequestMappingInfo, HandlerMethod> requestMappingInfoHandlerMethodEntry : handlerMethods
                        .entrySet()) {
                    RequestMappingInfo requestMappingInfo = requestMappingInfoHandlerMethodEntry
                            .getKey();
                    HandlerMethod mappingInfoValue = requestMappingInfoHandlerMethodEntry
                            .getValue();

                    PermissionInfo pi = mappingInfoValue
                            .getMethodAnnotation(PermissionInfo.class);

                    if (pi != null) {
                        PatternsRequestCondition patternsCondition = requestMappingInfo
                                .getPatternsCondition();
                        String requestUrl = patternsCondition.getPatterns()
                                .iterator().next();

                        if (mp.get(requestUrl) == null) {

                            RequestMethodsRequestCondition methodCondition = requestMappingInfo
                                    .getMethodsCondition();

                            String requestType = "";
                            Set<RequestMethod> type = methodCondition
                                    .getMethods();
                            if (!type.isEmpty()) {
                                requestType = methodCondition.getMethods()
                                        .iterator().next().name();
                            }

                            String permissionName = "";
                            String permissionModule = "";

                            permissionName = pi.name();
                            permissionModule = pi.module();

                            String controllerName = mappingInfoValue
                                    .getBeanType().toString();
                            String requestMethodName = mappingInfoValue
                                    .getMethod().getName();
                            Class<?>[] methodParamTypes = mappingInfoValue
                                    .getMethod().getParameterTypes();
                            RequestToMethod item = new RequestToMethod(
                                    requestUrl, requestType, controllerName,
                                    requestMethodName, methodParamTypes,
                                    permissionName, permissionModule);
                            /*Permission permission = new Permission();
                            permission.setMemo(permissionModule);
                            permission.setName(permissionName);
                            permission.setUrl(requestUrl);
                            permissionService.save(permission);*/
                            requestToMethodItemList.add(item);
                        }
                    }
                }
                break;
            }
        }
        return requestToMethodItemList;
    }
}
