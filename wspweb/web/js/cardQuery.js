/**
 * Created by Administrator on 2016/4/18.
 */
require(['jquery', 'bootstrap','bootstrapvalidator'], function() {
    $(function(){
        var validatorFields = {
            carNo:{
                validators: {
                    notEmpty: {
                        message: '卡号不能为空'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: '密码不能为空'
                    },
                    regexp: {
                        regexp: /^[0-9]{6}$/,
                        message: '6位数字'
                    }

                }
            },
            //authCode:{
            //    validators: {
            //        notEmpty: {
            //            message: '验证码不能为空'
            //        }
            //    }
            //}
        }
        var user;//登录用户
        $.ajax({
            type: 'GET',
            url: '/Setting/User/MyInfo',
            dataType: 'json',
            async: false,
            success: function (result) {
                user = result;
            }
        })
        var userName=user.name;
        $("#form").attr('action','/Payment/QueryBindCard');
        // 初始化表单验证
        initValidator(validatorFields);
        function initValidator(fieldsList, callback) {
            $('form')
                .bootstrapValidator({
                    message: 'This value is not valid',
                    excluded: [':disabled'],
                    feedbackIcons: {
                        valid: '',
                        invalid: '',
                        validating: ''
                    },
                    fields: fieldsList
                })
                .on('success.form.bv', function (e) {
                    // Prevent form submission
                    e.preventDefault();

                    // Get the form instance
                    var $form = $(e.target),
                        validator = $form.data('bootstrapValidator'),
                        submitButton = validator.getSubmitButton();
                    checkJsInject();
                    // 转义特殊字符，防止js注入
                    var data = $form.serialize();
                    // Use Ajax to submit form data
                    $.ajax({
                        type: "POST",
                        url: $form.attr('action'),
                        data: data,
                        dataType: "json",
                        async: false,
                        success: function (result) {
                            if(result.success == 'false'){
                                showAlert(result.msg,'warn')
                            }else{
                                showAlert(result.msg);
                                window.location.href = '/web/user/cardQueryDetail.html?cardNo='+$('input[name=cardNo]').val()+'&userName='+userName;
                            }
                            //关闭模态框
                            $("#editModal").modal("hide");
                            $("#addModal").modal("hide");
                            //重置表格
                            validator.resetForm();
                            if(Object.prototype.toString.call(callback) == '[object Function]'){
                                callback();
                            }else if(callback && callback.end){
                                callback.end(result);
                            }
                        }
                    });

                    //window.location.reload();
                })
                .on('click', 'button[data-dismiss]', function () {
                    $('form').data('bootstrapValidator').resetForm();
                });
        }
        //验证码
        $('#vimg').click(function(){
            //重新加载验证码，达到刷新的目的
            $(this).attr('src',"/WiseAuth/AuthImageServlet?t=" + Math.random()) // 防止浏览器缓存的问题
        });
    })
})
