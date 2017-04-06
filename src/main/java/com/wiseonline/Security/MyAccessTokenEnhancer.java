package com.wiseonline.Security;

import org.springframework.security.oauth2.common.DefaultOAuth2AccessToken;
import org.springframework.stereotype.Service;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.token.TokenEnhancer;
import org.springframework.security.oauth2.provider.OAuth2Authentication;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Created by kelsey on 2016/11/8.
 */
@Service
public class MyAccessTokenEnhancer implements TokenEnhancer{

    public OAuth2AccessToken enhance(OAuth2AccessToken accessToken,
                              OAuth2Authentication authentication){
        if (accessToken instanceof DefaultOAuth2AccessToken){
            DefaultOAuth2AccessToken token= (DefaultOAuth2AccessToken) accessToken;
            Map<String, Object> additionalInformation = new LinkedHashMap<String, Object>();
            additionalInformation.put("username",authentication.getName());
            token.setAdditionalInformation(additionalInformation);
        }
        return accessToken;
    }

}
