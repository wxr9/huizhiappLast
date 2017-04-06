require(['jquery', 'bootstrap', 'datatables'], function() {
  var dToption = {
    "bAutoWidth": true, //自动宽度
    "dom": '<"top"if>rt<"bottom"lp><"clear">',
    "serverSide": true,
    "bDestory": true,
    "info": false,
    "ordering": false,
    "lengthChange": false,
    "sPaginationType": "full_numbers",
    "ajax": {
      url: '/Setting/User/CommonUser',
      dataSrc: "result"
    },
    "aoColumns": [{
      "sTitle": "用户名",
      "data": "username"
    }, {
      "sTitle": "姓名",
      "data": "realName"
    }, {
      "sTitle": '性别',
      "data": 'sex'
    }, {
      "sTitle": '手机号',
      "data": 'phone'
    }, {
      "sTitle": "汇智卡号",
      "data": "cardid"
    }, {
      "sTitle": "注册时间",
      "data": "createDate"
    }, {
      "sTitle": "最近登录时间",
      "data": "updateDate"
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
        "sFirst": "首页",
        "sPrevious": "<<",
        "sNext": ">>",
        "sLast": "末页"
      }
    },
    "columnDefs": [{
		render : function(data, type, row){
         if(row.sex === 1){
            return "男";
          } else if(row.sex === 2){
            return "女";
          }
        },
        targets : 2
      },
	{
      render: function(data, type, row) {
        var username = row.username;
        var html = [];
        html.push('<a class="operate infoBtn" data-toggle="modal" data-target="#infoModal" data-id=' + username + '>查看</a>');
        if (row.deleteFlag === -1) {
          html.push('<a class="operate enableBtn" data-id=' + username + '>解禁</a>');
        } else { //defalut 0
          html.push('<a class="operate disableBtn" data-id=' + username + '>禁用</a>');
        }
        return html.join('');
      },
      targets: 7
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
    var table = $("#memberTable").DataTable(dToption);
    var usertable = $('#memberTable');
    //禁用
      usertable.on('click','.disableBtn',function(){
          var username = $(this).attr('data-id');
          var flag = 0;
          $.ajax({
              type: "POST",
              url: "/Setting/User/EnableUser/" + username + "/" + flag,
              dataType: "json",
              success: function(data) {
                  showAlert(data.msg);
                  table.ajax.reload(null,false);
              }
          });

      });

      //解禁
      usertable.on('click','.enableBtn',function(){
          var username = $(this).attr('data-id');
          var flag = 1;
          $.ajax({
              type: "POST",
              url: "/Setting/User/EnableUser/" + username + "/" + flag,
              dataType: "json",
              success: function(data) {
                  showAlert(data.msg);
                  table.ajax.reload(null,false);
              }
          });
      });

    //详情
    $("#memberTable").on('click', '.infoBtn', function() {
      var username = $(this).attr("data-id");
      $.ajax({
        type: "GET",
        url: "/Setting/User/Edit/" + username,
        dataType: "json",
        success: function(data) {

          if(data.workYears == null){
            data.workYears = 0;
          }

          data.birthday = data.birthday ? data.birthday : "";
          if(data.enterprise){
            data.enterprise = data.enterprise.name;
          }else
            data.enterprise = "";

          if(data.settingNation){
            data.nation = data.settingNation.name
          }else{
            data.nation = "";
          }

          //户籍所在地
          if(data.hometownCity){
            var city = data.settingHometowntCity;
            var cityname = [];
            //第一个地名
            cityname.push(city.name);
            if(typeof(city.settingCity) == null){
                cityname.join("");
                data.hometownCity = cityname
            } else{
              //第二个地名
              if(city.settingCity.name){
                cityname.push(city.settingCity.name);
                data.hometownCity = cityname.reverse().join("");
              }else{
                cityname.join("");
              }
            }
          }else{
            data.hometownCity = "";
          }
          //居住地
          if(data.apartmentCity){
            var city = data.settingApartmentCity;
            var cityname = [];
            //第一个地名
            cityname.push(city.name);
            if(typeof(city.settingCity) == "null"){
                cityname.join("");
                data.apartmentCity = cityname
            } else{
              //第二个地名
                if(city.settingCity.name){
                  cityname.push(city.settingCity.name);
                  data.apartmentCity = cityname.reverse().join("");
                }else{
                  cityname.join("");
                }
            }
          }else{
            data.apartmentCity = "";
          }


          if(data.marital == 1){
            data.marital = "已婚";
          } else if(data.marital == 2){
            data.marital = "未婚";
          }
          if(data.settingDict){
            data.settingDict = data.settingDict.name;
          }else{
            data.settingDict = "";
          }
          data.signature = data.signature ? data.signature : "";


          var html = [];
          html.push("<tr><td>用户名:</td><td>"+data.username+"</td></tr>");
          html.push("<tr><td>昵称:</td><td>"+data.name+"</td></tr>");
          html.push("<tr><td>真实姓名:</td><td>"+data.realName+"</td></tr>");
          html.push("<tr><td>出生日期:</td><td>"+data.birthday+"</td></tr>");
          html.push("<tr><td>工作年限:</td><td>"+data.workYears+"</td></tr>");
            if(data.enterpriseInput !==null){
                html.push("<tr><td>企业名称:</td><td>"+data.enterpriseInput+"</td></tr>");
            }else{
                html.push("<tr><td>企业名称:</td><td></td></tr>");
            }

          html.push("<tr><td>国籍:</td><td>"+data.nation+"</td></tr>");
          html.push("<tr><td>户籍地:</td><td>"+data.hometownCity+"</td></tr>");
          html.push("<tr><td>居住地:</td><td>"+data.apartmentCity+"</td></tr>");
          html.push("<tr><td>婚姻状况:</td><td>"+data.marital +"</td></tr>");
          html.push("<tr><td>学历:</td><td>"+data.settingDict+"</td></tr>");
          html.push("<tr><td>个人签名:</td><td>"+data.signature+"</td></tr>");

          $("#userInfo").empty().append(html.join(""));
        }
      });
    });

  });
});
