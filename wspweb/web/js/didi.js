/**
 * Created by z on 2016/11/22.
 */
require(['jquery', 'bootstrap','pm'], function() {
    $(function(){
        var target = $('#didi');
        $.ajax({
            url: '/Setting/User/MyInfo',
            success: function(data){
                if(data.success === false){
                    target.text('登录后领取>');
                    target.bind('click',function(){
                        $('#login').trigger('click');
                    })
                }else{

                    var typeId;
                    //需要登录/注册
                    $.ajax({
                        type:"GET",
                        url: "/Setting/SettingDict/0/0?type=Sale3rdMain",
                        dataType:'json',
                        success: function(data){
                            $.each(data.result, function(i,e){
                                if(e.english == "asLogin"){
                                    typeId = e.objectid;
                                }
                            });
                            target.bind('click',function(){
                                $.ajax({
                                    type:"GET",
                                    url:'/Thirdpart/SaleChild/GetTicket/'+typeId,
                                    data:{
                                        "name": encodeURIComponent('滴滴')
                                    },
                                    dataType:'json',
                                    success:function(data){
                                        showAlert(data.msg);
                                    }
                                });
                            });
                        }
                    });
                }
            }
        });

    })
});