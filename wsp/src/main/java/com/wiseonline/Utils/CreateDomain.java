package com.wiseonline.Utils;

/**
 * Created by yanwj on 2016/3/23.
 */
public class CreateDomain {
    public String is_grab; //是否抢单(自动流转时,标识为True时,流转task_user传多人)
    public String process; //工作流定义id
    public String related_table;
    public String task_id; //下一步任务id(自动流转时才有值)
    public String task_user; //下一步用户id(自动流转时才有值)
    public String view; //业务视图地址

    public String getIs_grab() {
        return is_grab;
    }

    public void setIs_grab(String is_grab) {
        this.is_grab = is_grab;
    }

    public String getProcess() {
        return process;
    }

    public void setProcess(String process) {
        this.process = process;
    }

    public String getRelated_table() {
        return related_table;
    }

    public void setRelated_table(String related_table) {
        this.related_table = related_table;
    }

    public String getTask_id() {
        return task_id;
    }

    public void setTask_id(String task_id) {
        this.task_id = task_id;
    }

    public String getTask_user() {
        return task_user;
    }

    public void setTask_user(String task_user) {
        this.task_user = task_user;
    }

    public String getView() {
        return view;
    }

    public void setView(String view) {
        this.view = view;
    }
}
