require(['jquery', 'bootstrap','pm','pagination'],function(){
    //筛选列表
    $.ajax({
        type: 'GET',
        url:'/Setting/MerchantSale/GetSearchMenu',
        dataType:'json',
        async: true,
        success: function(data){
            $('#saleSelect').empty().append(getSearchMenu(data));
        },
        error:function(data){

        }
    })

    //搜索功能
    $(document).on('click','.item',function(){
        $(this).addClass('active').siblings().removeClass('active');
        initPagination();
    })

    $(document).on('click','.searchBtn',function(){
        initPagination();
    })
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
            param.push('name='+decodeURIComponent($('#searchName').val()));
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
    //生活中心筛选列表结构
    //获取子菜单列表
    function getChildMenu(data){
        var html = [];
        html.push('<div class="col-md-12 select-item child-select">');
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

                var thisNode = $("<div class='col-md-12 select-item'></div>");
                var loadChild;
                if(items.length > 0){
                    for(var k=0; k<items.length;k++){
                        html.push("<a class='item' id='"+items[k].objectid+"' name='"+labelNode.fieldName+"'>"+items[k].name+"</a>");
                        if(childMenu != null){
                            parNod.push(items[k].objectid);
                            parData[items[k].objectid] = childMenu.items;
                        }
                    }

                }
            }
            html.push("</div>");
            thisNode.append(html.join(''));
            ret.append(thisNode);
            if(loadChild != undefined){
                thisNode.after(getChildMenu(loadChild));
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

    //初始化列表
    var initPagination = function() {
        var page_index = 1;
        var size = 6;

        $.ajax({
            type: 'GET',
            url:'/Setting/MerchantSale/List/1/8?isCheck=2&' + getSearchParam(),
            dataType:'json',
            async: true,
            success: function(data){
                // 创建分页
                if(data.result.length > 0){
                    var num_entries = data.total;
                    var page_index = 0;
                    var init_flag = false;
                    if(page_index == 0 && !init_flag){
                        $("#pagination").pagination(num_entries, {
                            num_edge_entries: 1, //边缘页数
                            num_display_entries: 4, //主体页数
                            callback: pageselectCallback,
                            items_per_page:8, //每页显示1项
                            prev_text: "&laquo;",
                            next_text: "&raquo;"
                        });
                    }
                } else {
                    $('#prefer-info').empty().append("<div class='empty-tip'>未查找到相关商户!</div>")
                    $('#pagination').empty();
                }

                function pageselectCallback(page_index, jq){
                    if(page_index == 0 && !init_flag){
                        init_flag = true;
                        $('#prefer-info').empty().append(getProductModel(data.result));
                    }else{
                        getListDate(page_index+1,8);
                    }
                    return false;
                }

            },
            error:function(data){

            }
        });

        function getListDate(page_index,size){
            $.ajax({
                type: 'GET',
                url:'/Setting/MerchantSale/List/'+page_index+'/'+size+'?isCheck=2&' + getSearchParam(),
                dataType:'json',
                async: true,
                success: function(data){

                    if(data.result.length > 0){
                            $('#prefer-info').empty().append(getProductModel(data.result));

                    } else {
                        $('#prefer-info').empty().append("<div class='empty-tip'>未查找到相关商户!</div>")
                        $('#pagination').empty();
                    }
                },
                error:function(data){

                }
            })
        }

    };

    initPagination();

})
