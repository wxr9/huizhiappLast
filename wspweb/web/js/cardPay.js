/**
 * Created by Administrator on 2016/4/18.
 */
require(['jquery', 'bootstrap', 'bootstrapvalidator'], function() {
    $(function(){
        $('#price li').click(function(){
            $(this).addClass('active').siblings().removeClass('active');
            $('input[name=orderAmt]').val($(this).text().substr(1));
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
        var data=$("#formChong").serialize();
        $('#chongCfm').click(function(){
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
                    $('#link').attr('href',data.msg.postUrl+'?merSignMsg='+data.msg.merSignMsg+'&tranData='+data.msg.tranData)
                    document.getElementById("link").click();
                }
            });

        })
    })
})
