package test.com.wiseonline.Controller.Setting;

import com.wiseonline.Domain.Merchant;
import com.wiseonline.Service.MerchantService;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.annotation.Resource;

/** 
* MerchantController Tester. 
* 
* @author <Authors name> 
* @since <pre>Mar 7, 2016</pre> 
* @version 1.0 
*/
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"file:src/main/webapp/WEB-INF/applicationContext.xml"})
public class MerchantControllerTest {

    @Resource
    MerchantService merchantService;

@Before
public void before() throws Exception { 
} 

@After
public void after() throws Exception { 
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
* Method: BaseAdd(Merchant model) 
* 
*/ 
@Test
public void testBaseAdd() throws Exception { 
//TODO: Test goes here...
    Merchant mc = new Merchant();
    mc.setAddress("abcd");
    mc.setAvar("sasa");
    mc.setIntroduce("saafd");
    mc.setName("test");
    mc.setPhone("123456");
    mc.setWorkStartTime("08:00");
    mc.setWorkEndTime("17:00");
    merchantService.save(mc);
} 

/** 
* 
* Method: BaseUpdate(Merchant model) 
* 
*/ 
@Test
public void testBaseUpdate() throws Exception { 
//TODO: Test goes here...
    Merchant mc = new Merchant();
    mc.setObjectid(1);
    mc.setName("testtest2");

    merchantService.update(mc);
} 

/** 
* 
* Method: BaseDel(@PathVariable int objectid) 
* 
*/ 
@Test
public void testBaseDel() throws Exception { 
//TODO: Test goes here...
    merchantService.delete(2);
} 

/** 
* 
* Method: BaseList(@PathVariable int page, @PathVariable int pageSize, Merchant Model) 
* 
*/ 
@Test
public void testBaseList() throws Exception { 
//TODO: Test goes here...

} 


} 
