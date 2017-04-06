/*** Created by iris on 16/4/12.*/
$(function(){
    var queryString = function (query) {
        var search = window.location.search + '';
        if (search.charAt(0) != '?') {
            return undefined;
        } else {
            search = search.replace('?', '').split('&');
            for (var i = 0; i < search.length; i++) {
                if (search[i].split('=')[0] == query) {
                    return decodeURI(search[i].split('=')[1]);
                }
            }
            return undefined;
        }
    };

    var objectid = queryString('objectid');

    $.ajax({
        type:'GET',
        url:'/Setting/LivingCenterAdver/Edit/'+objectid,
        dataType:'json',
        async: true,
        success:function(data){

            if(data.content != undefined){
                $('#content').append(data.content);
            }else{
                $('#content').append('<h3>暂无信息</h3>')
            }
        }
    })
});
