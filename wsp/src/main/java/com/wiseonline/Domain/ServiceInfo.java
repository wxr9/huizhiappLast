package com.wiseonline.Domain;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import javax.persistence.*;

/**
 * 服务信息表
 * Created by yanwj on 2015/11/9.
 */
@Entity
@Table(name = "service_info")
public class ServiceInfo extends BaseEntity{

    public String name;

    public String url;

    public String pic;

    @ManyToOne(targetEntity = ServiceInfo.class, fetch = FetchType.EAGER, cascade = {CascadeType.ALL})
    @JoinColumn(name = "parentid")
    @NotFound(action = NotFoundAction.IGNORE)
    public ServiceInfo serviceInfo;

    @Transient
    public int parentid;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getPic() {
        return pic;
    }

    public void setPic(String pic) {
        this.pic = pic;
    }

    public ServiceInfo getServiceInfo() {
        return serviceInfo;
    }

    public void setServiceInfo(ServiceInfo serviceInfo) {
        this.serviceInfo = serviceInfo;
    }

    public int getParentid() {
        if (serviceInfo != null){
            return serviceInfo.getObjectid();
        }else {
            return parentid;
        }
    }

    public void setParentid(int parentid) {
        this.parentid = parentid;
    }
}
