package com.wiseonline.Utils;

import java.util.Calendar;
import java.util.Date;

/**
 * Created by huizhisoft on 15/12/20.
 */
public class DateUtils {

    /**
     * 获取到星期几
     * @param dt
     * @return
     */
    public static String getWeekOfDate(Date dt) {
        String[] weekDays = {"星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"};
        Calendar cal = Calendar.getInstance();
        cal.setTime(dt);
        int w = cal.get(Calendar.DAY_OF_WEEK) - 1;
        if (w < 0) {
            w = 0;
        }
        return weekDays[w];
    }
}
