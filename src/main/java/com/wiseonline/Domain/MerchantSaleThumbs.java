package com.wiseonline.Domain;

/**
 * Created by R7tech on 3/11/2016.
 */
/***********************************************************************
 * Module:  MerchantSaleThumbs.java
 * Author:  R7tech
 * Purpose: Defines the Class MerchantSaleThumbs
 ***********************************************************************/

import javax.persistence.*;
import java.text.SimpleDateFormat;

/** 商户优惠缩略图
 *
 * @pdOid af4f74a0-7a3e-4437-8463-33f39263dec3 */
@Entity
@Table(name = "merchant_sale_thumbs")
public class MerchantSaleThumbs {
    /** @pdOid be3b2a76-2729-4b43-8d33-9cb2d6ea3918 */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int objectid;
    /** @pdOid 52eae886-b715-4649-925b-989363fa83a4 */
    public int mid;
    /** 缩略图
     *
     * @pdOid a882ee23-3877-404d-9dbc-b6511aa9c220 */
    public java.lang.String url;
    /** 上传时间
     *
     * @pdOid 57c207ee-d7d1-4413-b4d5-0ddd3db9fd09 */
    public java.util.Date createTime;

    /** @pdOid 28033799-e665-477b-a375-9f2ea9c8c8ce */
    public int getObjectid() {
        return objectid;
    }

    /** @param newObjectid
     * @pdOid e6b6776f-7026-493f-9468-f85b7ae1eeb5 */
    public void setObjectid(int newObjectid) {
        objectid = newObjectid;
    }

    /** @pdOid e535bf07-2612-4e93-b021-aef1b44f2ced */
    public int getMid() {
        return mid;
    }

    /** @param newMid
     * @pdOid 9ce1663a-67ac-4626-a950-6f5d7dd61145 */
    public void setMid(int newMid) {
        mid = newMid;
    }

    /** @pdOid d924447c-ee20-4d31-a75b-0cfc66f6af78 */
    public java.lang.String getUrl() {
        return url;
    }

    /** @param newUrl
     * @pdOid 3469e7ec-3072-4b13-b43e-f7fbd1e54421 */
    public void setUrl(java.lang.String newUrl) {
        url = newUrl;
    }

    /** @pdOid fb924d0a-68db-4ce9-9293-ffc5b4bfa1a3 */
    public java.lang.String getCreateTime() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return sdf.format(createTime);
    }

    /** @param newCreateTime
     * @pdOid 85a16325-70af-4d27-82e6-dc062e51275b */
    public void setCreateTime(java.util.Date newCreateTime) {
        createTime = newCreateTime;
    }
}
