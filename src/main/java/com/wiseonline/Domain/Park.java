package com.wiseonline.Domain;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by yanwj on 2015/11/25.
 */
@Entity
@Table(name = "park")
public class Park extends BaseEntity{
    public String name;

    public String memo;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }
}
