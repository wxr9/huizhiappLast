package com.wiseonline.Security;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.stereotype.Service;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by R7tech on 3/24/2016.
 */
@Service
public class MyLogoutSuccessHandler implements LogoutSuccessHandler {
    public void onLogoutSuccess(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Authentication authentication) throws IOException, ServletException {
        String jason = "{\"msg\":\"注销成功\",\"success\":true}";
        httpServletResponse.setHeader("Content-type", "text/html;charset=UTF-8");
            httpServletResponse.getWriter().write(jason);
            httpServletResponse.getWriter().flush();
            httpServletResponse.getWriter().close();
    }
}
