require(['jquery','bootstrap','datatables'],function(){
	// var data = [];
	$.ajax({
        url:"/Setting/SettingDict/1/10",
        success:function(data){
        }
    })
 	
	$("#businessTable").DataTable({
		// "data": "data",
		// "columns":[
		// 	{data: 'name'}
		// ],
		"ordering": false,
		"info": false,
		"pagingType": "full_numbers",
		"dom": '<"top"if>rt<"bottom"lp><"clear">',
		// "paging": false,
		"language":{
			"sProcessing": "处理中",
			"sZeroRecords": "没有匹配结果",
			"sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
        	"sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
        	"sInfoFiltered": "(由 _MAX_ 项结果过滤)",
       	 	"sInfoPostFix": "",
       	 	"lengthMenu": "显示 _MENU_ 条",
        	"sSearch": "搜索:",
        	"sEmptyTable": "表中数据为空",
        	"sLoadingRecords": "载入中...",
        	"sInfoThousands": ",",
			"oPaginate": {
				"sFirst": "首页",
				"sPrevious": "<<",
				"sNext": ">>",
				"sLast": "末页"
			},
			"oAria": {
            "sSortAscending": ": 以升序排列此列",
            "sSortDescending": ": 以降序排列此列"
        	}
		}
	});

    $("input[type='search']").attr("placeholder","公司/流水号");
});