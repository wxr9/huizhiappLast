package com.wiseonline.Domain;

import javax.persistence.*;

/**
 * Created by yanwj on 2016/3/14.
 */
@Entity
@Table(name = "user_jobs")
public class UserJobs extends BaseEntity{
    public String username;
    @Column(name = "chinese_name")
    public String chineseName;
    public String phone;
    public String email;
    public String memo;
    public String url;
    @Column(name = "download_num")
    public int downloadNum;
    @ManyToOne(targetEntity = Jobs.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
    @JoinColumn(name = "jobs_id")
    public Jobs jobs;
    @Transient
    public int jobsid;

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

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public int getDownloadNum() {
        return downloadNum;
    }

    public Jobs getJobs() {
        return jobs;
    }

    public void setJobs(Jobs jobs) {
        this.jobs = jobs;
    }

    public void setDownloadNum(int downloadNum) {
        this.downloadNum = downloadNum;
    }

    public int getJobsid() {
        if (jobs != null){
            return jobs.getObjectid();
        }else {
            return jobsid;
        }
    }

    public void setJobsid(int jobsid) {
        this.jobsid = jobsid;
    }
}
