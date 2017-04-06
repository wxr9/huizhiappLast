package test.com.wiseonline.Controller.RedPacket; 

import com.wiseonline.Domain.RedPacket;
import com.wiseonline.Service.RedPacketService;
import org.junit.Test;
import org.junit.Before; 
import org.junit.After;
import org.junit.runner.RunWith;
import org.springframework.stereotype.Service;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import test.com.wiseonline.Controller.common.BasicWebTest;

import javax.annotation.Resource;

/** 
* RedPacketController Tester. 
* 
* @author <Authors name> 
* @since <pre>Oct 13, 2016</pre> 
* @version 1.0 
*/
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"file:src/main/webapp/WEB-INF/applicationContext.xml"})
public class RedPacketControllerTest {

    @Resource
    RedPacketService redPacketService;

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
* Method: BaseAdd(RedPacket model) 
* 
*/ 
@Test
public void testBaseAdd() throws Exception { 
//TODO: Test goes here...
    RedPacket rp = new RedPacket();
    rp.setEnableRule(true);
    rp.setDotEnable(1);
    rp.setType(1);
    rp.setName("test");
    rp.setHitPersent(0.70f);
    rp.setTotalSum(100);
    rp.setMaxSum(10);
    rp.setMinSum(10);
    redPacketService.save(rp);
} 

/** 
* 
* Method: BaseUpdate(RedPacket model) 
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
* Method: BaseList(@PathVariable int page, @PathVariable int pageSize, RedPacket model) 
* 
*/ 
@Test
public void testBaseList() throws Exception { 
//TODO: Test goes here... 
} 

/** 
* 
* Method: BaseBan(HttpServletRequest request) 
* 
*/ 
@Test
public void testBaseBan() throws Exception { 
//TODO: Test goes here... 
} 

/** 
* 
* Method: BaseStatistic(HttpServletResponse response) 
* 
*/ 
@Test
public void testBaseStatistic() throws Exception { 
//TODO: Test goes here... 
} 


} 
