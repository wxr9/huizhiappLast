/**
 * Created by Administrator on 2016/3/28.
 */
require(['jquery','pm'], function(){
    var id = queryString('id');
    $(function(){
        $.ajax({
            url: '/Jobs/Edit/' + id,
            success:function(data){
                if(data != ''){
                    var target = $('#cont').empty();
                    var time = data.createDate;
                    time = time.substring(0,10);
                    var html = []
                    html.push('<div class="jobTop">');
                    html.push('<h4 class="jobh4">'+data.name+'</h4>');
                    html.push('<p class="jobDate">发布日期：'+time+'</p></div>');
                    html.push('<div class="row jobRowTop">');
                    html.push('<div class="col-xs-2 jobh51">薪资：</div>');
                    html.push('<div class="col-xs-4 jobPrice jobLeftDel">'+data.money+'</div>');
                    html.push('<div class="col-xs-2 jobh51">薪资类别:</div>');
                    html.push('<div class="col-xs-4 jobh51 jobLeftDel">'+data.moneyType.name+'</div></div>');
                    html.push('<div class="row jobRowTop">')
                    html.push('<div class="col-xs-2 jobh51 ">职位描述：</div>');
                    html.push('<div class="row col-xs-offset-2">');
                    var content=data.content;
                    var arr=content.split("。");
                    var asd="";
                    for(var i=0;i<arr.length;i++){
                        asd+=arr[i]+"。<br/>";
                    }
                    $("#cont1").append(asd);
                    html.push('<div class="col-xs-10 jobLeftDel jobp">'+data.content+'</div></div>');
                    html.push('<div class="row text-center"><a href="/web/services/jobApply.html?id='+data.objectid+'&jobName='+data.name+'" class="btn btn-blue">投递简历</a></div>');
                    html.push('<p class="jobNotice">＊请有求职者将个人简历通过邮件发送至prrc@hr-it.com.cn，谢谢。</p>')
                    target.append(html.join(''));
                }

            }
        })
    })
});



