package com.wiseonline.Controller.Questionnaire;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wiseonline.Controller.BaseController;
import com.wiseonline.Domain.JSJtoken;
import com.wiseonline.Service.Impl.JSJtokenServiceImpl;
import com.wiseonline.Utils.ResponseFromUrl;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;

/**
 * 问卷系统 ————金数据
 * Created by kelsey on 2016-4-12.
 */
@RestController
@RequestMapping("/questionnaire")
public class QuestionnaireController extends BaseController {

    @Value("#{configProperties['JSJ.GetToken']}")
    private String token_url;

    @Value("#{configProperties['JSJ.List']}")
    private String list_url;

    @Autowired
    JSJtokenServiceImpl jsjtokenService;

    /**
     授权回调获取token接口
     */
    @RequestMapping(value = "index", method = RequestMethod.GET)
    public String index(HttpServletRequest request, String code) {
/*        JSJtoken jsj = new JSJtoken();
        jsj.setApplicationId("6dc08d2543758706e03bd6cac787d487919cb067bd2af3d218df8df1aba3526b");
        jsj.setSecret("8f3c44d17cdfe8ac5fca9b1e3e8204c83f570efdf08d653afc5f078cc9f9532d");
        jsj.setAccess_token("3a6e71a0492c9d9a64903310b22a62958c2d892f725ad1c4c4cfe286b4a7a0a8");
        jsj.setCreated_at("1460363662");
        jsj.setExpires_in("7200");
        jsj.setScope("public");
        jsj.setRefresh_token("892e1212efef74ae7961783f95705fe755f154d7930528f257be73583d64fb1e");
        jsj.setToken_type("bearer");
        jsjtokenService.save(jsj);*/
        JSJtoken jsjobj = jsjtokenService.getbyId(1);
        String param = "client_id=" + jsjobj.getApplicationId()
                + "&client_secret=" + jsjobj.getSecret()
                + "&grant_type=authorization_code&code=" + code
                + "&redirect_uri=http://172.22.11.42:81/questionnaire/index";
        String result = ResponseFromUrl.sendPost(token_url, param);
        JSONObject jso = new JSONObject(result);
        if (jso.has("access_token")){
            jsjobj.setAccess_token(jso.get("access_token").toString());
            jsjobj.setRefresh_token(jso.get("refresh_token").toString());
            jsjobj.setCreated_at(jso.get("created_at").toString());
            jsjobj.setToken_type(jso.get("token_type").toString());
            jsjobj.setExpires_in(jso.get("expires_in").toString());
            jsjobj.setScope(jso.get("scope").toString());
            jsjtokenService.update(jsjobj);
        }
        return result;
    }

    /**
     用refresh_token换取access_token
     */
    @RequestMapping(value = "refresh", method = RequestMethod.GET)
    public String refresh() {

        JSJtoken jsjobj = jsjtokenService.getbyId(1);
        String param = "client_id=" + jsjobj.getApplicationId()
                + "&client_secret=" + jsjobj.getSecret()
                + "&grant_type=refresh_token&refresh_token=" + jsjobj.getRefresh_token();
        String result = ResponseFromUrl.sendPost(token_url, param);
        JSONObject jso = new JSONObject(result);
        if (jso.has("access_token")) {
            jsjobj.setAccess_token(jso.get("access_token").toString());
            jsjobj.setRefresh_token(jso.get("refresh_token").toString());
            jsjobj.setCreated_at(jso.get("created_at").toString());
            jsjobj.setToken_type(jso.get("token_type").toString());
            jsjobj.setExpires_in(jso.get("expires_in").toString());
            jsjobj.setScope(jso.get("scope").toString());
            jsjtokenService.update(jsjobj);
        }
        return result;
    }

    @RequestMapping(value = "list", method = RequestMethod.GET,produces = {"application/json;charset=UTF-8"})
    public Object List() throws UnsupportedEncodingException {
        JSJtoken jsjobj = jsjtokenService.getbyId(1);
        if  (jsjobj != null) {
            //返回所有数据，待修改成开启数据
            String url = list_url + "?access_token=" + jsjobj.getAccess_token()
                    + "&per_page=10";
            try {
                String result = ResponseFromUrl.GetResult(url);
                ObjectMapper mapper = new ObjectMapper();
                Object object = mapper.readValue(result, Object.class);
                return object;
                //return new String(result.getBytes(), "UTF-8");
            } catch (UnsupportedEncodingException e) {
                return new ArrayList();
            } catch (JsonParseException e) {
                e.printStackTrace();
            } catch (JsonMappingException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return new ArrayList();
    }
}
