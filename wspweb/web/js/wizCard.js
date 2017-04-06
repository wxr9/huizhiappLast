/**
 * Created by z on 2016/10/14.
 */
require(['jquery', 'bootstrap', 'pm','bootstrapvalidator',], function() {
    $(function () {

        var bind; // 是否绑定
        var userName;
        var trueMoney = $('#tureAmtCount'); //实际金额
        var redMoney = 0; //红包金额
        var recharge = 50; //冲值默认值
        var discount = 0; //优惠金额
        var usePacket = $('#usePacket');
        var packetSelect = $('#packet-select');
        var cardBtns = $('#cardInfo a');
        var rechargeForm = document.forms.rechargeForm;
        
        // $('#chongzhiModal .modal-body').empty().append('<div style="color:#F44336;letter-spacing:1px">由于支付网络通道切割，暂时停止线上充值，开放时间请关注汇智e站通知</div>');
        // $('#chongzhiModal .modal-footer').empty().append('<button class="btn btn-default" data-dismiss="modal">关闭</button>');
        //根据是否绑定显示绑定的状态
        $.ajax({
            type: 'get',
            url: '/Setting/User/MyInfo',
            dataType: 'json',
            success: function (result) {

                
                // bind==-1
                bind = result.cardid;
                userName=result.username;
                if (typeof bind != "string" || bind.length < 3) {
                    //按钮绑定显示
                    $.each(cardBtns,function(ind,val){
                        var id = val.id;
                        if(id == 'bind'){
                            $(this).show();
                        }else if(id == 'cardNum'){
                            $(this).text('[未绑定]');
                        }
                    });
                    // 是否申请了汇智卡
                    $.ajax({
                        type:'GET',
                        url:'/CardApply/Person/Me/List/0/0',
                        dataType:'json',
                        success:function(res){
                            var len = res.total;
                            if(len > 0){
                                var data = res.result[0];
                                var info = $('#applyInfo');
                                info.show();
                                var href = info.attr('href')+"?objectid="+data.id;
                                info.attr("href",href);
                            }else{
                                $('#apply').show();
                            }
                        }
                    });
                } else {
                    $('input[name=cardNo]').val(bind);
                    //绑定状态按钮解绑/充值显示
                    $.each(cardBtns,function(ind,val){
                        var id = val.id;
                        if(id == 'unbind' || id == 'recharge' || id == 'guashi' || id == "jiegua"){
                            $(this).show();
                        }else if(id == 'cardNum'){
                            $(this).text(bind.slice(4,8) + '***' + bind.slice(-4));
                        }
                    });
                    //公告
                    $.ajax({
                        type: 'GET',
                        url: '/Payment/Annoucement/Judge',
                        dataType: 'json',
                        success: function(data){
                            if(!data.success){
                                $('#notice').text("公告：" + data[0].content);
                            }
                        }
                    })
                    //账户金额显示
                    $.ajax({
                        type: 'post',
                        url: '/BizPayment/QueryCardBalance?time='+ new Date(),
                        data: {
                            merchantNo:'000006666666666',
                            cardNo: bind,
                            memberNo: 2
                        },
                        dataType: 'json',
                        success: function (data) {
                            //主账户余额
                            $('#mainAccount').html(data.edBalance);
                            $('#eWallet').html(data.epBalance);
                        }
                    })
                    //充值表单初始化
                    rechargeForm.memberNo.value = userName;
                    rechargeForm.cardNo.value = bind;
                    rechargeForm.orderAmt.value = 50; //默认金额
                    //打折or使用红包
                    $.ajax({
                        type:'GET',
                        url:'/BizPayment/CardReChargeEnableDiscount?time='+ new Date(),
                        dataType:'json',
                        success:function(result){
                            if(result.msg == "true" || result.msg == true){
                                //打折优惠金额
                                $('#redpacketBox').css('display','none');
                                $.ajax({
                                    type: 'post',
                                    url: '/BizPayment/CardReChargeDiscount',
                                    data:{
                                        orderAmtCount:50
                                    },
                                    dataType:'json',
                                    success: function (data) {
                                        $('#orderAmtCount').text('优惠金额：'+data.msg+'元');
                                        discount = + data.msg;
                                        rechargeForm.orderAmtCount.value = discount;//默认充50
                                        trueMoney.text(recharge - discount);
                                    }
                                });
                                $('#price').on('click','li',function(){
                                    $(this).addClass('active').siblings().removeClass('active');
                                    var amount = $(this).text().substr(1);
                                    rechargeForm.orderAmt.value = amount;
                                    recharge = +amount;
                                    //优惠
                                    $.ajax({
                                        type: 'post',
                                        url: '/BizPayment/CardReChargeDiscount',
                                        data:{
                                            orderAmtCount:amount
                                        },
                                        dataType:'json',
                                        success: function (data) {
                                            // trueMoney.text(recharge - parseFloat(data.msg));
                                            $('#orderAmtCount').text('优惠金额：'+data.msg+'元');
                                            discount = + data.msg;
                                            rechargeForm.orderAmtCount.value = discount;
                                            trueMoney.text(recharge - discount);
                                        }
                                    })

                                });

                            }else{
                                //使用红包
                                //有效红包列表
                                $.ajax({
                                    method:"GET",
                                    url:'/RedPacket/User/Valid/List?time='+ new Date(),
                                    dataType:'json',
                                    success:function(result){

                                        if(result.length != 0){
                                            rechargeForm.orderAmtCount.value = result[0].id;//默认使用第一个红包
                                            var html=[];
                                            for(var i=0, len=result.length; i<len; i++){
                                                var data = result[i];
                                                html.push('<option objectid="'+data.id+'" value="'+data.sum+'">'+data.sum+'元&nbsp;&nbsp;('+data.validateDate.slice(0,10)+'到期)'+'</option>');
                                            }
                                            packetSelect.empty().append(html.join(''));
                                            redMoney = +result[0].sum;
                                        }else{
                                            usePacket.attr('disabled','disabled');
                                            usePacket.next().text('无可用红包');
                                        }

                                        packetSelect.on('change',function(){
                                            if(usePacket.is(':checked')){
                                                redMoney = +$(this).val();
                                                var money = recharge - redMoney;
                                                trueMoney.text(money.toFixed(2));
                                                rechargeForm.orderAmtCount.value = $('#packet-select option:selected').attr('objectid');
                                            }

                                        })
                                    }
                                });
                                //使用红包
                                usePacket.on('click',function(){
                                    if($(this).is(':checked')){
                                        packetSelect.css('display','block');
                                        redMoney = +packetSelect.val();
                                        var money = recharge - redMoney;
                                        trueMoney.text(money.toFixed(2));
                                        rechargeForm.orderAmtCount.value = $('#packet-select option:selected').attr('objectid');
                                    }else{
                                        packetSelect.css('display','none');
                                        trueMoney.text(recharge);
                                        redMoney = 0;
                                    }
                                })

                                $('#price').on('click','li',function(){
                                    $(this).addClass('active').siblings().removeClass('active');
                                    var amount = $(this).text().substr(1);
                                    rechargeForm.orderAmt.value = amount;
                                    recharge = +amount;
                                    if(usePacket.is(':checked')){
                                        redMoney = +packetSelect.val();
                                        var money = recharge - redMoney;
                                        trueMoney.text(money.toFixed(2));
                                        rechargeForm.orderAmtCount.value = $('#packet-select option:selected').attr('objectid');
                                    }else{
                                        trueMoney.text(amount);
                                    }
                                });

                            }

                            var validatorFields = {
                                memberNo: {
                                    validators: {
                                        notEmpty: {
                                            message: '用户名不能为空'
                                        }
                                    }
                                },
                                orderAmt: {
                                    validators: {
                                        notEmpty: {
                                            message: '充值金额不能为空'
                                        }
                                    }
                                }
                            };
                            $('#chongCfm').click(function(){
                                data = $(rechargeForm).serialize();
                                initBootstrapValidator(validatorFields);
                                $.ajax({
                                    url: '/BizPayment/CardReCharge',
                                    method: 'post',
                                    data: data,
                                    dataType: 'json',
                                    success: function (data) {
                                        if(data.code=='0000'){
                                            $('#link').attr('href', data.url);
                                            document.getElementById("link").click();
                                        }
                                        $('#chongzhiModal').modal('hide');
                                    }
                                });
                            })
                        }
                    });
                    //解绑卡号显示
                    $('.cardNo').text(bind);
                    //解绑
                    $('#unbindCfm').click(function(){
                        $.ajax({
                            type: 'post',
                            url: '/BizPayment/BindUnBindCard',
                            data: {
                                merchantNo: '000006666666666',
                                memberNo: userName,
                                type: '2',
                                cardNo: bind
                            },
                            dataType: 'json',
                            success: function (result) {
                                $('#link2').attr('href', result.msg.postUrl + '?merSignMsg=' + result.msg.merSignMsg + '&tranData=' + result.msg.tranData + '&cardNo=' + bind);
                                document.getElementById("link2").click();
                                $('#unbindModal').modal("hide");
                                setTimeout(function(){
                                    window.location.reload();
                                },3000)
                            }
                        })

                    });
                    //挂失
                    $('#guashiCfm').click(function(){
                        $.ajax({
                            type:'post',
                            url:'/BizPayment/LostHangCard',
                            data:{
                                merchantNo: '000006666666666',
                                memberNo: userName,
                                type: '1',
                                cardNo: bind
                            },
                            dataType:'json',
                            success:function(result){
                                $('#link3').attr('href', result.msg.postUrl + '?merSignMsg=' + result.msg.merSignMsg + '&tranData=' + result.msg.tranData + '&cardNo=' + bind);
                                document.getElementById("link3").click();
                                $('#guashiModal').modal("hide");
                                // setTimeout(function(){
                                //     window.location.reload();
                                // },3000)

                            }
                        })
                    })
                    //解挂
                    $('#jieguaCfm').click(function(){
                        $.ajax({
                            type:'post',
                            url:'/BizPayment/LostHangCard',
                            data:{
                                merchantNo: '000006666666666',
                                memberNo: userName,
                                type: '2',
                                cardNo: bind
                            },
                            dataType:'json',
                            success:function(result){
                                $('#link4').attr('href', result.msg.postUrl + '?merSignMsg=' + result.msg.merSignMsg + '&tranData=' + result.msg.tranData + '&cardNo=' + bind);
                                document.getElementById("link4").click();
                                $('#jieguaModal').modal("hide");
                                // setTimeout(function(){
                                //     window.location.reload();
                                // },3000)

                            }
                        })
                    })

                }

                //绑定
                $('.container').on('click','#bind',function(){
                    var validatorFields = {
                        cardNo: {
                            validators: {
                                notEmpty: {
                                    message: '不能为空'
                                }
                            }
                        }
                    }

                    //$('#form').attr('action','/BizPayment/BindUnBindCard')
                    $('#bindCfm').click(function(){
                        var form = document.forms.bindForm;
                        form.memberNo.value = userName;
                        initBootstrapValidator(validatorFields);
                        var data = $(form).serialize();
                        $.ajax({
                            url: '/BizPayment/BindUnBindCard',
                            method: 'post',
                            data: data,
                            dataType: 'json',
                            success: function (data) {
                                if(data.success==false){
                                    showAlert(data.msg);
                                }else{
                                    $('#link1').attr('href', data.msg.postUrl + '?merSignMsg=' + data.msg.merSignMsg + '&tranData=' + data.msg.tranData + '&cardNo=0000' + form.cardNo.value);
                                    document.getElementById("link1").click();
                                    $('#bindModal').modal('hide');
                                    setTimeout(function(){
                                        window.location.reload();
                                    },3000)
                                }
                            }
                        });

                    })
                })
            }

        });

    })
})
