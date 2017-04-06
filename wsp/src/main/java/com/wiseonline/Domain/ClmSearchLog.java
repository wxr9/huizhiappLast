package com.wiseonline.Domain;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by yanwj on 2016/4/13.
 */
@Entity
@Table(name = "clm_search_log")
public class ClmSearchLog extends BaseEntity{
    public String name;//单位
    public String username;//操作人

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
