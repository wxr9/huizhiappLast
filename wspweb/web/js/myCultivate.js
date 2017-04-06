/**
 * Created by Administrator on 2016/3/28.
 */
require(['jquery'], function(){
    $(function(){
        $.ajax({
            type:'get',
            url: '/Cultivate/Course/Enable/List/0/0',
            success:function(data){

                var target = $('#cont').empty();
                $(data.result).each(function(ind,val){
                    var html = [];
                    html.push('<li>');
                    html.push('<a href="/web/services/myCultivateDetail.html?objectid=' +val.objectid+
                        '"><img src="/'+val.pic+'" onerror="this.src=\'/web/images/default_mm.png\'" /></a>');
                    var name=val.name;
                    name = name.length > 20 ? name.substr(0,20)+'...': name;
                    html.push('<div class="class-box"><a href="/web/services/myCultivateDetail.html?objectid=' +val.objectid+
                            '" title="'+name+'">'+name+'</a>');
                    //html.push('<h5>'+val.name+'</h5>');
                    html.push('<div class="time">');
                    var time=val.updateDate.substr(5)
                    time=time.substr(0,11);

                    html.push('<span class="icon"></span><span class="classdate">'+time+'</span>');
                    val.price==0?html.push('<span class="price">免费</span>'):html.push('<span class="price1" title="'+val.price+'元">'+val.price+'元</span>');
                    html.push('</div><div class="hose">');
                    var sp = val.sponsor;
                    sp = sp.length > 9 ? sp.slice(0,9)+'...': sp;
                    html.push('<span title="'+sp+'">'+sp+'</span>');
                    html.push('<a class="btn" href="/web/services/myCultivateForm.html?id=' +val.objectid+ '&name='+val.name+'">报名</a></div></div></li>');
                    target.append(html.join(''));
                })
            }
        })
    })
});



