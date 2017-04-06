package com.wiseonline.Utils;

import java.util.Date;

/**
 * Created by yanwj on 2016/4/20.
 */
public class CourseExcel {
    public String courseName;//课程名称
    public Date applyTime;//报名时间
    public String chineseName;//报名人姓名
    public String phone;//联系方式
    public String email;//E-mail
    public String socialInsurance;//是否缴纳社保
    public String censusRegister;//是否沪籍
    public String schoolTime;//上课时间

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public Date getApplyTime() {
        return applyTime;
    }

    public void setApplyTime(Date applyTime) {
        this.applyTime = applyTime;
    }

    public String getChineseName() {
        return chineseName;
    }

    public void setChineseName(String chineseName) {
        this.chineseName = chineseName;
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

    public String getSocialInsurance() {
        return socialInsurance;
    }

    public void setSocialInsurance(String socialInsurance) {
        this.socialInsurance = socialInsurance;
    }

    public String getCensusRegister() {
        return censusRegister;
    }

    public void setCensusRegister(String censusRegister) {
        this.censusRegister = censusRegister;
    }

    public String getSchoolTime() {
        return schoolTime;
    }

    public void setSchoolTime(String schoolTime) {
        this.schoolTime = schoolTime;
    }
}
