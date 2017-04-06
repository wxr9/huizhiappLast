package com.wiseonline.Domain;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.wiseonline.Utils.CustomDateSerializerJustDate;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by yanwj on 2016/3/17.
 */
@Entity
@Table(name = "user_incubator")
public class UserIncubator extends BaseEntity{
    @Column(name = "serial_number")
    public String serialNumber;
    public String username;
    @Column(name = "chinese_name")
    public String chineseName;
    public String company;
    public String phone;
    public String email;
    @Column(name = "rent_type")
    public int rentType;
    @Column(name = "appointment_date")
    public Date appointmentDate;
    public String memo;

    @Column(name = "deleteflag")
    public int deleteFlag;

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

    public int getRentType() {
        return rentType;
    }

    public void setRentType(int rentType) {
        this.rentType = rentType;
    }

    @Temporal(TemporalType.TIMESTAMP)
    @JsonSerialize (using = CustomDateSerializerJustDate.class)
    public Date getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(Date appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public int getDeleteFlag() {
        return deleteFlag;
    }

    public void setDeleteFlag(int deleteFlag) {
        if (deleteFlag == 0){
            this.deleteFlag = 1;
        }else {
            this.deleteFlag = deleteFlag;
        }
    }
}
