require(['md5','jquery', 'cookie', 'pm', 'bootstrapvalidator'], function (md5) {

    $(document).ready(function () {
	    var de = $.cookie('defaultName');
				if(de != undefined){
					$("#username").val(de);
				}
        $("#loginForm").attr('action', '/j_spring_security_check');

        //登录按钮调用接口
        $('#submitBtn').click(function () {
	        var defaultName = $('#username').val();
            //密码加密
            var truePsd = $('#password').val();
            $("#password2").val(md5(truePsd));
            $.ajax({
                method: "POST",
                url: '/j_spring_security_check',
                data: $("#loginForm").serialize(),
                dataType: "json",
                async: false,
                success: function (result) {
                    //saveUserInfo();
	                $.cookie('defaultName',defaultName);
	                if(result.success === true){
                        var redirect =queryString('redirect');
                        if(redirect){
                            window.location.href = redirect;
                        }else{
                            window.location.href = '/admin/form-common.html';
                        }
	                }else{
                        showAlert(result.msg,'danger');
                    }
                },
                error: function (e) {
                    if (e.status == 200 && e.responseText.indexOf("登录") == -1) {
	                    $.cookie('defaultName',defaultName);
	                    //saveUserInfo();
                        window.location.href = '/admin/form-common.html';
                    } else if (e.status == 200 && e.responseText.indexOf("登录") != -1) {
                        showAlert("用户名/密码错误!", 'danger');
                    } else if (e.status == 500) {
                        showAlert("用户名/密码错误!", 'danger');
                    } else if (e.status == 403) {
                        showAlert("您的账户没有权限，请联系管理员。", 'danger');
                    } else {
                    }
                }
            });
        });

        $('body').keypress(function(event){
            if(event.which == '13'){
                $('#submitBtn').click();
            }
        })
    });
})
