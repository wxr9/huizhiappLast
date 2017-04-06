package com.wiseonline.Domain;
import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;




import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.wiseonline.Utils.CustomDateSerializer;
/**
 * Created by yanwj on 2015/11/6.
 */
@MappedSuperclass
@JsonIgnoreProperties (value={ "hibernateLazyInitializer" })
public class BaseEntity implements Serializable {
    /**
     *
     */
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int objectid;

    //新增时间
    @Column(updatable = false,nullable=false,name = "create_date")
    private Date createDate=new Date();


    //修改时间
    @Column(name = "update_date")
    private Date updateDate=new Date();

    public int getObjectid() {
        return objectid;
    }

    public void setObjectid(int objectid) {
        this.objectid = objectid;
    }
    @Temporal(TemporalType.TIMESTAMP)
    @JsonSerialize (using = CustomDateSerializer.class)
    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable=false)
    @JsonSerialize (using = CustomDateSerializer.class)
    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }
}
