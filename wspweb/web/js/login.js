require(["md5","jquery", 'pm', 'cookie', "bootstrap"], function (md5) {
    //后期需要修改的,登陆窗口关闭问题
    var path = location.pathname;
    $("#loginModal").on('click', '.close', function(){
        if(path != "/" || path != "/web/index.html" ){
            if(path.indexOf('user') != -1){
                window.location.href="/";
            }
        }
    })
    $(function () {
        $("#loginForm").attr('action', '/Login');
        //登录按钮调用接口
        $('#loginBtn').click(function () {
            //密码加密
            var truePsd = $('#psd').val();
            $('#psd2').val(md5(truePsd));
            $.ajax({
                method: "POST",
                url: '/j_spring_security_check',
                data: $("#loginForm").serialize(),
                dataType: "json",
                async: false,
                success: function (result) {
                    //Save();
                    //关闭模态框
                    if(result.success == true){
                        window.location.reload();
                    }else{
                        showAlert(result.msg,'warn');
                    }
                },
                error: function (e) {
                    if (e.status == 200 && e.responseText.toString().indexOf('admin/js/form-common.js') != -1) {
                        //Save();
                        //关闭模态框
                        $("#loginModal").modal("hide");
                        window.location.reload();
                    } else if (e.responseText.toString().indexOf('admin/js/login.js') != -1) {
                        showAlert("用户名/密码错误!", 'danger'); // 密码错误时
                    } else if (e.status == 500) {
                        showAlert("用户名/密码错误!", 'danger'); // 用户名错误时
                    } else if (e.status == 403) {
                        showAlert("您的账户没有权限，请联系管理员。", 'danger'); // 该用户无权限时
                    } else {
                    }
                }
            });
        });
        //登录框显示的时候enter键登录
        $('#loginModal').on('show.bs.modal',function(event){
            $('body').keypress(function(event){
                if(event.which == '13'){
                    $('#loginBtn').click();
                }
            })
        })

    });
})
