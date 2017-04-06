/**
 * Created by iris on 16/3/10.
 */
require(['jquery', 'bootstrap','datepicker', 'datatables','pm','select2','cropper','bootstrapvalidator'], function() {
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
            url: '/Setting/Merchant/List/',
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
            "sTitle": '点击量',
            "data": 'hitCount'
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
                "sFirst": "首页",
                "sPrevious": "<<",
                "sNext": ">>",
                "sLast": "末页"
            }
        },
        "columnDefs": [{
                render: function(data, type, row) {
                    var type = row.sDict.name;
                    return type;
                },
                targets:1
            },
            {
                render: function(data, type, row) {
                    var username = row.username;
                    var objectid = row.objectid;
                    var html = [];
                    html.push('<a class="operate infoBtn" data-toggle="modal" data-target="#infoModal" data-id=' + objectid + '>查看详情</a>');
                    html.push('<a class="operate resetBtn" data-id=' + username + '>重置密码</a>');

                    if (row.status == -1) {
                        html.push('<a class="operate statusBtn" data-id=' + objectid + ' flag='+row.status+'>启用</a>');
                    } else { //defalut 1
                        html.push('<a class="operate statusBtn" data-id=' + objectid + ' flag="'+row.status+'">禁用</a>');
                    }
                    return html.join('');
                },
                targets: 5,
                width:'160px'
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

        var table = $("#businessTable").DataTable(dToption);
        var usertable = $("#businessTable");

        //禁用-1-启用1
        usertable.on('click','.statusBtn',function(){
            var id = $(this).attr('data-id');
            var flag = $(this).attr('flag');
            if(flag == -1){
                $.ajax({
                    type: "POST",
                    url: "/Setting/Merchant/Status/",
                    data:{ objectid:id, status:1},
                    dataType: "json",
                    success: function(data) {
                        showAlert(data.msg,'success');
                        table.ajax.reload( null, false );
                    }
                });
            }else{
                $.ajax({
                    type: "POST",
                    url: "/Setting/Merchant/Status/",
                    data:{ objectid:id, status:-1},
                    dataType: "json",
                    success: function(data) {
                        showAlert(data.msg,'success');
                        table.ajax.reload( null, false );
                    }
                });
            }

        });



        //重置密码
        usertable.on('click', '.resetBtn', function() {
            var username = $(this).attr("data-id");
            $.ajax({
                type: "POST",
                url: "/Setting/User/ResetPassword/" + username,
                dataType: "json",
                success: function(data) {
                    if(data.success){
                        showAlert("密码已重置",'success')
                    }else{
                        showAlert(data.msg,'danger')
                    }
                    table.ajax.reload();
                }
            });
        });

        //详情
        usertable.on('click', '.infoBtn', function() {
            var username = $(this).attr("data-id");
            $.ajax({
                type: "GET",
                url: "/Setting/Merchant/Edit/" + username,
                dataType: "json",
                success: function(data) {
                    var html = [];
                    userName = data.username;
                    html.push("<tr><td>用户名:</td><td>"+data.username+"</td></tr>");
                    html.push("<tr><td>商户名称:</td><td>"+data.name+"</td></tr>");
                    html.push("<tr><td>营业时间:</td><td>"+data.workStartTime+"-"+data.workEndTime+"</td></tr>");
                    html.push("<tr><td>商户分类:</td><td>"+data.sDict.name+"</td></tr>");
                    html.push("<tr><td>商户照片:</td><td><img width='200' src='/"+data.avar+"'></td></tr>");
                    html.push("<tr><td>商户地址:</td><td>"+data.address+"</td></tr>");
                    html.push("<tr><td>所属园区:</td><td>"+data.parkName.name+"</td></tr>");
                    html.push("<tr><td>商户类型标签:</td><td>"+data.sDict.name+"</td></tr>");
                    html.push("<tr><td>是否特约商户:</td><td>"+(data.isInvite ? '是' : '否')+"</td></tr>");
                    html.push("<tr><td>商户电话:</td><td>"+data.phone+"</td></tr>");
                    html.push("<tr><td>内容摘要:</td><td>"+(data.shortIntro || "暂无")+"</td></tr>");

                    $("#businessInfo").empty().append(html.join(''));
                }
            });
        });

        //新增商户
        //商户类型/园区/类型标签字典

        merType({ele:$('#type'),param:'-1',id:''});
        $('#childBox').hide();
        getPark($('#park'));
        getDict({selector:$('#label'),type:'merchantClass'});

        //如果商户类型有子类型,显示选择子类型
       $('#type').on('change',function(){
           if($(this).val()){
               merType({ele:$('#typeChild'),param:$(this).val(),id:''});
           }
       });

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
                            $('#addForm').data('bootstrapValidator').updateStatus('avar', 'VALID');
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
                $('#addForm').data('bootstrapValidator').updateStatus('avar', 'NOT_VALIDATED');
            }
        });
      

        //新增验证&&提交更新
        var fieldsList = {
            username: {
                validators:{
                    notEmpty: {
                        message:"用户名不能为空"
                    },
                    regexp:{
                        regexp: /^[a-z]\w+$/i,
                        message:'用户名需由字母开头,数字字母下划线组成'
                    },
                    stringLength: {
                        min: 1,
                        max: 50,
                        message: '限50字以内'
                    }
                }
            },
            name: {
                validators:{
                    notEmpty: {
                        message: '商户名称不能为空'
                    },
                    stringLength: {
                        max: 50,
                        message: '限50个字符以内'
                    }
                }
            },
            workStartTime: {
                validators: {
                    notEmpty: {
                        message: '开始时间不能为空'
                    }
                }
            },
            workEndTime: {
                validators: {
                    notEmpty: {
                        message: '结束时间不能为空'
                    }
                }
            },
            type: {
                validators:{
                    notEmpty: {
                        message: '商户类型不能为空'
                    }
                }
            },
            childType: {
                validators:{
                    notEmpty: {
                        message: '商户子类型不能为空'
                    }
                }
            },
            park: {
                validators:{
                    notEmpty: {
                        message: '所属园区不能为空'
                    }
                }
            },
            parkType: {
                validators:{
                    notEmpty: {
                        message: '商户类型标签不能为空'
                    }
                }
            },
            avar: {
                validators:{
                    notEmpty: {
                        message: '请上传图片'
                    }
                }
            },
            address: {
                validators:{
                    notEmpty: {
                        message: '地址不能为空'
                    },
                    stringLength: {
                        max: 100,
                        message: '限100个字符以内'
                    }
                }
            },
            phone: {
                validators:{
                    notEmpty: {
                        message: '商户电话不能为空'
                    },
                    regexp:{
                        message:'请输入格式为0xx(x)-xxxxxxx(x)的电话号码或11位的手机号码',
                        regexp:/^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/
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
        }

        $('#addForm').attr('action','/Setting/Merchant/Add');
        //初始化验证
        $('#addForm').bootstrapValidator({
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

                checkJsInject();
                // 转义特殊字符，防止js注入


                var $form = $(e.target),
                    validator = $form.data('bootstrapValidator'),
                    submitButton = validator.getSubmitButton();
                // Use Ajax to submit form data
                var data = $form.serialize();
                $.ajax({
                    type: "POST",
                    url: $form.attr('action'),
                    data: data,
                    dataType: "json",
                    async: false,
                    success: function (result) {
                        if(result.success == false){
                            showAlert(result.msg,'warn')
                            if(result.msg.indexOf('手机号已被注册') == -1){
                                validator.resetForm();
                            }
                        }else{
                            showAlert(result.msg);
                            //关闭模态框
                            $("#editModal").modal("hide");
                            $("#addModal").modal("hide");
                            //重置表格
                            validator.resetForm();
                        }
                        table.ajax.reload(null,false);


                    }
                });
            })
            .on('click', 'button[data-dismiss]', function () {
                $('form').data('bootstrapValidator').resetForm();
            });
        //时间更改验证
        $('.form_datetime')
            .on('change', function(e) {
                $('#addForm')
                // Get the bootstrapValidator instance
                    .data('bootstrapValidator')
                    // Mark the field as not validated, so it'll be re-validated when the user change date
                    .updateStatus('workStartTime', 'NOT_VALIDATED', null)
                    .updateStatus('workEndTime', 'NOT_VALIDATED', null)
                    // Validate the field
                    .validateField('workStartTime')
                    .validateField('workEndTime');
            });
        //验证初始化
        $('#addModal').on("shown.bs.modal",function(){
            $('#addForm').bootstrapValidator('resetForm',true);
            merType({ele:$('#type'),param:'-1',id:''});
            getPark($('#park'));
            getDict({selector:$('#label'),type:'merchantClass'});
            table.ajax.reload();
            $('#image').cropper('destroy');
            initCropper($('#image'));
            $('.image-box').hide();
            //营业时间初始化，避免插件冲突
            $(".form_datetime")
                .datetimepicker({
                    format: "hh:ii",
                    pickerPosition: "bottom-left",
                    minView: 0,
                    autoclose:true,
                    startView: 1,
                    todayBtn:false
                });
            $('.table-condensed').children('thead').css({'visibility': 'hidden','height':0,'overflow':'hidden'})
                .find('th').css({'visibility':'hidden'}).find('span').css({'visibility':'hidden'});
        });


        function getPark(selector,id){
            $.ajax({
                type:"GET",
                url: "/Setting/Park/0/0",
                dataType:'json',
                success: function(data){
                    var options = [];
                    var List = data.result;
                    options.push("<option value='' selected></option>");
                    for(var i=0,len=List.length; i<len; i++){
                        options.push("<option value=\'"+ List[i].objectid +"\'>"+List[i].name+"</option>");
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

        function merType(option){
            var param = option.param;
            var selector = option.ele;
            var id = option.id;
            $.ajax({
                type:"GET",
                url: "/Setting/Merchant/GetMenuList/" + param,
                dataType:'json',
                success: function(data){
                    if(param != -1 && data!=''){
                        $('#childBox').css('display','block');
                        $('#addForm').data('bootstrapValidator').updateStatus('childType','NOT_VALIDATED');
                    }else{
                        $('#childBox').css('display','none');
                        $('#addForm').data('bootstrapValidator').updateStatus('childType','VALID');
                    }
                    if(data !=''){
                        var options = [];
                        var List = data;
                        options.push("<option value='' selected></option>");
                        for(var i=0,len=List.length; i<len; i++){
                            options.push("<option value=\'"+ List[i].objectid +"\'>"+List[i].name+"</option>");
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
                }
            })
        }



    });
});
