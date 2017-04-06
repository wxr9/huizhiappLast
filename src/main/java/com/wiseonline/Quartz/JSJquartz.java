package com.wiseonline.Quartz;


import com.wiseonline.Domain.JSJtoken;
import com.wiseonline.Service.Impl.JSJtokenServiceImpl;
import com.wiseonline.Utils.ResponseFromUrl;
import org.json.JSONObject;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Service;

import java.io.IOException;

/**
 * Created by kelsey on 2016-4-11.
 */
@Service("jsjquartz")
public class JSJquartz extends QuartzJobBean {

    private String token_url;

    JSJtokenServiceImpl jsjtokenService;

    public void setToken_url(String token_url) {
        this.token_url = token_url;
    }



    public void setJsjtokenService(JSJtokenServiceImpl jsjtokenService) {
        this.jsjtokenService = jsjtokenService;
    }

    public void work() throws IOException {
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
        //return result;
    }

    @Override
    protected void executeInternal(JobExecutionContext arg0)
            throws JobExecutionException {
        try {
            System.out.println("begin1 auto job");
            this.work();
            System.out.println("begin auto job");
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }
}
