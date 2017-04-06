/**
 * Created by Administrator on 2016/3/17.
 */
require(['jquery'], function(){
   $(function(){
       $.ajax({
           type:'get',
           url: '/House/List/0/0',
           success:function(data){
               var target = $('.paul').empty();
               $(data.result).each(function(ind,val){
                   var html = []
                   html.push('<a href="/web/services/parkListDetail.html?objectid='+val.objectid+'"><li><img src="/'+val.pic+'" onerror="this.src=\'/web/images/default_ll.png\'" />')
                   html.push('<div class="paMask"></div><h4>'+val.address+'</h4>');
                   html.push('<h3>'+val.name+'</h3>')
                   html.push('</li></a>');
                   target.append(html.join(''));
               })
           }
       })
       $('.paul a').mouseover(function(){
           $(this).find('.paMask').attr('top','0');
       }).mouseout(function(){
           $(this).find('.paMask').attr('top','180px');
       })
   })
});


