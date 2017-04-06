/**
 * Created by Administrator on 2016/4/6.
 */

require(['jquery', 'bootstrap','datepicker', 'datatables','pm','select2','bootstrapvalidator'], function() {
    $(function () {
        var cardNo=queryString('cardNo');
        var memberNo=queryString('userName');
        $('#carNum').text(cardNo.substr(0,3)+'****'+cardNo.substr(13,16));
        //创建表格
        $.ajax({
            type: 'post',
            url: '/BizPayment/QueryTransDetails',
            data:{
                merchantNo:'000006666666666',
                cardNo:cardNo,
                endDate:'',
                memberNo:memberNo,
                queryNum:'',
                startDate:'',
                tranType:'02'
            },
            dataType:'json',
            success: function (data) {
                //tableData=data.msg.items;
                var html=[];
                html.push('<table class="transaction transaction_bg" width="100%" cellspacing="0"><thead><td>流水号</td><td>交易金额</td><td>交易时间</td><td>交易类型</td><td>商户名称</td></thead><tbody>')
                $(data.details).each(function(ind,val) {
                    html.push('<tr><td>' + val.tranNo + '</td>')
                    if (parseInt(val.tranAmount) > 0) {
                        html.push('<td class="red">' + val.tranAmount + '</td>')
                    } else {
                        html.push('<td class="green">' + val.tranAmount + '</td>')
                    }
                    html.push('<td>' + val.tranDate + '</td>' +
                        '<td>' + val.tranType + '</td>' +
                        '<td>' + val.terminalNo + '</td>')
                })
                html.push('</tbody></table>')
                $('#one').append(html.join(''));
            }
        })
        $.ajax({
            type: 'post',
            url: '/BizPayment/QueryTransDetails',
            data:{
                merchantNo:'000006666666666',
                cardNo:cardNo,
                endDate:'',
                memberNo:memberNo,
                queryNum:'',
                startDate:'',
                tranType:'07'
            },
            dataType:'json',
            success: function (data) {
                //tableData=data.msg.items;
                var html=[];
                html.push('<table class="transaction transaction_bg" width="100%" cellspacing="0"><thead><td>流水号</td><td>交易金额</td><td>交易时间</td><td>交易类型</td><td>商户名称</td></thead><tbody>')
                $(data.details).each(function(ind,val) {
                    html.push('<tr><td>' + val.tranNo + '</td>')
                    if (parseInt(val.tranAmount) > 0) {
                        html.push('<td class="red">' + val.tranAmount + '</td>')
                    } else {
                        html.push('<td class="green">' + val.tranAmount + '</td>')
                    }
                    html.push('<td>' + val.tranDate + '</td>' +
                        '<td>' + val.tranType + '</td>' +
                        '<td>' + val.terminalNo + '</td>')
                })
                html.push('</tbody></table>')
                $('#two').append(html.join(''));
            }
        })
        //获取主账户和电子钱包余额
        $.ajax({
            type: 'post',
            url: '/BizPayment/QueryCardBalance',
            data:{
                merchantNo:'000006666666666',
                cardNo:cardNo,
                memberNo:memberNo
            },
            dataType: 'json',
            success: function (data) {

                //主账户余额
                $('#mainAccount p').html(data.edBalance);
                $('#eWallet p').html(data.epBalance);
            }
        })
        //充值
        //充值
        $('input[name=memberNo]').attr('value',memberNo);
        $('input[name=cardNo]').attr('value',cardNo);
        $('input[name=orderAmt]').val(50);
        var data;
        $('#price li').click(function(){
            $(this).addClass('active').siblings().removeClass('active');
            $('input[name=orderAmt]').val($(this).text().substr(1));
            $('input[name=orderAmtCount]').val($(this).text().substr(1));
            //优惠
            $.ajax({
                type: 'post',
                url: '/BizPayment/CardReChargeDiscount',
                data:{
                    orderAmtCount:$('input[name=orderAmtCount]').val()
                },
                dataType:'json',
                success: function (data) {
                    $('#orderAmtCount').text('优惠金额：'+data.msg+'元');
                }
            })
        })
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
        }
        $('#chongCfm').click(function(){
            data=$("#formChong").serialize();
            initBootstrapValidator(validatorFields)
            $.ajax({
                url : '/BizPayment/CardReCharge',
                method : 'post',
                data  : data,
                dataType:'json',
                success : function(data){
                    $('input[name=merSignMsg]').val(data.msg.merSignMsg);
                    $('input[name=tranData]').val(data.msg.tranDataBase64);
                    $('#formChong').attr('action',data.msg.postUrl);
                    $('#link').attr('href',data.msg.postUrl+'?merSignMsg='+data.msg.merSignMsg+'&tranData='+data.msg.tranData+'&cardNo='+$('input[name=cardNo]').val())
                    document.getElementById("link").click();
                }
            });
        })
    })
})
