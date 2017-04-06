/**
 * Created by Administrator on 2016/4/21.
 */
require(['jquery', 'bootstrap', 'datatables', 'pm','select2','bootstrapvalidator','raty'], function () {
    var dToption = {
        "bAutoWidth": true, //自动宽度
        "dom": '<"top"if>rt<"bottom"lp><"clear">',
        "serverSide": true,
        "bDestory": true,
        "info": false,
        "ordering": false,
        "searching": false,
        "lengthChange": false,
        "sPaginationType": "full_numbers",
        "ajax": {
            url: '/Setting/MainBusiness/noComment/List',
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "流水号",
            "data": "serialNumber"
        }, {
            "sTitle": "服务类别",
            "data": "businessTypeZh"
        }, {
            "sTitle": '申请时间',
            "data": 'createDate'
        }, {
            "sTitle": '操作',
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
                "sFirst": "",
                "sPrevious": "«",
                "sNext": "»",
                "sLast": ""
            }
        },
        "columnDefs": [
            {
                render: function (data, type, row) {

                    var html = [];
                        html.push('<a class="operate ratyBtn" data-toggle="modal" serialNumber="'+row.serialNumber+'" businessType="'+row.businessType+'" objectid="'+row.businessId+'" data-target="#ratyModal">评价</a>');
                    return html.join('');

                },
                targets: 3
            }],
        //初始化结束
        "initComplete": function () {
            $('#changeTabel2').width("100%");
        },
        //加载结束
        "drawCallback": function () {

        }
    };




    $(function () {
        var table = $("#changeTabel2").DataTable(dToption);
        var usertable = $("#changeTabel2");
        //初始化评价
        var initRatyStar = function () {
            $('.ratyStar1').raty({
                hints: ['1', '2', '3', '4', '5'],
                path: '/lib/images/',
                scoreName: 'duration',
                targetKeep: true
            });
            $('.ratyStar2').raty({
                hints: ['1', '2', '3', '4', '5'],
                path: '/lib/images/',
                scoreName: 'attitude',
                targetKeep: true
            });
            $('.ratyStar3').raty({
                hints: ['1', '2', '3', '4', '5'],
                path: '/lib/images/',
                scoreName: 'quality',
                targetKeep: true
            });
        }
        initRatyStar();

        //评价
        usertable.on('click', '.ratyBtn', function () {
            $('textarea[name=content]').val('');
            //$('#ratyModal').show;
            $('input[name=businessId]').val($(this).attr('objectid'));
            $('input[name=businessType]').val($(this).attr('businessType'))
            $('input[name=serialNumber]').val($(this).attr('serialNumber'))


        });
        //初始化表格
        // 验证字段

        $('#ratyForm').bootstrapValidator({
                    message: 'This value is not valid',
                    excluded: [':disabled'],
                    feedbackIcons: {
                        valid: 'fa fa-smile-o',
                        invalid: 'fa fa-frown-o',
                        validating: 'fa fa-refresh'
                    },
                    fields: {
                        content: {
                            validators: {
                                stringLength: {
                                    max: 250,
                                    message: '限250个字符以内'
                                },
                                notEmpty: {
                                    message: '内容不能为空',
                                }
                            }
                        }

                    }
                })
            .on('success.form.bv', function (e) {
            // Prevent form submission
            e.preventDefault();

            // Get the form instance
            var $form = $(e.target),
                validator = $form.data('bootstrapValidator'),
                submitButton = validator.getSubmitButton();
            // 转义特殊字符，防止js注入
            checkJsInject();
            //$('#ratyForm').attr('action','/Comment/Add');
            //$('#ratyModal').modal('hide');
            //table.ajax.reload( null, false );
            //validator.resetForm();
            $.ajax({
                type: "POST",
                url: '/Comment/Add',
                data: $form.serialize(),
                dataType: "json",
                async: false,
                success: function (result) {
                    showAlert('评价成功', 'success');
                    $('#ratyModal').modal('hide');
                    table.ajax.reload( null, false );
                    validator.resetForm();
                    //重置表格
                }
            });
        })

        $('#ratyModal').on('hide.bs.modal',function(){
            $('#ratyForm').bootstrapValidator('resetForm',true)
            initRatyStar();
        })


    })
})


