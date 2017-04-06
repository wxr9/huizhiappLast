package com.wiseonline.Utils;

import java.util.Date;
import java.util.List;

/**
 * Created by yanwj on 2016/3/30.
 */

public class MeetingroomItinerary {
    public String mettingroomName;
    public List<List<AA>> data;

    public String getMettingroomName() {
        return mettingroomName;
    }

    public void setMettingroomName(String mettingroomName) {
        this.mettingroomName = mettingroomName;
    }

    public List<List<AA>> getData() {
        return data;
    }

    public void setData(List<List<AA>> data) {
        this.data = data;
    }
}