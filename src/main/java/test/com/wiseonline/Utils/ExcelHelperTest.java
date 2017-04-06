package test.com.wiseonline.Utils; 

import com.wiseonline.Utils.ExcelHelper;
import org.junit.Test;
import org.junit.Before; 
import org.junit.After;

import java.io.File;
import java.io.IOException;
import java.util.List;

import static org.junit.Assert.fail;
import static org.testng.AssertJUnit.assertNotNull;

/** 
* ExcelHelper Tester. 
* 
* @author <Authors name> 
* @since <pre>Apr 25, 2016</pre> 
* @version 1.0 
*/ 
public class ExcelHelperTest { 

@Before
public void before() throws Exception { 
} 

@After
public void after() throws Exception { 
} 

/** 
* 
* Method: exportListFromExcel(File file, int sheetNum) 
* 
*/ 
@Test
public void testExportListFromExcelForFileSheetNum() throws Exception { 
//TODO: Test goes here... 
} 

/** 
* 
* Method: exportListFromExcel(InputStream is, String extensionName, int sheetNum) 
* 
*/ 
@Test
public void testExportListFromExcelForIsExtensionNameSheetNum() throws Exception { 
//TODO: Test goes here... 
} 


/** 
* 
* Method: exportListFromExcel(Workbook workbook, int sheetNum) 
* 
*/ 
@Test
public void testExportListFromExcel() throws Exception {
    String path = "G:\\i'm office\\i'm office\\PersonalData\\User\\wanx@51138389\\RecvedFile\\yanwj@51138389\\1289245070200_201604251129.xlsx";
    List<String> list = null;
    try {
        list = ExcelHelper.exportListFromExcel(new File(path), 0);
        assertNotNull(list);
    } catch (IOException e) {
        fail();
    }
/* 
try { 
   Method method = ExcelHelper.getClass().getMethod("exportListFromExcel", Workbook.class, int.class); 
   method.setAccessible(true); 
   method.invoke(<Object>, <Parameters>); 
} catch(NoSuchMethodException e) { 
} catch(IllegalAccessException e) { 
} catch(InvocationTargetException e) { 
} 
*/ 
} 

} 
