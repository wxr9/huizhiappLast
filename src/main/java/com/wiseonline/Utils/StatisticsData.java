package com.wiseonline.Utils;
import java.util.List;

/**
 * Created by yanwj on 2015/12/2.
 */
public class StatisticsData {
    public List<DataAndType> xAxis;
    public List<DataAndType> series;

    public List<DataAndType> getxAxis() {
        return xAxis;
    }

    public void setxAxis(List<DataAndType> xAxis) {
        this.xAxis = xAxis;
    }

    public List<DataAndType> getSeries() {
        return series;
    }

    public void setSeries(List<DataAndType> series) {
        this.series = series;
    }
}
