package com.wiseonline.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

/**
 * Created by R7tech on 5/19/2016.
 */
public class MyJsonMapper extends ObjectMapper {
    public MyJsonMapper() {
        this.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
    }
}
