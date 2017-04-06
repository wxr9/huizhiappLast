/**
 * Created by z on 2016/10/24.
 */
require(['jquery','pm'], function(){
    var objectid = queryString('objectid');
    $.ajax({
        method:"GET",
        url:'/ActivityCenter/ActivityMain/Edit/'+objectid,
        success:function(result){
            if(result != null){
                var richText = result.richText;
                if(richText != ''){
                    $('#content').html(richText);
                }else{
                    $('#content').html('<div style="text-align:center;font-size:20px;color:#666;">暂无相关详情</div>');
                }
            }
        }
    })
});