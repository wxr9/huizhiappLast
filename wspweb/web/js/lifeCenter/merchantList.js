require(['jquery','bootstrap','pm','raty','pagination'],function(){
    $(function(){
        //生活中心的搜索结果
        var seParam = queryString('type') || '';
        var seName = queryString('name') || '';
        var parentId = queryString('parent')||"";
        //筛选列表
        $.ajax({
            type: 'GET',
            url:'/Setting/Merchant/GetSearchMenu',
            dataType:'json',
            async: true,
            success: function(data){
                $('#saleSelect').empty().append(getSearchMenu(data));
                //首页查询跳转筛选结果页面;
                if(seParam != undefined){
                    $('.item').each(function(index,element){
                        if($(element).attr('id') == parentId) {
                            $(element).addClass('active').siblings().removeClass('active');
                        }
                    });
                    $('.item').each(function(index,element){
                        if($(element).attr('id') == seParam){
                            $(element).addClass('active').siblings().removeClass('active');
                        }
                    });
                }
                if(seName != undefined){
                    $('#searchName').val(seName);
                    //history.pushState(null, "商户广场", window.location.pathname);
                }
                initPagination()
            },
            error:function(data){

            }
        });
        //排序
        $(document).on('click','#hit',function(){
            $(this).children('.fa').toggleClass('fa-sort-amount-desc').toggleClass('fa-sort-amount-asc');
            if($(this).attr('param') == 'false'){
                $(this).attr('param','true');
            }else{
                $(this).attr('param','false');
            }
            initPagination();
        });
        //搜索功能
        $(document).on('click','.item',function(){
            $(this).addClass('active').siblings().removeClass('active');
            initPagination()
        });
        $(document).on('click','.searchBtn',function(){
            initPagination()
        });

        $('body').keypress(function(e){
            if(e.which == 13){
                if($('.searchBox').val() != '')
                    initPagination();
            }
        });

        //获取选中的筛选参数
        function getSearchParam(){
            var items = $('.item');
            var param = [];
            if($('#searchName').val() != ""){
                param.push('name='+encodeURIComponent($('#searchName').val()));
            }
            for (var i=0; i < items.length; i++){
                if($(items[i]).hasClass('active')){
                    if (items[i].id != ""){
                        param.push(encodeURIComponent(items[i].name)+"="+encodeURIComponent(items[i].id));
                    }
                }
            }
            return param.join('&');
        }
        //获取子菜单列表
        function getChildMenu(data){
            var html = [];
            html.push('<div class="col-xs-12 select-item child-select">');
            html.push('<div class="body" style="margin-left:82px;">')
            $(data).each(function(ind,val){
                html.push('<a class="item" id="'+val.objectid+'" name="childType">'+val.name+'</a>');
            })
            html.push('</div></div>')
            return html.join('');
        }
        //生活中心筛选列表结构
        function getSearchMenu(data){
            var ret = $('<div />');
            var parNod = [];
            var parData = {};
            for (var i=0 ; i < data.length; i++){
                //一级节点 标签
                var labelNode = data[i];
                //二级节点 主菜单
                var headMenu = labelNode.child;
                html =[];
                html.push("<div class='head'><span class='title'>"+labelNode.label+"</span></div>" +
                    "<div class='body'><a class='item active' id='' name='"+labelNode.fieldName+"'>不限</a>");
                for(var j=0;j<headMenu.length;j++){
                    var headMenuNode = headMenu[j];
                    var items = headMenuNode.items;
                    //三级节点 二级菜单
                    var childMenu = headMenuNode.child;

                    var thisNode = $("<div class='col-xs-12 select-item'></div>");
                    var loadChild;
                    if(items.length > 0){
                        for(var k=0; k<items.length;k++){
                            html.push("<a class='item' id='"+items[k].objectid+"' name='"+labelNode.fieldName+"'>"+items[k].name+"</a>");
                            if(childMenu != null){
                                parNod.push(items[k].objectid);
                                parData[items[k].objectid] = childMenu.items;
                                if(parentId == items[k].objectid){
                                    loadChild = childMenu.items;
                                }
                            }
                        }

                    }
                }
                html.push("</div>");
                thisNode.append(html.join(''));
                ret.append(thisNode);
                if(loadChild != undefined){
                    thisNode.after(getChildMenu(loadChild))
                    loadChild = undefined;
                }
            }
            $(ret).on('click','.item', function(e){
                var pat = $(this).parents('.select-item');
                var childNode = pat.next('.child-select');
                if(childNode.length >0){
                    childNode.remove();
                }
                $(parNod).each(function(ind,val){
                    if(e.target.id == val){
                        pat.after(getChildMenu(parData[val]))
                        return false;
                    }
                })
            })
            return ret;
        }
        //初始化翻页列表
        var initPagination = function() {
            $.ajax({
                type: 'GET',
                url:'/Setting/Merchant/List/1/5?isCheck=2&paramHit='+$('#hit').attr('param') + '&' + getSearchParam(),
                dataType:'json',
                async: true,
                success: function(data){

                    // 创建分页
                    if(data.result.length > 0) {
                        var num_entries = data.total;
                        var page_index = 0;
                        var init_flag = false;
                        if (page_index == 0 && !init_flag) {
                            $("#pagination").pagination(num_entries, {
                                num_edge_entries: 1, //边缘页数
                                num_display_entries: 4, //主体页数
                                callback: pageselectCallback,
                                items_per_page: 5, //每页显示1项
                                prev_text: "&laquo;",
                                next_text: "&raquo;"
                            });
                        }
                    }else {
                        $('#sale-list').empty().append("<div class='empty-tip'>未查找到相关商户!</div>")
                        $('#pagination').empty();
                    }
                    function pageselectCallback(page_index,jq){
                        if(page_index == 0 && !init_flag){
                            init_flag = true;
                            $('#sale-list').empty().append(getListModel(data.result));
                        }else{
                            getListDate(page_index+1,5);
                        }
                    }

                },
                error:function(data){

                }
            });


            function getListDate(page_index,size){
                //刷新数据
                    $.ajax({
                        type: 'GET',
                        url:'/Setting/Merchant/List/'+page_index+'/'+size+'?isCheck=2&paramHit='+$('#hit').attr('param') + '&'  + getSearchParam(),
                        dataType:'json',
                        async: true,
                        success: function(data){
                            if(data.result.length > 0){
                                $('#sale-list').empty().append(getListModel(data.result));
                            } else {
                                $('#sale-list').empty().append("<div class='empty-tip'>未查找到相关商户!</div>")
                                $('#pagination').empty();
                            }
                        },
                        error:function(data){

                        }
                    })

            }

        };
        $('#sale-list').on('click','.moreSale',function(){
            if($(this).siblings('.body').css('height') == '20px'){
                $(this).siblings('.body').css('height','auto');
            }else{
                $(this).siblings('.body').css('height','20px');
            }


        });
        //列表元素模版
        function getListModel(data){
            var model = [];
            var len = data.length;
            //数据为空时
            if(len == 0){
                model.push("<div class='empty-tip'>未查找到相关商户!</div>")
                return model.join("");
            }
            //生成数据 ≤5条
            for (var i = 0; i < len; i++){
                var result = data[i];
                var type = result.sDict.english || '';
                var avar = "/" + result.avar;
                model.push("<div class='col-xs-12 sale-list'><div class='row'><div class='col-xs-4 sale-img'><div class='sale-image' style='background:url("+avar+") no-repeat center center; background-size:230px;'></div>")
                if (result.isInvite == 1){
                    model.push("<div class='label-right'></div>")
                }
                if (result.isNew == 1){
                    model.push("<div class='label-left'></div>")
                }

                model.push(
                    "</div><div class='col-xs-8'><ul class='sale-detail'><li><h4 class='sale-title'><a href='/web/lifeCenter/merchantDetail.html?objectid="+result.objectid+"'>"+result.name+"</a></h4>")
                if(result.mEvaluate != null){
                    var raty = result.mEvaluate;
                    if(type == "food"){
                        model.push(
                            "<div class='rating'><span class='now-price'>口味"+raty.taste+"</span><span class='now-price'>环境"+raty.env+"</span>" +
                            "<span class='now-price'>服务"+raty.service+"</span></div>")
                    } else{
                        model.push(
                            "<div class='rating'><span class='now-price'>环境"+raty.env+"</span>" +
                            "<span class='now-price'>服务"+raty.service+"</span></div>")
                    }
                }

                model.push( "</li>" +
                    "<li><span class='icon type'></span><span>"+result.sDict.name+"</span></li><li><span class='icon address'></span><span>"+result.address+"</span></li>" +
                    "<li><span class='icon phone'></span><span>"+result.phone+"</span></li></ul>");
                if(result.saleList != "" && result.saleList){
                    var list = result.saleList;
                    var listlen = list.length;
                    model.push("<div class='discount'><span class='label'>优惠</span><span class='body'>");
                    for(var j = 0; j< listlen; j++){
                        model.push("<a class='saleList-link' href='/web/lifeCenter/preferentialDetail.html?objectid="+list[j].objectid+"'>"+list[j].title+"</a>");
                    }
                    if(listlen > 1){
                        model.push("</span><span class='more moreSale'>更多"+(listlen-1)+"条优惠</span></div>");
                    } else {
                        model.push("</span></div>");
                    }
                }
                model.push("</div></div></div>");
            }
            //按钮
            return model.join("");
        }


    })
})
