package com.wiseonline.Utils;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by yanwj on 2015/11/6.
 */
public class CustomDateSerializerJustDate extends JsonSerializer<Date> {
    @Override
    public void serialize(Date value, JsonGenerator jgen,
                          SerializerProvider provider) throws IOException,
            JsonProcessingException {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        jgen.writeString(sdf.format(value));

    }
}
