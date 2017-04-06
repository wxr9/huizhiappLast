require(['jquery','pm'], function () {
    $(function () {
        checkMust();
        var user; //登录用户

        //获取个人信息
        $.ajax({
            type: 'GET',
            url: '/Setting/User/MyInfo?',
            dataType: 'json',
            async: true,
            success: function (result) {
                if (result.success == undefined) {
                    user = result;
                    var reg = /(\d{3})\d{4}(\d{4})/;
                    var userPhone = user['phone'] || '';
                    userPhone = userPhone.replace(reg, "$1****$2");
                    $('#phone').text(userPhone);
                    if(result.emailFlag == 1){
                        if(!!result.email){
                            var data = "username=" + result.username + "&email=" + result.email;
                            var username = result['username'];
                            $('#email').text(result.email + "(等待验证)")
                            $('#operate').html('<a href="##" id="refreshSend">重新发送验证</a>');
                            $('#refreshSend').bind('click',function(){
                                $.ajax({
                                    type: 'POST',
                                    url: '/SysEmail/SendAuthEmail',
                                    dataType: 'json',
                                    data: data,
                                    async: false,
                                    success: function (result) {
                                        showAlert(result.msg);
                                    }
                                });
                            })
                        }else{
                            $('#email').text("未绑定邮箱");
                            $('#operate').html("<a href='/web/user/bindEmail.html'>绑定邮箱</a>");
                        }
                        

                    }else if(result.emailFlag == 2 ){
                        $('#email').text(result.email);
                    }

                }
            }
        });

    })
})
