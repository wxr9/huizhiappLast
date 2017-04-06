require(['jquery','fullpage','carousel','pm'], function ($) {
	 //加载页面
	var pageList = [
		'video',
		'actCenter',
		'lifeCenter',
		'serviceCenter',
		'wizCard'
	];
	var target = $("#fullPage").fullpage({
		navigation: true,
		navigationPosition: 'right',
        afterLoad:function(anchorLink,index){
            if(index == 5){
                $("#scrollNextBtn").hide();
            }else{
                $("#scrollNextBtn").show();
            }
        }
	});
	$("#scrollNextBtn").on('click', function(){
		$.fn.fullpage.moveSectionDown();

	})

    //广告图片
    $.ajax({
        type:'GET',
        url:'/Setting/HomepageAdver/List/0/0',
        dataType:'json',
        async:true,
        success: function(data){
            var target = $('#indexCarousel').empty();
            if(data.result != ''){
                var list = [],
                     num = 0,
                    total = data.total,
                    result = data.result;
                for(var k=0; k<total; k++){
                    if(num < 5){
                        if(result[k].isBan == 2){
                            list.push(result[k].imgUrl);
                            num++;
                        }
                    }else
                        break;
                }
                var len = num;
                if(len > 0){
                    var html = [];
                    //状态点
                    html.push('<ol class="carousel-indicators carousel-dot">')
                    html.push('<li class="active" data-target="#indexCarousel" data-slide-to="0"><a><span></span></a></li>');
                    for(var i=1; i<len; i++){
                        html.push('<li data-target="#indexCarousel" data-slide-to="'+i+'"><a><span></span></a></li>')
                    }
                    html.push('</ol><div class="carousel-inner">');

                    //第一张图片,添加active
                    html.push('<div class="item active" style="background-image:url(/'+list[0]+')"></div>');
                    for(var j=1; j<len; j++){
                        html.push('<div class="item" style="background-image:url(/'+list[j]+')"></div>');
                    }
                    html.push('</div>');
                    //前一张后一张按钮
                    html.push('<a class="left carousel-control" href="#indexCarousel" data-slide="prev"><img class="arrow-btn" src="/web/images/rightarrow.png"></a>' +
                        '<a class="right carousel-control" href="#indexCarousel" data-slide="next"><img class="arrow-btn" src="/web/images/leftarrow.png"></a>');
                    target.append(html.join(''));
                }else{
                    //无图片时显示默认图片
                    var defaultHtml = [];
                    defaultHtml.push('<img src="/web/images/sb.png" width="1200">');
                    target.append(defaultHtml.join(''))
                }
            }else{
                //无图片时显示默认图片
                var noImg = [];
                noImg.push('<img src="/web/images/sb.png" width="1200">');
                target.append(noImg.join(''))
            }
        }
    })
    $('.carousel-box').css('min-height','800px');
    $('#indexCarousel').on('slid.bs.carousel', function() {
        var item = $('#indexCarousel .carousel-inner .item.active');
        $('.carousel-indicators li').removeClass('active');
        var index = item.index()+1;
        $('.carousel-indicators li:nth-child(' + index + ')').addClass('active');
    });


    //加载活动中心列表
	$.ajax({
		url: '/ActivityCenter/ActivityMain/List/0/0',
		dataType:'json',
        method:'GET',
		success: function(data){
            if(data.result != ''){
                var list = $('#activityList');
                var result = [];
                $(data.result).each(function(i,e){
                    //unlimited
                    if(e.isBan == 1){
                        result.push(e);
                    }
                });
                var len = result.length > 6 ? 6 : result.length;
                var html=[];
                var first = ["<a class='act-item' data-id='"+result[0].needLogin+"' target='_blank' href='"+result[0].details+"'><img src='/"+result[0].image+"' height='400'></a>"];
                $('.activityImg').append(first.join(''));
                for(var i=1;i< len;i++){
                    var title = result[i].title.length > 27 ? result[i].title.substring(0,23)+"..." : result[i].title;
                    html.push("<li class='img-item act-item' data-id='"+result[i].needLogin+"'><a target='_blank' href='"+result[i].details+"'><img src='/"+result[i].image+"' height='110'><span class='act-title'>"+title+"</span></a></li>")
                }
                html.push("<li class='img-item act-item' data-id='"+result[i].needLogin+"'><a target='_blank' href='/web/activity/activityCenter.html'><span class='img-more'></span><span>更多活动</span></a></li>")
                list.empty().append(html.join(''));


            }

		}
	});
    $('#activity').on('click','.act-item',function(event){
        var status = $('#loginStatus').attr('loginstatus');
        var id = $(this).attr('data-id');
        if(id == 1 && status == undefined){
            event.preventDefault();
            $('#login').trigger('click');
        }
    })

    //加载生活中心列表
    $.ajax({
        url: '/Setting/Merchant/List/1/5?isCheck=2&paramHit=false',
        dataType:'json',
        method:'GET',
        success: function(data){
           if(data != undefined){
               var result = data.result;
               var html = [];
               html.push("<div class='lifeBox-item'>" +
                   "<a href='/web/lifeCenter/merchantDetail.html?objectid="+result[0].objectid+"' class='life-img'><img src='/"+result[0].avar+"' class='image'></a>" +
                   "<a href='/web/lifeCenter/merchantDetail.html?objectid="+result[1].objectid+"' class='life-img'><img src='/"+result[1].avar+"' class='image'></a>" +
                   "</div>");
               var type = data.result[2].sDict.english;
               var raty = data.result[2].mEvaluate;
               if(type == 'food'){
                   html.push("<div class='lifeBox-item'>" +
                       "<a href='/web/lifeCenter/merchantDetail.html?objectid="+result[2].objectid+"' class='life-mid-img'><div class='life-rating'>" +
                       "<img src='/"+result[2].avar+"' width='470'>" +
                       "<div class='raty-item'><div class='raty-title'>"+result[2].name+"</div><span>口味"+raty.taste+"</span><span>环境"+raty.env+"</span>" +
                       "<span>服务"+raty.service+"</span></div></div></a>" +
                       "</div>");
               }else{
                   html.push("<div class='lifeBox-item'>" +
                       "<a href='/web/lifeCenter/merchantDetail.html?objectid="+result[2].objectid+"' class='life-mid-img'><div class='life-rating'>" +
                       "<img src='/"+result[2].avar+"' width='470'>" +
                       "<div class='raty-item'><div class='raty-title'>"+result[2].name+"</div><span>环境"+raty.env+"</span>" +
                       "<span>服务"+raty.service+"</span></div></div></a>" +
                       "</div>");
               }

               html.push("<div class='lifeBox-item'>" +
                   "<a href='/web/lifeCenter/merchantDetail.html?objectid="+result[3].objectid+"' class='life-img'><img src='/"+result[3].avar+"' class='image'></a>" +
                   "<a href='/web/lifeCenter/merchantDetail.html?objectid="+result[4].objectid+"' class='life-img'><img src='/"+result[4].avar+"' class='image'></a>" +
                   "</div>");
               $('#lifeBox').empty().append(html.join(''));
           }
        }
    });
	window.showMessage = showMessage;

});
