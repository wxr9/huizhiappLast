package com.wiseonline.Domain;


import javax.persistence.*;

/**
 * Created by yanwj on 2015/11/26.
 */
@Entity
@Table(name = "building")
public class Building extends BaseEntity{

    public String name;

    public String memo;

    @ManyToOne(targetEntity = Park.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
    @JoinColumn(name = "parkid")
    public Park park;

    @Transient
    public int parkid;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public Park getPark() {
        return park;
    }

    public void setPark(Park park) {
        this.park = park;
    }

    public int getParkid() {
        if (park != null){
            return park.getObjectid();
        }else {
            return parkid;
        }
    }

    public void setParkid(int parkid) {
        this.parkid = parkid;
    }
}
