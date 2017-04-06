require(['jquery', 'cookie', 'bootstrap', 'nprogress', 'pm'], function () {
    window.WSP = window.WSP || {}
    var callList = WSP.list || [];
    var userInfo = WSP.userInfo || {};
    var isLogin = WSP.isLogin;
    //生成登录注册按钮
    function generateLoginRegister() {
        if ($('#sidebar').val() != undefined || window.location.href.indexOf("/web/myWiz.html") != -1) {
            window.location.href = '/web/index.html';
        }
    }

    $(function () {
        // 顶部进度条 by Yoriki
        NProgress.start();

        var loginUser; //登录用户

        //根据是否登录显示登录状态
        // 顶部进度条 by Yoriki
        NProgress.inc(0.2);
        $.ajax({
            type: 'GET',
            url: '/Setting/User/MyInfo?timestamp='+ new Date().getTime(),
            //dataType: 'json',
            success: function (result) {

                doCook('userInfo', JSON.stringify(result));
                NProgress.inc(0.4);
                if (result.success === false) {
                    skipCheck();

                } else if (result['realName'] != undefined) {
                    loginUser = result;
                    var enterprise;

                    var userface;
                    if (loginUser['enterprise'] != null) {
                        enterprise = loginUser['enterprise']['name'];
                    } else {
                        enterprise = "";
                    }
                    if (loginUser['userFace'] != null) {
                        userface = loginUser['userFace'];
                    } else {
                        userface = "/web/images/defaultFace.png"
                    }

                    var html = [];
                    html.push('<li class="dropdown" id="loginStatus" loginstatus="true" username="'+loginUser['username']+'"><a id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img src="' + userface + '" height="40" width="40" alt="Avatar" class="img-circle"><span class="circleDot circleDot1"></span> <i class="fa fa-chevron-down"></i></a>');
                    html.push('<div class="dropdown-menu dropdown-menu-right dropdown-menu-animated" aria-labelledby="dropdownMenu2"><div class="media">')
                    html.push('<div style="word-wrap:break-word;" class="media-body media-middle"><h5 class="media-heading" style="font-size:20px;">' + loginUser['realName'] + '</h5><small>' + enterprise + '</small></div>');
                    html.push('</div><a href="/web/user/personalInfo.html" class="dropdown-item text-uppercase">个人中心</a>');
                    if (result.userFlag === 4) {
                        html.push('<a href="/web/merchant/merchantList.html" class="dropdown-item text-uppercase">商户中心</a>');
                    }
                    html.push('<a href="/web/user/changePassword.html" class="dropdown-item text-uppercase">修改密码</a>');

                    html.push('<a href="/web/user/avatarSetting.html" class="dropdown-item text-uppercase">修改头像</a>');
                    html.push('<a href="/web/user/notificationManagement.html" class="dropdown-item text-uppercase">通知管理<span class="circleDot circleDot2"></span></a>');
                    html.push('<a id="logout" href="#" class="dropdown-item text-uppercase text-muted">注销</a></div></li>')
                    //生成登录后的样式
                    $('.loginAndRegister').empty().append(html.join(''));

                    $('img[alt="Avatar"]').error(function () {
                        $('img[alt="Avatar"]').attr('src', '/web/images/defaultFace.png');
                    })
                    //判断是否有未读通知显示红点
                    $.ajax({
                        type: "get",
                        url: "/Notification/Total/GetUnReadCount",
                        dataType: "json",
                        success: function(data) {
                            if(data.msg!='0'){
                                $('.circleDot').css('display','inline-block');
                                $('.circleDot2').text(data.msg)
                            }else{
                                $('.circleDot').css('display','none');
                            }

                        }
                    });


                    //注销按钮调用接口
                    $('#logout').click(function () {
                        $.ajax({
                            type: "POST",
                            url: '/j_spring_security_logout',
                            //dataType: "json",
                            async: false,
                            success: function (result) {
                                loginUser = null;
                                window.location.reload();
                            }
                        });
                        //清除cookie
                        $.cookie('username', "", {
                            expires: -1
                        });
                        $.cookie('password', "", {
                            expires: -1
                        })
                    });
                }


                $('.loginAndRegister').slideDown(500)
                //根据判断有无登录，生成"我的小智"
                if (loginUser != null) {
                    $('#nav-myWiz').children('a').attr('href','/web/myWiz.html');
                }else{
                    $('#nav-myWiz').on('click', function(){
                        $('#login').get(0).click();
                    })
                }
                NProgress.done();
            },
            error: function (e) {
                if (e.status == 403) {
                    generateLoginRegister();
                }
            }
        });
        //myWiz是否登录
        $('#nav-myWiz').on('click',function(){
            if (!$('#loginStatus').attr('loginstatus')) {
                $("#login").show();
                return false;
            }else{
                return true;
            }
        })

        //初始化tooltip
        $('[data-toggle="tooltip"]').tooltip();

        //模态框消失事件
        $('.modal').on('hidden.bs.modal', function (e) {
            $("nav").removeClass("blur");
            $("header").removeClass("blur");
            $(".container").removeClass("blur");
        });

        //模态框出现事件
        $('.modal').on('show.bs.modal', function (e) {
            $("nav").addClass("blur");
            $("header").addClass("blur");
            $(".container").addClass("blur");
        });

        function skipCheck(){
            //若当前退出页面在商户中心/用户中心/我的小智页面,跳转到首页
            var path = window.location.pathname;
            if(path.indexOf('/merchant/') != -1 || path.indexOf('myWiz.html') != -1){
                window.location.href = '/' || '/web/index.html';
            }
        }

        //头部导航高亮
        (function highLightNav(){
            //index:首页； myWiz：我的小智；lifeCenter:生活中心； activity:活动中心； 其他：服务中心
            var arr = ['index','myWiz','services','lifeCenter','activity','serviceCenter','applyForPropertyRepair','applyForITRepair','myWorkflowDetail'];
            var path = location.pathname;
            var pathArr = path.split('/').join('.').split('.');
            var flag=false,page = 0;
            for(var i=0; i<arr.length;i++){
                var index = pathArr.indexOf(arr[i]);
                if(index != -1){
                    page = i;
                    flag = true;
                    break;
                }else{
                    //首页
                    if(path == '/'){
                        flag = true;
                        page = 0;
                        break;
                    }
                }
            }
            page = (page >= 5) ? 2:page;
            if(flag == true){
                $("#navbar a").eq(page).parent().addClass('active');
            }
        })()
        // 加载完后显示顶部导航菜单，提升用户体验 by Yoriki
        $('.fade.nprogress').addClass('in');

    });
});
