/**
 * Created by Administrator on 2016/5/3.
 */
require(['jqueryUpload',"jquery","pm", 'bootstrap','pagination','bootstrapvalidator'], function(jqueryUpload) {
    $(function () {

        //初始化列表
        var initPagination = function(cur) {
            var now = cur != undefined ? cur : 0;
            $.ajax({
                type: 'GET',
                url:'/Setting/AccessoryManage/List/1/3?type=material',
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
                                current_page: now,
                                callback: pageselectCallback,
                                items_per_page: 3, //每页显示1项
                                prev_text: "&laquo;",
                                next_text: "&raquo;"
                            });
                        }
                    }else {
                        $('#materialList').empty().append("<div class='empty-tip'>未查找到素材!</div>")
                    }
                    function pageselectCallback(page_index, panel){
                        if(page_index == 0 && !init_flag){
                            init_flag = true;
                            $('#materialList').empty().append(getProductModel(data.result));
                        }else
                            getListDate(page_index+1,3);
                        return false;
                    }
                },
                error:function(data){

                }
            });

            function getListDate(page_index,size){
                $.ajax({
                    type: 'GET',
                    url:'/Setting/AccessoryManage/List/'+page_index+'/'+size+'?type=material',
                    dataType:'json',
                    async: true,
                    success: function(data){
                        if(data.result.length > 0){
                            $('#materialList').empty().append(getProductModel(data.result));
                        } else {
                            $('#materialList').empty().append("<div class='empty-tip'>未查找到素材!</div>")
                        }
                    },
                    error:function(data){

                    }
                })
            }
        }

        initPagination();
        function getProductModel(data){
            var html=[];
            html.push('<ul class="clearfix ulList">');
            $.each(data,function(ind,val){
                html.push('<li>' +
                    '<img src="/'+val.url+'" onerror="this.src=\'/admin/images/radio.jpg\'"/>' +
                    '<h4 class="name" title="'+val.name+'">'+val.name+'</h4>' +
                    '<p class="opp"><a class="btn btn-blue rename" href="javascript:;" objectid="'+val.objectid+'">编辑</a><a class="btn btn-blue delete" href="javascript:;" objectid="'+val.objectid+'">删除</a></p>' +
                    '<div class="author"><p>'+val.author+'</p><p>上传日期：'+val.createDate.substr(0,10)+'</p></div>' +
                    '<div class="popup1"><div class="triangle"></div><form method="POST"><label><span>编辑名称</span><input type="text" name="name" value="'+val.name+'"/>' +
                    '<input type="hidden" name="deleteFlag" value="'+val.deleteFlag+'"/>' +
                    '<input type="hidden" name="author" value="'+val.author+'"/>' +
                    '<input type="hidden" name="objectid" value="'+val.objectid+'"/>' +
                    '<input type="hidden" name="type" value="'+val.type+'"/>' +
                    '<input type="hidden" name="url" value="'+val.url+'"/></label>' +
                    '<p><a class="btn btn-orange">确认</a><a class="btn btn-gray cancel1">取消</a></p></form></div>' +
                    '<div class="popup2"><div class="triangle"></div><p>确定删除素材？</p><p><button class="btn btn-orange">确认</button><button class="btn btn-gray cancel" data-dismiss="modal">取消</button></p></div></li>');
            });
            return html.join('');
        }

        //素材上传
        var upl= jqueryUpload({
            file : 'pic',
            url : '/FileUpload/AccessoryNanageMaterialUploadDocFile',
            extData:{
                type: 'png'
            },
            name: 'pic',
            fileName: 'file',
            statusName : 'success',
            preview: {
                prevUrl : '/'
                //target : jqueryDom,
            },
            path: 'response path data',
            success: function(data){
                initPagination();
            },
            error: function(data){

            }
        });
        $('.operate').click(function(){
            upl.reset();
        })
        //重命名
        var $form;
        $('#materialList').on('click','.rename',function(){
            $(this).parent().siblings('.popup1').show();
            $(this).parent().siblings('.popup2').hide()
            $form=$(this).parent().parent().find('form');
            $form.attr('action','/Setting/AccessoryManage/Update');
            $form.find('.btn-orange').on('click',function(){
                //var data=$form.serialize();
                //$.post("/Setting/AccessoryManage/Update",$form.serialize(),function(data){
                //    showAlert(data.msg);
                //    return false;
                //})
                var data=$form.serialize();
                $.ajax({
                    type:'POST',
                    url:'/Setting/AccessoryManage/Update',
                    data:data,
                    dataType: "json",
                    success:function(data){
                        showAlert(data.msg);
                        $form.parent().hide();
                        var nowpage = $('.current:not(.next):not(.prev)').html();
                        initPagination(parseInt(nowpage)-1);
                        //window.location.reload();
                    }
                })
                return false;
            })
        });
        //删除
        $('#materialList').on('click','.delete',function(){
            var objectid=$(this).attr('objectid');
            $(this).parent().siblings('.popup2').show();
            $(this).parent().siblings('.popup1').hide()
            $(this).parent().siblings('.popup2').find('.btn-orange').click(function(){

                $.ajax({
                    type:'GET',
                    url:'/Setting/AccessoryManage/Delete/'+objectid,
                    success:function(data){
                        showAlert(data.msg)
                        if(data.success==true){
                            var nowpage = $('.current:not(.next):not(.prev)').html();
                            initPagination(parseInt(nowpage)-1);
                            //window.location.reload();
                        }
                    }
                })
                $(this).parent().parent().hide();
            })
        });
        $('#materialList').on('click','.cancel',function(){
            $(this).parent().parent().hide();
        });
        $('#materialList').on('click','.cancel1',function(){
            $(this).parent().parent().parent().hide();
        });
    });
});