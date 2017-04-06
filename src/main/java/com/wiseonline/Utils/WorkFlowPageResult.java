package com.wiseonline.Utils;
import org.json.JSONArray;


/**
 * Created by yanwj on 2015/11/6.
 */
public class WorkFlowPageResult  {
    private int total;

    private Object result;

    private int page;

    private int pagesize;

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public Object getResult() {
        return result;
    }

    public void setResult(Object result) {
        this.result = result;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getPagesize() {
        return pagesize;
    }

    public void setPagesize(int pagesize) {
        this.pagesize = pagesize;
    }
}
