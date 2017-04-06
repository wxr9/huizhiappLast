/**
 * Created by Administrator on 2016/5/10.
 */
require(['jquery'], function(){
    $(function() {
        //是否是企业用户，进入IT报修页面
        $('#decideIT').click(function(){
            $.ajax({
                url:'/Setting/User/IsBindEnterprise',
                dataType:'json',
                success:function(result){
                    if(result.msg=='已绑定'){
                        $('#decideIT').attr('href','/web/applyForITRepair.html');
                    }else if(result.msg=='审核中'){
                        showAlert('您绑定的企业正在审核中！');
                    }else{
                        showAlert('您尚未绑定企业！');
                    }
                }
            })
        })

        $.ajax({
            type: 'GET',
            url:'/Setting/Merchant/GetSearchLivingMenu',
            dataType:'json',
            async: true,
            success: function(data){
                if(data.length>0) {
                    var html = [];
                    for(var i=0; i<data.length;i++){
                        var type = data[i].child[0].items[0].objectid || '';
                        html.push('<a href="/web/lifeCenter/merchantList.html?type='+type+'">'+data[i].label+'</a>')
                    }
                    $("#lifeCenter").empty().append(html.join(''));
                }
            },
            error:function(data){

            }
        });

    });
});