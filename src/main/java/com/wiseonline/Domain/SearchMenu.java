package com.wiseonline.Domain;

import java.util.List;

/**
 * Created by R7tech on 3/22/2016.
 */
public class SearchMenu {
    /*
    标签
     */
    private String label;

    /**
     * 字段名称
     */
    private String fieldName;

    /**
     * 菜单名称数组
     */
    private List<ChildMenu> child;

    public List<ChildMenu> getChild() {
        return child;
    }

    public void setChild(List<ChildMenu> child) {
        this.child = child;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }
}
