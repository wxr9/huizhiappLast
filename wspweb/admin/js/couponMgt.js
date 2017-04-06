/**
 * Created by z on 2016/11/17.
 */
require(['jqueryUpload','jquery', 'datepicker','datatables','select2','bootstrapvalidator','pm'], function(jqueryUpload) {
    var dToption = {
        "bAutoWidth": true, //自动宽度
        "dom": '<"top"if>rt<"bottom"lp><"clear">',
        "serverSide": true,
        "bDestory": true,
        "info": false,
        "ordering": false,
        "searching":false,
        "lengthChange": false,
        "sPaginationType": "full_numbers",
        "sEmptyTable": "未查找到信息",
        "ajax": {
            url: '/Thirdpart/SaleMain/List',
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "优惠名称",
            "data": "name"
        }, {
            "sTitle": "开始时间",
            "data": "startDate"
        }, {
            "sTitle": "结束时间",
            "data": 'endDate'
        }, {
            "sTitle": "类型",
            "data": 'sDict'
        },{
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
        "columnDefs": [{
            render: function (data, type, row) {
                return data.name;
            },
            targets: 3
        },
            {
                render: function (data, type, row) {
                    var id = row.id;
                    var html = [];
                    html.push('<a class="operate editBtn" data-toggle="modal" data-target="#editModal" objectid="' + id + '">编辑</a>');
                    html.push('<a class="operate importBtn" data-toggle="modal" data-target="#codeModal"  objectid="' + id + '">验证码管理</a>');
                    return html.join('');
                },
                targets: 4
            }
        ],
        //初始化结束
        "initComplete": function () {
            $('#activityPubList').width("100%");
        },
        //加载结束
        "drawCallback": function () {

        }
    };
    $(function(){
        //列表初始化
        var dataTable = $("#table").DataTable(dToption);
        var table = $("#table");
        //选择优惠时间
        $(".form_datetime")
            .datetimepicker({
                format: "yyyy-mm-dd hh:ii:00",
                autoclose: true,
                todayBtn: true,
                pickerPosition: "bottom-left",
                minView: 0,
                startDate: new Date()
            });
        //初始化下拉框
        getDict({
            selector:$('#select'),
            type:"Sale3rdMain"
        });

        // 验证字段
        var fieldsList = {
            name: {
                validators:{
                    notEmpty: {
                        message: '优惠名称不能为空'
                    },
                    stringLength: {
                        min: 1,
                        max: 50,
                        message: '限50个字符以内'
                    }
                }
            },
            startDate: {
                validators:{
                    notEmpty:{
                        message:'开始时间不能为空'
                    },
                    stringLength: {
                        min: 1,
                        max: 200,
                        message: '限200个字符以内'
                    },
                    callback:{

                    }
                }
            },
            endDate: {
                validators:{
                    notEmpty:{
                        message:'结束时间不能为空\n'
                    },
                    callback:{
                        message:'结束时间必须不小于开始时间',
                        callback:function(fieldValue, validator){
                            var time = validator.getFieldElements('startDate').val();
                            var start = new Date(time);
                            var end = new Date(fieldValue);
                            return end >= start;
                        }
                    }
                }
            },
            type:{
                validators:{
                    notEmpty:{
                        message:'类型不能为空'
                    }
                }
            },
            content: {
                validators:{
                    notEmpty: {
                        message: '通知内容不能为空'
                    }
                }
            }

        };
        $('.form_datetime')
            .on('change', function(e) {
                $('#addForm')
                // Get the bootstrapValidator instance
                    .data('bootstrapValidator')
                    // Mark the field as not validated, so it'll be re-validated when the user change date
                    .updateStatus('startDate', 'NOT_VALIDATED', null)
                    .updateStatus('endDate', 'NOT_VALIDATED', null)
                    // Validate the field
                    .validateField('startDate')
                    .validateField('endDate')
            });

        $('#editForm').attr('action','/Thirdpart/SaleMain/Update/');
        $('#addForm').attr('action','/Thirdpart/SaleMain/Add');

        // 初始化表单验证
        validator(fieldsList);
        function validator(fieldsList,callback) {
            $('form')
                .bootstrapValidator({
                    message: 'This value is not valid',
                    excluded: [':disabled'],
                    feedbackIcons: {
                        valid: '',
                        invalid: '',
                        validating: ''
                    },
                    fields: fieldsList
                })
                .on('success.form.bv', function (e) {
                    // Prevent form submission
                    e.preventDefault();
                    var $form = $(e.target),
                        validator = $form.data('bootstrapValidator');
                    checkJsInject();
                    // 转义特殊字符，防止js注入
                    if(callback){
                        if(callback.prev != undefined){
                            callback.prev();
                        }

                    }

                    var data = $form.serialize();
                    // Use Ajax to submit form data
                    $.ajax({
                        type: "POST",
                        url: $form.attr('action'),
                        data: data,
                        dataType: "json",
                        async: false,
                        success: function (result) {
                            if(result.success == false){
                                showAlert(result.msg,'warn')
                            }else{
                                //关闭模态框
                                $("#editModal").modal("hide");
                                $("#addModal").modal("hide");
                                showAlert(result.msg);
                                dataTable.ajax.reload(null, false);
                            }
                            //重置表格
                            validator.resetForm();
                        }
                    });

                })
        }


        table.on('click','.editBtn',function(){
            var id = $(this).attr('objectid');
            $.ajax({
                type:"GET",
                url:'/Thirdpart/SaleMain/Edit/'+id,
                dataType:'json',
                success:function(data){
                    if(data != null){
                        var form = document.forms['editForm'];
                        form.id.value = data.id;
                        form.startDate.value = data.startDate;
                        form.endDate.value = data.endDate;
                        form.name.value = data.name;
                        form.content.value = data.content;
                        getDict({
                            selector:$('#select2'),
                            type:"Sale3rdMain",
                            id:data.type
                        });
                    }

                }

            })

        })

        var codeId = 1;
        //验证码管理
        var codeOption = {
            "bAutoWidth": true, //自动宽度
            "dom": '<"top"if>rt<"bottom"lp><"clear">',
            "serverSide": true,
            "bDestory": true,
            "info": false,
            "ordering": false,
            "searching":false,
            "lengthChange": false,
            "sPaginationType": "full_numbers",
            "sEmptyTable": "未查找到信息",
            "ajax": {
                url: '/Thirdpart/SaleChild/List',
                data:function(d){
                    d.main_id = codeId;
                },
                dataSrc: "result"
            },
            "aoColumns": [{
                "sTitle": "验证码",
                "data": "code"
            }, {
                "sTitle": "使用状态",
                "data": "status"
            }, {
                "sTitle": "使用人",
                "data": 'user'
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
                render: function (data, type, row) {
                    if(data){
                        return "已领用"
                    }else
                        return "未领取"
                },
                targets: 1
            }],
            //初始化结束
            "initComplete": function () {

            },
            //加载结束
            "drawCallback": function () {

            }
        };

        //列表初始化
        var codeDataTable = $("#codeTable").DataTable(codeOption);
        table.on('click','.importBtn',function(){
            codeId = $(this).attr('objectid');
            codeDataTable.ajax.reload();

            $('.uploadHBox').hide();
            jqueryUpload({
                file : 'fileUpload1',
                url : '/Thirdpart/SaleChild/ExcelImport',
                extData:{
                    type: 'xlsx',
                    objectid:codeId
                },
                name: 'file',
                fileName: 'file',
                statusName : 'success',
                //path: 'response path data',
                success: function(data){
                },
                error: function(data){
                    showAlert('数据格式错误')
                }
            });
        });

    })


});