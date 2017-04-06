/**
 * Created by Administrator on 2016/4/1.
 */
require(['jquery', 'bootstrap', 'datatables','pm','select2','bootstrapvalidator', 'philter'], function() {
    $(function () {
        checkMust();
        var bind; // 是否绑定
        var userName;
        //根据是否绑定显示绑定的状态
        $.ajax({
            type: 'get',
            url: '/Setting/User/MyInfo',
            dataType: 'json',
            success: function (result) {
                //bind==-1 没有绑定
                bind = result.cardid;
                userName=result.username;
                //如果没有绑定，隐藏解绑、充值按钮
                $('input[name=memberNo]').val(userName);
                if (bind == null || bind == '' || bind == 'undefined') {
                    $('#one').hide();
                    $('#two').hide();
                    $('#three').hide();
                } else {
                    //交易记录
                    $.ajax({
                        type: 'post',
                        url: '/BizPayment/QueryTransDetails',
                        data:{
                            merchantNo:'000006666666666',
                            cardNo:bind,
                            endDate:'',
                            memberNo:userName,
                            queryNum:'',
                            startDate:'',
                            tranType:'02'
                        },
                        dataType:'json',
                        success: function (data) {
                            if(data.result != ''){
                                var html=[];
                                html.push('<table class="transaction" width="100%" cellspacing="0"><thead><td>流水号</td><td>交易金额</td><td>交易时间</td><td>交易类型</td><td>商户名称</td></thead><tbody>')
                                $(data.details).each(function(ind,val) {

                                    html.push('<tr><td>' + val.tranNo + '</td>')
                                    if (val.tranAmount > 0) {
                                        html.push('<td class="red">' + val.tranAmount + '</td>')
                                    } else {
                                        html.push('<td class="green">' + val.tranAmount + '</td>')
                                    }
                                    html.push('<td>' + val.tranDate + '</td>' +
                                        '<td>圈存</td>' +
                                        '<td>'+ val.merchantName + '</td>')
                                })
                                html.push('</tbody></table><p class="card-tips">*交易记录为近期30笔交易</p>')
                                $('#one').append(html.join(''));
                            }else{
                                $('#one').append("<div class='empty'>暂无此记录！</div>");
                            }
                        }
                    });
                    //充值记录
                    $.ajax({
                        type: 'post',
                        url: '/BizPayment/QueryTransDetails',
                        data:{
                            merchantNo:'000006666666666',
                            cardNo:bind,
                            endDate:'',
                            memberNo:userName,
                            queryNum:'',
                            startDate:'',
                            tranType:'01'
                        },
                        dataType:'json',
                        success: function (data) {
                            if(data.result != ''){
                                var html=[];
                                html.push('<table class="transaction" width="100%" cellspacing="0"><thead><td>流水号</td><td>交易金额</td><td>交易时间</td><td>交易类型</td><td>商户名称</td></thead><tbody>')
                                $(data.details).each(function(ind,val) {

                                    html.push('<tr><td>' + val.tranNo + '</td>')
                                    if (val.tranAmount > 0) {
                                        html.push('<td class="red">' + val.tranAmount + '</td>')
                                    } else {
                                        html.push('<td class="green">' + val.tranAmount + '</td>')
                                    }
                                    html.push('<td>' + val.tranDate + '</td>' +
                                        '<td>充值</td>' +
                                        '<td>'+ val.merchantName + '</td>')
                                })
                                html.push('</tbody></table><p class="card-tips">*交易记录为近期30笔交易</p>')
                                $('#four').append(html.join(''));
                            }else{
                                $('#four').append("<div class='empty'>暂无此记录！</div>");
                            }
                        }
                    });
                    $.ajax({
                        type: 'post',
                        url: '/BizPayment/QueryTransDetails',
                        data:{
                            merchantNo:'000006666666666',
                            cardNo:bind,
                            endDate:'',
                            memberNo:userName,
                            queryNum:'',
                            startDate:'',
                            tranType:'07'
                        },
                        dataType:'json',
                        success: function (data) {
                            if(data.result != ''){
                                var html=[];
                                html.push('<table class="transaction" width="100%" cellspacing="0"><thead><td>流水号</td><td>交易金额</td><td>交易时间</td><td>交易类型</td><td>商户名称</td></thead><tbody>')
                                $(data.details).each(function(ind,val) {

                                    html.push('<tr><td>' + val.tranNo + '</td>')
                                    if (val.tranAmount > 0) {
                                        html.push('<td class="red">' + val.tranAmount + '</td>')
                                    } else {
                                        html.push('<td class="green">' + val.tranAmount + '</td>')
                                    }
                                    html.push('<td>' + val.tranDate + '</td>' +
                                        '<td>电子钱包脱机消费</td>' +
                                        '<td>' + val.merchantName +'</td>')
                                })
                                html.push('</tbody></table><p class="card-tips">*交易记录为近期30笔交易</p>')
                                $('#two').append(html.join(''));
                            }else{
                                $('#two').append("<div class='empty'>暂无此记录！</div>");
                            }
                        }
                    });
                    $.ajax({
                        type: 'get',
                        url: '/Setting/PayLogById/List/0/0',
                        dataType:'json',
                        success: function (data) {
                            if(data.result != '') {
                                var html = [];
                                html.push('<table class="transaction" width="100%" cellspacing="0"><thead>' +
                                    '<td>订单号</td>' +
                                    '<td>汇智卡号</td>' +
                                    '<td>订单金额</td>' +
                                    '<td>充值时间</td>' +
                                    '<td>交易状态</td>' +
                                    '<td>操作</td></thead><tbody>')
                                $(data.result).each(function (ind, val) {
                                    var data = val.tranTime.substring(0, 10);
                                    var time = val.tranTime.substring(10);
                                    html.push('<tr><td>' + val.orderNo + '</td>' +
                                        '<td>' + val.cardNo + '</td>' +
                                        '<td>' + val.orderAmt + '</td>' +
                                        '<td>' + data + '<br/>' + time + '</td>' +
                                        '<td>' + val.memo + '</td>')

                                    if (val.status == true) {
                                        html.push('<td ><a objectid="' + val.objectid + '" class="sendMessage">发送收据短信</a></td>')
                                    } else {
                                        html.push('<td>   </td>')
                                    }
                                })
                                html.push('</tbody></table><p class="card-tips">*交易记录为近期30笔交易</p>')
                                $('#three').append(html.join(''));
                            }else{
                                $('#three').append("<div class='empty'>暂无此记录！</div>");
                            }    
                        }
                    })

                }
            }
        });

        //发送发票短信
        $('#three').on('click','.sendMessage',function(){
            var objectid=$(this).attr('objectid');
            $.ajax({
                type: 'post',
                url: '/BizPayment/SendRechargePhoneMessage',
                data:{
                    objectid:objectid
                },
                dataType: 'json',
                success: function (data) {
                    showAlert(data.msg);

                }
            })
        })


        

    })
})
