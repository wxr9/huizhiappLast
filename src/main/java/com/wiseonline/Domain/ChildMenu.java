package com.wiseonline.Domain;

import java.util.List;

/**
 * Created by R7tech on 4/29/2016.
 */
public class ChildMenu{
    private List<SettingDict> items;

    private ChildMenu child;

    public List<SettingDict> getItems() {
        return items;
    }

    public void setItems(List<SettingDict> items) {
        this.items = items;
    }

    public ChildMenu getChild() {
        return child;
    }

    public void setChild(ChildMenu child) {
        this.child = child;
    }
}
