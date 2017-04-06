/**
 * Created by iris on 16/2/29.
 */
require(['jquery', 'bootstrap', 'datatables','select2','bootstrapvalidator','pm'], function() {
    var dToption = {
        "bAutoWidth": true, //自动宽度
        "dom": '<"top"if>rt<"bottom"lp><"clear">',
        "serverSide": true,
        "bDestory": true,
        "info": false,
        "ordering": false,
        "lengthChange": false,
        "sPaginationType": "full_numbers",
        "sEmptyTable" : "未查找到信息",
        "ajax": {
            url: '/Setting/User/Role/List',
            data:function(d){
                var value = $('.dataTables_filter input').val();
                var reg = new RegExp('^[a-zA-Z]*$','gi');
                if(reg.test(value)){
                    //搜索英文
                    d.rolename = value;
                    d.name = '';
                }else{
                    //搜索中文
                    d.rolename = '';
                    d.name = value;
                }
            },
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "角色英文名",
            "data": "rolename"
        }, {
            "sTitle": "角色名称",
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
                var username = row.rolename;
                var html = [];
                html.push('<a class="operate editBtn" rolename=' + username + '>编辑</a>');
                html.push('<a class="operate deleteBtn" rolename=' + username + '>删除</a>');
                return html.join('');
            },
                targets:2
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


    $(function() {
        var table = $("#roleTable").DataTable(dToption),
            operate = $('#roleTable');

        $('.dataTables_filter input').keyup(function(e){
            table.ajax.reload(null,false);
        });
        //编辑角色
        operate.on('click','.editBtn',function(){
            $('#editModal').modal('toggle');
            var rolename = $(this).attr('rolename');
            $.ajax({
                type:'GET',
                url: '/Setting/User/Role/Edit/' + rolename,
                dataType:'json',
                success: function(data){
                    $('input[name="rolename"]').val(data.rolename);
                    $('input[name="name"]').val(data.name);
                    $('textarea[name="memo"]').val(data.memo);

                    if(data.isShow == '2'){
                        $('input[name="isShow"]').eq(1).attr('checked',true);
                    }else{
                        $('input[name="isShow"]').eq(0).attr('checked',true);
                    }

                    var list = data.permissionList,
                        listId = [];
                    if(list != null){
                        for(var i = 0, len = list.length; i<len; i++){
                            listId.push(list[i].objectid);
                        }
                    }
                    getPermissionList($('#permissionList'),listId);

                }
            })
        })
        //删除角色
        var delRoleName='';
        operate.on('click','.deleteBtn', function(event){
            delRoleName = $(this).attr('rolename');
            $('#delModal').modal('show');
            return false;
        });
        $('#delBtn').on('click',function(){
            $.ajax({
                type: 'GET',
                url: '/Setting/User/Role/Delete/' + delRoleName,
                dataType: 'json',
                success: function(data){
                    table.ajax.reload(null,false);
                    $('#delModal').modal('hide');
                    showAlert(data.msg);
                }
            });
            return false;
        });

        //获取所有角色权限,selector为显示$对象,id为初始化选中列表
        function getPermissionList(selector,id){
            $.ajax({
                type:"GET",
                url: "/Setting/User/Permission/List/0/0",
                dataType:'json',
                success: function(data){
                    var options = [];
                    var List = data.result;
                    for(var i=0,len=List.length; i<len; i++){
                        options.push("<option value=\'"+ List[i].objectid +"\'>"+List[i].name+"</option>");
                    }
                    selector.empty().append(options.join(""));
                    if(id){
                        selector.val(id).select2();
                    }else{
                        selector.select2();
                    }
                }
            })
        }

        getPermissionList($('#permissionList2'))

        // 验证字段
        var fieldsList = {
            rolename: {
                validators:{
                    notEmpty: {
                        message:'角色英文名不能为空'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9]{1,50}$/i,
                        message: '限50个字符以内的英文字母和数字'
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
            },
            permissionArray: {
                validators:{
                    notEmpty: {
                        message: '角色权限不能为空'
                    }
                }
            }

        }

        $('#editForm').attr('action',' /Setting/User/Role/Update');
        $('#addForm').attr('action',' /Setting/User/Role/Add');

        // 初始化表单验证
        initBootstrapValidator(fieldsList);
        table.ajax.reload(null,false);

        $("#eidtModal").on('hide.bs.modal',function(){
            $('#editForm').bootstrapValidator('resetForm',true);
            table.ajax.reload(null,false);
        });

        $("#addModal").on('hide.bs.modal',function(){
            $('#addForm').bootstrapValidator('resetForm',true);
            table.ajax.reload(null,false);
        });
        $("#add").on('click',function(){
            $('#permissionList2').val('').select2();
            $('#addForm').bootstrapValidator('resetForm',true);
        })

    });
});