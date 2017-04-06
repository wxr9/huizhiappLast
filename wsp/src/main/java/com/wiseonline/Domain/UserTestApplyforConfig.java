package com.wiseonline.Domain;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by yanwj on 2016/4/12.
 */
@Entity
@Table(name = "user_test_applyfor_config")
public class UserTestApplyforConfig extends BaseEntity{
    public String content;//配置信息
    public int type;//标示（1）

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }
}
