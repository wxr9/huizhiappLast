package test.com.wiseonline.Controller.HuizhiCard; 

import org.junit.Test; 
import org.junit.Before; 
import org.junit.After;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import test.com.wiseonline.Controller.common.BasicWebTest;

/** 
* HuizhiPayController Tester. 
* 
* @author <Authors name> 
* @since <pre>Apr 1, 2016</pre> 
* @version 1.0 
*/ 
public class HuizhiPayControllerTest extends BasicWebTest {

@Before
public void before() throws Exception { 
} 

@After
public void after() throws Exception { 
} 

/** 
* 
* Method: QueryBindCard(HttpServletRequest request, HttpServletResponse response) 
* 
*/ 
@Test
public void testQueryBindCard() throws Exception {
    mvc.perform(MockMvcRequestBuilders.post("/Payment/BindCard")
            .param("password","")
            .param("queryFlag","0")
    )
            .andExpect(MockMvcResultMatchers.status().isOk());
} 

/** 
* 
* Method: QueryTransaction(HttpServletRequest request, HttpServletResponse response) 
* 
*/ 
@Test
public void testQueryTransaction() throws Exception {
    mvc.perform(MockMvcRequestBuilders.post("/Payment/QueryTransaction")
            .param("queryNum","3")
            .param("startDate","20150330")
            .param("startTime","100000")
            .param("endDate","20160330")
            .param("endTime","100000")
            .param("tranType","0")
    )
            .andExpect(MockMvcResultMatchers.status().isOk());
} 

/** 
* 
* Method: main(String[] args) 
* 
*/ 
@Test
public void testMain() throws Exception { 
//TODO: Test goes here... 
} 


/** 
* 
* Method: memcpy(char[] src, char[] dest, int len) 
* 
*/ 
@Test
public void testMemcpy() throws Exception { 
//TODO: Test goes here... 
/* 
try { 
   Method method = HuizhiPayController.getClass().getMethod("memcpy", char[].class, char[].class, int.class); 
   method.setAccessible(true); 
   method.invoke(<Object>, <Parameters>); 
} catch(NoSuchMethodException e) { 
} catch(IllegalAccessException e) { 
} catch(InvocationTargetException e) { 
} 
*/ 
} 

/** 
* 
* Method: SendPackage(String pkgStr) 
* 
*/ 
@Test
public void testSendPackage() throws Exception { 
//TODO: Test goes here... 
/* 
try { 
   Method method = HuizhiPayController.getClass().getMethod("SendPackage", String.class); 
   method.setAccessible(true); 
   method.invoke(<Object>, <Parameters>); 
} catch(NoSuchMethodException e) { 
} catch(IllegalAccessException e) { 
} catch(InvocationTargetException e) { 
} 
*/ 
} 

} 
