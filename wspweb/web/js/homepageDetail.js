/**
 * Created by z on 2016/12/8.
 */
require(['jquery', 'bootstrap','pm'], function(){
    var id = queryString('building');
    var spans = $('#mapMark span');
    var height = [11,4,8,4,4];
    var buildingList = $('#buildingList'); //平面图楼层按钮
    var typeList = $('#typeList'); //楼层显示
    var images = [[1,2,3,4,5,6],[1,2,3,4,5],[1,2,3,4,5],[1,2,3,4,5],[1,2,3,4,5]];//图片编号
    var floors = [
        [1,2,3,'4-10',11,'屋顶'],
        [1,2,3,4,'屋顶'],
        [1,2,3,'4-8','屋顶'],
        [1,2,3,4,'屋顶'],
        [1,2,3,4,'屋顶']
    ] //nav名称
    //初始化
    spans.eq(id-1).addClass('active').siblings().removeClass('active');
    $('#buildName').text('一期'+(id)+'号楼');
    $('#buildHeight').text(height[id-1] +'层');
    changeTypeShow(id);
    //地图切换
    spans.on('click',function(){
        id = $(this).index();
        spans.eq(id-1).addClass('active').siblings().removeClass('active');
        $('#buildName').text('一期'+(id)+'号楼');
        $('#buildHeight').text(height[id-1] +'层');
        //切换楼层平面图内容
        changeTypeShow(id);

    })
    //房源切换
    $('#hp2Btns').on('click','span',function(){
        $(this).addClass('active').siblings().removeClass('active');
        var i = $(this).index();
        $('#buildingSource li').eq(i).addClass('active').siblings().removeClass('active');
    })


    typeList.on('click','img', function(){
        $('#img').attr('src',$(this).attr('src'));
        $('#imageModal').modal('show');
    })

    buildingList.on('click','li',function(){
        $(this).addClass('active').siblings().removeClass('active');
       var index = $(this).index();
       // $('#typeList').css('left',-index*550 + 'px');
       typeList.animate({'left':-index*550 + 'px'},500,'linear');
    })
    function changeTypeShow(id){
        var html = [],html2=[];
        var num = id-1;//楼栋编号,0开始；
        for(var i=0;i<images[num].length;i++){
            if(i==0) {
                html.push('<li class="active">'+floors[num][i]+'层</li>');
            } else
                html.push('<li>' + floors[num][i] + '层</li>');
            html2.push('<li><img src="/web/images/house'+id+(i+1)+'.jpg" alt="楼层平面图" width="400px"><p>'+floors[num][i]+'层平面图</p></li>')
        }
        buildingList.empty().append(html.join(""));
        typeList.empty().append(html2.join(''));
        typeList.animate({'left':0},500,'linear');
    }
});