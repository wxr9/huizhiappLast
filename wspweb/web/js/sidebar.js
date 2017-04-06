require(['jquery'], function () {
    $(function () {
        //------------------Sidebar navigation-------------------
        $('.submenu > a').click(function (e) {
            e.preventDefault();
            var submenu = $(this).siblings('ul');
            var li = $(this).parents('li');
            var submenus = $('#sidebar li.submenu ul');
            var submenus_parents = $('#sidebar li.submenu');
            if (li.hasClass('open')) {
                if (($(window).width() > 768) || ($(window).width() < 479)) {
                    submenu.slideUp();
                } else {
                    submenu.fadeOut(250);
                }
                li.removeClass('open');
            } else {
                if (($(window).width() > 768) || ($(window).width() < 479)) {
                    submenus.slideUp();
                    submenu.slideDown();
                } else {
                    submenus.fadeOut(250);
                    submenu.fadeIn(250);
                }
                submenus_parents.removeClass('open');
                li.addClass('open');
            }
        });

        var ul = $('#sidebar > ul');

        $('#sidebar > a').click(function (e) {
            e.preventDefault();
            var sidebar = $('#sidebar');
            if (sidebar.hasClass('open')) {
                sidebar.removeClass('open');
                ul.slideUp(250);
            } else {
                sidebar.addClass('open');
                ul.slideDown(250);
            }
        });

        //根据不同情况处理左侧关于企业的导航
        $.ajax({
            type: 'GET',
            url: '/Setting/User/IsBindEnterprise?',
            data:{
                timestamp : new Date().getTime()
            },
            dataType: 'json',
            async: false,
            success: function (result) {
                if (result.success) {
                    $('#nav-enterpriseInfo-info a').attr('href', '/web/user/enterpriseInfo.html');
                }
                if (result.msg == "未绑定") {
                    $('#nav-enterpriseInfo-info a').attr('href', '/web/user/searchEnterprise.html');
                }
                if (result.msg == "审核中") {
                    $('#nav-enterpriseInfo-info a').attr('href', '/web/user/enterpriseReviewing.html');
                }
            }
        });

        $.ajax({
            method: 'GET',
            url: '/Setting/User/IsEnterpriseAdminUser?',
            dataType: 'json',
            data:{
                timestamp : new Date().getTime()
            },
            async: false,
            success: function (result) {
                if (result.success == false) {
                    $('#nav-enterpriseMemberMgt').empty();
                }
            }
        });

        //--------------------------------------根据页面地址，左侧导航设置高亮------------------
        var href = window.location.href;
        //个人资料
        if (href.indexOf("personalInfo.html") != -1) {
            $("#nav-personalInfo").addClass('active open');
            $("#nav-personalInfo-info").addClass("active");
        }
        //头像设置
        if (href.indexOf("avatarSetting.html") != -1) {
            $("#nav-personalInfo").addClass('active open');
            $("#nav-personalInfo-avatar").addClass("active");
        }
        //账户安全/修改密码/绑定手机
        if (href.indexOf("accountSafe.html") != -1 || href.indexOf("changePassword.html") != -1 || href.indexOf("bindPhone.html") != -1 || href.indexOf("bindEmail.html") != -1) {
            $("#nav-personalInfo").addClass('active open');
            $("#nav-personalInfo-safe").addClass("active");
        }
        //企业基本信息
        if (href.indexOf("enterpriseInfo.html") != -1 || href.indexOf("searchEnterprise.html") != -1 || href.indexOf("enterpriseReviewing.html") != -1) {
            $("#nav-enterpriseInfo").addClass('active open');
            $("#nav-enterpriseInfo-info").addClass("active");
        }
        //企业成员管理
        if (href.indexOf("enterpriseMemberMgt.html") != -1) {
            $("#nav-enterpriseInfo").addClass('active open');
            $("#nav-enterpriseMemberMgt").addClass("active");
        }
        //汇智卡
        if (href.indexOf("cardDetail.html") != -1) {
            $("#nav-cardDetail").addClass("active");
        }
        //评价管理
        if (href.indexOf("ratingManagement.html") != -1) {
            $("#nav-ratingManagement").addClass("active");
        }
        //红包管理
        if (href.indexOf("redpacket.html") != -1) {
            $("#nav-redpacket").addClass("active");
        }
        //通知管理
        if (href.indexOf("notificationManagement.html") != -1) {
            $("#nav-notificationManagement").addClass("active");
        }
    })
});
