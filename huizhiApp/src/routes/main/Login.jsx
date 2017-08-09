import { createForm } from 'rc-form';
import React from 'react';
import LoginInner from '../../components/main/Login/LoginInner';

// 登录
class Login extends React.Component {
  constructor (props) {
    super(props);
    // console.log(this.props.location.query);
  }
  componentWillMount () {
    var lastUrl = this.props.location.query.url;
    localStorage.lastUrl = lastUrl;
  }
  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <LoginInner/>
      </div>
    );
  }
}

const LoginWrapper = createForm()(Login);
export default LoginWrapper;
