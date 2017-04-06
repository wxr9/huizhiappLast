
/**
 * Created by z on 2016/9/14.
 */
require(['jquery', 'bootstrap','pm'], function() {
    $(function(){
        var userName = "";
        //善诊活动
        var show = $('#show');
        //团布丁活动
        var tuanbuding = $('.tuanbuding');
        var box = $('.erwei-box');
        //天天果园
        var getFruit = $('#getFruit');
        $.ajax({
            url: '/Setting/User/MyInfo',
            success: function(data){
                if(data.success === false){
                    show.html('<a href="javascript:void(0)">点我登录后可见</a>');
                    show.bind('click',function(){
                        $('#login').trigger('click');
                    });
                    
                    tuanbuding.bind('click',function(){
                        $('#login').trigger('click');
                    });
                    getFruit.text('登录后领取');
                    getFruit.bind('click',function(){
                        $('#login').trigger('click');
                    })
                }else{
                    userName = data.username;
                    show.html('<a>上海浦东软件园</a>');
                    box.html('<div class="erwei-img"><img src="/web/images/tuan_erwei.jpg"></div><p>扫描二维码报名</p>');
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
                            $('.g-img .tips').attr("display","block");
                            getFruit.bind('click',function(){
                                $.ajax({
                                    type:"GET",
                                    url:'/Thirdpart/SaleChild/GetTicket/'+typeId,
                                    data:{
                                      "name": encodeURIComponent('天天果园')
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