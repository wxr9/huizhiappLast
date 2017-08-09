import {List, InputItem, WingBlank, Checkbox, Card, Button,Modal,Toast} from 'antd-mobile';
import {createForm} from 'rc-form';
import React from 'react';
import {Link} from 'react-router';

import requestGET from '../../../utils/requestGET';
import request from '../../../utils/requestPOST';
import config from '../../../config';

const AgreeItem = Checkbox.AgreeItem;
const alert = Modal.alert;

/**
 *  申请汇智卡表单部分
 */
class ApplyCardPart2 extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      checked:false,
      disabled:false,//勾选同意须知
      applyCardInfo:{},//已申请卡信息
      isApplyCard:false,//是否已申请卡
      submitDisabled:"",//已申请按钮不可用
    };
  }
  componentWillMount () {
    requestGET(config.ApplyCardInfoUrl).then((data) => {//从配置文件中读取url
      console.log(data);
      if(data.total > 0){//已申请卡
        let applyCardInfo = data.result[0];
        console.log(applyCardInfo);
        this.setState({
          applyCardInfo: applyCardInfo,
          isApplyCard:true,
          submitDisabled:"disabled",
        });
        console.log(this.state.applyCardInfo);
      }else {
        //从缓存中读取用户个人信息
        let userInfo = JSON.parse(localStorage.userInfo);
        console.log(userInfo);
        let applyCardInfo ={};
        applyCardInfo.username = userInfo.username;
        applyCardInfo.email = userInfo.email;
        applyCardInfo.company = userInfo.enterpriseInput;
        // applyCardInfo.realname = userInfo.realName;
        applyCardInfo.idcard = '';
        applyCardInfo.contact = userInfo.phone;
        this.setState({
          applyCardInfo: applyCardInfo,
          isApplyCard:false,
          submitDisabled:"",
        });
      }
    });
  }
  //同意须知
  agreeApply(e){
    if(e.target.checked){
      this.state.disabled=true;
      console.log("同意须知"+this.state.disabled);
    } else{
      this.state.disabled=false;
      console.log(this.state.disabled);
    }
  }

  /*----------表单验证部分-start-----------*/
  /*身份证号验证*/
  validateIdCard = (rule, value, callback) => {
    let re = /^\d{17}(\d|X)$/;
    if(re.test(value)){
      callback();
    }else{
      callback(new Error('身份证格式错误！'));
    }
  };

  /*邮箱验证*/
  validateEmail = (rule, value, callback) => {
    let re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    if(re.test(value)){
      callback();
    }else{
      callback(new Error('邮箱格式错误！'));
    }
  };
  /*手机号验证*/
  validatePhone = (rule, value, callback) => {
    let re = /^1[34578]\d{9}$/;
    if(re.test(value)){
      callback();
    }else{
      callback(new Error('手机号格式错误！'));
    }
  };
  /*验证公司*/
  validateCompany = (rule, value, callback) => {
    // value = value.replace(" ","").replace(" ","");
    let re = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、\s+]/im;
    if(!re.test(value)){
      callback();
    }else{
      callback(new Error('公司名包含特殊字符！'));
    }
  };
  /*----------表单验证部分-end-----------*/

  /*----------表单提交部分-start---------*/
  onSubmit = () => {
    if (this.state.isApplyCard) {
      alert("您已申请过卡，不可再次申请！");
    } else {

      let state = this.state.disabled;
      if (state) {
        this.props.form.validateFields({force: true}, (error) => {
          if (!error) {
            let applyInfo = this.props.form.getFieldsValue();
            let username = applyInfo.username;
            let email = applyInfo.email;
            let company = applyInfo.company;
            let phone = applyInfo.phone;
            let realname = applyInfo.realname;
            let IdCard = applyInfo.IdCard;
            let params = "username=" + username + "&email=" + email + "&company=" + company +
              "&phone=" + phone + "&realname=" + realname + "&IdCard=" + IdCard;
            let data = {
              username: username,
              email: email,
              company: company,
              contact: phone,
              realname: realname,
              idcard: IdCard
            };
            console.log(data);
            //轻提示，1秒后消失
            Toast.loading('提交中...', 0);
              request(config.applyAddUrl, data).then((data) => {//从配置文件中读取url
                if (data.success) {//提交成功
                  Toast.hide();
                  alert("申请已提交，请耐心等待结果。");
                  window.location.href = "#index/unbound";     //已绑定汇智卡
                } else {
                  Toast.hide();
                  alert(data.msg);
                }
              })
          }
        })
      } else {
        alert("请勾选同意须知");
      }
    }
  };
  /*----------表单提交部分-end---------*/

  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    const { applyCardInfo, submitDisabled } = this.state;
    let realName = "";
    let idcard = "";
    if(submitDisabled === "disabled"){
      realName = applyCardInfo.realname;
      idcard = applyCardInfo.idcard;
    }
    return (
      <form>
        <div>
          <WingBlank
            style={{
              marginTop: '10px',
            }}
          >
            <AgreeItem
              onChange={(e)=>this.agreeApply(e)}>同意须知</AgreeItem>
            <List className="ApplyCard_List">
              <InputItem
                className="ApplyCard_InputItem"
                {...getFieldProps('username',{
                  initialValue: applyCardInfo.username,
                  rules:[
                    { required: true, message: '请输入用户名' },
                    { validator: this.validateUsername },
                  ]
                })}
                clear
                error={!!getFieldError('username')}
                onErrorClick={() => {
                  alert(getFieldError('username').join('、'));
                }}
                maxLength = "20"
                placeholder="请输入用户名"
              ><span className="ApplyCard_label_color">*</span> 申请人</InputItem>
            </List>
            <List className="ApplyCard_List">
              <InputItem
                className="ApplyCard_InputItem"
                {...getFieldProps('email',{
                  initialValue: applyCardInfo.email,
                  rules:[
                    { required: true, message: '请输入邮箱' },
                    { validator: this.validateEmail },
                  ]
                })}
                clear
                error={!!getFieldError('email')}
                onErrorClick={() => {
                  alert(getFieldError('email').join('、'));
                }}
                placeholder="请输入邮箱"
              ><span className="ApplyCard_label_color">*</span>E-mail</InputItem>
            </List>
            <List className="ApplyCard_List">
              <InputItem
                className="ApplyCard_InputItem"
                {...getFieldProps('company',{
                  initialValue: applyCardInfo.company,
                  rules:[
                    { required: true, message: '请输入公司名称' },
                    { validator: this.validateCompany },
                  ]
                })}
                clear
                error={!!getFieldError('company')}
                onErrorClick={() => {
                  alert(getFieldError('company').join('、'));
                }}
                maxLength = "30"
                placeholder="请输入公司名称"
              ><span className="ApplyCard_label_color">*</span> 公司名称</InputItem>
            </List>
            <List className="ApplyCard_List">
              <InputItem
                className="ApplyCard_InputItem"
                {...getFieldProps('phone',{
                  initialValue: applyCardInfo.contact,
                  rules:[
                    { required: true, message: '请输入手机号' },
                    { validator: this.validatePhone },
                  ]
                })}
                clear
                error={!!getFieldError('phone')}
                onErrorClick={() => {
                  alert(getFieldError('phone').join('、'));
                }}
                type="number"
                maxLength="11"
                placeholder="请输入手机号"
              ><span className="ApplyCard_label_color">*</span> 联系方式</InputItem>
            </List>
            <List className="ApplyCard_List">
              <InputItem
                className="ApplyCard_InputItem"
                {...getFieldProps('realname',{
                  initialValue: realName,
                  rules:[
                    { required: true, message: '请输入真实姓名' },
                    { validator: this.validateRealname },
                  ]
                })}
                clear
                error={!!getFieldError('realname')}
                onErrorClick={() => {
                  alert(getFieldError('realname').join('、'));
                }}
                maxLength = "20"
                placeholder="请输入真实姓名"
              ><span className="ApplyCard_label_color">*</span> 真实姓名</InputItem>
            </List>
            <p className="ApplyCard_p">提示：真实姓名需与身份证上一致</p>
            <List className="ApplyCard_List">
              <InputItem
                className="ApplyCard_InputItem"
                {...getFieldProps('IdCard',{
                  initialValue: idcard,
                  rules:[
                    { required: true, message: '请输入身份证号' },
                    { validator: this.validateIdCard },
                  ]
                })}
                clear
                error={!!getFieldError('IdCard')}
                onErrorClick={() => {
                  alert(getFieldError('IdCard').join('、'));
                }}
                placeholder="请输入身份证号"
                maxLength = "18"
              ><span className="ApplyCard_label_color">*</span> 身份证</InputItem>
            </List>

            <div className="ApplyCard_div_btn">
                <Button disabled = { this.state.submitDisabled }
                  className="boatOrder_submit" ref="ApplyCard_btn" type="primary"
                   onClick={this.onSubmit}
                >提交</Button>
            </div>
          </WingBlank>
        </div>
      </form>
    );
  }
}

const ApplyCardPart2Wrapper = createForm()(ApplyCardPart2);
export default ApplyCardPart2Wrapper;
