require(['jquery', 'bootstrap','pm'],function(){
    //var objectid=queryString("objectid")
   $(function(){
       $.ajax({
           type:"GET",
           url: "/Classroom/Classroom/Enable/List/0/0",
           success:function(data){
                var target=$("#cont").empty();
                $(data.result).each(function(ind,val) {

                    var html = [];
                    html.push('<li>')
                    html.push('<dl class="row"><dt class="col-xs-4"><a href="/web/services/classroomDetail.html?objectid='+val.objectid+'"><img src="/'+val.pic+'" onerror="this.src=\'/web/images/default_ll.png\'"/></a></dt>')
                    html.push("<dd class='col-xs-7 pr'style='padding-left:5%;'><h4><a href='/web/services/classroomDetail.html?objectid="+val.objectid+"'>"+val.name+"</a></h4>" +
                        "<p><span class='address'></span>地址："+val.location+"</p><p>可容纳人数："+val.peoples+"人</p><p>面积："+val.area+"m²</p>" +
                        "<p class='clearfix'><a class='fr btn btn-orange btn-big' href='/web/services/classroomForm.html?objectid="+val.objectid+"&name="+val.name+"'>预订</a>" +
                        "<span class='fr red'>&yen;"+val.price+"</span></p></dd></dl></li>")
                    $("#cont").append(html.join(''));
                })
           }
       })
   })
})

