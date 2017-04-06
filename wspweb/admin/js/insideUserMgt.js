require(['jquery', 'bootstrap', 'datatables','pm','select2','bootstrapvalidator'], function() {
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
      url: '/Setting/User/InsideUser',
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
      "sTitle": "单位",
      "data": "enterprise"
    }, {
      "sTitle": "部门",
      "data": "settingDepartmentDict"
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
          } else {
            return "";
         }
        },
        targets : 2
      },{
        render : function(data, type, row){
            if(row.enterprise){
                return row.enterprise.abbreviation;
            } else {
                return "";
            }
        },
        targets : 4
    },{
        render : function(data, type, row){
            if(row.settingDepartmentDict){
                return row.settingDepartmentDict.name;
            } else {
                return "";
            }
        },
        targets : 5
    },
      {
      render: function(data, type, row) {
        var username = row.username;
        var html = [];
        html.push('<a class="operate editBtn" data-id=' + username + '>编辑</a>');
        if (row.deleteFlag == -1) {
          html.push('<a class="operate enableBtn" data-id=' + username + '>解禁</a>');
        } else { //defalut 0
          html.push('<a class="operate disableBtn" data-id=' + username + '>禁用</a>');
        }
        html.push('<a class="operate resetBtn" data-id=' + username + '>密码重置</a>');
        html.push('<a class="operate infoBtn" data-toggle="modal" data-target="#infoModal" data-id=' + username + '>详情</a>');
        return html.join('');
      },
      targets: 6
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

    var table = $("#insideUserTable").DataTable(dToption);
    var usertable = $("#insideUserTable");

    //禁用
    usertable.on('click','.disableBtn',function(){
      var username = $(this).attr('data-id');
      var flag = 0;
      $.ajax({
        type: "POST",
        url: "/Setting/User/EnableUser/" + username + "/" + flag,
        dataType: "json",
        success: function(data) {
          table.ajax.reload(null,false);
          showAlert(data.msg);
        }
      })
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
          table.ajax.reload(null,false);
          showAlert(data.msg);
        }
      });
    });


    //重置密码
    usertable.on('click', '.resetBtn', function() {
      var username = $(this).attr("data-id");
      $.ajax({
        type: "POST",
        url: "/Setting/User/ResetPassword/" + username,
        dataType: "json",
        success: function(data) {
          table.ajax.reload(null,false);
          showAlert(data.msg);
        }
      });
    });

    //详情
    usertable.on('click', '.infoBtn', function() {
      var username = $(this).attr("data-id");
      $.ajax({
        type: "GET",
        url: "/Setting/User/Edit/" + username,
        dataType: "json",
        success: function(data) {
          var html = [];
         if(data.sex === 1){
             data.sex ="男";
          } else if(data.sex === 2){
             data.sex ="女";
          }
            data.enterprise = data.enterprise ? data.enterprise.name : "";
            data.settingDepartmentDict = data.settingDepartmentDict ? data.settingDepartmentDict.name : "";
          html.push("<tr><td>用户名:</td><td>"+data.username+"</td></tr>");
          html.push("<tr><td>姓名:</td><td>"+data.realName+"</td></tr>");
          html.push("<tr><td>性别:</td><td>"+data.sex+"</td></tr>");
          html.push("<tr><td>手机:</td><td>"+data.phone+"</td></tr>");
          html.push("<tr><td>单位:</td><td>"+data.enterprise+"</td></tr>");
          html.push("<tr><td>部门:</td><td>"+data.settingDepartmentDict+"</td></tr>");

          $("#insideUserInfo").empty().append(html.join(''));
        }
      });
    });
    
    //编辑
    usertable.on('click', '.editBtn', function() {
      $("#editModal").modal('toggle');
      var username = $(this).attr("data-id");
      $.ajax({
        type:'GET',
        url: '/Setting/User/Edit/' + username,
        dataType:'json',
        success: function(data){
          //读取表单数据
          $("input[name='username']").attr('readonly','true');
          $("input[name='username']").val(data.username);
          $("input[name='realName']").val(data.realName);
          $("input[name='name']").val(data.name);
          $("input[name='userFlag']").val(data.userFlag);
          var sex = $("input[name='sex']")
          for(var i=0,len=sex.length; i<len; i++){
            if(sex.eq(i).val() == data.sex){
              sex.eq(i).attr("checked","checked");
            }
          }
          $("input[name='phone']").val(data.phone);

          //获取单位\部门\角色id
          var companyid = data.enterpriseId;
          var departmentid = data.settingDepartmentDict.objectid;
          var rolesid = [];
          var List = data.roleList;
          for(var i=0,len=List.length; i<len; i++){
              rolesid.push(List[i].rolename);
          }

          //编辑时，读取所有单位、部门、角色
          getCompanys($("#company"),companyid);
          getDepartments($("#department"),departmentid);
          getRoles($("#role"),rolesid);
        }
      })

    });

    //新增时，读取所有单位、部门、角色
    getCompanys($("#company2"));
    getDepartments($("#department2"));
    getRoles($("#role2"));



    // 验证字段
    var fieldsList = {
      username: {
        validators:{
          notEmpty: {
            message:'用户名不能为空'
          },
          regexp: {
            regexp: /^[a-zA-Z][a-zA-Z0-9]{1,19}$/i,
            message: '限20个字符以内的英文字母或数字，以英文字母开头'
          }
        }
      },
      realName: {
        validators:{
          notEmpty: {
            message: '姓名不能为空'
          },
          stringLength: {
            min: 1,
            max: 20,
            message: '限20字符以内'
          }
        }
      },
      phone: {
        validators:{
          notEmpty: {
            message: '号码不能为空'
          },
          regexp: {
            regexp: /^[0-9]{11}$/i,
            message: '请输入11位手机号码'
          }
        }
      },
      enterpriseId: {
        validators:{
          notEmpty: {
            message: '单位不能为空'
          },
          callback: {
            message: '单位不能为空'

          }
        }
      },
      department: {
        validators:{
          notEmpty: {
            message: '部门不能为空'
          }
        }
      },
      select2 : {
        validators:{
          notEmpty: {
            message: '不能为空'
          }
        }
      },
      roleArray:{
        validators:{
          notEmpty: {
            message: '默认角色不能为空'
          }
        }
      }
    }

    $('#editForm').attr('action','/Setting/User/Update');
    $('#addUserForm').attr('action','/Setting/User/Add');

