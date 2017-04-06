package com.wiseonline.Domain;

/***********************************************************************
 * Module:  MenuAdmin.java
 * Author:  R7tech
 * Purpose: Defines the Class MenuAdmin
 ***********************************************************************/

import javax.persistence.*;

/** 后台系统菜单
 *
 * @pdOid ae40314f-cc8e-4221-974a-9330836a82e5 */
@Entity
@Table(name = "menu_admin")
public class MenuAdmin implements  Comparable<MenuAdmin>{
    /** @pdOid b91a91e3-dc54-4cce-9844-32756b7954ea */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int id;
    /** @pdOid c2dfba61-dfee-44cb-8a6e-e23dc16bb234 */
    public java.lang.String name;
    /** @pdOid 0a191bd7-4c72-4ebe-a837-cf54278e7d34 */
    public java.lang.String url;
    /** @pdOid 14113c6c-c2ae-4bf0-b41c-28787f535bfa */
    public java.lang.String icon;
    /** @pdOid 73f2e872-b2f2-4b7f-8096-4d79911b6809 */
    public int parent;

    /** @pdOid 0a07ff18-cb50-4d98-b533-e4f6def682a4 */
    public int getId() {
        return id;
    }

    /** @param newId
     * @pdOid 04d51cd1-d54d-4163-9718-e040f9d34841 */
    public void setId(int newId) {
        id = newId;
    }

    /** @pdOid 1d7e789b-6f58-4b87-9985-759a2c30ea61 */
    public java.lang.String getName() {
        return name;
    }

    /** @param newName
     * @pdOid 4ccade43-946b-415c-a1e9-fd7fa850c414 */
    public void setName(java.lang.String newName) {
        name = newName;
    }

    /** @pdOid 241fadec-0169-400b-b8a5-e7ec86f71bf5 */
    public java.lang.String getUrl() {
        return url;
    }

    /** @param newUrl
     * @pdOid 1da02a22-dcd5-48a3-bc5c-ddcb38b41ae5 */
    public void setUrl(java.lang.String newUrl) {
        url = newUrl;
    }

    /** @pdOid 5c867a15-f880-4616-a935-e318889dfb08 */
    public java.lang.String getIcon() {
        return icon;
    }

    /** @param newIcon
     * @pdOid 88ccd9bd-a127-49cd-9bb6-f717fa9eeeaa */
    public void setIcon(java.lang.String newIcon) {
        icon = newIcon;
    }

    /** @pdOid 2aab0ca5-6351-4004-ab5b-d00d81875db6 */
    public int getParent() {
        return parent;
    }

    /** @param newParent
     * @pdOid 97ab5a0c-a097-4c28-930f-d10d88c54641 */
    public void setParent(int newParent) {
        parent = newParent;
    }

    public int compareTo(MenuAdmin o) {

        return new Integer(this.getId()).compareTo(o.getId());
    }
}
