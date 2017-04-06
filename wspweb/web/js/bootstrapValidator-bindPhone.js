require(['jquery', 'bootstrap', 'bootstrapvalidator', 'pm'], function () {
    $(function () {
        checkMust();

        var wait = 60; //发送校验码等待时间

        function time(o) {
            if (wait == 0) {
                o.removeAttribute("disabled");
                o.innerHTML = '获取校验码';
                wait = 60;
            } else {
                o.setAttribute("disabled", true);
                o.innerHTML = wait + "秒后可以重新发送";
                wait--;
                setTimeout(function () {
                        time(o)
                    },
                    1000)
            }
        }
        document.getElementById("getPhoneCodeBtn").onclick = function () {
            var that = this;
            var phone = $('#phone').val();

            $.ajax({
                type: 'GET',
                url: ' /Public/Phone/SendCode/' + phone,
                dataType: 'json',
                async: false,
                success: function (result) {
                    if(result.success) {
                        showAlert(result.msg, 'success');
                        time(that);
                    }
                    else{
                        showAlert(result.msg,'danger');
                    }

                }
            });

        }

        //设置form的action，提交表单用
        $("#formYoriki").attr("action", '/Setting/User/ChangePhone');

        //获取登录用户信息
        $.ajax({
            type: 'GET',
            url: '/Setting/User/MyInfo',
            dataType: 'json',
            async: false,
            success: function (result) {
                if (result.success != false) {
                    $('form [name="username"]').val(result['username']);
                }
            }
        });

        // 验证字段
        var validatorFields = {
            phone: {
                validators: {
                    notEmpty: {
                        message: '新手机号不能为空'
                    },
                    regexp: {
                        regexp: /^0?1[3|4|5|8][0-9]\d{8}$/,
                        message: '请输入11位手机号'
                    }
                }
            },
            code: {
                validators: {
                    notEmpty: {
                        message: '校验码不能为空'
                    },
                    stringLength: {
                        min: 6,
                        max: 6,
                        message: '请输入6位校验码'
                    },
                    regexp: {
                        regexp: /^[0-9]*$/,
                        message: '校验码必须为数字'
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
                $.ajax({
                    type: "POST",
                    url: $form.attr('action'),
                    data: $form.serialize(),
                    //dataType: "json",
                    async: false,
                    success: function (result) {
                        if (result.success) {
                            showAlert("新手机已绑定", "success");
                            setTimeout("window.location.href = '/web/user/accountSafe.html'", 2000);
                        } else {
                            showAlert("校验码错误，新手机绑定失败", "danger");
                            setTimeout("window.location.reload()", 2000);
                        }
                    }
                });

                $('form').data('bootstrapValidator').resetForm();
            })
            .on('error.field.bv', function (e, data) {
                if (data.field == 'phone') {
                    // The postal code is not valid
                    $('#getPhoneCodeBtn').prop('disabled', true).removeClass('btn-success');
                }
            })
            .on('success.field.bv', function (e, data) {
                if (data.field == 'phone') {
                    // The postal code is valid
                    $('#getPhoneCodeBtn').prop('disabled', false).addClass('btn-success');
                }
            });
    })
})
