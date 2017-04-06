package com.wiseonline.Domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by yanwj on 2016/3/3.
 */
@Entity
@Table(name = "classroom")
public class Classroom extends BaseEntity{
    public String name;//教室名称
    public String pic;//封面图片
    public String location;//教室位置
    public String peoples;//可容纳人数
    public int projector;//是否含有投影仪（-1-不含，1-含）
    public int microphone;//是否含有麦克风（-1-不含，1-含）
    public int computer;//是否含有电脑（-1-不含，1-含）
    public String price;//参考价格
    public String area;//面积
    public String content;//内容
    @Column(name = "deleteflag")
    public int deleteFlag; //禁用启用（-1,1）
    public String readme;//须知
    @Column(name = "is_read")
    public int isRead;//是否需要已读确认(1-是，-1-否)&oq=是否需要已读确认(1-是，-1-否)

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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getPeoples() {
        return peoples;
    }

    public void setPeoples(String peoples) {
        this.peoples = peoples;
    }

    public int getProjector() {
        return projector;
    }

    public void setProjector(int projector) {
        this.projector = projector;
    }

    public int getMicrophone() {
        return microphone;
    }

    public void setMicrophone(int microphone) {
        this.microphone = microphone;
    }

    public int getComputer() {
        return computer;
    }

    public void setComputer(int computer) {
        this.computer = computer;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
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

    public String getReadme() {
        return readme;
    }

    public void setReadme(String readme) {
        this.readme = readme;
    }

    public int getIsRead() {
        return isRead;
    }

    public void setIsRead(int isRead) {
        this.isRead = isRead;
    }
}
