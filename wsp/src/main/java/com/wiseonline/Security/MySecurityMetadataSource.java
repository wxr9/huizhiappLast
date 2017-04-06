package com.wiseonline.Security;

import com.wiseonline.Dao.BaseDao;
import com.wiseonline.Dao.PermissionDao;
import com.wiseonline.Domain.Permission;
import com.wiseonline.Domain.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.access.SecurityConfig;
import org.springframework.security.web.FilterInvocation;
import org.springframework.security.web.access.intercept.FilterInvocationSecurityMetadataSource;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


/**
 * 加载资源与权限的对应关系
 *
 * */
@Service
public class MySecurityMetadataSource implements FilterInvocationSecurityMetadataSource {
	@Autowired
	private BaseDao baseDao;
	@Autowired
	private PermissionDao permissionDao;
	private static Map<String, Collection<ConfigAttribute>> resourceMap = null;

	public Collection<ConfigAttribute> getAllConfigAttributes() {
		return null;
	}

	public boolean supports(Class<?> clazz) {
		return true;
	}

	private static final String ROLE_PATTER = "ROLE_%s";
	private String formatRole(String m){
		return String.format(ROLE_PATTER, m.toUpperCase());
	}
	/**
	 * @PostConstruct是Java EE 5引入的注解，
	 * Spring允许开发者在受管Bean中使用它。当DI容器实例化当前受管Bean时，
	 * @PostConstruct注解的方法会被自动触发，从而完成一些初始化工作，
	 * 
	 * //加载所有资源与权限的关系
	 */
	@PostConstruct
	private void loadResourceDefine() {
//		System.err.println("-----------MySecurityMetadataSource loadResourceDefine ----------- ");
		if (resourceMap == null) {
			resourceMap = new HashMap<String, Collection<ConfigAttribute>>();
			List<Permission> resources = this.permissionDao.findAll();
			for (Permission resource : resources) {
//				String sql = "SELECT rolename FROM `role_permission` WHERE permissionid="+resource.getObjectid();
//				List<String> roles = baseDao.findByCustomerSQL(sql);

				Collection<ConfigAttribute> configAttributes = new ArrayList<ConfigAttribute>();
				for(Role role : resource.getRoleList()){
					// TODO:ZZQ 通过资源名称来表示具体的权限 注意：必须"ROLE_"开头
					// 关联代码：applicationContext-security.xml
					// 关联代码：com.huaxin.security.MyUserDetailServiceImpl#obtionGrantedAuthorities
					ConfigAttribute configAttribute = new SecurityConfig(formatRole(role.getRolename()));
					configAttributes.add(configAttribute);
				}
				resourceMap.put(resource.getUrl(), configAttributes);
			}
		}
		return;
	}
	//返回所请求资源所需要的权限
	public Collection<ConfigAttribute> getAttributes(Object object) throws IllegalArgumentException {
//		System.err.println("-----------MySecurityMetadataSource getAttributes ----------- ");
		String requestUrl = ((FilterInvocation) object).getRequestUrl();
	//	System.out.println("requestUrl is " + requestUrl);
		if(resourceMap == null) {
			loadResourceDefine();
		}
		//System.err.println("resourceMap.get(requestUrl); "+resourceMap.get(requestUrl));
		if(requestUrl.indexOf("?")>-1){
			requestUrl=requestUrl.substring(0,requestUrl.indexOf("?"));
		}

		String regxPage = "(/[-]{0,1}[0-9]{1,}){0,3}[/]{0,1}$";
		Pattern patternPage = Pattern.compile(regxPage);
		Matcher matcherPage = patternPage.matcher(requestUrl);
		String ret[] = {};
		if(matcherPage.find()){
			System.out.println("match regxPage");
			ret = patternPage.split(requestUrl);
		}


		String regxEdit = "/Edit/[0-9]{1,}[/]{0,1}$";
		Pattern patternEdit = Pattern.compile(regxEdit);
		Matcher matcherEdit = patternEdit.matcher(requestUrl);
		if(matcherEdit.find()){
			System.out.println("match regxEdit");
			ret = patternEdit.split(requestUrl);
			ret[0] += "/Edit";
		}

		String regxDelete = "/Delete(/[a-zA-Z0-9]{1,})*$";
		Pattern patternDelete = Pattern.compile(regxDelete);
		Matcher matcherDelete = patternDelete.matcher(requestUrl);
		if(matcherDelete.find()){
			System.out.println("match regxDelete");
			ret = patternDelete.split(requestUrl);
			ret[0] += "/Delete";
		}

		String regxSend = "/SendCode/[a-zA-Z0-9_]*$";
		Pattern patternSend = Pattern.compile(regxSend);
		Matcher matcherSend = patternSend.matcher(requestUrl);
		if(matcherSend.find()){
			System.out.println("match regxSend");
			ret = patternSend.split(requestUrl);
			ret[0] += "/SendCode";
		}


		Collection<ConfigAttribute> configAttributes;
		if(ret.length==0){
			configAttributes = resourceMap.get(requestUrl);
		}
		else
		{
			configAttributes = resourceMap.get(ret[0]);
		}


		if(configAttributes == null || configAttributes.size()==0){
			Collection<ConfigAttribute> returnCollection = new ArrayList<ConfigAttribute>();
			 returnCollection.add(new SecurityConfig("ROLE_NO_USER"));
			return returnCollection;
		}
		return configAttributes;
	}


}