package com.wiseonline.Security;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Service;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by R7tech on 3/23/2016.
 */
@Service
public class MyAuthenticationFailureHandler implements AuthenticationFailureHandler {
    public void onAuthenticationFailure(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, AuthenticationException e) throws IOException, ServletException {
        String jason = "{\"msg\":\""+e.getMessage()+"\",\"success\":false}";
        httpServletResponse.setHeader("Content-type", "text/html;charset=UTF-8");
        httpServletResponse.getWriter().write(jason);
        httpServletResponse.getWriter().flush();
        httpServletResponse.getWriter().close();
    }
}
