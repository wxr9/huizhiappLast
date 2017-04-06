/**
 * Created by Administrator on 2016/5/4.
 */
require(['jqueryUpload','jquery', 'bootstrap','ckeditor','datepicker', 'datatables','pm','select2','bootstrapvalidator'], function(jqueryUpload) {
    var dToption = {
        "bAutoWidth": true, //自动宽度
        "dom": '<"top">rt<"bottom"lp><"clear">',
        "serverSide": true,
        "bDestory": true,
        "info": false,
        "ordering": false,
        "lengthChange": false,
        "sPaginationType": "full_numbers",
        "ajax": {
            url: '/Setting/AccessoryManage/List',
            data:function(d){
                d.type='accessory';
            },
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "名称",
            "data": "name"
        },{
            "sTitle": '上传人',
            "data": 'author'
        },{
            "sTitle": '操作',
            "data": 'objectid'
        }],
        "oLanguage": {
            "sProcessing": "处理中",
            "sZeroRecords": "没有匹配结果",
            "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
            "sInfoPostFix": "",
            "sLengthMenu": "显示 _MENU_ 项记录",
            "sSearch": "搜索:",
            "sEmptyTable": "表中数据为空",
            "sLoadingRecords": "载入中...",
            "sInfoThousands": ",",
            "oPaginate": {
                "sFirst": "首页",
                "sPrevious": "<<",
                "sNext": ">>",
                "sLast": "末页"
            }
        },
        "columnDefs": [{
            render: function(data, type, row) {
                var objectid = row.objectid;
                var html = [];
                html.push('<a class="operate renameBtn" objectid="'+objectid+'" href="#" data-toggle="modal" data-target="#renameModal">重命名</a>');
                html.push('<a class="operate deleteBtn" objectid="'+objectid+'">删除</a>');

                return html.join('');
            },
            targets: 2
        }],
        //初始化结束
        "initComplete": function() {
            $('#activityPubList').width("100%");
        },
        //加载结束
        "drawCallback": function() {

        }
    };

    
    $(function() {
        var list = $("#accessoryList");
        var table = $("#accessoryList").DataTable(dToption);
        //附件上传
        var file1 =jqueryUpload({
            file : 'file',
            url : '/FileUpload/AccessoryNanageUploadDocFile',
            extData:{
                type: 'doc'
            },
            name: 'file',
            fileName: 'file',
            statusName : 'success',
            //path: 'response path data',
            success: function(data){

                setTimeout(function () {
                    $('#addModal').modal('hide');
                    table.ajax.reload(null,false);
                },2000);
            },
            error: function(data){
            }
        });
        $('.add').click(function(){
            file1.reset();
        });
        //重命名
        list.on('click','.renameBtn',function(){
            var objectid=$(this).attr('objectid');
            $.ajax({
                type:'GET',
                url:'/Setting/AccessoryManage/Edit/'+objectid,
                dataType:'json',
                success:function(data){

                    $.each(data,function(ind,val){
                        var tar = $('input[name="'+ind+'"]');
                        if(tar.attr('type') != 'radio'){
                            tar.val(val)
                        }
                    });
                }
            })
        });
        //重命名的确定按钮
        var validatorFields = {
            name: {
                validators: {
                    notEmpty: {
                        message: '名称不能为空'
                    }
                }
            }
        }

        $('#renameForm').attr('action','/Setting/AccessoryManage/Update');
        // 初始化表单验证
        initBootstrapValidator(validatorFields,{
            end:function(){
                $('#renameModal').modal("hide");
                table.ajax.reload(null,false);
            }
        });
        //删除
        var delId='';
        list.on('click','.deleteBtn',function(){
            delId=$(this).attr('objectid');
            $('#delModal').modal('show');
            return false;
        })
        $('#delBtn').on('click',function(){
            $.ajax({
                type:'GET',
                url:'/Setting/AccessoryManage/Delete/'+delId,
                success:function(data){
                    showAlert(data.msg);
                    $('#delModal').modal('hide');
                    table.ajax.reload(null,false);
                }
            })
            return false;
        });


    });
});
