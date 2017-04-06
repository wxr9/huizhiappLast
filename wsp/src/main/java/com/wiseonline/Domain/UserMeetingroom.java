package com.wiseonline.Domain;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.wiseonline.Utils.CustomDateSerializer;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by yanwj on 2016/3/3.
 */
@Entity
@Table(name = "user_meetingroom")
public class UserMeetingroom extends BaseEntity{
    @Column(name = "serial_number")
    public String serialNumber;//流水号
    public String username;//申请人
    @Column(name = "chinese_name")
    public String chineseName;
    public String company;//公司名
    public String phone;//联系方式
    public String email;//E-mail
    public String topics;//会议主题
    @Column(name = "tea_reak")
    public int teaReak;//是否需要茶歇（1-需要，-1-不需要）
    @Column(name = "tea_reak_money")
    public int teaReakMoney;//茶歇人均标准
    public int projector;//是否使用有投影仪（-1-不含，1-含）
    public int microphone;//是否使用麦克风（-1-不含，1-含）
    public int vsx;//是否含有视频会议（-1-不含，1-含）
    public String memo;//备注信息

    public String peoples;


    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getChineseName() {
        return chineseName;
    }

    public void setChineseName(String chineseName) {
        this.chineseName = chineseName;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTopics() {
        return topics;
    }

    public void setTopics(String topics) {
        this.topics = topics;
    }

    public int getTeaReak() {
        return teaReak;
    }

    public void setTeaReak(int teaReak) {
        this.teaReak = teaReak;
    }

    public int getTeaReakMoney() {
        return teaReakMoney;
    }

    public void setTeaReakMoney(int teaReakMoney) {
        this.teaReakMoney = teaReakMoney;
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

    public int getVsx() {
        return vsx;
    }

    public void setVsx(int vsx) {
        this.vsx = vsx;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public String getPeoples() {
        return peoples;
    }

    public void setPeoples(String peoples) {
        this.peoples = peoples;
    }
}
