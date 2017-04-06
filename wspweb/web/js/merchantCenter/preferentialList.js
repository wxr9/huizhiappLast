require(['jquery', 'bootstrap','datepicker', 'datatables','pm','cropper','select2','bootstrapvalidator'], function() {
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
            url: '/Setting/MerchantSale/List/',
            data: function(d){
                d.username = 'must'
            },
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "标题",
            "data": "title"
        }, {
            "sTitle": "发布时间",
            "data": "publishDate"
        }, {
            "sTitle": "开始日期",
            "data": "startTime"
        }, {
            "sTitle": '截止日期',
            "data": 'endTime'
        },{
            "sTitle": '审核状态',
            "data": 'bCheck'
        }, {
            "sTitle": '审核意见',
            "data": 'memo'
        },{
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
        "columnDefs": [{
            render: function(data, type, row) {
                var html = [];
                if(row.isCheck == 2){
                    html.push("已审核")
                }else if(row.isCheck == 1){
                    html.push("待审核")
                }else{
                    html.push("未通过")
                }
                return html.join('');
            },
            targets: 4
        },
        {
           targets:5,
            width:"250px"

        },
        {
            targets:0,
            width:"150px"

        },
        {
            render: function(data, type, row) {
                var html = [];
                if(row.isBan == 1){
                    html.push("<a class='operate' data-id='"+row.objectid+"'>禁用</a>")
                }else{
                    html.push("已禁用")
                }
                return html.join('');
            },
            targets: 6
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
        checkMust();
        var objectid;
        var type; //优惠类型
        $.ajax({
            type: 'GET',
            url: '/Setting/Merchant/GetMerchantCenterInfo',
            dataType: "json",
            success: function(data) {
                objectid = data[0].objectid;
                $('input[name="companyId"]').val(objectid);

            }
        });

        var table = $("#businessTable").DataTable(dToption);
        $("#businessTable").on('click','.operate',function(){
            var id = $(this).attr('data-id');
            $.ajax({
                type:'POST',
                url: '/Setting/MerchantSale/BanSet',
                data:{"isBan":2,"objectid":id},
                dataType:'json',
                success: function(data){
                    if(data.success){
                        showAlert(data.msg,'success');
                        table.ajax.reload();
                    }
                    else{
                        showAlert(data.msg,'success');
                        table.ajax.reload();
                    }

                }
            })
        });

        //优惠类型字典
        getSaleTypeDicts($('#type'));
        //初始化优惠类型值
        $('input[name="origin"]').val('0');
        $('input[name="current"]').val('0');
        $('input[name="discount"]').val('0');


        //图片上传
        $('.upload-box').bind('click',function(e){
            var target = e.target;
            var id = target.id;
            switch(id){
                case "fakeInput":
                    $('#input').trigger('click');
                    $('#uploadImg').removeClass('disabled');
                    break;
                case "uploadImg":
                    if(!$(target).hasClass('disabled')){
                        uploadImage($(target),function(){
                            $('#merchantInfo').data('bootstrapValidator').updateStatus('coverImg', 'VALID');
                            $('.image-box').hide();
                        });
                    }else{
                        $('.image-box').hide();
                    }
                    break;
            }
        });
        $('#input').bind('change',function(){
            if($(this).val() != "") {
                readImage();
                $('#realInput').val('');
                $('#merchantInfo').data('bootstrapValidator').updateStatus('coverImg', 'NOT_VALIDATED');
            }
        });
        // var imgUpload;
        // require(['jqueryUpload'], function(UploadImg) {
        //     imgUpload = UploadImg({
        //         file: 'coverImg',
        //         url: '/FileUpload/SimpleUploadFile',
        //         extData: {
        //             type: 'img'
        //         },
        //         fileName: 'file',
        //         name:'coverImg',
        //         loadingImg: '/lib/images/loading.gif',
        //         validatorImg: '/lib/images/validator.png',
        //         path: 'response path data',
        //         statusName: 'success',
        //         preview: {
        //             prevUrl: '/'
        //         },
        //         success: function (data) {
        //             showAlert('上传成功');
        //         },
        //         error: function (data) {
        //             showAlert('上传失败');
        //         }
        //     })
        // })


        //新增验证&&提交更新
        var fieldsList = {
            title: {
                validators:{
                    notEmpty: {
                        message: '优惠名称不能为空'
                    },
                    stringLength: {
                        max: 20,
                        message: '限20个字符以内'
                    }
                }
            },
            startTime: {
                validators:{
                    notEmpty: {
                        message: '开始时间不能为空'
                    }
                }
            },
            endTime:{
                validators:{
                    notEmpty: {
                        message:'结束时间不能为空'
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
            },
            coverImg: {
                validators:{
                    notEmpty: {
                        message: '请上传图片'
                    }
                }
            },
            type: {
                validators:{
                    notEmpty: {
                        message: '优惠类型不能为空'
                    }
                }
            },
            discount: {
                validators:{
                    regexp:{
                        regexp:/^[0-9](\.[0-9]{1,2})?$/,
                        message:'10以内最多精确到小数点后两位'
                    }
                }
            },
            origin: {
                validators:{
                    regexp:{
                        regexp:/^\d*(\.?\d+)?$/,
                        message: '请填写数字'
                    }
                }
            },
            current: {
                validators:{
                    regexp:{
                        regexp:/^\d*(\.?\d+)?$/,
                        message: '请填写数字'
                    },
                    callback:{
                        message:'现价不能大于原价',
                        callback: function(value,validator){
                            var old = validator.getFieldElements('origin').val();
                            var cur = validator.getFieldElements('current').val();
                            return parseInt(cur) <= parseInt(old) ;

                        }
                    }

                }
            },
            shortIntro: {
                validators:{
                    notEmpty: {
                        message: '内容摘要不能为空'
                    },
                    stringLength: {
                        max: 200,
                        message: '限200个字符以内'
                    }
                }
            }
        };

        $('#merchantInfo').attr('action','/Setting/MerchantSale/Add');
        //初始化验证
        $('#merchantInfo')
            .bootstrapValidator({
                message: 'This value is not valid',
                feedbackIcons: {
                    valid: '',
                    invalid: '',
                    validating: ''
                },
                excluded: [':disabled'],
                fields: fieldsList
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

                // Use Ajax to submit form data
                $.ajax({
                    type: "POST",
                    url: $form.attr('action'),
                    data: $form.serialize(),
                    dataType: "json",
                    async: false,
                    success: function (result) {
                        if(result.success == false){
                            showAlert(result.msg,'warn');
                        }else{
                            showAlert(result.msg);
                            table.ajax.reload();
                        }
                        //关闭模态框
                        $("#infoModal").modal("hide");


                    }
                });


            });

        $('#infoModal').on("shown.bs.modal",function() {
            $('#merchantInfo').bootstrapValidator('resetForm',true);
            // imgUpload.reset();
            getSaleTypeDicts($('#type'));
            //初始化优惠类型值
            $('input[name="origin"]').val('0');
            $('input[name="current"]').val('0');
            $('input[name="discount"]').val('0');
            $('.saleBox').hide();
            $('#image').cropper('destroy');
            initCropper($('#image'));
            $('.image-box').hide();
            //选择优惠时间
            $(".form_datetime")
                .datetimepicker({
                    format: "yyyy-mm-dd",
                    autoclose: true,
                    todayBtn: true,
                    pickerPosition: "bottom-left",
                    minView: 'month',
                    startDate: new Date()
                });
        });

        $('#type').on('change',function(){
            var selectName = $('#type').find('option:selected').attr('enName');

            if(selectName == 'discount'){
                $('.saleBox').hide();
                $('#discount').show();
            }else if(selectName == 'price'){
                $('.saleBox').hide();
                $('.discount2').show();
            }else{
                $('.saleBox').hide();
            }
        });
        $('.form_datetime')
            .on('change', function(e) {
                $('#merchantInfo')
                // Get the bootstrapValidator instance
                    .data('bootstrapValidator')
                    // Mark the field as not validated, so it'll be re-validated when the user change date
                    .updateStatus('startTime', 'NOT_VALIDATED', null)
                    .updateStatus('endTime', 'NOT_VALIDATED', null)
                    // Validate the field
                    .validateField('startTime')
                    .validateField('endTime')
            });

        //获取商户类型字典
        function getSaleTypeDicts(selector,id){
            $.ajax({
                type:"GET",
                url: "/Setting/SettingDict/0/0?type=merchantSaleType",
                dataType:'json',
                success: function(data){
                    var options = [];
                    var List = data.result;
                    options.push("<option value='' selected></option>")
                    for(var i=0,len=List.length; i<len; i++){
                        options.push("<option enName='"+List[i].english+"' value=\'"+ List[i].objectid +"\'>"+List[i].name+"</option>");
                    }
                    selector.empty().append(options.join(""));
                    if(id){
                        selector.val(id).select2();
                    }else{
                        var d = selector.children().eq(0).val();
                        selector.val("value", d);
                        selector.val(d).select2();
                    }

                }
            })
        }
    });
});


