package com.wiseonline.Domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by yanwj on 2016/2/15.
 */
@Entity
@Table(name = "course")
public class Course extends BaseEntity{
    public String name;
    public String pic;
    @Column(name = "course_outline")
    public String courseOutline;
    public float price;
    public String content;
    @Column(name = "deleteflag")
    public int deleteFlag;
    public String sponsor;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPic() {
        return pic;
    }

    public void setPic(String pic) {
        this.pic = pic;
    }

    public String getCourseOutline() {
        return courseOutline;
    }

    public void setCourseOutline(String courseOutline) {
        this.courseOutline = courseOutline;
    }

    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
        this.price = price;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getDeleteFlag() {
        return deleteFlag;
    }

    public void setDeleteFlag(int deleteFlag) {
        this.deleteFlag = deleteFlag;
    }

    public String getSponsor() {
        return sponsor;
    }

    public void setSponsor(String sponsor) {
        this.sponsor = sponsor;
    }
}
