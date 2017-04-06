/**
 * Created by z on 2016/12/15.
 */
require(['jquery', 'bootstrap','pm'], function() {
    var apply = $('#apply');
    var objectId = queryString('id') || 1;

    $.ajax({
        url: '/Setting/User/MyInfo',
        dataType:'json',
        success: function(data){
       
            if(data.success === false){
                apply.text('登录报名');
                apply.on('click',function(){
                    $('#login').trigger('click');
                })
            }else{

                var end = new Date(2016,11,22);
                var now = new Date();
                if(end > now) {
                    apply.text('点击报名');
                    apply.on('click',function(){
                        $.ajax({
                            type:'POST',
                            url:'/ActivityCenter/ActivityJoin/Add',
                            data:{
                                activityMainId:objectId
                            },
                            dataType:'json',
                            success:function(result){
                                if(result.success){
                                    showAlert("您的报名信息已经提交，等待后续通知。", 'success');
                                }else{
                                    if(result.msg == 'already'){
                                        showAlert("已报名", 'danger');
                                    }else
                                        showAlert(result.msg, 'danger');
                                }
                            }
                        })
                    })
                }else
                    apply.css('disabled').text('报名已截止');
            }

        }

    });
});