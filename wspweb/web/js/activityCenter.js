require(['jquery','pagination'], function(){
  $(function(){

    //活动展示列表
    $.ajax({
        type:'get',
        url: "/ActivityCenter/ActivityMain/List/1/12?isBan=1&timer="+new Date().getTime(),
        success:function(data){
        
            var num_entries = data.total;
            var page_index = 0;
            var init_flag = false;
            if(data.result != '' && page_index == 0 && !init_flag){

                $("#pagination").pagination(num_entries, {
                    num_edge_entries: 1, //边缘页数
                    num_display_entries: 4, //主体页数
                    callback: pageselectCallback,
                    items_per_page: 12, //每页显示1项
                    prev_text: "&laquo;",
                    next_text: "&raquo;"
                });

            }else{
                $('#cont').empty().append('<div class="empty-tip">暂无活动!</div>');
                $('#pagination').empty();
            }
            function pageselectCallback(page_index, panel){
                if(page_index == 0 && !init_flag){
                    init_flag = true;
                    $('#cont').empty().append(getTemp(data.result));
                }else{
                    getDate(page_index + 1,12)
                }
            }


        }
    });
      $('#cont').on('click','.list',function(event){
          var status = $('#loginStatus').attr('loginstatus');
          var id = $(this).attr('data-id');
          if(id == 1 && status == undefined){
              event.preventDefault();
              $('#login').trigger('click');
          }
      });

      function getDate(page,size){
          $.ajax({
              type:'get',
              url: "/ActivityCenter/ActivityMain/List/"+page+'/'+size+"?isBan=1&timer="+new Date().getTime(),
              success:function(data){
                  if(data.result !=''){
                      $('#cont').empty().append(getTemp(data.result));
                  }else{
                      $('#cont').empty().append('<div class="empty-tip">暂无活动!</div>');
                  }
              }
          });

      }
      function getTemp(data){
          var data = data;
          var html = [];
          $(data).each(function(ind,val){
              html.push('<li class="list" data-id="'+val.needLogin+'">');
              var link = val.details;
              //地址链接跳转/富文本打开到activityDetail.html中
              if(link != ""){
                  html.push('<a class="display_b" target="_blank" href="'+val.details+'">');
              }else{
                  html.push('<a class="display_b" target="_blank" href="./activityDetail.html?objectid='+val.objectid+'">');
              }
              html.push('<img src="/'+val.image+'" onerror="this.src=\'/web/images/default_mm.png\'" /></a>');

              var name = val.title;
              name = name.length > 20 ? name.substr(0,20)+'...': name;
              html.push('<div class="class-box"><a target="_blank" href="'+val.details+'">'+name+'</a>');
              html.push('<div class="time">');
              var today = new Date();
              var start = new Date(val.startTime);
              if(val.startTime == null){
                  html.push('<span class="icon"></span><span class="date">暂无开始时间</span></div>');
              }else{
                  html.push('<span class="icon"></span><span class="date">'+val.startTime.slice(5,16)+'</span></div>');
              }
              html.push('<div class="hose"><span title="'+val.mType.name+'">'+val.mType.name+'</span>');
              // if(today <= start){
              //     html.push('<a class="btn" target="_blank" href="'+val.details+'">报名</a>');
              // }
              html.push('</div></div></li>');
          })
          return html.join('');
      }
  })

});



