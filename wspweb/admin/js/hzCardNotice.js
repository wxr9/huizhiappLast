/**
 * Created by z on 2017/3/7.
 */
/**
 * Created by z on 2016/10/17.
 */
require(['jquery', 'bootstrap', 'datepicker','datatables','select2','bootstrapvalidator','pm'], function() {
    var dToption = {
        "bAutoWidth": true, //自动宽度
        "dom": '<"top"if>rt<"bottom"lp><"clear">',
        "serverSide": true,
        "bDestory": true,
        "searching": false,
        "info": false,
        "ordering": false,
        "lengthChange": false,
        "sPaginationType": "full_numbers",
        "sEmptyTable" : "未查找到信息",
        "ajax": {
            url: '/Payment/Annoucement/List/',
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "公告内容",
            "data": "content"
        }, {
            "sTitle": "开始时间",
            "data": "startTime"
        }, {
            "sTitle": "结束时间",
            "data": 'endTime'
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
                // html.push('<a class="operate editBtn" objectid="' + id + '">编辑</a>');
                html.push('<a class="operate delBtn" objectid="' + id + '">删除</a>');
                return html.join('');
            },
                targets:3
            },
            {
                width:'180px',
                targets:[1,2]
            }
        ],
        //初始化结束
        "initComplete": function() {
        },
        //加载结束
        "drawCallback": function() {

        }
    };


    $(function() {
        var table = $("#table").DataTable(dToption),
            operate = $('#table');

        //选择优惠时间
        $(".endTime")
            .datetimepicker({
                format: "yyyy-mm-dd hh:ii:00",
                autoclose: true,
                todayBtn: true,
                pickerPosition: "bottom-left",
                minView: 0,
                startDate: new Date()
            });
        $(".startTime")
            .datetimepicker({
                format: "yyyy-mm-dd hh:ii:00",
                autoclose: true,
                todayBtn: true,
                pickerPosition: "bottom-left",
                minView: 0,
                startDate: new Date()
            });
        // 验证字段
        var fieldsList = {
            content: {
                validators:{
                    notEmpty: {
                        message: '公告内容'
                    },
                    stringLength: {
                        min: 1,
                        max: 50,
                        message: '限50个字符以内'
                    }
                }
            },
            startTime: {
                validators:{
                    notEmpty:{
                        message:'开始时间不能为空'
                    }
                }
            },
            endTime: {
                validators:{
                    notEmpty:{
                        message:'结束时间不能为空\n'
                    },
                    callback:{
                        message:'结束时间必须不小于开始时间',
                        callback:function(fieldValue, validator){
                            var time = validator.getFieldElements('startTime').val();
                            var start = new Date(time);
                            var end = new Date(fieldValue);
                            return end >= start;
                        }
                    }
                }
            }

        }
        $('#addForm .form_datetime')
            .on('change', function(e) {
                $('#addForm')
                // Get the bootstrapValidator instance
                    .data('bootstrapValidator')
                    // Mark the field as not validated, so it'll be re-validated when the user change date
                    .updateStatus('startTime', 'NOT_VALIDATED', null)
                    .updateStatus('endTime', 'NOT_VALIDATED', null)
                    // Validate the field
                    .validateField('startTime')
                    .validateField('endTime')
            });
        $('#editForm .form_datetime')
            .on('change', function(e) {
                $('#editForm')
                // Get the bootstrapValidator instance
                    .data('bootstrapValidator')
                    // Mark the field as not validated, so it'll be re-validated when the user change date
                    .updateStatus('startTime', 'NOT_VALIDATED', null)
                    .updateStatus('endTime', 'NOT_VALIDATED', null)
                    // Validate the field
                    .validateField('startTime')
                    .validateField('endTime')
            });

        $('#editForm').attr('action','/Payment/Annoucement/Update/');
        $('#addForm').attr('action','/Payment/Annoucement/Add');

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
                                table.ajax.reload(null, false);
                            }
                            $('#addForm').bootstrapValidator('resetForm',true);
                            //重置表格
                            validator.resetForm();
                        }
                    });

                })
        }


        $('#addModal').on('click','button[data-dismiss="modal"]', function() {
            $('#addForm').bootstrapValidator('resetForm', true);
            //选择优惠时间
            $(".endTime")
                .datetimepicker({
                    format: "yyyy-mm-dd hh:ii:00",
                    autoclose: true,
                    todayBtn: true,
                    pickerPosition: "bottom-left",
                    minView: 0,
                    startDate: new Date()
                });
            $(".startTime")
                .datetimepicker({
                    format: "yyyy-mm-dd hh:ii:00",
                    autoclose: true,
                    todayBtn: true,
                    pickerPosition: "bottom-left",
                    minView: 0,
                    startDate: new Date()
                });
        });

        //编辑
        var edit = $('#editModal');

        operate.on('click','.editBtn',function(){
            var id = $(this).attr('objectid');
            edit.modal('show');
            $.ajax({
                method:"GET",
                url:'/Payment/Annoucement/Edit/'+id,
                dataType:'json',
                success:function(result){
                    var form = document.forms['editForm'];
                    form.content.value = result.content;
                    form.startTime.value = result.startTime;
                    form.endTime.value = result.endTime;
                    form.objectid = result.objectid;

                }
            })
        });

        operate.on('click','.delBtn', function(){
            $('#deleteModal').modal('toggle');
            var id = $(this).attr('objectid');
            $('#disableCfm').click(function() {
                $.ajax({
                    type: 'GET',
                    url: '/Payment/Annoucement/Del/' + id,
                    dataType: 'json',
                    success: function(data) {
                        $("#deleteModal").modal('hide');
                        table.ajax.reload( null, false );
                    }

                })
            });
            table.ajax.reload( null, false );

        })


    });
});