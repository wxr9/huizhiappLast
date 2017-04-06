package test.com.wiseonline.Controller.Setting; 

import org.junit.Test; 
import org.junit.Before; 
import org.junit.After;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import test.com.wiseonline.Controller.common.BasicWebTest;

/** 
* MerchantSaleController Tester. 
* 
* @author <Authors name> 
* @since <pre>Mar 31, 2016</pre> 
* @version 1.0 
*/ 
public class MerchantSaleControllerTest  extends BasicWebTest {

@Before
public void before() throws Exception { 
} 

@After
public void after() throws Exception { 
} 

/** 
* 
* Method: GetSearchMenuList() 
* 
*/ 
@Test
public void testGetSearchMenuList() throws Exception { 
//TODO: Test goes here... 
} 

/** 
* 
* Method: BaseEdit(@PathVariable int objectid) 
* 
*/ 
@Test
public void testBaseEdit() throws Exception { 
//TODO: Test goes here... 
} 

/** 
* 
* Method: BaseAdd(MerchantSale model) 
* 
*/ 
@Test
public void testBaseAdd() throws Exception {
    mvc.perform(MockMvcRequestBuilders.post("/Setting/MerchantSale/Add")
            .param("title","test")
            .param("coverImg","/static/test.jpg")
            .param("companyId","1")
            .param("type","442")
            .param("startTime","test")
            .param("endTime","test")
            .param("shortIntro","test")
            .param("content","test")
            .param("isCheck","1")
            .param("publishDate","2016-03-31")
            .param("memo","test")
    )
            .andExpect(MockMvcResultMatchers.status().isOk());
} 

/** 
* 
* Method: BaseUpdate(MerchantSale model) 
* 
*/ 
@Test
public void testBaseUpdate() throws Exception { 
//TODO: Test goes here... 
} 

/** 
* 
* Method: BaseDel(@PathVariable int objectid) 
* 
*/ 
@Test
public void testBaseDel() throws Exception { 
//TODO: Test goes here... 
} 

/** 
* 
* Method: BaseList(@PathVariable int page, @PathVariable int pageSize, MerchantSale Model, HttpServletRequest request) 
* 
*/ 
@Test
public void testBaseList() throws Exception { 
//TODO: Test goes here... 
} 

/** 
* 
* Method: BaseAudit(HttpServletRequest request) 
* 
*/ 
@Test
public void testBaseAudit() throws Exception { 
//TODO: Test goes here... 
} 


} 
