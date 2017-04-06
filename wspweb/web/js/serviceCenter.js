require(['jquery', 'bootstrap', 'pm'], function () {
    $(function () {
        var loginUser; // 登录用户
        var isPropertyRepairEnable = false; // 物业报修是否处于有效期
        var isITRepairEnable = false; // IT报修是否处于有效期

        //根据是否登录显示登录状态
        $.ajax({
            type: 'GET',
            url: '/Setting/User/MyInfo',
            //dataType: 'json',
            async: false,
            success: function (result) {
                loginUser = result;
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
            if (loginUser == "") {
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
            if (loginUser == "") {
                $('#applyforITRepair').attr('href', '#');
                $('#loginModal').modal('show');
            } else if (isITRepairEnable == false) {
                showAlert(mssssg, 'danger');
            } else {
                $('#applyforITRepair').attr('href', '/web/applyForITRepair.html');
            }
        });

        //判断是否绑定卡
        if(loginUser.cardid==''||loginUser.cardid=='undefined'||loginUser.cardid=='null'){

            $('.bind').show();
            $('#openWindow').attr('data-target','#bindModal');
        }else{
            $('#openWindow').attr('data-target','#chongzhiModal');
            $('#formChong input[name=cardNo]').val(loginUser.cardid)
        }
        $('#close').click(function(){
            $(this).parent().parent().hide();
        });
        //充值
        var validatorFields = {
            cardNo: {
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
                        regexp:/^[0-9]{6}$/,
                        message:  '请输入6位数字'
                    }

                }
            }
        }
        $('#formChong').attr('action','/Payment/PayTransaction');
        //绑定汇智卡
        $('#form').attr('action','/Payment/QueryBindCard');
        // 初始化表单验证
        initBootstrapValidator(validatorFields);



    })
})
