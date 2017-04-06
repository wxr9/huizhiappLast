require(['md5','jquery', 'bootstrap', 'bootstrapvalidator', 'pm'], function (md5) {
    $(function () {
        checkMust();
        //设置form的action，提交表单用
        $("#formYoriki").attr("action", '/Setting/User/ChangePassword');
        $.ajax({
            type: 'GET',
            url: '/Setting/User/MyInfo',
            dataType: 'json',
            async: true,
            success: function (result) {
                if (result.success != false) {
                    $('form [name="username"]').val(result['username']);
                }
            }
        });
        $('#forget').click(function(){  $('#forgetpsdModal').modal('show')});
        // 验证字段
        var validatorFields = {
            oldpassword: {
                validators: {
                    notEmpty: {
                        message: '当前登录密码不能为空'
                    },
                    stringLength: {
                        min: 8,
                        max: 12,
                        message: '8~12位'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: '新密码不能为空'
                    },
                    stringLength: {
                        min: 8,
                        max: 12,
                        message: '8~12位'
                    },
                    different: {
                        field: 'oldpassword',
                        message: '新密码不能和当前登录密码一致'
                    }
                }
            },
            confirmPassword: {
                validators: {
                    notEmpty: {
                        message: '请确认新登录密码'
                    },
                    stringLength: {
                        min: 8,
                        max: 12,
                        message: '8~12位'
                    },
                    identical: {
                        field: 'password',
                        message: '输入的两次新密码不一致'
                    }
                }
            }
        }

        // 初始化表单验证
        $('#formYoriki')
            .bootstrapValidator({
                message: 'This value is not valid',
                feedbackIcons: {
                    valid: '',
                    invalid: '',
                    validating: ''
                },
                fields: validatorFields
            })
            .on('success.form.bv', function (e) {
                // Prevent form submission
                e.preventDefault();

                // Get the form instance
                var $form = $(e.target);

                // Get the BootstrapValidator instance
                var bv = $form.data('bootstrapValidator');

                // 转义特殊字符，防止js注入
                checkJsInject();

                // Use Ajax to submit form data
                //密码加密
                var list = [];
                list.push('username='+$('#userName').val());
                list.push('oldpassword='+md5($('#oldpassword').val()));
                list.push('password='+md5($('#password').val()));
                list.push('confirmPassword='+md5($('#confirmpassword').val()));
                $.ajax({
                    type: "POST",
                    url: $form.attr('action'),
                    data: list.join('&'),
                    //dataType: "json",
                    async: false,
                    success: function (result) {
                        if (result.success) {
                            showAlert("密码已修改", "success");
                            setTimeout("window.location.reload()", 2000);
                        } else {
                            showAlert("原密码错误，修改失败", "danger");
                            setTimeout("window.location.reload()", 2000);
                        }
                    }
                });

                $('#formYoriki').data('bootstrapValidator').resetForm();
            })
    })
})
