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
      url: '/Setting/Enterprise',
      dataSrc: "result"
    },
    "aoColumns": [{
      "sTitle": "企业用户名",
      "data": "username"
    },{
      "sTitle": "企业名称",
      "data": "name"
    },{
      "sTitle": "企业简称",
      "data": "abbreviation"
    },{
      "sTitle": '联系人',
      "data": 'contacts'
    }, {
      "sTitle": '联系电话',
      "data": 'contactsinfo'
    }, {
      "sTitle": "联系地址",
      "data": "address"
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
        targets:[1,5]
    },
    {
      render: function(data, type, row) {
        var enterpriseId = row.objectid;
        var html = [];
        html.push('<a class="operate editBtn" data-toggle="modal" data-target="#editModal" data-id=' + enterpriseId + '>编辑</a>');
        if (row.deleteFlag == -1) {
          html.push('<a class="operate enableBtn" data-id=' + enterpriseId + '>解禁</a>');
        } else { //defalut 0
          html.push('<a class="operate disableBtn" data-id=' + enterpriseId + '>禁用</a>');
        }
        html.push('<a class="operate resetBtn" data-id=' + enterpriseId + '>密码重置</a>');
        html.push('<a class="operate infoBtn" data-toggle="modal" data-target="#infoModal" data-id=' + enterpriseId + '>详情</a>');
        return html.join('');
      },
      targets: 6,
        width:'160px'
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

    var table = $("#companyTable").DataTable(dToption);
    var usertable = $("#companyTable");

    //禁用
    usertable.on('click', '.disableBtn', function() {

      var enterpriseId = $(this).attr("data-id");
      var flag = 0;

      $.ajax({
        type: "POST",
        url: "/Setting/Enterprise/EnableEnterprise/" + enterpriseId + "/" + flag,
        dataType: "json",
        success: function(data) {
            showAlert(data.msg,'success');
            table.ajax.reload(null,false);

        }
      });
    });

    //解禁
    usertable.on('click', '.enableBtn', function() {
      var enterpriseId = $(this).attr("data-id");
      var flag = 1;

      $.ajax({
        type: "POST",
        url: "/Setting/Enterprise/EnableEnterprise/" + enterpriseId + "/" + flag,
        dataType: "json",
        success: function(data) {
            showAlert(data.msg,'success');
            table.ajax.reload(null,false);
        }
      });
    });

    //重置密码
    usertable.on('click', '.resetBtn', function() {
      var enterpriseId = $(this).attr("data-id");
      $.ajax({
        type: "POST",
        url: "/Setting/Enterprise/RestEnterpriseAdminPassword/" + enterpriseId,
        dataType: "json",
        success: function(data) {
            table.ajax.reload(null,false);
            showAlert(data.msg,'success');
        },
        error: function(e) {

        }
      });
    });


    //详情
    usertable.on('click', '.infoBtn', function() {
      var enterpriseId = $(this).attr("data-id");
      $.ajax({
        type: "GET",
        url: "/Setting/Enterprise/Edit/" + enterpriseId,
        dataType: "json",
        success: function(data) {
          var html = [];
          html.push("<tr><td>企业用户名:</td><td>"+data.username+"</td></tr>");
          html.push("<tr><td>联系人:</td><td>"+data.contacts+"</td></tr>");
          html.push("<tr><td>联系电话:</td><td>"+data.contactsinfo+"</td></tr>");
          html.push("<tr><td>联系地址:</td><td>"+data.address+"</td></tr>");
          html.push("<tr><td>企业名称:</td><td>"+data.name+"</td></tr>");
          html.push("<tr><td>入驻年份:</td><td>"+data.enterpriseIntake.name+"年</td></tr>");
          html.push("<tr><td>企业规模:</td><td>"+data.enterpriseScale.name+"</td></tr>");
          html.push("<tr><td>所属行业:</td><td>"+data.enterpriseIndustry.name+"</td></tr>");
          html.push("<tr><td>企业性质:</td><td>"+data.enterpriseType.name+"</td></tr>");

          $("#companyInfo").empty().append(html.join(""));
        }
      });
    });
      
    //编辑
    usertable.on('click', '.editBtn', function() {
      // $("#editModal").modal('toggle');
    
      var enterpriseId = $(this).attr("data-id");

      $.ajax({
        type:'GET',
        url: '/Setting/Enterprise/Edit/' + enterpriseId,
        dataType:'json',
        success: function(data){

          //读取表单数据
          $("input[name='username']").val(data.username);
          $("input[name='objectid']").val(data.objectid);
          $("input[name='contacts']").val(data.contacts);
          $("input[name='contactsinfo']").val(data.contactsinfo);
          $("input[name='address']").val(data.address);
          $("input[name='name']").val(data.name);
          $("input[name='abbreviation']").val(data.abbreviation);
          $("#companyEditForm input[name='clmId']").val(data.clmId);


          //读取入驻年份、企业规模、所属行业、企业性质字典
            getDicts($("#startYear"),"years",data.intake);
            getDicts($("#scale"),"enterpriseScale",data.scale);
            getDicts($("#industry"),"enterpriseIndustry",data.industry);
            getDicts($("#type"),"enterpriseType",data.type);
      
        }
      })
    }); //编辑结束
    
        //新增，读取所有单位、部门、角色
      getDicts($("#startYear2"),"years");
      getDicts($("#scale2"),"enterpriseScale");
      getDicts($("#industry2"),"enterpriseIndustry");
      getDicts($("#type2"),"enterpriseType");

      function getDicts(selector,type,id){
          $.ajax({
              type:"GET",
              url: "/Setting/SettingDict/0/0?type=" + type,
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

    // 表单验证
    var fieldsList = {
      username: {
          validators:{
              notEmpty: {
                  message:'用户名不能为空'
              },
              stringLength: {
                  min: 1,
                  max: 20,
                  message: '限20字以内'
              },
              regexp: {
                  regexp: /^[a-zA-Z][a-zA-Z0-9]{7,19}$/i,
                  message: '8-20个英文和数字组合，首字母必须为英文字母，特殊符号不可用'
              }
          }
      },
      contacts: {
          validators:{
              notEmpty: {
                  message: '联系人不能为空'
              },
              stringLength: {
                  max: 20,
                  message: '限20个字符以内'
              }
          }
      },
      contactsinfo: {
          validators:{
              notEmpty: {
                  message: '联系方式不能为空'
              },
              stringLength: {
                  max: 20,
                  message: '限20个字符以内'
              },
              digits: {
                  message:'请输入数字'
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
      name: {
          validators:{
              notEmpty: {
                  message: '企业名称不能为空',
              },
              stringLength: {
                  max: 100,
                  message: '限100个字符以内'
                  
              }
          }
      },
      abbreviation: {
          validators:{
              stringLength: {
                  max: 50,
                  message: '限50个字符以内'
              }
          }
      },
      intake: {
          validators:{
              notEmpty: {
                  message: '入驻年不能为空'
              }
          }
      },
      scale: {
          validators:{
              notEmpty: {
                  message: '企业规模不能为空'
              }
          }
      },
      industry: {
          validators:{
              notEmpty: {
                  message: '所属行业不能为空'
              }
          }
      },
      type: {
          validators:{
              notEmpty: {
                  message: '企业类型不能为空'
              }
          }
      },
        clmId: {
            validators:{
                notEmpty: {
                    message: 'clmId不能为空'
                },
                regexp:{
                    regexp:/^\d+$/,
                    message:'clamId请填写数字'
                }
            }
        }
        
    }

    $('#companyEditForm').attr('action','/Setting/Enterprise/Update');
    $('#addCompanyForm').attr('action','/Setting/Enterprise/Add');
    //清空验证
    $("#eidtModal").on('show.bs.modal',function(){
        $('#companyEditForm').bootstrapValidator('resetForm',true);

        
    })
    $("#addModal").on('show.bs.modal',function(){
        $('#addCompanyForm').bootstrapValidator('resetForm',true);
        getDicts($("#startYear2"),"years");
        getDicts($("#scale2"),"enterpriseScale");
        getDicts($("#industry2"),"enterpriseIndustry");
        getDicts($("#type2"),"enterpriseType");
    })
    //初始化验证
    initBootstrapValidator(fieldsList);
      table.ajax.reload(null,false);


  }); //$
});

