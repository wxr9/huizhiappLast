/**
 * Created by Administrator on 2016/3/28.
 */
require(['jquery','pm'], function(){
    var objectid = queryString('objectid');
    $(function(){
        $.ajax({
            type:'get',
            url: '/Cultivate/Course/Edit/'+objectid,
            success:function(data){
                var target = $('#cont').empty();
                var time=data.createDate
                var arr=time.substring(0,10).split('-');
                time=arr[0]+'年'+arr[1]+'月'+arr[2]+'日'
                var html = []
                html.push('<div class="myDetailUp clearfix">')
                html.push('<div class="myimg"><img src="/'+data.pic+'" onerror="this.src=\'/web/images/default_ll.png\'"/></div>')
                html.push('<div class="myh"><h3>'+data.name+'</h3><p><span class="iconImg icon-px"/></span>发布日期：'+time+'</p><p class="myhp">')
                html.push('<span class="HandlePrice">'+data.price+'元</span>');
                html.push('<a href="/web/services/myCultivateForm.html?id=' +data.objectid+ '&name='+data.name+'">我要报名</a></p></div></div>');

                html.push('<div class="myDetailDown">')
                html.push('<h4>课程大纲</h4>');
                html.push('<p>'+data.courseOutline+'</p>');
                html.push('<h4>课程简介</h4>');
                html.push('<p>'+data.content+'</p></div>');
                target.append(html.join(''));

            }
        })
    })
});




