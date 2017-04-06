package com.wiseonline.Utils;


import java.util.List;

/**
 * Created by yanwj on 2015/11/6.
 */
public class TranslatePageResult {
    private int total;

    private List<TranslateDomain> result;

    private int page;

    private int pagesize;

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public List<TranslateDomain> getResult() {
        return result;
    }

    public void setResult(List<TranslateDomain> result) {
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
