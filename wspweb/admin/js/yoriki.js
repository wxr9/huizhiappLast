require(['jquery', 'bootstrap'], function () {
    $(function () {
        var loginUser; //登录用户

        //如果没有登录，跳转至登录界面
        $.ajax({
            type: 'GET',
            url: '/Setting/User/MyInfo?timestamp=' + new Date().getTime(),
            //dataType: 'json',
            async: false,
            success: function (result) {
                if (result.success === false) {
                    if(window.location.pathname != '/admin/login.html'){
                        window.location.href="/admin/login.html"
                    }
                } else {
                    loginUser = result;
                    $('#loginUserName').append(loginUser['realName']);
                    //注销按钮调用接口
                    $('#logout').click(function () {
                        $.ajax({
                            method: "POST",
                            url: '/j_spring_security_logout',
                            dataType: "json",
                            async: false,
                            success: function (result) {
	                            if(result.success === true){
                                    var redirect = encodeURI(window.location.pathname);
		                            window.location.href = '/admin/login.html?redirect=' + redirect;
	                            }
                            }
                        });
                    });
                }
            }
        });

        //模态框消失事件
        $('.modal').on('hidden.bs.modal', function (e) {
            //$("#header").removeClass("blur");
            //$("#sidebar").removeClass("blur");
            //$(".content").removeClass("blur");
        });

        //模态框出现事件
        $('.modal').on('show.bs.modal', function (e) {
            //$("#header").addClass("blur");
            //$("#sidebar").addClass("blur");
            //$(".content").addClass("blur");
        });
    })
})
