package com.wiseonline.Domain; /***********************************************************************
 * Module:  Noticfication.java
 * Author:  R7tech
 * Purpose: Defines the Class Noticfication
 ***********************************************************************/

import javax.persistence.*;
import java.text.SimpleDateFormat;
import java.util.*;

@Entity
@Table(name = "noticfication")
/** @pdOid 96557731-497c-464c-95ca-7f3dacb4318e */
public class Noticfication {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   /** @pdOid bc7b6f11-3b95-49d1-a784-c7c07b9c92c8 */
   private int objectid;
   /** @pdOid a54b7bcd-40fc-4276-af6b-6576ec61fe77 */
   private String author;
   /** @pdOid f4918a5c-710d-4710-b9dc-afac08eb8348 */
   private String title;
   /** @pdOid 008b1167-a2bb-4a11-8fb7-1931eccb5005 */
   private String content;
   /** @pdOid 100daf12-dc9a-48b9-8d0e-5c152becd8e1 */
   private Date createTime;

   private String accepter;

   /*
   已读状态  1未读2已读
    */
   private int readStatus;
   
   /** @pdOid 957cd77d-e9f7-4c21-a1d7-ce118ee37625 */
   public int getObjectid() {
      return objectid;
   }
   
   /** @param newObjectid
    * @pdOid 04816a6b-6c3e-4fd1-8280-6f9391fcc09c */
   public void setObjectid(int newObjectid) {
      objectid = newObjectid;
   }
   
   /** @pdOid 15d2fe84-6916-4ab3-ae31-1e475b7f57c4 */
   public String getAuthor() {
      return author;
   }
   
   /** @param newAuthor
    * @pdOid e4c216d8-d3af-4d13-a775-3dfc15169d3d */
   public void setAuthor(String newAuthor) {
      author = newAuthor;
   }
   
   /** @pdOid 6a63da94-d6ea-4554-a0cf-f021d04aebae */
   public String getTitle() {
      return title;
   }
   
   /** @param newTitle
    * @pdOid 618c0d94-d1d6-4168-896f-720390564185 */
   public void setTitle(String newTitle) {
      title = newTitle;
   }
   
   /** @pdOid 987f3810-2085-4bff-89e8-a365e6811700 */
   public String getContent() {
      return content;
   }
   
   /** @param newContent
    * @pdOid a37e8dc8-ba0b-401c-890e-9354e0764a73 */
   public void setContent(String newContent) {
      content = newContent;
   }
   
   /** @pdOid 7afcb007-977d-4d84-b49d-52e52a56c3e1 */
   public String getCreateTime() {
      SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
      return sdf.format(createTime);
   }
   
   /** @param newCreateTime
    * @pdOid bd70e591-4734-4671-ac72-d471d4056a6e */
   public void setCreateTime(Date newCreateTime) {
      createTime = newCreateTime;
   }

   public String getAccepter() {
      return accepter;
   }

   public void setAccepter(String accepter) {
      this.accepter = accepter;
   }

   public int getReadStatus() {
      return readStatus;
   }

   public void setReadStatus(int readStatus) {
      this.readStatus = readStatus;
   }
}