/**
 * Created by z on 2016/10/17.
 */
require(['jquery'],function(){
    //有效红包列表
    var valid = $('#valid');
    var overdue = $('#overdue');
    $.ajax({
        method:"GET",
        url:'/RedPacket/User/Valid/List',
        dataType:'json',
        success:function(result) {
            var len = result.length;
            var flag = true;
            for(var i=0; i<len; i++) {
                var item = result[i];
                var html = [];
                html.push('<div class="packet">');
                var time = formatTime(item.createTime) + '-' + formatTime(item.validateDate);
                html.push('<div class="packet-money"><span>&yen;</span>' +
                    '<span class="big">'+item.sum+'</span>' +
                    '<span>元</span></div><div class="packet-time">有效期:'+time+'</div></div>');
                if(flag){
                    valid.empty().append(html.join(''));
                    flag = false;
                }else
                    valid.append(html.join(''));
            }
        }
    });
    $.ajax({
        method:"GET",
        url:'/RedPacket/User/Invalid/List',
        dataType:'json',
        success:function(result){
            var len = result.length;
            var flag = true;
            for(var i=0; i<len; i++) {
                var item = result[i];
                var html = [];
                html.push('<div class="packet overdue">');
                var time = formatTime(item.createTime) + '-' + formatTime(item.validateDate);
                html.push('<div class="packet-money"><span>&yen;</span>' +
                    '<span class="big">'+item.sum+'</span>' +
                    '<span>元</span></div><div class="packet-time">有效期:'+time+'</div></div>');
                if(flag){
                    overdue.empty().append(html.join(''));
                    flag = false;
                }else
                    overdue.append(html.join(''));
            }
        }
    });

    function formatTime(str){
        return str.slice(0,10).split('-').join('.');
    }
});