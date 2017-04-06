
require(['jquery','bootstrap','pm'],function(){
    $(function(){

        //搜索菜单
        $.ajax({
            type: 'GET',
            url:'/Setting/Merchant/GetSearchLivingMenu',
            dataType:'json',
            async: true,
            success: function(data){
                if(data != 'undefined') {
                    $('#search').empty().html(getMenuModel(data));
                }
            },
            error:function(data){

            }
        });
        $('#search').on('click','.link',function(){
            var name = $(this).attr('data-name');
            var value = $(this).attr('data-id');
            var par = $(this).attr('data-parent');

            window.location.href = '/web/lifeCenter/merchantList.html?'+ name + "=" + value +"&parent=" + par;
        })
        $('.life-header').on('click','.searchBtn',function(){
            var search = $('.searchBox').val();
            window.location.href = '/web/lifeCenter/merchantList.html?name=' + search;
        });
        $('body').keypress(function(e){
            if(e.which == 13){
                var search = $('.searchBox').val();
                window.location.href = '/web/lifeCenter/merchantList.html?name=' + search;
            }
        });

        //广告图片
        $.ajax({
            type:'GET',
            url:'/Setting/LivingCenterAdver/List/0/0?isBan=2',
            dataType:'json',
            async:true,
            success: function(data){
                var target = $('#carousel').empty();
                if(data.total > 0){
                    var list = data.result;
                    var len = data.total;
                    len = len < 5 ? len : 5;
                    var html = [];
                    //状态点
                    html.push('<ol class="carousel-indicators carousel-dot">')
                    html.push('<li class="active" data-target="#carousel" data-slide-to="0"><a><span></span></a></li>')
                    for(var i=1; i<len; i++){
                        html.push('<li data-target="#carousel" data-slide-to="'+i+'"><a><span></span></a></li>')
                    }
                    html.push('</ol><div class="carousel-inner">');
                    //如果isShow为1,仅显示图片,isShow为2,添加图片链接,isShow为3,链接到富文本;
                    //第一张图片,添加active
                    if(list[0].isShow == 2){
                        html.push('<div class="item active"><a target="_blank" href="'+list[0].linkA+'"><img src="/'+list[0].imgUrl+'"></a></div>')
                    }else if(list[0].isShow == 1){
                        html.push('<div class="item active"><img src="/'+list[0].imgUrl+'"></div>')
                    }else{
                        html.push('<div class="item active"><a target="_blank" href="/web/lifeCenter/richText.html?objectid='+list[0].objectid+'"><img src="/'+list[0].imgUrl+'"></a></div>')
                    }
                    for(var j=1; j<len; j++){
                        //if(list[j].imgUrl == null) list[j].imgUrl = '/web/images/Rectangle4.png';
                        if(list[j].isShow == 2){
                            html.push('<div class="item"><a target="_blank" href="'+list[j].linkA+'"><img src="/'+list[j].imgUrl+'"></a></div>')
                        }else if(list[j].isShow == 1){
                            html.push('<div class="item"><img src="/'+list[j].imgUrl+'"></div>')
                        }else{
                            html.push('<div class="item"><a target="_blank" href="/web/lifeCenter/richText.html?objectid='+list[j].objectid+'"><img src="/'+list[j].imgUrl+'"></a></div>')
                        }
                    }
                    html.push('</div>');
                    //前一张后一张按钮
                    html.push('<a class="left carousel-control" href="#carousel" data-slide="prev"><img class="btn" src="/web/images/rightarrow.png"></a>' +
                        '<a class="right carousel-control" href="#carousel" data-slide="next"><img class="btn" src="/web/images/leftarrow.png"></a>');
                    target.append(html.join(''));
                }else{
                    var defaultHtml = [];
                    defaultHtml.push('<img src="/web/images/Rectangle4.png" width="750" height="250">');
                    target.append(defaultHtml.join(''))
                }
                target.find('img').on('error', function(){
                    this.src='/web/images/Rectangle4.png';
                })

            }
        })
        $('#carousel').on('slid.bs.carousel', function() {
            var item = $('#carousel .carousel-inner .item.active');
            $('.carousel-indicators li').removeClass('active');
            var index = item.index()+1;
            $('.carousel-indicators li:nth-child(' + index + ')').addClass('active');
        });


        //优惠信息列表
        $.ajax({
            type: 'GET',
            url:'/Setting/MerchantSale/List/1/10?isCheck=2',
            dataType:'json',
            async: true,
            success: function(data){
                if(data != undefined) {
                    if(data.result.length > 0){
                        //getProductModel public.js
                        $('#product-info').empty().html(getProductModel(data.result, 7));
                        $('#product-info').append(
                            "<div class='product-box'><div class='product-item product-item-all'>" +
                            "<a href='/web/lifeCenter/preferentialList.html' class='all-link'>查看全部</a></div></div>");
                    }else{
                        $('#product-info').empty().append('<div><h3 class="default-img">暂无优惠信息</h3></div>')
                    }
                }else{
                    $('#product-info').empty().append('<div><h3 class="default-img">暂无优惠信息</h3></div>')
                }

            },
            error:function(data){

            }
        });
        //几种优惠列表
        $.ajax({
            type:"GET",
            url:'/Setting/Merchant/GetClassifiedMerchant',
            dataType:'json',
            async:true,
            success:function(result){
                var model = [];
                var item,i=1;
                for(item in result){
                    var data = result[item];
                    model.push('<div class="col-xs-12 product-info-title"><div class="product-mark"><span class="mark-icon icon'+i+'"></span>'+data.name+'</div>' +
                        '<div class="product-more"><a class="btn btn-default" href="/web/lifeCenter/merchantList.html?type='+data.typeId+'">查看更多</a></div></div>');
                    model.push('<div class="product-info">'+merchantModel(data.value,item)+'</div>');
                    i++;
                }
                $('#product-list').append(model.join(''));
            }
        });
        function merchantModel(data,item){
            var model=[];
            var len = data.length;
            for (var i=0; i< len; i++){
                var d = data[i];
                model.push('<div class="product-box"><div class="product-item"><a href="/web/lifeCenter/merchantDetail.html?objectid='+d.objectid+'">' +
                    '<div class="product-img" style="background:url(/'+d.avar+') no-repeat center center;background-size:100%"></div>' +
                    '<div class="product-detail">' +
                    '<div class="row"><span class="icon"></span><span class="shop">'+d.name+'</span></div>');
                var score = d.merchantEvaluate;
                if(item == 'food'){
                    model.push('<div class="eval"><span>口味&nbsp;'+score.taste+'</span><span>环境&nbsp;'+score.env+'</span><span>服务&nbsp;'+score.service+'</span></div>');
                }else{
                    model.push('<div class="eval"><span>环境&nbsp;'+score.env+'</span><span>服务&nbsp;'+score.service+'</span></div>');
                }
                model.push('</div></a></div></div>')
            }
            return model.join('');
        }

        function getMenuModel(data){
            var html =[];
            // html.push("<input class='searchBox' placeholder='请输入要查询的商户名称'><a href='#' class='searchBtn fa fa-search'></a>");
            html.push("<ul class='search-list'>");
            for (var i=0 ; i < data.length; i++){
                //一级节点 标签
                var labelNode = data[i];
                //二级节点 主菜单
                var headMenu = labelNode.child;
                for(var j=0;j<headMenu.length;j++){
                    var headMenuNode = headMenu[j];
                    var items = headMenuNode.items;
                    var childMenu;
                    //三级节点 二级菜单
                    if(headMenuNode.child != null){
                        childMenu = headMenuNode.child.items;
                    }else{
                        childMenu = [];
                    }
                    if(items.length > 0){
                        for(var k=0; k<items.length;k++){
                            html.push("<li><a class='link' href='#' data-id='"+items[k].objectid+"' data-name='"+labelNode.fieldName+"'><span class='search-link'></span><span>"+items[k].name+"</span></a>");
                            // if(childMenu != null){
                            //     var its = childMenu;
                            //     html.push("<div class='sub-link'>");
                            //     for(var m=0;m<its.length;m++){
                            //         html.push("<a href='#' class='link' data-parent='"+items[k].objectid+"' data-name='"+labelNode.fieldName+"' data-id='"+its[m].objectid+"'>"+its[m].name+"</a>")
                            //     }
                            //     html.push("</div>");
                            // }
                            html.push("</li>");
                        }
                    }
                    // for (var j=0; j< child.length; j++){
                    //    html.push( "<a class='item' id='"+child[j].objectid+"' name='"+result.fieldName+"'>"+child[j].name+"</a>");
                    // }
                }
            }
            html.push("</ul>");
            return html.join('');
        }


    })
})
