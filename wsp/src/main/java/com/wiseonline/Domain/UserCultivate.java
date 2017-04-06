package com.wiseonline.Domain;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import javax.persistence.*;

/**
 * Created by yanwj on 2016/2/15.
 */
@Entity
@Table(name = "user_cultivate")
public class UserCultivate extends BaseEntity {
    public String username;
    @Column(name = "chinese_name")
    public String chineseName;
    public int sex;
    @ManyToOne(targetEntity = SettingDict.class, fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
    @JoinColumn(name = "education")
    @NotFound(action = NotFoundAction.IGNORE)
    public SettingDict education;
    @Transient
    public int educationId;
    @ManyToOne(targetEntity = SettingDict.class, fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
    @JoinColumn(name = "work_year")
    @NotFound(action = NotFoundAction.IGNORE)
    public SettingDict workYear;
    @Transient
    public int workYearId;
    public String company;
    @ManyToOne(targetEntity = Course.class, fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
    @JoinColumn(name = "courseid")
    public Course course;
    @Transient
    public int courseId;
    @ManyToOne(targetEntity = SettingDict.class, fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
    @JoinColumn(name = "grade")
    @NotFound(action = NotFoundAction.IGNORE)
    public SettingDict grade;
    @Transient
    public int gradeId;
    public String phone;
    public String email;
    @ManyToOne(targetEntity = SettingDict.class, fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
    @JoinColumn(name = "job")
    public SettingDict job;
    @Transient
    public int jobId;
    @Column(name = "social_insurance")
    public int socialInsurance;
    @Column(name = "census_register")
    public int censusRegister;
    @Column(name = "school_time")
    public String schoolTime;
    public String memo;

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

    public int getSex() {
        return sex;
    }

    public void setSex(int sex) {
        this.sex = sex;
    }

    public SettingDict getEducation() {
        return education;
    }

    public void setEducation(SettingDict education) {
        this.education = education;
    }

    public int getEducationId() {
        if (education != null) {
            return education.getObjectid();
        } else {
            return educationId;
        }
    }

    public void setEducationId(int educationId) {
        this.educationId = educationId;
    }

    public SettingDict getWorkYear() {
        return workYear;
    }

    public void setWorkYear(SettingDict workYear) {
        this.workYear = workYear;
    }

    public int getWorkYearId() {
        if (workYear != null) {
            return workYear.getObjectid();
        } else {
            return workYearId;
        }
    }

    public void setWorkYearId(int workYearId) {
        this.workYearId = workYearId;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public int getCourseId() {
        if (course != null) {
            return course.getObjectid();
        } else {
            return courseId;
        }
    }

    public void setCourseId(int courseId) {
        this.courseId = courseId;
    }

    public SettingDict getGrade() {
        return grade;
    }

    public void setGrade(SettingDict grade) {
        this.grade = grade;
    }

    public int getGradeId() {

        if (grade != null) {
            return grade.getObjectid();
        } else {
            return gradeId;
        }
    }

    public void setGradeId(int gradeId) {
        this.gradeId = gradeId;
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

    public SettingDict getJob() {
        return job;
    }

    public void setJob(SettingDict job) {
        this.job = job;
    }

    public int getJobId() {
        if (job != null) {
            return job.getObjectid();
        } else {
            return jobId;
        }
    }

    public void setJobId(int jobId) {
        this.jobId = jobId;
    }

    public int getSocialInsurance() {
        return socialInsurance;
    }

    public void setSocialInsurance(int socialInsurance) {
        this.socialInsurance = socialInsurance;
    }

    public int getCensusRegister() {
        return censusRegister;
    }

    public void setCensusRegister(int censusRegister) {
        this.censusRegister = censusRegister;
    }

    public String getSchoolTime() {
        return schoolTime;
    }

    public void setSchoolTime(String schoolTime) {
        this.schoolTime = schoolTime;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }
}
