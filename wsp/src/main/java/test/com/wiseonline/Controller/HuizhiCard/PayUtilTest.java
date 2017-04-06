package test.com.wiseonline.Controller.HuizhiCard; 

import com.wiseonline.Controller.HuizhiCard.PayUtil;
import org.junit.Test;
import org.junit.Before; 
import org.junit.After; 

/** 
* PayUtil Tester. 
* 
* @author <Authors name> 
* @since <pre>Apr 19, 2016</pre> 
* @version 1.0 
*/ 
public class PayUtilTest { 

@Before
public void before() throws Exception { 
} 

@After
public void after() throws Exception { 
} 

/** 
* 
* Method: WriteRechargeInfo(int amount, String cardNo, String orderNo) 
* 
*/ 
@Test
public void testWriteRechargeInfo() throws Exception { 
//TODO: Test goes here... 
} 


/** 
* 
* Method: SendPaySms(String phone, String sendMessage) 
* 
*/ 
@Test
public void testSendPaySms() throws Exception { 
//TODO: Test goes here...
    new PayUtil().WriteRechargeInfo("111","aaaa","111111");
/*
try {
   Method method = PayUtil.getClass().getMethod("SendPaySms", String.class, String.class);
   method.setAccessible(true);
   method.invoke(<Object>, <Parameters>);
} catch(NoSuchMethodException e) {
} catch(IllegalAccessException e) {
} catch(InvocationTargetException e) {
}
 */
} 

} 
