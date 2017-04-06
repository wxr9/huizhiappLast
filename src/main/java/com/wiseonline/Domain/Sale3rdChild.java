package com.wiseonline.Domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

/**
 * Created by R7tech on 11/15/2016.
 */

/** @pdOid 5b039af3-a421-4d7d-849b-1de79c40f8ba */
@Entity
@DynamicInsert(true)
@DynamicUpdate(true)
@Table(name = "sale_3rd_child")
public class Sale3rdChild{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "objectid")
    public int id;


    public int main_id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JoinColumn(name = "main_id",insertable = false, updatable = false)
    public Sale3rdMain sale3rdMain;
    /**
     * @pdOid efa357e6-7c5b-4a6b-a126-93c0d4dcf880
     */
    public java.lang.String code;
    /**
     * @pdOid 78da4b56-c642-4242-af9f-19f98c5b929a
     */
    public boolean status;
    /**
     * @pdOid dac4ae62-3357-4c7d-9eb4-a92856b822e6
     */
    public java.lang.String user;
    /**
     * @pdOid a34ef913-e422-4474-b99b-cc3683e87fae
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    public java.util.Date useTime;

    public java.util.Date createTime;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getMain_id() {
        return main_id;
    }

    public void setMain_id(int main_id) {
        this.main_id = main_id;
    }

    /**
     * @pdOid 3c70c76e-2b39-4a3d-bd56-b5dee13bf715
     */
    public java.lang.String getCode() {
        return code;
    }

    /**
     * @param newCode
     * @pdOid 7e0dc0fd-f097-4303-83c0-d8cef48c0280
     */
    public void setCode(java.lang.String newCode) {
        code = newCode;
    }

    /**
     * @pdOid 0fc38561-27ae-49b0-864c-8373b45e010f
     */
    public boolean getStatus() {
        return status;
    }

    /**
     * @param newStatus
     * @pdOid c9c9cdb9-b3dd-4ef9-95cc-ac6a5c879e78
     */
    public void setStatus(boolean newStatus) {
        status = newStatus;
    }

    /**
     * @pdOid 9605c3c7-a5ba-4af0-8b9b-60efe838a8b5
     */
    public java.lang.String getUser() {
        return user;
    }

    /**
     * @param newUser
     * @pdOid 0479df3b-c7be-4ec1-9902-24b0c04302e3
     */
    public void setUser(java.lang.String newUser) {
        user = newUser;
    }

    /**
     * @pdOid e98f0e67-d9c6-44ce-b66f-bc5b61d865b2
     */
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    public java.util.Date getUseTime() {
        return useTime;
    }

    /**
     * @param newUseTime
     * @pdOid ec5ae6a0-611a-46c0-a0f9-2799de63226b
     */
    public void setUseTime(java.util.Date newUseTime) {
        useTime = newUseTime;
    }

    public Sale3rdMain getSale3rdMain() {
        return sale3rdMain;
    }

    public void setSale3rdMain(Sale3rdMain sale3rdMain) {
        this.sale3rdMain = sale3rdMain;
    }

    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }
}
