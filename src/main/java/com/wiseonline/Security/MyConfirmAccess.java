package com.wiseonline.Security;


import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.context.expression.MapAccessor;
import org.springframework.expression.Expression;
import org.springframework.security.oauth2.provider.endpoint.FrameworkEndpoint;
import org.springframework.util.PropertyPlaceholderHelper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.security.oauth2.provider.endpoint.*;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;


/**
 * Created by kelsey on 2016/11/18.
 */
@FrameworkEndpoint
@SessionAttributes("authorizationRequest")
public class MyConfirmAccess {

    @RequestMapping("/oauth/confirm")
    public ModelAndView getAccessConfirmation(Map<String, Object> model, HttpServletRequest request) throws Exception {
        if (model.containsKey("scopes") || request.getAttribute("scopes") != null) {
            model.put("scopes",createScopes(model, request));
            model.put("denial",false);
        }
        else {
            model.put("scopes","");
            model.put("denial",true);
        }
        if (model.containsKey("_csrf") || request.getAttribute("_csrf") != null) {
            model.put("csrf",CSRF);
        }
        else {
            model.put("csrf","");
        }
        if (request.getAttribute("_csrf") != null) {
            model.put("_csrf", request.getAttribute("_csrf"));
        }
        return new ModelAndView("confirm", model);
    }

    private CharSequence createScopes(Map<String, Object> model, HttpServletRequest request) {
        StringBuilder builder = new StringBuilder("<ul>");
        @SuppressWarnings("unchecked")
        Map<String, String> scopes = (Map<String, String>) (model.containsKey("scopes") ? model.get("scopes") : request
                .getAttribute("scopes"));
        for (String scope : scopes.keySet()) {
            String approved = "true".equals(scopes.get(scope)) ? " checked" : "";
            String denied = !"true".equals(scopes.get(scope)) ? " checked" : "";
            String value = SCOPE.replace("%scope%", scope).replace("%key%", scope).replace("%approved%", approved)
                    .replace("%denied%", denied);
            builder.append(value);
        }
        builder.append("</ul>");
        return builder.toString();
    }

    private static String CSRF = "<input type='hidden' name='${_csrf.parameterName}' value='${_csrf.token}' />";

    //暂时没用到
    private static String SCOPE = "<li><div class='form-group'>%scope%: <input type='radio' name='%key%'"
            + " value='true'%approved%>Approve</input> <input type='radio' name='%key%' value='false'%denied%>Deny</input></div></li>";

}
