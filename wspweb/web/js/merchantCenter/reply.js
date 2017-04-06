require(['jquery', 'bootstrap','datepicker', 'datatables','raty'], function() {
    var dToption = {
        "bAutoWidth": true, //自动宽度
        "dom": '<"top"if>rt<"bottom"lp><"clear">',
        "serverSide": true,
        "bDestory": true,
        "info": false,
        "ordering": false,
        "lengthChange": false,
        "sPaginationType": "full_numbers",
        "searching": false,
        "sEmptyTable" : "未查找到信息",
        "ajax": {
            url: '/Setting/MerchantEvaluate/List',
            data: function(d){
                d.username = 'merchant'
            },
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "评论用户",
            "data": "customer"
        }, {
            "sTitle": "评论时间",
            "data": "createTime"
        }, {
            "sTitle": '评论内容',
            "data": 'comment'
        }, {
            "sTitle": '评价',
            "data": 'env'
        }, {
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
                "sFirst": "",
                "sPrevious": "«",
                "sNext": "»",
                "sLast": ""
            }
        },
        "columnDefs": [
            {
                targets:2,
                width:250,
            },
            {
                render:function(data,type,row){
                    var rating = [];
                    if(row.mMerchant.sDict.english =='food'){
                        rating.push('<ul class="raty-list"><li>环境: <span class="ratyStar" data-score='+row.env+'></span></li>');
                        rating.push('<li>口味: <span class="ratyStar" data-score='+row.taste+'></span></li>');
                        rating.push('<li>服务: <span class="ratyStar" data-score='+row.service+'></span></li></ul>');
                    } else{
                        rating.push('<ul class="raty-list"><li>环境: <span class="ratyStar" data-score='+row.env+'></span></li>');
                        rating.push('<li>服务: <span class="ratyStar" data-score='+row.service+'></span></li></ul>');
                    }
                    return rating.join('');
                },
                targets:3
            },{
                render:function(data,type,row){

                    var html = [];
                    if(row.replyList.length == 0){
                        html.push("<a class='reply' data-toggle='modal' data-target='#infoModal' objectid='"+row.objectid+"'><i class='fa fa-wechat fa-2x'></i></a>");
                    }else{
                        html.push('已回复')
                    }

                    return html.join('');
                },
                targets:4
            }
        ],
        //初始化结束
        "initComplete": function() {

        },
        //加载结束
        "drawCallback": function() {
            $('.ratyStar').raty({
                path:'/lib/images/',
                half:true,
                halfShow: true,
                targetKeep: true,
                score:function(){
                    return $(this).attr('data-score')
                },
                readOnly: true
            });
        }
    };


    $(function() {
        checkMust();
        var table = $("#businessTable").DataTable(dToption);
        var reply = $("#businessTable");
        reply.on('click','.reply',function(){
            var id = $(this).attr('objectid');
            $.ajax({
                type:"GET",
                url:'/Setting/MerchantEvaluate/Edit/'+id,
                success:function(data){
                    $('input[name="eid"]').val(data.objectid);
                    $('input[name="merchant"]').val(data.merchant);
                    $('#comment').val(data.comment);
                    $('#customer').val(data.customer);
                },
                error:function(data){

                }
            })
        });

        $('#replyForm').attr('action','/Setting/MerchantReply/Add');
        $('#replyForm').bootstrapValidator({
            message:'This value is not valid.',
            feedbackIcons: {
                valid: '',
                invalid: '',
                validating: ''
            },
            fields: {
                content: {
                    validators: {
                        notEmpty: {
                            message: '评论内容不能为空'
                        },
                        stringLength: {
                            max: 200,
                            message: '限200个字符以内'
                        }
                    }
                }
            }

        }).on('success.form.bv', function (e) {
                // Prevent form submission
                e.preventDefault();

                // Get the form instance
                var $form = $(e.target),
                    validator = $form.data('bootstrapValidator'),
                    submitButton = validator.getSubmitButton();
                // 转义特殊字符，防止js注入
                checkJsInject();

                // Use Ajax to submit form data
                $.ajax({
                    type: "POST",
                    url: $form.attr('action'),
                    data: $form.serialize(),
                    dataType: "json",
                    async: false,
                    success: function (result) {
                        if(result.success == false){
                            showAlert(result.msg,'warn')
                        }
                        //关闭模态框
                        $("#infoModal").modal("hide");
                        //重置表格
                        validator.resetForm();
                        table.ajax.reload();
                    }
                });
            })
            .on('click', 'button[data-dismiss]', function () {
                $('form').bootstrapvalidator(resetForm,'true');
            });



    });
});

