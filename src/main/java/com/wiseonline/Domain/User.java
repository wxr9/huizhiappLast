package com.wiseonline.Domain;

import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.wiseonline.Utils.CustomDateSerializer;
import com.wiseonline.Utils.CustomDateSerializerJustDate;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

/**
 * 用户表
 * Created by yanwj on 2015/11/6.
 */
@Entity
@DynamicInsert(true)
@DynamicUpdate(true)
@Table(name = "users")
public class User implements UserDetails{
    /**
     *
     */
    private static final long serialVersionUID = 1L;

    public User() {

    }

    @Id
    private String username;

    public String name;

    @Column(name = "realname")
    public String realName;

    @Transient
    @JsonIgnore
    private String password;

    @JsonIgnore
    @Column(updatable = false, nullable = false)
    private String hpassword;

    //新增时间
    @Column(updatable = false,nullable=false,name = "create_date")
    private Date createDate=new Date();


    //修改时间
    @Column(name = "update_date")
    private Date updateDate=new Date();

    public int sex;

    public Date birthday;

    @Column(name = "entrtpriseinput")
    public String enterpriseInput;

    public int workYears;

    @ManyToOne(targetEntity = SettingDict.class,fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
    @JoinColumn(name = "nation")
    private SettingDict settingNation;

    @Transient
    public int nation;

    @ManyToOne(targetEntity = SettingCity.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
    @JoinColumn(name = "apartmentCity")
    public SettingCity settingApartmentCity;

    @Transient
    public int apartmentCity;

    @JsonIgnore
    public String apartmentDetail;

    @ManyToOne(targetEntity = SettingCity.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
    @JoinColumn(name = "hometownCity")
    public SettingCity settingHometowntCity;

    @Transient
    public int hometownCity;

    @JsonIgnore
    public String hometownDetail;

    @ManyToOne(targetEntity = SettingDict.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
    @JoinColumn(name = "education")
    public SettingDict settingDict;

    @Transient
    public int education;

    //婚姻状况（0-保密，1-已婚，2-未婚）
    public int marital;

    public String cardid;

    public String phone;

    public String email;

    @Transient
    public boolean approved;
    @JsonIgnore
    public int approvedflag;

    @Column(name = "userface")
    public String userFace;

    @ManyToMany(targetEntity = Role.class, cascade = CascadeType.ALL)
    @JoinTable(name = "role_user", joinColumns = @JoinColumn(name = "username"), inverseJoinColumns = @JoinColumn(name = "rolename"))
    private Set<Role> roleList;

    // 前端传角色列表string(逗号分隔)
    @Transient
    private String roleArray;

    public String signature;

    @Column(name = "deleteflag")
    public int deleteFlag;

    @ManyToOne(targetEntity = Enterprise.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
    @JoinColumn(name = "enterpriseid")
    @NotFound(action = NotFoundAction.IGNORE)
    public Enterprise enterprise;

    @Transient
    private int enterpriseId;

    @Column(name = "enterpriseroot")
    public int enterpriseRoot;

    @ManyToOne(targetEntity = SettingDict.class,fetch = FetchType.EAGER,cascade = {CascadeType.MERGE})
    @JoinColumn(name = "department")
    @NotFound(action = NotFoundAction.IGNORE)
    public SettingDict settingDepartmentDict;

    @Transient
    public int department;

    @Column(name = "userflag")
    public int userFlag;

    /**
     * 1未绑定2已绑定  默认1
     */
    @Column(name = "emailflag")
    public int emailFlag;

    public boolean isApproved() {
        return approved;
    }

    public void setUsername(String username) {
        this.username = username.toLowerCase();
    }

    public String getUsername() {
        return username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRealName() {
        return realName;
    }

    public void setRealName(String realName) {
        this.realName = realName;
    }

    public String getPassword() {
        if (hpassword != null) {
            return hpassword;
        }
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getHpassword() {
        return hpassword;
    }

    public void setHpassword(String hpassword) {
        this.hpassword = hpassword;
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

    public boolean approved() {
        return approved;
    }

    public void setApproved(boolean approved) {
        if (approvedflag > 0){
            this.approved = true;
        }else{
            this.approved = false;
        }
    }

    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<GrantedAuthority> authorities = new HashSet<GrantedAuthority>();

        for (Role role : this.getRoleList()) {
            //authorities.add(role.generateGrantedAuthority());
            GrantedAuthority authority = new SimpleGrantedAuthority(role.getRolename());
            authorities.add(authority);
        }

        // GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_USER");
        //authorities.add(authority);
        return authorities;
    }

    public boolean isAccountNonExpired() {
        // TODO Auto-generated method stub
        return true;
    }

    public boolean isAccountNonLocked() {
        // TODO Auto-generated method stub
        return true;
    }

    public boolean isCredentialsNonExpired() {
        // TODO Auto-generated method stub
        return true;
    }

    public boolean isEnabled() {
        // TODO Auto-generated method stub
        return !approved;
    }

    public Set<Role> getRoleList() {
        return roleList;
    }

    public void setRoleList(Set<Role> roleList) {
        this.roleList = roleList;
    }

    public String getRoleArray() {
        return roleArray;
    }

    public void setRoleArray(String roleArray) {
        this.roleArray = roleArray;
    }

    public String getUserFace() {
        return userFace;
    }

    public void setUserFace(String userFace) {
        this.userFace = userFace;
    }

    public int getApprovedflag() {
        return approvedflag;
    }

    public void setApprovedflag(int approvedflag) {
        this.approvedflag = approvedflag;
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

    public int getSex() {
        return sex;
    }

    public void setSex(int sex) {
        this.sex = sex;
    }

    @JsonSerialize (using = CustomDateSerializerJustDate.class)
    public Date getBirthday() {
        return birthday;
    }

    public void setBirthday(Date birthday) {
        this.birthday = birthday;
    }

    public String getEnterpriseInput() {
        return enterpriseInput;
    }

    public void setEnterpriseInput(String enterpriseInput) {
        this.enterpriseInput = enterpriseInput;
    }

    public int getWorkYears() {
        return workYears;
    }

    public void setWorkYears(int workYears) {
        this.workYears = workYears;
    }

    public SettingDict getSettingNation() {
        return settingNation;
    }

    public void setSettingNation(SettingDict settingNation) {
        this.settingNation = settingNation;
    }

    public int getNation() {
        if (settingNation != null){
            return settingNation.getObjectid();
        }else {
            return nation;
        }
    }

    public void setNation(int nation) {
        this.nation = nation;
    }

    public int getApartmentCity() {
        if (settingApartmentCity != null){
            return settingApartmentCity.getObjectid();
        }else {
            return apartmentCity;
        }
    }

    public void setApartmentCity(int apartmentCity) {
        this.apartmentCity = apartmentCity;
    }

    public String getApartmentDetail() {
        return apartmentDetail;
    }

    public void setApartmentDetail(String apartmentDetail) {
        this.apartmentDetail = apartmentDetail;
    }

    public int getHometownCity() {
        if (settingHometowntCity != null){
            return settingHometowntCity.getObjectid();
        }else {
            return hometownCity;
        }
    }

    public void setHometownCity(int hometownCity) {
        this.hometownCity = hometownCity;
    }

    public String getHometownDetail() {
        return hometownDetail;
    }

    public void setHometownDetail(String hometownDetail) {
        this.hometownDetail = hometownDetail;
    }

    public SettingDict getSettingDict() {
        return settingDict;
    }

    public void setSettingDict(SettingDict settingDict) {
        this.settingDict = settingDict;
    }

    public int getEducation() {
        if (settingDict != null){
            return settingDict.getObjectid();
        }else {
            return education;
        }
    }

    public void setEducation(int education) {
        this.education = education;
    }

    public int getMarital() {
        return marital;
    }

    public void setMarital(int marital) {
        this.marital = marital;
    }

    public String getCardid() {
        return cardid;
    }

    public void setCardid(String cardid) {
        this.cardid = cardid;
    }

    public String getSignature() {
        return signature;
    }

    public void setSignature(String signature) {
        this.signature = signature;
    }

    public SettingCity getSettingApartmentCity() {
        return settingApartmentCity;
    }

    public void setSettingApartmentCity(SettingCity settingApartmentCity) {
        this.settingApartmentCity = settingApartmentCity;
    }

    public SettingCity getSettingHometowntCity() {
        return settingHometowntCity;
    }

    public void setSettingHometowntCity(SettingCity settingHometowntCity) {
        this.settingHometowntCity = settingHometowntCity;
    }

    public int getDeleteFlag() {
        return deleteFlag;
    }

    public void setDeleteFlag(int deleteFlag) {
        this.deleteFlag = deleteFlag;
    }

    public Enterprise getEnterprise() {
        return enterprise;
    }

    public void setEnterprise(Enterprise enterprise) {
        this.enterprise = enterprise;
    }

    public int getEnterpriseId() {
        if(enterprise != null){
            return enterprise.getObjectid();
        }else {
            return enterpriseId;
        }
    }

    public void setEnterpriseId(int enterpriseId) {
        this.enterpriseId = enterpriseId;
    }

    public int getEnterpriseRoot() {
        return enterpriseRoot;
    }

    public void setEnterpriseRoot(int enterpriseRoot) {
        this.enterpriseRoot = enterpriseRoot;
    }

    public SettingDict getSettingDepartmentDict() {
        return settingDepartmentDict;
    }

    public void setSettingDepartmentDict(SettingDict settingDepartmentDict) {
        this.settingDepartmentDict = settingDepartmentDict;
    }

    public int getDepartment() {
        if (settingDepartmentDict != null){
            return settingDepartmentDict.getObjectid();
        }else {
            return department;
        }
    }

    public void setDepartment(int department) {
        this.department = department;
    }

    public int getUserFlag() {
        return userFlag;
    }

    public void setUserFlag(int userFlag) {
        this.userFlag = userFlag;
    }

    public int getEmailFlag() {
        return emailFlag;
    }

    public void setEmailFlag(int emailFlag) {
        this.emailFlag = emailFlag;
    }
}
