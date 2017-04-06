/**
 * Created by z on 2016/10/17.
 */
require(['jquery', 'bootstrap', 'datepicker','datatables','select2','bootstrapvalidator','pm'], function() {
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
            url: '/RedPacket/Setting/RedPacket/List',
            data:function(d){
                var name = $('.dataTables_filter input').val();
                d.name = name;
            },
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "红包名称",
            "data": "name"
        }, {
            "sTitle": "开始时间",
            "data": "startDate"
        }, {
            "sTitle": "结束时间",
            "data": 'endDate'
        }, {
            "sTitle": "类型",
            "data": 'type'
        }, {
            "sTitle": "总金额（元）",
            "data": 'totalSum'
        }, {
            "sTitle": "已发送个数",
            "data": 'sentNum'
        }, {
            "sTitle": "已发金额",
            "data": 'sentSum'
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
        "columnDefs": [{
          render:function(data, type, row){
              if(data == 1){
                  return "充值红包";
              }else{
                  return "其他";
              }
          },
            targets:3
        },
            { render:function(data,type,row){
                var id = row.id;
                var work = row.enableRule;
                var html = [];
                html.push('<a class="operate editBtn" objectid="' + id + '">编辑</a>');
                if(work == true){
                    html.push('<a class="operate disableBtn" flag="false" objectid="' + id + '" data-toggle="modal" data-target="#disableModal">禁用</a>');
                }else{
                    html.push('<a class="operate disableBtn" flag="true" objectid="' + id + '" data-toggle="modal" data-target="#disableModal">启用</a>');
                }

                html.push('<a class="operate chartBtn" start="'+row.startDate+'" end="'+row.endDate+'" objectid="' + id + '" data-toggle="modal" data-target="#chartModal">统计</a>');
                return html.join('');
            },
                targets:7
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
        var table = $("#table").DataTable(dToption),
            operate = $('#table');

        $('.dataTables_filter input').keyup(function(e){
            table.ajax.reload(null,false);
        });
        //选择优惠时间
        $(".endTime")
            .datetimepicker({
                format: "yyyy-mm-dd 23:59:59",
                autoclose: true,
                todayBtn: true,
                pickerPosition: "bottom-left",
                minView: 'month',
                startDate: new Date()
            });
        $(".startTime")
            .datetimepicker({
                format: "yyyy-mm-dd 00:00:00",
                autoclose: true,
                todayBtn: true,
                pickerPosition: "bottom-left",
                minView: 'month',
                startDate: new Date()
            });
        // 验证字段
        var fieldsList = {
            name: {
                validators:{
                    notEmpty: {
                        message: '红包名称不能为空'
                    },
                    stringLength: {
                        min: 1,
                        max: 50,
                        message: '限50个字符以内'
                    }
                }
            },
            totalSum:{
                validators:{
                    notEmpty: {
                        message: '红包金额不能为空'
                    },
                    regexp:{
                        regexp:/^\d+$/,
                        message:'请填写数字'
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
            validDate: {
                validators:{
                    notEmpty:{
                        message:'有效期截止时间不能为空\n'
                    },
                    callback:{
                        message:'需大于结束时间',
                        callback:function(fieldValue, validator){
                            var time = validator.getFieldElements('endDate').val();
                            var start = new Date(time);
                            var end = new Date(fieldValue);
                            return end >= start;
                        }
                    }
                }
            },
            hitPersent: {
                validators:{
                    notEmpty: {
                        message: '中奖概率不能为空'
                    },
                    regexp:{
                        message:'请填写小于100的整数',
                        regexp:/^\d{1,2}$/
                    }
                }
            },
            dotEnable: {
                validators:{
                    notEmpty: {
                        message: '金额小数点不能为空'
                    }
                }
            },
            minSum: {
                validators:{
                    notEmpty: {
                        message: '最小金额不能为空'
                    },
                    regexp:{
                        message:'请填写整数',
                        regexp:/^\d+$/
                    },
                    lessThan:{
                        value: 50,
                        message:'不能大于50',
                        inclusive:true
                    }
                }
            },
            maxSum: {
                validators:{
                    notEmpty: {
                        message: '最大金额不能为空'
                    },
                    regexp:{
                        message:'请填写整数',
                        regexp:/^\d+$/
                    },
                    lessThan:{
                        value: 50,
                        message:'不能大于50',
                        inclusive:true
                    },
                    callback:{
                        message:'需大于最小金额',
                        callback:function(value, validator){
                            value = parseInt(value,10);
                            var minValue = validator.getFieldElements('minSum').val();
                            return value > parseInt(minValue);
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
                    .updateStatus('startDate', 'NOT_VALIDATED', null)
                    .updateStatus('endDate', 'NOT_VALIDATED', null)
                    .updateStatus('validDate','NOT_VALIDATED', null)
                    // Validate the field
                    .validateField('startDate')
                    .validateField('endDate')
                    .validateField('validDate')
            });
        $('#editForm .form_datetime')
            .on('change', function(e) {
                $('#editForm')
                // Get the bootstrapValidator instance
                    .data('bootstrapValidator')
                    // Mark the field as not validated, so it'll be re-validated when the user change date
                    .updateStatus('startDate', 'NOT_VALIDATED', null)
                    .updateStatus('endDate', 'NOT_VALIDATED', null)
                    .updateStatus('validDate','NOT_VALIDATED', null)
                    // Validate the field
                    .validateField('startDate')
                    .validateField('endDate')
                    .validateField('validDate')
            });

        $('#editForm').attr('action','/RedPacket/Setting/RedPacket/Update/');
        $('#addForm').attr('action','/RedPacket/Setting/RedPacket/Add');

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
                    format: "yyyy-mm-dd 23:59:59",
                    autoclose: true,
                    todayBtn: true,
                    pickerPosition: "bottom-left",
                    minView: 'month',
                    startDate: new Date()
                });
            $(".startTime")
                .datetimepicker({
                    format: "yyyy-mm-dd 00:00:00",
                    autoclose: true,
                    todayBtn: true,
                    pickerPosition: "bottom-left",
                    minView: 'month',
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
                url:'/RedPacket/Setting/RedPacket/Edit/'+id,
                dataType:'json',
                success:function(result){
                    var form = document.forms['editForm'];
                    for(var prop in result){
                       if(form[prop] != undefined){
                           if(prop == 'hitPersent'){
                               form[prop].value = +result[prop]*100;
                           }else{
                               form[prop].value = result[prop];
                           }
                       }
                    }
                    $('#sentSum').text(result.sentSum);
                }
            })
        });

        //禁用解禁
        var form = document.forms['ableForm'];
        var tips = $('#tips');
        operate.on('click','.disableBtn',function(){
            var id = $(this).attr('objectid');
            var flag = $(this).attr('flag');
            if(flag == 'true'){
                tips.text("您确定解禁此红包？")
            }else{
                tips.text("您确定禁用此红包？")
            }
            form.objectId.value = id;
            form.isBan.value = flag;
        });

        $('#btn').on('click',function(){
            $.ajax({
                method:"POST",
                url:"/RedPacket/Setting/RedPacket/BanSet",
                data:$('#ableForm').serialize(),
                dataType:'json',
                success:function(result){
                    showAlert(result.msg);
                    $('#disableModal').modal('hide');
                    table.ajax.reload(null,false);
                }
            });
        });
        function showChart(data){
            var chartOption = {
                tooltip : {
                    trigger: 'axis'
                },
                calculable : true,
                legend: {
                    data:['发放个数','发放金额']
                },
                xAxis : [
                    {
                        type : 'category',
                        data : data.day
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        name : '个数',
                        axisLabel : {
                            formatter: '{value} 个'
                        }
                    },
                    {
                        type : 'value',
                        name : '金额',
                        axisLabel : {
                            formatter: '{value} 元'
                        }
                    }
                ],
                series : [
                    {
                        name:'发放个数',
                        type:'bar',
                        data:data.count
                    },
                    {
                        name:'发放金额',
                        type:'line',
                        yAxisIndex: 1,
                        data:data.sum
                    }
                ]
            };
            //初始化图表
            require([
                'echarts',
                'echarts/chart/bar',
                'echarts/chart/line'
            ], function (ec) {
                var chart = ec.init(document.getElementById('chart'));
                chart.setOption(chartOption);

            })
        }

        var chartForm = document.forms['chartForm'];
        var initDate ={};
        operate.on('click','.chartBtn',function(){
            var that =$(this);
            var id = that.attr("objectid");
            var start = that.attr("start");
            var end = that.attr('end');
            chartForm.beginDate.value = start;
            chartForm.endDate.value = end;
            chartForm.ruleId.value = id;
            //保存初始时间段
            initDate.start = start;
            initDate.end = end;
            initDate.id = id;

            getChart();

            $(".chartStart")
                .datetimepicker({
                    format: "yyyy-mm-dd 00:00:00",
                    autoclose: true,
                    todayBtn: true,
                    pickerPosition: "bottom-left",
                    minView: 'month',
                    startDate: start,
                    endDate: end
                });
            $(".chartEnd")
                .datetimepicker({
                    format: "yyyy-mm-dd 23:59:59",
                    autoclose: true,
                    todayBtn: true,
                    pickerPosition: "bottom-left",
                    minView: 'month',
                    startDate: start,
                    endDate: end
                });
        })
        $('.form_datetime>input').on('change',function(){
           $('#chartBtn').removeAttr('disabled');
        });

        $('#chartBtn').on('click',function(){
            getChart();
        });
        $('#resetChart').on('click',function(){
            chartForm.beginDate.value = initDate.start;
            chartForm.endDate.value = initDate.end;
            chartForm.ruleId.value = initDate.id;
            getChart();
        });
        function getChart(){
            $.ajax({
                method:'POST',
                url:'/RedPacket/User/StatisticGraphData',
                data:$('#chartForm').serialize(),
                dataType:'json',
                success:function(result){
                    $('#totalNum').text(result.TotalNumber + "个");
                    $('#totalMoney').text(result.TotalSum + "元");
                    $('#highNum').text(result.TopCountDay.Date +"、"+result.TopCountDay.Count+ "个");
                    $('#highMoney').text(result.TopSumDay.Date +"、"+result.TopSumDay.Sum+ "元");
                    showChart(result.data);
                }
            });
        }



    });
});