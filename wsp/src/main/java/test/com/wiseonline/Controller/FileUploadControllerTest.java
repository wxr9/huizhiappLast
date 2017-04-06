package test.com.wiseonline.Controller; 

import javassist.bytecode.ByteArray;
import org.junit.Test;
import org.junit.Before; 
import org.junit.After;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import test.com.wiseonline.Controller.common.BasicWebTest;

import java.io.File;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.fileUpload;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** 
* FileUploadController Tester. 
* 
* @author <Authors name> 
* @since <pre>Oct 8, 2016</pre> 
* @version 1.0 
*/ 
public class FileUploadControllerTest extends BasicWebTest {

@Before
public void before() throws Exception { 
} 

@After
public void after() throws Exception { 
} 

/** 
* 
* Method: AccessoryUploadImgSpecial(HttpServletRequest request, HttpServletResponse response) 
* 
*/ 
@Test
public void testAccessoryUploadImgSpecial() throws Exception { 
//TODO: Test goes here... 
} 

/** 
* 
* Method: UploadImgSpecial(HttpServletRequest request, HttpServletResponse response) 
* 
*/ 
@Test
public void testUploadImgSpecial() throws Exception { 
//TODO: Test goes here... 
} 

/** 
* 
* Method: UploaddocSpecial(HttpServletRequest request, HttpServletResponse response) 
* 
*/ 
@Test
public void testUploaddocSpecial() throws Exception { 
//TODO: Test goes here... 
} 

/** 
* 
* Method: UploadImgComm(HttpServletRequest request, HttpServletResponse response) 
* 
*/ 
@Test
public void testUploadImgComm() throws Exception { 
//TODO: Test goes here... 
} 

/** 
* 
* Method: SimpleUploadFile(HttpServletRequest request, HttpServletResponse response, MultipartFile file, String type) 
* 
*/ 
@Test
public void testSimpleUploadFile() throws Exception { 
//TODO: Test goes here... 
} 

/** 
* 
* Method: AccessoryNanageUploadDocFile(HttpServletRequest request, HttpServletResponse response, @RequestParam("file")MultipartFile[] files) 
* 
*/ 
@Test
public void testAccessoryNanageUploadDocFile() throws Exception { 
//TODO: Test goes here... 
} 

/** 
* 
* Method: AccessoryNanageMaterialUploadDocFile(HttpServletRequest request, HttpServletResponse response, @RequestParam("file") MultipartFile[] files) 
* 
*/ 
@Test
public void testAccessoryNanageMaterialUploadDocFile() throws Exception { 
//TODO: Test goes here... 
} 

/** 
* 
* Method: SimpleUploadDocFile(HttpServletRequest request, HttpServletResponse response, MultipartFile file, String type) 
* 
*/ 
@Test
public void testSimpleUploadDocFile() throws Exception { 
//TODO: Test goes here... 
} 

/** 
* 
* Method: SimpleUploadFileByCut(HttpServletRequest request, HttpServletResponse response, MultipartFile file) 
* 
*/ 
@Test
public void testSimpleUploadFileByCut() throws Exception { 
//TODO: Test goes here... 
} 

/** 
* 
* Method: UploadFileWithExternal(HttpServletRequest request, HttpServletResponse response, MultipartFile file) 
* 
*/ 
@Test
public void testUploadFileWithExternal() throws Exception { 
//TODO: Test goes here....
    File f = new File("static/test.png");
    MockMultipartFile file = new MockMultipartFile("file","static/test.png","image/png","nonsensecontent".getBytes());
    //mvc.perform(MockMvcRequestBuilders.fileUpload("/FileUpload/UploadFileWithExternal")
    mvc.perform(fileUpload("/FileUpload/UploadFileWithExternal").file(file)).andExpect(status().isOk());
} 


/** 
* 
* Method: isMax(long fileSize) 
* 
*/ 
@Test
public void testIsMax() throws Exception { 
//TODO: Test goes here... 
/* 
try { 
   Method method = FileUploadController.getClass().getMethod("isMax", long.class); 
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
* Method: isPic(String suffix) 
* 
*/ 
@Test
public void testIsPic() throws Exception { 
//TODO: Test goes here... 
/* 
try { 
   Method method = FileUploadController.getClass().getMethod("isPic", String.class); 
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
* Method: isDoc(String suffix) 
* 
*/ 
@Test
public void testIsDoc() throws Exception { 
//TODO: Test goes here... 
/* 
try { 
   Method method = FileUploadController.getClass().getMethod("isDoc", String.class); 
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
* Method: isMaterial(String suffix) 
* 
*/ 
@Test
public void testIsMaterial() throws Exception { 
//TODO: Test goes here... 
/* 
try { 
   Method method = FileUploadController.getClass().getMethod("isMaterial", String.class); 
   method.setAccessible(true); 
   method.invoke(<Object>, <Parameters>); 
} catch(NoSuchMethodException e) { 
} catch(IllegalAccessException e) { 
} catch(InvocationTargetException e) { 
} 
*/ 
} 

} 
