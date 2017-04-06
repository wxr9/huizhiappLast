require(['jquery','bootstrap', 'datatables','pm','select2','bootstrapvalidator'], function(){
    $(function(){
        var objectid=queryString("objectid");

        $.ajax({
            type:'get',
            url: '/House/Edit/'+objectid,
            success:function(data){
                var target = $('#cont').empty();

                var html = []
                html.push('<div class="parkDetailUp clearfix">')
                html.push('<div class="parkimg"><img src="/'+data.pic+'" onerror="this.src=\'/web/images/default_ll.png\'"/></div>')
                html.push('<div class="parkh"><h3>'+data.name+'</h3><p><span class="iconImg"></span>'+data.address+'</p></div></div>')

                html.push('<div class="parkDetailDown clearfix"><h4>园区介绍</h4>');
                html.push('<div class=".parkDetailDownp"><p>'+data.content+'</p>');
                target.append(html.join(''));
                }

        })
    })
});



