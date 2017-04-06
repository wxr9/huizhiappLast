/** Created by iris on 16/4/6.*/
require(['jquery', 'bootstrap','pm'], function(){
    $(function(){
        $.ajax({
            type:'GET',
            url:'/Setting/Readme/Type/Edit?type=userCommercialize',
            dataType:'json',
            success:function(data){
                if(data.content != undefined){
                    $('#noticeContent').empty().append(data.content);
                }else{
                    $('#noticeContent').empty().append('广告服务暂无用户须知');
                }

            }
        })



    })

});

