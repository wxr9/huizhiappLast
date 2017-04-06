package com.wiseonline.Controller.Notification;

import com.wiseonline.Domain.Noticfication;
import com.wiseonline.Service.NotificationService;
import junit.framework.TestCase;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.annotation.Resource;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import static org.junit.Assert.*;

/**
 * Created by R7tech on 12/9/2015.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"file:src/main/webapp/WEB-INF/applicationContext.xml"})
public class NotificationControllerTest extends TestCase {

    @Resource
    NotificationService notificationService;

    @Test
    public void testGetAll() throws Exception {

    }

    @Test
    public void testAdd() throws Exception {
        Noticfication nf = new Noticfication();
        nf.setAuthor("jack");
        nf.setTitle("test");
        nf.setContent("contenct");
        Date date=new Date();
//        DateFormat format=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//        String time=format.format(date);
        nf.setCreateTime(date);
        assertTrue(notificationService.save(nf));
    }

    @Test
    public void testEdit() throws Exception {

    }

    @Test
    public void testUpdate() throws Exception {

    }

    @Test
    public void testDelete() throws Exception {

    }
}