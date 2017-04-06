require(['jquery', 'bootstrap','bootstrapvalidator', 'pm'], function () {
    checkMust();
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
    var options = {
        email: {
            validators: {
                notEmpty: {
                    message: '邮箱号不能为空'
                },
                emailAddress: {
                    message: '请输入正确的邮箱号'
                }
            }
        }
    };
    $('#bindEmailForm').attr('action','/SysEmail/SendAuthEmail');
    initBootstrapValidator(options,function(){
        setTimeout(function(){window.location.href = '/web/user/accountSafe.html'},4000);
    });



});
