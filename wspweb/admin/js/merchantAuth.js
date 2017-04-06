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
            url: '/Setting/Merchant/Auth/List',
            data: function(d){
                d.isCheck = 1;
            },
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "商户名称",
            "data": "name"
        }, {
            "sTitle": "商户分类",
            "data": "type"
        }, {
            "sTitle": '商户地址',
            "data": 'address'
        }, {
            "sTitle": '商户电话',
            "data": 'phone'
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
                render: function(data,type,row){
                    var type = row.sType.name;
                    return type;
                },
                targets: 1
            },
            {
            render: function(data,type,row){
                var name = "";
                var cont = [];
                if(data.length>10){
                    name = data.substring(0,10) + "...";
                    cont.push('<span title='+data+'>'+name+'</span>')
                }else{
                    name = data;
                    cont.push(name);
                }
                return cont.join('');
            },
            targets: 2,
                width:'250px'
            },
            {
                render: function(data, type, row) {
                    var html = [];
                    html.push('<a class="operate editBtn" data-id=' + row.objectid + '>审核</a>');
                    return html.join('');
                },
                targets: 4
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

    $(function(){
        var table = $('#merchantTable').DataTable(dToption);

        //审查详情
        $('#merchantTable').on('click','.editBtn',function(){
            var objectid = $(this).attr('data-id');
            $('#editModal').modal('toggle');
            $.ajax({
                type: "GET",
                url: "/Setting/MerchantHistory/Edit/" + objectid,
                dataType: "json",
                success: function(data) {
                    if (data != undefined) {
                        $('input[name="objectid"]').val(data.objectid);
                        $('input[name="name"]').val(data.name);
                        $('input[name="workStartTime"]').val(data.workStartTime);
                        $('input[name="workEndTime"]').val(data.workEndTime);
                        $('#image').attr('src','/'+data.avar);
                        $('input[name="type"]').val(data.sType.name);
                        $('input[name="park"]').val(data.parkName.name);
                        $('input[name="parkType"]').val(data.sParkType.name);
                        if(data.isInvite == 1){
                            $('input[name="isInvite"]').eq(0).attr('checked',true);
                        }else{
                            $('input[name="isInvite"]').eq(1).attr('checked',true);
                        }
                        $('input[name="address"]').val(data.address);
                        $('input[name="phone"]').val(data.phone);
                        $('#merchantDetail textarea[name="shortIntro"]').val(data.shortIntro);
                    }
                }
            });

        });

        $('#submit1').on('click',function() {
            $.ajax({
                type: "POST",
                url: "/Setting/Merchant/Audit",
                data: $('#merchantInfo').serialize(),
                success: function(msg){
                    if(msg.success){
                        $('#editModal').modal('hide');
                        showAlert(msg.msg,'success');
                        table.ajax.reload();
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
                url: "/Setting/Merchant/Audit",
                data: $('#merchantInfo2').serialize(),
                success: function(msg){
                    if(msg.success){
                        $('#editModal').modal('hide');
                        showAlert(msg.msg,'success');
                        table.ajax.reload();
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
