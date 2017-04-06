require(['jquery', 'bootstrap'],function(){
    $(function(){
        $.ajax({
            type:"GET",
            url: " /Mettingroom/Mettingroom/Enable/List/0/0",
            success:function(data){

                var target=$("#cont").empty();
                var html = [];
                $(data.result).each(function(ind,val) {

                    html.push('<li>')
                    html.push('<dl class="row"><dt class="col-xs-4"><a href="meetingRoomDetail.html?objectid='+val.objectid+'"><img src="/'+val.pic+'" onerror="this.src=\'/web/images/default_ll.png\'"/></a></dt>')
                    html.push("<dd class='col-xs-8 pr' style='padding-left:5%;'><h4><a href='meetingRoomDetail.html?objectid="+val.objectid+"'>"+val.name+"</a></h4>" +
                        "<p><span class='address'></span>地址："+val.location+"</p><p>可容纳人数："+val.peoples+"人</p><p>面积："+val.area+"m²</p>" +
                        "<p class='clearfix'><a class='fr btn btn-orange btn-big' href='/web/services/meetingRoomForm.html?objectid="+val.objectid+"&name="+val.name+"'>预订</a>")
                    if(val.projector==1){
                        html.push("<span class='fl icon projector'>投影仪</span>")
                    }
                    if(val.microphone==1){
                        html.push("<span class='fl icon microphone'>麦克风</span>")
                    }if(val.vsx==1){
                        html.push("<span class='fl icon vsx'>视频会议</span>")
                    }

                    html.push("<span class='fr red'>&yen;"+val.price+"</span></p></dd></dl></li>")
                })
                html.push('<li><dl class="row"><dt class="col-xs-4"><a target="_blank" href="http://2014.spspvc.com.cn/Member/"><img src="/web/images/fuhua.png"/></a></dt>' +
                    '<dd class="col-xs-8 pr" style="padding-left:5%;"><a target="_blank" class="hTitle" href="http://2014.spspvc.com.cn/Member/">孵化器会议室</a></dd></dl></li>')
                $("#cont").append(html.join(''));
            }
        })
    })
})

