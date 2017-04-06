require(['md5',"jquery","bootstrap","bootstrapvalidator"], function(md5){
$(function() {

    $(document).on('click', '#forgetpsdLink', function () {
        //关闭登陆模态框,打开忘记密码模态框
        $('#loginModal').modal('hide');
        $('#forgetpsdModal').modal('show');
    });

    $('#forgetpsdForm').attr('action', '/Setting/User/ForgetPasswordStepOne');
    $('#forgetpsdForm2').attr('action', '/Setting/User/ForgetPasswordStepTwo');

    /*点击检测用户名是否正确,正确就发送验证码,并在60秒后可重新获取验证码,返回true;
     错误就提示获取验证码失败,返回false,按钮显示重新获取验证码
     */
    $(document).on('click', '#getCodeBtn', function () {

        var username = $('#username').val();
        var codeBtn = $(this);
        var reg = /^[a-zA-Z0-9]{8,19}$/i;
        var wait = 60;
        if(reg.test(username)){
            sendCode(codeBtn);
        }else{
            showAlert("请正确填写用户名",'danger');
        }
        function sendCode(o){
            if(wait == 60){
                $.ajax({
                    type: "GET",
                    url: "/Setting/User/SendCode/" + username,
                    dataType: "json",
                    success: function (data) {
                        if (data.success) {
                            //将用户名传给表单第二步
                            showAlert(data.msg,'success');
                            $('#username2').val(username);
                            //倒计时发送验证码
                            wait--;
                            sendCode(codeBtn);
                        } else {
                            wait = 60;
                            showAlert(data.msg,'danger');
                            return false;
                        }

                    }
                })
            }
            else if(wait > 0){
                o.attr('disabled', true);
                o.val(wait + "秒后可重新发送");
                wait--;
                setTimeout(function () {
                    sendCode(codeBtn)
                }, 1000)
            }else{
                o.attr('disabled', false);
                o.val("免费获取验证码");
                wait = 60;
                clearInterval();
            }
        }
        return false;
    });

    //第一步表单验证
    $('#forgetpsdForm').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'fa fa-check',
            invalid: 'fa fa-times',
            validating: ''
        },
        fields: {
            username: {
                validators: {
                    notEmpty: {
                        message: '用户名/手机号不能为空'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9]{8,19}$/i,
                        message: '8-20位用户名或11位手机号，特殊符号不可用'
                    }
                }
            },
            code: {
                validators: {
                    notEmpty: {
                        message: '验证码不能为空'
                    },
                    stringLength: {
                        min:6,
                        max:6,
                        message: '验证码错误'
                    },
                    digits:{
                        message:'验证码为6位数字'
                    }


                }
            }
        }
    }).on('success.form.bv', function (e) {
        // Prevent form submission
        e.preventDefault();

        // Get the form instance
        var $form = $(e.target),
            validator = $form.data('bootstrapValidator'),
            submitButton = validator.getSubmitButton();
        // 转义特殊字符，防止js注入
        checkJsInject();

        // Use Ajax to submit form data
        $.ajax({
            type: "POST",
            url: $form.attr('action'),
            data: $form.serialize(),
            dataType: "json",
            async: false,
            success: function (result) {
                //提交失败, 提示验证码/用户名错误
                if(result.success){
                    $('#codeCopy').val($('#code2').val());
                    //成功,隐藏第一步模态框,显示第二步模态框
                    $('#stepOne').slideUp();
                    $('#stepTwo').slideDown();
                    //重置表单
                    validator.resetForm();
                    showAlert('验证成功','success')
                } else{
                    showAlert(result.msg, 'danger');
                    //重置表单
                    validator.resetForm();
                }
            }
        });
    }); //第一步验证结束

    //第二步表单验证
    $('#forgetpsdForm2').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'fa fa-check',
            invalid: 'fa fa-times',
            validating: ''
        },
        fields: {
            password: {
                validators: {
                    notEmpty: {
                        message: '新密码不能为空'
                    },
                    stringLength: {
                        min: 8,
                        message: '密码要超过8个字符'
                    },
                    identical:{
                        field: 'confirmpassword',
                        message:'与确认密码不一致'
                    }
                }
            },
            confirmpassword: {
                validators: {
                    notEmpty: {
                        message: '新密码不能为空'
                    },
                    identical: {
                        field: 'password',
                        message: '与确认密码不一致'
                    }

                }
            }
        }
    }).on('success.form.bv', function (e) {
        // Prevent form submission
        e.preventDefault();

        // Get the form instance
        var $form = $(e.target),
            validator = $form.data('bootstrapValidator'),
            submitButton = validator.getSubmitButton();
        // 转义特殊字符，防止js注入
        checkJsInject();
        //密码加密
        $('#username2').val($('#username').val());
        $('#newpsd').val(md5($('#newpsd').val()));
        $('#newCfmPsd').val(md5($('#newCfmPsd').val()));
        // Use Ajax to submit form data
        $.ajax({
            type: "POST",
            url: $form.attr('action'),
            data: $form.serialize(),
            dataType: "json",
            async: false,
            success: function (result) {
                if(result.success){
                    showAlert('修改成功','success')
                    //关闭忘记密码模态框
                    $('#forgetpsdModal').modal('hide');
                    //成功,隐藏第一步模态框,显示第二步模态框
                    $('#stepOne').slideDown();
                    $('#stepTwo').slideUp();
                    //打开注册页面
                    $('#loginModal').modal('show');

                }else{
                    showAlert(result.msg, 'danger');
                }
                //重置表单
                validator.resetForm();
            }
        });
    }); //第二步验证结束

    //初始化模态框
    $('#forgetpsdModal').on('show.bs.modal', function () {
        $('#forgetpsdForm').bootstrapValidator('resetForm', true);
        $('#forgetpsdForm2').bootstrapValidator('resetForm', true);
    });
    $('#forgetpsdModal').on('hide.bs.modal', function () {
        $('#forgetpsdForm').bootstrapValidator('resetForm', true);
        $('#forgetpsdForm2').bootstrapValidator('resetForm', true);
        $('#stepOne').slideDown();
        $('#stepTwo').slideUp();
    });
})
});

