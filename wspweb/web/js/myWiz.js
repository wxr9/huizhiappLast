require(['jquery', 'bootstrap', 'datatables', 'pm', 'select2', 'raty'], function () {

    $(function () {
        var loginUser; // 登录用户
        var isPropertyRepairEnable = false; // 物业报修是否处于有效期
        var isITRepairEnable = false; // IT报修是否处于有效期
        var target = queryString('title');
        // console.log(target);
        if(target == 'apply'){
            $('.myRecord>li:eq(1) a').tab('show');
        }
        //根据是否登录显示登录状态
        $.ajax({
            type: 'GET',
            url: '/Setting/User/MyInfo',
            //dataType: 'json',
            async: false,
            success: function (result) {
                loginUser = result;
                $('input[name=memberNo]').val(result.name)
            }
        })
        var mssssg = "";
        //申请物业报修
        //如果没有登录，弹出登录框
        //如果非有效时间，弹出提示
        $('#applyforPropertyRepair').click(function () {
            //获取物业报修是否处于申请有效期
            $.ajax({
                type: 'GET',
                url: '/Setting/CheerDay/IsRepairEnable/1',
                //dataType: 'json',
                async: false,
                success: function (result) {
                    mssssg = result.msg;
                    if (result.success) {
                        isPropertyRepairEnable = true;
                    }
                }
            });
            if (loginUser.toString().indexOf('登录失败') != -1) {
                $('#applyforPropertyRepair').attr('href', '#');
                $('#loginModal').modal('show');
            } else if (isPropertyRepairEnable == false) {
                showAlert(mssssg, 'danger');
            } else {
                $('#applyforPropertyRepair').attr('href', '/web/applyForPropertyRepair.html');
            }
        });

        //申请IT网络报修
        //如果没有登录，弹出登录框
        //如果非有效时间，弹出提示
        $('#applyforITRepair').click(function () {
            //获取IT报修是否处于申请有效期
            $.ajax({
                type: 'GET',
                url: '/Setting/CheerDay/IsRepairEnable/2',
                //dataType: 'json',
                async: false,
                success: function (result) {
                    mssssg = result.msg;
                    if (result.success) {
                        isITRepairEnable = true;
                    }
                }
            });
            if (loginUser.toString().indexOf('登录失败') != -1) {
                $('#applyforITRepair').attr('href', '#');
                $('#loginModal').modal('show');
            } else if (isITRepairEnable == false) {
                showAlert(mssssg, 'danger');
            } else {
                $('#applyforITRepair').attr('href', '/web/applyForITRepair.html');
            }
        });

        //页面加载完后小智闪亮登场～ by Yoriki
        $('#xzImg').addClass('in').addClass('animated fadeInRight');
        //页面加载完后再显示“我的业务”，使页面更流畅，提升用户体验 by Yoriki
        $('.pageContent').addClass('in');
        $('#one').addClass('in');
        $('#two').addClass('in');
        //二期新表单
    })
});
