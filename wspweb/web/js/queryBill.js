/**
 * Created by Administrator on 2016/4/5.
 */
require(['jquery', 'bootstrap', 'datatables','pm','select2','bootstrapvalidator'], function() {
    var date=new Date();
    var typeId=1;
    var selectYear = date.getFullYear();
    var selectMonth ="";
    //if(date.getMonth() == 0){
    //    selectMonth = 12;
    //    selectYear -= 1;
    //}else{
    //    selectMonth = date.getMonth();
    //}
  //前一个月
    var dToption = {
        "bAutoWidth": true, //自动宽度
        "dom": '<"top">rt<"bottom"lp><"clear">',
        "serverSide": true,
        "bDestory": true,
        "info": false,
        "ordering": false,
        "lengthChange": false,
        "paging":   false,
        "ajax": {
            url: '/Buiness/CLMBusiness/CheckTheBill/List',
            data:function(d){
                d.typeId= typeId;
                //d.month=$('#month').val();
                d.year= selectYear;
                d.month= selectMonth;
                //d.year=2015;
            },
            //dataSrc: "getEffectiveAccountsResult.accountWebService"
            dataSrc: function(json){
                if(json.getEffectiveAccountsResult == undefined)
                    showAlert('未查询到数据','error');
                else{
                var data = json.getEffectiveAccountsResult.accountWebService;
                if(data == undefined)
                    showAlert('未查询到数据','error');
                else
                    return data;
                }
            }

        },
        "aoColumns": [{
            "sTitle": "年份",
            "data": "year"
        }, {
            "sTitle": "月份",
            "data": "month"
        },{
            "sTitle": "合同号",
            "data": "contractNumber"
        }, {
            "sTitle": '应收金额',
            "data": 'account'
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
        ],
        //初始化结束
        "initComplete": function () {
            $('#rentTable').width("100%");
        },
        //加载结束
        "drawCallback": function () {

        }
    };
    $(function () {
        var table = $("#rentTable").DataTable(dToption);




        var currentYear=date.getFullYear();
        var currentMonth = date.getMonth();
        //初始化年月列表
        var html=[];
        for(var i=2014;i<=currentYear;i++){
            if(i == currentYear){
                html.push('<option selected>'+i+'年</option>');
            } else
                html.push('<option>'+i+'年</option>');
        }
        $('#year').append(html.join(''));
        getMonthList(currentYear);

        $('#month').on('change',function(){
            selectMonth = $(this).find('option:selected').val();
            table.ajax.reload(null, false);
        })

        $('#year').on('change',function(){
            var year = $(this).find('option:selected').val();
            var id=$('.nav li.active').attr('id');
            getMonthList(year);

            if(id == 'yue'){
                typeId = 1;
            }else{
                typeId = 2;
            }
            selectMonth = '';
            selectYear = parseInt(year);
            table.ajax.reload(null, false);

        });


        $('#wu').on('click',function(){
            typeId = 2;
            table.ajax.reload(null, false);
        })
        $('#yue').on('click',function(){
            typeId = 1;
            table.ajax.reload(null, false);
        })

        function getMonthList(year){
            var options = [];
            //var monthLength = 12;
            options.push('<option value="">全部</option>')
            //if(year == currentYear ){
            //    monthLength = currentMonth;
            //}
            for(var i=1; i<=12; i++){
                options.push('<option value="'+i+'">'+i+'月</option>')
            }
            $('#month').empty().append(options.join(''));
        }
    });
    var loginUser; // 登录用户
    $.ajax({
        type: 'GET',
        url: '/Setting/User/MyInfo',
        //dataType: 'json',
        success: function (result) {
            loginUser = result.success;
            //如果没有登录，弹出登录框
            if (loginUser == false) {
                $('#loginModal').modal('show');
            }
        }
    })
})


