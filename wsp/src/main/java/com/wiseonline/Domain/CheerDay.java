package com.wiseonline.Domain;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.wiseonline.Utils.CustomDateSerializer;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by huizhisoft on 15/12/20.
 */
@Entity
@Table(name = "cheer_day")
public class CheerDay extends BaseEntity{

    @Temporal(TemporalType.TIMESTAMP)
    @JsonSerialize(using = CustomDateSerializer.class)
    @Column(name = "cheer_date")
    public Date cheerDay;

    public Date getCheerDay() {
        return cheerDay;
    }

    public void setCheerDay(Date cheerDay) {
        this.cheerDay = cheerDay;
    }
}
