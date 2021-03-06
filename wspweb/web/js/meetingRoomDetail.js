/**
 * Created by Administrator on 2016/4/11.
 */
require(['jquery', 'bootstrap','pm'],function(){
    $(function(){
        var objectid=queryString("objectid");
        $.ajax({
            type:"GET",
            url: "/Mettingroom/Mettingroom/Edit/"+objectid,
            success:function(data){
                var target=$("#cont1").empty();

                var html = [];
                html.push('<div class="myDetailUp clearfix">')
                html.push('<div class="myimg"><img src="/'+data.pic+'"  onerror="this.src=\'/web/images/default_ll.png\'"/></div>')
                html.push('<div class="myh"><h3>'+data.name+'</h3>' +
                    '<p class="pr"><span class="address1"></span>地址：'+data.location+'</p>' +
                    '<p>可容纳人数：'+data.peoples+'人</p>' +
                    '<p>面积：'+data.area+'m²</p>' +
                    '<p  class="myhp"><span class="HandlePrice">&yen;'+data.price+'</span><a class="btn btn-orange btn-big" href="/web/services/meetingRoomForm.html?objectid='+objectid+'&name='+data.name+'">预订</a></p>' +
                    '<p class="span icons">')
                if(data.projector==1){
                    html.push("<span class='icon projector'>投影仪</span>")
                }
                if(data.microphone==1){
                    html.push("<span class='icon microphone'>麦克风</span>")
                }
                if(data.vsx==1){
                    html.push("<span class='icon vsx'>视频会议</span>")
                }
                html.push('</p></div></div>');
                html.push('<div class="myDetailDown"><h4>会议室介绍</h4><p>'+data.content+'</p></div>')
                html.push('<div class="text-center"><a class="btn btn-blue returnList" href="/web/services/meetingRoomList.html">返回</a></div>')

                $("#cont1").append(html.join(''));

            }
        })
    })
})
