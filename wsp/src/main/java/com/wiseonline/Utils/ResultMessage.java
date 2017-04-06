package com.wiseonline.Utils;

/**
 * Created by yanwj on 2015/11/5.
 */
public class ResultMessage {
    public ResultMessage(){

    }

    private boolean success;

    private String msg;

    public boolean getSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
