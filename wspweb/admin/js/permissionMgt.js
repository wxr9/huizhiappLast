/**
 * Created by iris on 16/2/29.
 */
require(['jquery', 'bootstrap', 'datatables','select2','bootstrapvalidator','pm'], function() {
$(function() {
    var dToption = {
        "bAutoWidth": true, //自动宽度
        "dom": '<"top"if>rt<"bottom"lp><"clear">',
        "serverSide": true,
        "bDestory": true,
        "info": false,
        "ordering": false,
        "lengthChange": false,
        "searching":true,
        "sPaginationType": "full_numbers",
        "sEmptyTable" : "未查找到信息",
        "ajax": {
            data:function(d){
                //查询
            },
            url: '/Setting/User/Permission/List',
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "编号",
            "data": "objectid"
        }, {
            "sTitle": "权限名称",
            "data": "name"
        }, {
            "sTitle": "操作",
            "data": 'id'
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
        "columnDefs": [
            { render:function(data,type,row){
                var id = row.objectid;
                var html = [];
                html.push('<a class="operate editBtn" objectid=' + id + '>编辑</a>');
                //html.push('<a class="operate deleteBtn" objectid=' + id + '>删除</a>');
                return html.join('');
            },
                targets:2,
            }
        ],
        //初始化结束
        "initComplete": function() {
            $('#activityPubList').width("100%");
        },
        //加载结束
        "drawCallback": function() {

        }
    };



        var table = $("#permissionTable").DataTable(dToption),
            operate = $('#permissionTable');

        //编辑角色
        operate.on('click','.editBtn',function(){
            $('#editModal').modal('toggle');
            var id = $(this).attr('objectid');
            $.ajax({
                type:'GET',
                url: '/Setting/User/Permission/Edit/' + id,
                dataType:'json',
                success: function(data){

                    $('input[name="name"]').val(data.name);
                    $('input[name="objectid"]').val(data.objectid);
                    $('input[name="url"]').val(data.url);
                    $('textarea[name="memo"]').val(data.memo);

                }
            })
        })

        //删除角色
        operate.on('click','.deleteBtn', function(){
            $('#deleteModal').modal('show');
            var id = $(this).attr('objectid');
            $('#deleteBtn').click(function(){
                $.ajax({
                    type: 'GET',
                    url: '/Setting/User/Permission/Delete/' + id,
                    dataType: 'json',
                    success: function(data){
                        $('#deleteModal').modal('hide');
                        showAlert(data.msg)
                    }
                })
            })

        })


        // 验证字段
        var fieldsList = {
            url: {
                validators:{
                    notEmpty: {
                        message:'地址不能为空'
                    }
                }
            },
            name: {
                validators:{
                    notEmpty: {
                        message: '角色名称不能为空'
                    },
                    stringLength: {
                        min: 1,
                        max: 50,
                        message: '限50个字符以内'
                    }
                }
            },
            memo: {
                validators:{
                    stringLength: {
                        min: 1,
                        max: 200,
                        message: '限200个字符以内'
                    }
                }
            }

        }

        $('#editForm').attr('action','  /Setting/User/Permission/Update');
        $('#addForm').attr('action',' /Setting/User/Permission/Add');

        // 初始化表单验证
        initBootstrapValidator(fieldsList,{
            end:function(){
                table.ajax.reload( null, false );
            }
        });
        $("#eidtModal").on('show.bs.modal',function(){
            $('#editForm').bootstrapValidator('resetForm',true);
        })

        $("#addModal").on('show.bs.modal',function(){
            $('#addForm').bootstrapValidator('resetForm',true);
        })
    });
});