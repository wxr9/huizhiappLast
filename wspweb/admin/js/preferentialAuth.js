require(['jquery','bootstrap','datepicker', 'datatables','select2','pm','bootstrapvalidator'],function(){
    var dToption = {
        "bAutoWidth": true, //自动宽度
        "dom": '<"top"if>rt<"bottom"lp><"clear">',
        "serverSide": true,
        "bDestory": true,
        "info": false,
        "ordering": false,
        "lengthChange": false,
        "searching":false,
        "sPaginationType": "full_numbers",
        "ajax": {
            url: '/Setting/MerchantSale/List',
            data: function(d){
                d.isCheck = 1;
            },
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "标题",
            "data": "title"
        }, {
            "sTitle": '开始日期',
            "data": 'startTime'
        }, {
            "sTitle": '截止日期',
            "data": 'endTime'
        },{
            "sTitle": '操作',
            "data": 'isCheck'
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
            {
                targets:0,
                width:"400px"
            },
            {
                render: function(data, type, row) {
                    var html = [];
                    html.push('<a class="operate editBtn" data-id=' + row.objectid + '>审核</a>');
                    return html.join('');
                },
                targets: 3
            }
        ],
        //初始化结束
        "initComplete": function() {
        },
        //加载结束
        "drawCallback": function() {

        }
    };

    $(function(){
        var table = $('#merchantTable').DataTable(dToption);

        //审查详情
        $('#merchantTable').on('click','.editBtn',function(){
            var objectid = $(this).attr('data-id');
            $('#editModal').modal('toggle');
            $.ajax({
                type: "GET",
                url: "/Setting/MerchantSale/Edit/" + objectid,
                dataType: "json",
                success: function(data) {
                    if (data != undefined) {

                        $('input[name="objectid"]').val(data.objectid);
                        $('input[name="title"]').val(data.title);
                        $('input[name="publishDate"]').val(data.publishDate);
                        $('input[name="startTime"]').val(data.startTime);
                        $('input[name="endTime"]').val(data.endTime);
                        $('#image').attr('src','/'+data.coverImg);
                        $('#merchantDetail textarea[name="shortIntro"]').val(data.shortIntro);
                        var options = {
                            selector:$('#type'),
                            type:'merchantSaleType',
                            id:data.type,
                            cb:function(){
                                $('#type').select2('readonly',true);
                            }
                        };
                        getDict(options);
                        if(data.sDict.english == 'discount'){
                            $('.saleBox').hide();
                            $('#discount').show();
                            $('input[name="discount"]').val(data.discount);
                        }else if(data.sDict.english == 'price'){
                            $('.saleBox').hide();
                            $('.discount2').show();
                            $('input[name="origin"]').val(data.origin);
                            $('input[name="current"]').val(data.current);
                        }else{
                            $('.saleBox').hide();
                        }
                    }
                }
            });

        });

        $('#submit1').on('click',function() {
            $.ajax({
                type: "POST",
                url: "/Setting/MerchantSale/Audit",
                data: $('#merchantInfo').serialize(),
                success: function(msg){
                    if(msg.success){
                        $('#editModal').modal('hide');
                        showAlert(msg.msg,'success');
                        table.ajax.reload();
                    }else{
                        showAlert(msg.msg,'danger');
                    }
                }
            });
        });

        $('#submit2').on('click',function() {
            var memo = $('#memo').val();
            if(memo == "" || memo == null){
                $('.help-block').addClass('empty');
                return false;
            }
            $('.help-block').removeClass('empty');
            $.ajax({
                type: "POST",
                url: "/Setting/MerchantSale/Audit",
                data: $('#merchantInfo2').serialize(),
                success: function(msg){
                    if(msg.success){
                        $('#editModal').modal('hide');
                        showAlert(msg.msg,'success');
                        table.ajax.reload();
                    }else{
                        showAlert(msg.msg,'danger');
                    }
                }
            });
        });
        $('#editModal').on('hidden.bs.modal',function(e){
            $('#merchantDetail').slideDown();
            $('#merchantInfo').slideDown();
            $('#merchantInfo2').slideUp();
            $('#memo').val('');
        });
        $('#nextStep').on('click',function() {
            $('#merchantDetail').slideUp();
            $('#merchantInfo').slideUp();
            $('#merchantInfo2').slideDown();
        });
        $('#preStep').on('click',function() {
            $('#merchantDetail').slideDown();
            $('#merchantInfo').slideDown();
            $('#merchantInfo2').slideUp();
        });

    })

});
