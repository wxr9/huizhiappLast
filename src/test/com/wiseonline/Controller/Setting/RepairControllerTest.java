package com.wiseonline.Controller.Setting;

import com.wiseonline.Domain.SettingRepair;
import com.wiseonline.Domain.SettingRepairAutoConfig;
import com.wiseonline.Domain.SettingRepairManConfig;
import com.wiseonline.Domain.SettingRichText;
import com.wiseonline.Service.SettingRepairAutoConfigService;
import com.wiseonline.Service.SettingRepairManConfigService;
import com.wiseonline.Service.SettingRepairService;
import com.wiseonline.Service.SettingRichTextService;
import junit.framework.TestCase;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.annotation.Resource;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * Created by R7tech on 12/15/2015.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"file:src/main/webapp/WEB-INF/applicationContext.xml"})
public class RepairControllerTest extends TestCase {

    @Resource
    SettingRepairService settingRepairService;

    @Resource
    SettingRichTextService settingRichTextService;

    @Resource
    SettingRepairManConfigService settingRepairManConfigService;

    @Resource
    SettingRepairAutoConfigService settingRepairAutoConfigService;

    @Test
    public void testBaseEdit() throws Exception {


        SettingRepair tp;

        tp = settingRepairService.getbyId(1);
        SettingRichText st = settingRichTextService.getbyId(tp.getBaseTerm());
        tp.setBaseTermName(st.getTitle());
        assertNotNull(tp);
    }

    @Test
    public void testBaseUpdate() throws Exception {

        SettingRepair tp = new SettingRepair();
        tp.setObjectid(1);
        tp.setBaseEnable((short) 1);
        SimpleDateFormat sdfStart = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        SimpleDateFormat sdfEnd = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        tp.setWorkStartTime("0000-00-00 09:00:00");
        tp.setWorkEndTime("0000-00-00 17:30:00");
        Date start = sdfStart.parse(tp.getWorkStartTime());
        Date end = sdfStart.parse(tp.getWorkEndTime());
        long diff = start.getTime() - end.getTime();
        if(diff<0)
        {
            System.out.println("end big");
        }
        else
        {
            System.out.println("start big");
        }
        Date date=new Date();
//        DateFormat format=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//        String time=format.format(date);
        //tp.setCreateDate(date);

        assertTrue(settingRepairService.update(tp));
    }

    @Test
    public void testCommentEdit() throws Exception {
        String TERM_URL = "http://www.163.com";
        SettingRepair tp = new SettingRepair();
        tp.setBaseEnable((short) 1);

        Date date=new Date();
//        DateFormat format=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//        String time=format.format(date);
        //tp.setCreateDate(date);

        assertTrue(settingRepairService.save(tp));
    }

    @Test
    public void testCommentUpdate() throws Exception {
        String TERM_URL = "http://www.163.com";
        SettingRepair tp = new SettingRepair();
        tp.setBaseEnable((short) 1);

        Date date=new Date();
//        DateFormat format=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//        String time=format.format(date);
        //tp.setCreateDate(date);

        assertTrue(settingRepairService.save(tp));
    }

    @Test
    public void testValidDateEdit() throws Exception {
        String TERM_URL = "http://www.163.com";
        SettingRepair tp = new SettingRepair();
        tp.setBaseEnable((short) 1);

        Date date=new Date();
//        DateFormat format=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//        String time=format.format(date);
        //tp.setCreateDate(date);

        assertTrue(settingRepairService.save(tp));
    }

    @Test
    public void testValidDateUpdate() throws Exception {
        String TERM_URL = "http://www.163.com";
        SettingRepair tp = new SettingRepair();
        tp.setBaseEnable((short) 1);

        Date date=new Date();
//        DateFormat format=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//        String time=format.format(date);
        //tp.setCreateDate(date);

        assertTrue(settingRepairService.save(tp));
    }

    @Test
    public void testAutoDispatchList() throws Exception {
        List<SettingRepairAutoConfig> sa = settingRepairAutoConfigService.findAll();

        assertNotNull(sa);
    }

    @Test
    public void testAutoDispatchEdit() throws Exception {
        SettingRepairAutoConfig sa = settingRepairAutoConfigService.getbyId(1);
        assertNotNull(sa);
    }

    @Test
    public void testAutoDispatchUpdate() throws Exception {
        SettingRepairAutoConfig sa = new SettingRepairAutoConfig();
        sa.setBuildingId(101);
        sa.setParkId(201);
        settingRepairAutoConfigService.save(sa);
    }

    @Test
    public void testSettingMaintainerList() throws Exception {
        List<SettingRepairManConfig> sm;
        sm = settingRepairManConfigService.findAll();
        Date date=new Date();
//        DateFormat format=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//        String time=format.format(date);
        //tp.setCreateDate(date);

        assertNotNull(sm);
    }

    @Test
    public void testSettingMaintainerAdd() throws Exception {
        SettingRepairManConfig sm = new SettingRepairManConfig();
        String[] s = {"1","2"};
        sm.setJobType(s);
        sm.setMobile("18916250668");
        sm.setName("jack");
        sm.setRepairType((short)1);

        Date date=new Date();
//        DateFormat format=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//        String time=format.format(date);
        //tp.setCreateDate(date);

        assertTrue(settingRepairManConfigService.save(sm));
    }

    @Test
    public void testSettingMaintainerEdit() throws Exception {
        SettingRepairManConfig sm = settingRepairManConfigService.getbyId(1);

        Date date=new Date();
//        DateFormat format=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//        String time=format.format(date);
        //tp.setCreateDate(date);

        assertNotNull(sm);
    }

    @Test
    public void testSettingMaintainerUpdate() throws Exception {
        SettingRepairManConfig sm = new SettingRepairManConfig();
        String[] s = {"1","2"};
        sm.setJobType(s);
        sm.setMobile("18916250668");
        sm.setName("jack");
        sm.setRepairType((short)1);

        Date date=new Date();
//        DateFormat format=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//        String time=format.format(date);
        //tp.setCreateDate(date);

        assertTrue(settingRepairManConfigService.save(sm));
    }

    @Test
    public void testSettingMaintainerDelete() throws Exception {

        assertTrue(settingRepairManConfigService.delete(1));
    }
}