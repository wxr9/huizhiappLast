require(['jquery','bootstrap','bootstrapvalidator','pm','raty','pagination'],function(){
    $(function(){
        var objectid = queryString('objectid') || 1;
        //商户点击量
        $.ajax({
            type:'GET',
            url:'/Setting/Merchant/Hit/'+objectid,
            dataType: 'json',
            success:function(data){
            },
            error:function(data){

            }
        })

        $.ajax({
            type:'GET',
            url:'/Setting/Merchant/Edit/'+objectid,
            dataType: 'json',
            success:function(data){
                if(data != ""){
                    $("#merchantDetail").empty().html(merchantDetailModel(data,objectid));
                    $('.merchant-img').on('error', function(){
                        this.src='/web/images/default_sm.jpg';
                    });
                    //IE10背景模糊兼容
                    // $('.blur-bg').css('background-image','url(/'+data.avar+')');
                    // var b_version = navigator.appVersion.split(';');
                    // var trim_version = b_version[1].replace(/[ ]/g,"");
                    // if(trim_version == "MSIE10.0" || trim_version == "MSIE11.0" ){
                    //     var html = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" > ' +
                    //         '<filter id="blurMe"> <feGaussianBlur in="SourceGraphic" stdDeviation="100" /> </filter> ' +
                    //         '<image class="blur-img" filter="url(#blurMe)" x="-20" y="-20" width="100%" height="540" xlink:href="/'+data.avar+'" />'
                    //         +'</svg>';
                    //     $('.blur-bg').after(html);
                    // }
                    // bgLoaded('.blur-bg');
                    //评价商户
                    $("input[name='merchant']").val(data.objectid);
                    if(data.sDict.english != 'food'){
                        $('#taste').addClass('hide').css('display','none');
                    }

                    //优惠列表
                    var listLen = data.saleList.length || 0;

                    $('.sale-msg').text(listLen);

                    if(listLen != 0){
                        $('#product-info').empty().append(getProductModel(data.saleList,data.name));
                    }else{
                        $('#product-info').empty().append("<div class='empty-tip'>暂无相关优惠信息!</div>");
                    }
                    try{
                        init(data.address);
                    }
                    catch(e){
                        console.log(e);
                    }
                }
            },
            error:function(data){

            }
        })

        //商户产品列表
        function getProductModel(data,companyName){
            var len = data.length;
            var model = [];
            var companyName = companyName;
            for (var i=0; i< len; i++){
                var d = data[i];
                var type = d.sDict.english || 'other'; //discount/price/other
                //图片
                var productImg ='/' + d.coverImg;
                //图片
                model.push("<div class='product-box'><div class='product-item'>" +
                    "<div class='product-img' style='background:url("+ productImg +") no-repeat center center;background-size:360px;'></div>")
                //标题
                model.push("<div class='product-detail'>");
                var title = d.title;
                title = title.length > 19 ? title.slice(0,16) + '...' : title;
                //折扣
                if (type == 'price'){//原价/现价
                    model.push("<div class='row'><div class='product-title'><sapn class='product'>" + title + "</sapn></div>" +
                        "<div class='product-cost'><span class='now-price'>&yen;"+ d.current +"</span><br/><del>&yen;"+ d.origin +"</del></div></div>" )
                } else if (type == 'discount'){//折扣
                    model.push("<div class='row'><div class='product-title'><sapn class='product'>" + title + "</sapn></div>" +
                        "<div class='product-cost'><span class='now-price'>"+ d.discount +"折</span></div></div>" )
                } else{//无
                    model.push("<div class='row'><div class='product-title'><sapn class='product'>" + title + "</sapn></div></div>")
                }
                //详情
                model.push("<div class='row'><span class='icon'></span><span class='shop'>"+ companyName +"</span>" +
                    "<a href='/web/lifeCenter/preferentialDetail.html?objectid="+ d.objectid +"' class='product-more-btn'>查看详情</a></div>" +
                    "</div></div></div>")
            }
            return model.join("");

        }


        //生活中心 商户详情页模版
        function merchantDetailModel(data,objectid){
            var result = data;
            var image = "";
            //图片处理
            var img = new Image();
            image = '/' + result.avar;
            var type = result.sDict;
            var name = result.name || '';
            var address = result.address || '';
            var phone = result.phone || '';
            var model = [];

            model.push("<div class='container'><div class='col-xs-4'>" +"<div class='merchant-img' style='background:url("+image+") no-repeat center center;background-size:360px auto;'></div>" +
                "<div class='merchant-info'>"+ (result.shortIntro || "暂无简介") +"</div></div>" +
                "<div class='col-xs-7 col-xs-offset-1'><ul class='merchant-detail'>" +
                "<li><h4>"+ name +"</h4></li>")
            if(result.mEvaluate != null){
                var raty = result.mEvaluate;
                if(type.english == "food"){
                    model.push(
                        "<div class='rating'><span class='now-price'>口味"+raty.taste+"</span><span class='now-price'>环境"+raty.env+"</span>" +
                        "<span class='now-price'>服务"+raty.service+"</span></div>")
                } else{
                    model.push(
                        "<div class='rating'><span class='now-price'>环境"+raty.env+"</span>" +
                        "<span class='now-price'>服务"+raty.service+"</span></div>")
                }
            } else {
                model.push("<li class='rating'><span class='now-price'>暂无评分</span></li>")
            }
            model.push("<li><span class='icon'></span><span>"+type.name+"</span></li></li><li><span class='icon'></span><span>上午"+result.workStartTime+"~下午"+result.workEndTime+"</span></li>" +
                "<li><span class='icon'></span><span>"+address+"</span></li>"+
                "<li><span class='icon'></span><span>"+phone+"</span></li>" +
                "<li><a  class='product-more-btn' id='raty'>点评商户</a></li>" +
                "</ul>");
            var thumbList = result.thumbList;
            if(thumbList.length > 0){
                model.push("<div class='row'><div class='thumb-list' id='thumb'><span class='fa fa-chevron-left arrow' id='left'></span><div class='thumb-box'>" +
                    "<ul class='thumb' style='width:"+thumbList.length* 110 +"px'>")

                for(var i=0; i< thumbList.length; i++){
                    var thumb = thumbList[i];
                    model.push("<li><a data-toggle='modal' data-target='#imageModal' ><img class='thumb-item' src='/"+thumb.url+"' alt='商品图片' width='100' height='55'></a></li>")
                }
                model.push("</ul></div><span class='fa fa-chevron-right arrow' id='right'></span></div></div>")
            }
            model.push("</div></div>");

            return model.join("");
        }

        //商品缩略图事件,前一张,后一张图片;
        $(document).on('click','#left',function(){
            var width = parseInt($('.thumb').css('width'));
            var left = parseInt($('.thumb').css('left'));
            if( left - 3 * 110 > -width){
                $('.thumb').css('left',(left - 110) + "px");
            }
        })
        $(document).on('click','#right',function(){
            var width = parseInt($('.thumb').css('width'));
            var left = parseInt($('.thumb').css('left'));
            if( left < 0){
                $('.thumb').css('left',(left + 110) + "px");
            }
        })
        $(document).on('click','.thumb-item',function(){
            var src = $(this).attr('src');
            $("#imageModal .modal-body").empty().append("<img width='100%' src='"+src+"'>")
        })


        //评价数据接口
        $('#ratyForm').attr('action', '/Setting/MerchantEvaluate/Add');
        //初始化评价
        var initRaty = function(){
        $('#ratyStar1').raty({
            path: '/lib/images/',
            size:24,
            scoreName:'taste',
            score:5
        })
        $('#ratyStar2').raty({
            path: '/lib/images/',
            size:24,
            scoreName:'env',
            score:5
        })
        $('#ratyStar3').raty({
            path: '/lib/images/',
            size:24,
            scoreName:'service',
            score:5
        })
        };

        $('#ratyForm').bootstrapValidator({
                message: 'This value is not valid',
                excluded: ':disabled',
                feedbackIcons: {
                    valid: 'fa fa-smile-o',
                    invalid: 'fa fa-frown-o',
                    validating: 'fa fa-refresh'
                },
                fields: {
                    comment: {
                        validators: {
                            stringLength: {
                                min:15,
                                max: 250,
                                message: '限15个字符以上250个字符以内'
                            },
                            notEmpty: {
                                message: '评价内容不能为空'
                            }
                        }
                    },
                    taste: {
                        validators: {
                            notEmpty: {
                                message: '请为口味打分'
                            }
                        }
                    },
                    env: {
                        validators: {
                            notEmpty: {
                                message: '请为环境打分'
                            }
                        }
                    },
                    service:{
                        validators: {
                            notEmpty:{
                                message:'请为服务打分'
                            }
                        }
                    }
                }
            })
            .on('success.form.bv', function (e) {
                // Prevent form submission
                e.preventDefault();

                // Get the form instance
                var $form = $(e.target),
                    validator = $form.data('bootstrapValidator'),
                    submitButton = validator.getSubmitButton();
                // 转义特殊字符，防止js注入
                checkJsInject();

                // Use Ajax to submit form dat

                    $.ajax({
                        type: "POST",
                        url: $form.attr('action'),
                        data: $form.serialize(),
                        dataType: "json",
                        async: false,
                        success: function (result) {
                            if (result.success) {
                                showAlert('点评成功', 'success');
                                $('#ratyModal').modal('hide');
                                validator.resetForm();
                                //刷新评论列表
                                initPagination();
                            }else{
                                showAlert(result.msg,'danger');
                            }
                            //重置表格
                        }
                    });
            })
            .on('remove.field.fv',function(e,data){

            })
        $('#ratyModal').on('show.bs.modal', function () {
            $('#ratyForm').bootstrapValidator('resetForm', true);
            initRaty();
        });
        //点评商户
        $('#merchantDetail').on('click','#raty',function(){
            //用户已登录
            var status = $('#loginStatus');
            if(status.attr('loginstatus') == 'true'){
                $('#ratyModal').modal('show');
                $("input[name='customer']").val(status.attr('username'));
            }else{ //未登录提示登录
                checkMust();
            }
        })
        //用户评价翻页列表

        var initPagination = function() {
            // 创建分页
            $.ajax({
                type: 'GET',
                url:'/Setting/MerchantEvaluate/List/1/5?merchant='+ objectid,
                dataType:'json',
                async: true,
                success: function(data){
                    var num_entries = data.total;
                    var page_index = 0;
                    var init_flag = false;
                    $('.sale-comment').text(data.total);
                    if(data.result != '' && page_index == 0 && !init_flag){
                        $("#pagination").pagination(num_entries, {
                            num_edge_entries: 1, //边缘页数
                            num_display_entries: 4, //主体页数
                            callback: pageselectCallback,
                            items_per_page: 5, //每页显示1项
                            prev_text: "&laquo;",
                            next_text: "&raquo;"
                        });

                    }else{
                        $('#comment').empty().append('<div class="empty-tip">暂无评论!</div>');
                        $('#pagination').empty();
                    }
                    function pageselectCallback(page_index, panel){
                        if(page_index == 0 && !init_flag){
                            init_flag = true;
                            if(data.result != ''){
                                var target =  $('#comment').empty();
                                target.append(commentModel(data));
                                target.find('img').on('error', function(){
                                    this.src='/web/images/defaultFace.png';
                                })
                            }else{
                                $('#comment').empty().append('暂无评价');
                            }
                        }else{
                            getDate(page_index + 1,5)
                        }
                        $('#pagination a').attr('href','#commentBox');
                    }
                },
                error:function(data){

                }
            })

            
            function getDate(page_index, size){
                $.ajax({
                    type: 'GET',
                    url:'/Setting/MerchantEvaluate/List/'+page_index+'/'+size+'?merchant='+ objectid,
                    dataType:'json',
                    async: true,
                    success: function(data){
                        if(data.result != ''){
                            var target =  $('#comment').empty();
                            target.append(commentModel(data));
                            target.find('img').on('error', function(){
                                this.src='/web/images/defaultFace.png';
                            })
                        }else{
                            $('#comment').empty().append('<div class="empty-tip">暂无评论!</div>');
                        }
                    },
                    error:function(data){

                    }
                })

                return false;
            }
        };

        function commentModel(data){
            var model = [];
            var result = data.result;
            var len = result.length;
            model.push("<div class='tab'><span>全部评论("+data.total+")条</span></div>");
            for(var i=0; i< len; i++){
                if(result[i].cCustomer.userFace == null){
                    result[i].cCustomer.userFace = '/web/images/defaultFace.png';
                }

                model.push("<div class='comment-list row'><div class='col-xs-1 head'><img class='avar' src='"+result[i].cCustomer.userFace+"'></div>" +
                    "<div class='col-xs-11 body'><div class='col-sm-9 title'>"+result[i].cCustomer.name+"</div><div class='col-sm-3 time'>"+result[i].createTime+"</div>")
                if(result[i].mMerchant.sDict.english == 'food'){
                    model.push(
                        "<div class='col-sm-12 raty'><span>口味"+result[i].taste+"</span><span>环境"+result[i].env+"</span>" +
                        "<span>服务"+result[i].service+"</span></div>");
                } else {
                    model.push(
                        "<div class='col-sm-12 raty'><span>环境" + result[i].env + "</span>" +
                        "<span>服务" + result[i].service + "</span></div>");
                }
                model.push("<div class='col-sm-12 text'>"+result[i].comment+"</div>");
                var reply = result[i].replyList;

                if(reply.length > 0){
                    model.push("<div class='col-sm-12'><div class='col-sm-1 head'><img class='avar' src='/"+result[i].mMerchant.avar+"'></div>" +
                        "<div class='col-sm-11 body'><div class='col-sm-9 title'> "+result[i].mMerchant.name+"</div>" +
                        "<div class='col-sm-3 time'>"+reply[0].createTime+"</div>"+
                        "<div class='col-sm-12 text'>"+reply[0].content+"</div></div>")
                }

                model.push("</div></div></div>")
            }
            return model.join("");
        }
        initPagination();


        //百度地图
        function init(address) {
            var map = new BMap.Map("map");            // 创建Map实例
            var point = new BMap.Point(121.607334, 31.2096); // 创建点坐标
            map.centerAndZoom(point, 15);
            map.addControl(new BMap.NavigationControl());
            map.addControl(new BMap.ScaleControl());
            map.addControl(new BMap.OverviewMapControl());
            var myGeo = new BMap.Geocoder();
            myGeo.getPoint(address, function (point) {
                if (point) {
                    map.centerAndZoom(point, 16);
                    map.addOverlay(new BMap.Marker(point));
                }
            }, "上海市");
        }
    })
})