// 初始化表单验证
    initBootstrapValidator(fieldsList);


    $("#eidtModal").on('show.bs.modal',function(){
      $('#editForm').bootstrapValidator('resetForm',true);
      table.ajax.reload(null,false);
    })
    $("#addModal").on('show.bs.modal',function(){
      $('#addUserForm').bootstrapValidator('resetForm',true);
    })
    $("#addModal").on('hide.bs.modal',function(){
      $('#addUserForm').bootstrapValidator('resetForm',true);
      table.ajax.reload(null,false);
    })
    $("#add").on('click',function(){
      $("input[name='username']").removeAttr('readonly');
      $('#addUserForm').get(0).reset()
      $('#company2').val('').select2();
      $('#department2').val('').select2();
      $('#role2').val('').select2();
    });



    //获取所有企业
    function getCompanys(selector,id){
      $.ajax({
          type:"GET",
          url: "/Setting/Enterprise/0/0",
          dataType:'json',
          success: function(data){
            var options = [];
            var List = data.result;
            options.push("<option value='' selected></option>")
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
    //获取所有部门
    function getDepartments(selector,id){
       $.ajax({
          type:"GET",
          url: "/Setting/SettingDict/0/0?type=department",
          dataType:'json',
          success: function(data){
            var options = [];
            var List = data.result;
            options.push("<option value='' selected></option>")
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
    //获取所有角色
    function getRoles(selector,id){
      $.ajax({
        type:"GET",
        url: "/Setting/User/Role/List/0/0",
        dataType:'json',
        success: function(data){
          var options = [];
          var List = data.result;
          for(var i=0,len=List.length; i<len; i++){
          options.push("<option value=\'"+ List[i].rolename +"\'>"+List[i].name+"</option>");
          }
          selector.empty().append(options.join(""));
          if(id){
            selector.val(id).select2();
          }else{
              selector.select2();
          }
        }
      })
    }

  });
});
