/**
 * Created by z on 2016/12/7.
 */
require(['jquery', 'bootstrap'], function(){
    //楼栋切换
    var lougao = [11,4,8,4,4];
    var num = ['一','二','三','四','五'];
    var tips = $('#tips .tip');
    $('#mapNav li').on('click',function(){
        $(this).addClass('active').siblings().removeClass('active');
        var index = $(this).index();
        tips.eq(index).addClass('active').siblings().removeClass('active');
        $('#lougao').text(lougao[index]+'层');
        $('#buildName').text('一期'+ num[index] +'号楼');
        $('#link').attr('href','/web/services/homepageDetail.html?building='+(index+1));
    });
    
    //线路切换
    var line = [["北洋泾路", "民生路", "源深体育中心", "世纪大道", "浦电路", "蓝村路", "上海儿童医学中心", "临沂新村", "高科西路", "东明路", "高青路", "华夏西路", "上南路", "灵岩南路", "东方体育中心"],
  ["大世界", "老西门", "陆家浜路", "西藏南路", "中华艺术", "宫耀华路", "成山路", "杨思", "东方体育中心", "凌兆新村", "芦恒路", "浦江镇", "江月路", "联航路", "沈杜公路"],
  ["交通大学", "徐家汇", "上海游泳馆", "龙华", "云锦路", "龙耀路", "东方体育中心", "三林", "三林东", "浦三路", "御桥", "罗山路", "秀沿路", "康新公路", "迪士尼"],
    '/web/images/hp_wh2.png'];
  
    $('#stationName').on('click','span',function(){
        $(this).addClass('active').siblings().removeClass('active');
        var index = $(this).index();
        changeLine(line[index],index);
        $('.line-mark span').eq(index).addClass('active').siblings().removeClass('active');
    })
    
    function changeLine(line,index){
        var html = [];
        if(typeof line == 'object'){
            $('.map-line').show();
            var mark = 12;//默认6号线
            if(index == 1){
                mark = 10;
            }else if(index == 2){
                mark = 7;
            }
            for(var i=0; i<15;i++){
                if(i == mark)
                    html.push('<li><span class="circle mark"></span><span>'+line[i]+'</span></li>');
                else
                    html.push('<li><span class="circle"></span><span>'+line[i]+'</span></li>')
            }
        }else{
            html.push('<li><img src="'+line+'"></li>');
            $('.map-line').hide();
        }
        $('#station').empty().append(html.join(''));
    }
    

});