require(['jquery', 'bootstrap', 'datatables', 'pm', 'select2', 'raty'], function () {

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
        var bind; // 是否绑定
        //根据是否绑定显示绑定的状态
        $.ajax({
            type: 'get',
            url: '/Setting/User/MyInfo',
            dataType: 'json',
            success: function (result) {
                //bind==-1 没有绑定
                bind = result.cardid;
                //如果没有绑定，隐藏解绑、充值按钮
                if (bind !='null'&&bind !=''&&bind !='undefined') {
                    $('#cardNum').text('汇智卡号：'+bind.substr(0,3)+'****'+bind.substr(13,16));
                    $('#bind').hide();
                    $('input[name=memberNo]').val(result.name)
                    $.ajax({
                        type: 'post',
                        url: '/BizPayment/QueryCardBalance',
                        data:{
                            merchantNo:'000006666666666',
                            cardNo:bind,
                            memberNo:result.name
                        },
                        dataType: 'json',
                        success: function (data) {

                            //主账户余额
                            $('#mainAccount .money').html(parseInt(data.edBalance));
                            $('#eWallet .money').html(parseInt(data.epBalance));
                        }
                    })
                }
            }
        })
        //var validatorFields = {
        //    cardNo: {
        //        validators: {
        //            notEmpty: {
        //                message: '卡号不能为空'
        //            },
        //            regexp: {
        //                regexp:/^[0-9]{12}$/,
        //                message:  '请输入12位数字'
        //            }
        //        }
        //    },
        //    password: {
        //        validators: {
        //            notEmpty: {
        //                message: '密码不能为空'
        //            },
        //            regexp: {
        //                regexp:/^[0-9]{6}$/,
        //                message:  '请输入6位数字'
        //            }
        //
        //        }
        //    },
        //    authCode:{
        //        validators: {
        //            notEmpty: {
        //                message: '验证码不能为空'
        //            }
        //        }
        //    }
        //}
        //$('#form').attr('action','/Payment/QueryBindCard');
        //initBootstrapValidator(validatorFields);
        ////验证码
        //$('#vimg1').click(function(){
        //    //重新加载验证码，达到刷新的目的
        //    $(this).attr('src',"/WiseAuth/AuthImageServlet?t=" + Math.random()) // 防止浏览器缓存的问题
        //});
        //绑定
        var validatorFields = {
            memberNo: {
                validators: {
                    notEmpty: {
                        message: '不能为空'
                    }
                }
            }
        }
        initBootstrapValidator(validatorFields);
        var data=$("#form").serialize();
        $('#form').attr('action','/BizPayment/BindUnBindCard')

        $('#bindCfm').click(function(){
            $.ajax({
                url : '/BizPayment/BindUnBindCard',
                method : 'post',
                data  : data,
                dataType:'json',
                success : function(data){
                    //$('input[name=merSignMsg]').val(data.msg.merSignMsg);
                    //$('input[name=tranData]').val(data.msg.tranData);
                    //$('#form').attr('action',data.msg.postUrl);
                    $('#link1').attr('href',data.msg.postUrl+'?merSignMsg='+data.msg.merSignMsg+'&tranData='+data.msg.tranData)
                    document.getElementById("link1").click();
                }
            });

        })

    })
});
