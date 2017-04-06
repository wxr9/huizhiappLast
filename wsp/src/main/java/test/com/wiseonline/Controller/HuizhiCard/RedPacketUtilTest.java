package test.com.wiseonline.Controller.HuizhiCard; 

import com.wiseonline.Controller.HuizhiCard.RedPacketUtil;
import org.junit.Test;
import org.junit.Before; 
import org.junit.After;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.annotation.Resource;

/** 
* RedPacketUtil Tester. 
* 
* @author <Authors name> 
* @since <pre>Oct 14, 2016</pre> 
* @version 1.0 
*/
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"file:src/main/webapp/WEB-INF/applicationContext.xml"})
public class RedPacketUtilTest { 
@Resource
    RedPacketUtil redPacketUtil;
@Before
public void before() throws Exception { 
} 

@After
public void after() throws Exception { 
} 

/** 
* 
* Method: generateRedpacket() 
* 
*/ 
@Test
public void testGenerateRedpacket() throws Exception { 
//TODO: Test goes here...
    redPacketUtil.generateRedpacket("ronaldo");
} 


} 
