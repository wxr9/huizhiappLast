package test.com.wiseonline.Utils; 

import com.wiseonline.Domain.LoginLog;
import com.wiseonline.Service.LoginLogService;
import com.wiseonline.Utils.ExportExcel;
import org.junit.Test;
import org.junit.Before; 
import org.junit.After;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import test.com.wiseonline.Controller.common.BasicWebTest;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/** 
* ExportExcel Tester. 
* 
* @author <Authors name> 
* @since <pre>Apr 8, 2016</pre> 
* @version 1.0 
*/ 
public class ExportExcelTest extends BasicWebTest {
@Autowired
    LoginLogService loginLogService;


@Before
public void before() throws Exception { 
} 

@After
public void after() throws Exception { 
} 

/** 
* 
* Method: exportExcel(HttpServletResponse response, String fileName, String[] Title, List<Object> listContent) 
* 
*/ 
@Test
public void testExportExcel() throws Exception {
    String[] Title={"机构ID","会员编号","类别","名称","省ID","省名称","城市ID","城市名称","详细地址","联系人","性别","联系手机","联系电话","传真","邮箱","QQ","生日","积分","客户等级","现金账户余额","结算方式","客户类型","购买次数","购买支数","创建人ID","创建人姓名","create_time","del","STS","备注","负责人ID","负责人姓名","审核标识","审核人ID ","审核人姓名","审核日期","分配人ID","分配人姓名","分配日期","修改人ID","修改人姓名  ","修改时间"};
    List<LoginLog> llist = new ArrayList<LoginLog>();
    for (int i=0;i<10;i++){
        LoginLog ll = new LoginLog();
        ll.setBrowser("chrome");
        ll.setIpAddr("127.0.0.1");
        ll.setStatus("success");
        ll.setUserName("admin");
        ll.setId(i);
        llist.add(ll);
    }
    ExportExcel.exportExcel(new MockHttpServletResponse(),"test.xls",Title,llist);
} 


} 
