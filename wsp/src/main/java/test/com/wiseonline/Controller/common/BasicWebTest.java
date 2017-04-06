package test.com.wiseonline.Controller.common;

import org.junit.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractTransactionalJUnit4SpringContextTests;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

/**
 * Created by R7tech on 4/18/2016.
 */
@WebAppConfiguration
@ContextConfiguration(locations = {"file:src/main/webapp/WEB-INF/applicationContext.xml","file:src/main/webapp/WEB-INF/spring-servlet.xml"})
public class BasicWebTest extends AbstractTransactionalJUnit4SpringContextTests {
    @Autowired
    protected WebApplicationContext wac;
    protected MockMvc mvc;
    @Before
    public void setUp() {
        this.mvc= MockMvcBuilders.webAppContextSetup(wac).build();
        }
    }
