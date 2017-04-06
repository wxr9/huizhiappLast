package com.wiseonline.Domain;

/***********************************************************************
 * Module:  MerchantComment.java
 * Author:  R7tech
 * Purpose: Defines the Class MerchantComment
 ***********************************************************************/

import com.fasterxml.jackson.annotation.JsonFormat;

import javax.persistence.*;
import java.util.Date;

/** 商户用户之间的互动评论
 *
 * @pdOid ef380d1a-07de-4478-8c8d-a9d30217b382 */
@Entity
@Table(name = "merchant_reply_set")
/***********************************************************************
 * Module:  MerchantReply.java
 * Author:  R7tech
 * Purpose: Defines the Class MerchantReply
 ***********************************************************************/
/**
 *  商户回复设置
 */
public class MerchantReplySet {

    /**
     * @pdOid 4949683f-3f53-4d76-bb93-d416c204a19d
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int objectid;

    private String content;


    public int getObjectid() {
        return objectid;
    }


    public void setObjectid(int newObjectid) {
        objectid = newObjectid;
    }


    public String getContent() {
        return content;
    }


    public void setContent(String newContent) {
        content = newContent;
    }

}