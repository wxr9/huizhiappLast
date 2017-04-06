package com.wiseonline.test;

import com.wiseonline.Domain.UserRepair;
import com.wiseonline.Service.UserRepairService;
import junit.framework.TestCase;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.annotation.Resource;

import static org.junit.Assert.*;

/**
 * Created by R7tech on 12/9/2015.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"file:src/main/webapp/WEB-INF/applicationContext.xml"})
public class UserRepairControllerTest extends TestCase {

    @Resource
    private UserRepairService userRepairService;

    public UserRepairControllerTest(){};

    @Before
    public void setUp() throws Exception {

    }

    @org.junit.After
    public void tearDown() throws Exception {

    }

    @org.junit.Test
    public void testGetAll() throws Exception {

    }

    @org.junit.Test
    public void testAdd() throws Exception {
        UserRepair ur = new UserRepair();
        ur.setApplicant("mike");
        ur.setSerialNumber("123456789");

        assertTrue(userRepairService.save(ur));
    }

    @org.junit.Test
    public void testEdit() throws Exception {

    }

    @org.junit.Test
    public void testUpdate() throws Exception {

    }

    @org.junit.Test
    public void testDelete() throws Exception {

    }
}