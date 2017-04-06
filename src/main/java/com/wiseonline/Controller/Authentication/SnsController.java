package com.wiseonline.Controller.Authentication;

import com.wiseonline.Service.Impl.UserServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;

/**
 * Created by Kelsey on 2016/11/8.
 */
@RestController
@RequestMapping("/sns")
public class SnsController {
    @Autowired
    UserServiceImpl userService;

    @Value("#{configProperties['Email.HostSchema']}")
    private String HostSchema;

    @RequestMapping(value = "userinfo",method = RequestMethod.GET, headers = "Accept=application/json")
    public HashMap<String,Object> userinfo(String username) {
        HashMap<String,Object> result = new HashMap<String, Object>();
        List<Object[]>  user = userService.findByCustomerSQL("select username,name,sex,birthday,phone,userFace from users where username ='"+username+"'");
        for (Object[] a:user) {
            result.put("username",a[0].toString());
            result.put("name",a[1].toString());
            result.put("sex",a[2].toString());
            result.put("birthday",a[3]);
            result.put("phone",a[4].toString());
            result.put("userFace",a[5]==null?a[5]:HostSchema +a[5]);
        }
        return result;
    }

}
