require(['jquery','bootstrap','pm'],function(){
    $(function(){
        var objectid = queryString('objectid') || 1;

        $.ajax({
            type:'GET',
            url:'/Setting/MerchantSale/Edit/'+objectid,
            dataType: 'json',
            success:function(data){
                if(data != 'undefined'){
                    //背景图片加载及IE10兼容
                    // $('.blur-bg').css('background-image','url(/'+data.coverImg+')');
                    // var b_version = navigator.appVersion.split(';');
                    // var trim_version = b_version[1].replace(/[ ]/g,"");
                    // if(trim_version == "MSIE10.0" || trim_version == "MSIE11.0"){
                    //     var html = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" > ' +
                    //         '<filter id="blurMe"> <feGaussianBlur in="SourceGraphic" stdDeviation="100" /> </filter> ' +
                    //         '<image class="blur-img" filter="url(#blurMe)" x="-20" y="-20" width="100%" height="540" xlink:href="/'+data.coverImg+'" />'
                    //         +'</svg>';
                    //     $('.blur-bg').after(html);
                    // }
                    // bgLoaded('.blur-bg');
                    $("#preferentialDetail").empty().html(saleDetailModel(data,objectid));
                }
            },
            error:function(data){

            }
        })

        //生活中心 详情页模版
        function saleDetailModel(data,objectid){
            var result = data;
            var image = '/' + result.coverImg;
            var type = result.sDict.english || 'other'; //discount/price/other
            var name = result.company.name || '';
            var address = result.company.address || '';
            var phone = result.company.phone || '';
            var model = [];
            var shortIntro = result.shortIntro || '';
            model.push("<div class='container'><div class='col-xs-4'>" +"<div class='merchant-img' style='background:url("+image+") no-repeat center center;background-size:360px auto;'></div>" +
                "<div class='merchant-info'>"+ (shortIntro || "暂无简介") +"</div></div>" +
                "<div class='col-xs-7 col-xs-offset-1'><ul class='merchant-detail'>" +
                "<li><h4>"+result.title+"</h4></li>");
            if(type == "discount"){
                model.push("<li class='rating'><span class='now-price'>"+result.discount+"折</span></li>")
            } else if( type == 'price'){
                model.push("<li class='rating'><span class='now-price'>&yen;"+result.current+"</span><del>&yen;"+result.origin+"</del></li>")
            } else{
                model.push("<li class='rating'><span class='now-price'>暂无折扣</span></li>")
            }

            model.push("<li><span class='icon'></span><span>"+name+"</span></li></li><li><span class='icon'></span><span>"+result.startTime+"~"+result.endTime+"</span></li>" +
                "<li><span class='icon'></span><span>"+address+"</span></li>"+
                "<li><span class='icon'></span><span>"+phone+"</span></li>" +
                "<li><a class='product-more-btn' href='/web/lifeCenter/merchantDetail.html?objectid="+result.companyId+"'>商户详情</a></li>" +
                "</ul></div></div>")

            return model.join("");
        }


    })
})
