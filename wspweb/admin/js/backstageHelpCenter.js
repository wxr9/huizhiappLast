/**
 * Created by z on 2016/7/27.
 */
require(['jquery','bootstrap','pm'], function () {
    var flag= queryString('flag') || 'f';
    var objectid = 1;
    if(flag =='b'){
        objectid = 2;
        $('#title').html('后台帮助中心设置');
    }else{
        objectid = 1
        $('#title').html('前台帮助中心设置');
    }
    //初始化
    $.ajax({
        url: '/Setting/SettingHelps/Edit?type=' + flag,
        method: 'GET',
        success:function(data){
            var result = JSON.parse(data.content);
            if(result != ''){
                helpCenterInit($('#fileBox'),result);
            }

        }
    })
    //新增文件夹
    $('#addFile').on('click',function(){
        helpCenterInit($('#fileBox'));

    })
    //数据上传
    $('#saveBtn').on('click',function(){
        var cont = save($('#fileBox'));
        var files = $('input[name="filename"]');
        var count = 0;
        for(var i=0; i<files.length; i++){
            if($(files[i]).val() == ""){
                $(files[i]).addClass('hightlight');
                count++;
            }
        }
        if(!count){
            $.ajax({
                url: '/Setting/SettingHelps/Update',
                method: 'POST',
                data:{
                    objectid: objectid,
                    flag:flag,
                    content: cont
                },
                success:function(data){
                    showAlert('保存成功');
                    setTimeout(function(){
                        window.location.reload();
                    },3000)
                }
            });
        }else{
            showAlert('请填写文件夹名')
        }
    });
    
    /* 生成数据
    / data=[
        {"filename":"file";"files":[{"name":"aa","title":"richtexttitle","id":"richtextid"},{...}]},
        {...}
    ]*/

    function save(ele){
        var options=[];
        var ele = ele;
        var file = ele.children();
        $.each(file,function(i,val){
            var option = {};
            var box = $(val).children();
            var parent = box.eq(0).children();
            var child = box.eq(1).children();
            var len = child.length;
            option.filename = parent.eq(1).val();
            option.files = [];
            for(var i=0; i<len; i++){
                var data = {};
                var list = child.eq(i).children();
                data.name = list.eq(1).val() || "";
                data.title = list.eq(2).val() || "";
                data.id = list.eq(2).attr("id") || "";
                option.files.push(data);
            }
            options.push(option);
        })
        return JSON.stringify(options);
    }
    
    
})