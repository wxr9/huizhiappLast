require(["jquery", "bootstrap", 'pm', 'datepickercn','bootstrapvalidator','raty', 'datatables','select2'], function(){

  var repairType = $("#repairType").val();
  //加载初始化设置页面
  $(function(){    
    // 基本设置
    $.ajax({
      url:'/Setting/SettingRepairBase/Edit/'+repairType,
      success: function(data){
        data.baseEnable == 1 ? $("#serviceStatus1").attr('checked',true) : $("#serviceStatus2").attr('checked',true);
        $("#serviceNeed").val(data.baseTermName).attr('data-id',data.baseTerm);
      }
    });
    $('#viewRich').on('click', function(){
      var self = $(this);
      window.open('/web/viewRich.html?id=' + self.parent().find('input').attr('data-id') +'&name=' +self.parent().find('input').val())
    });
    //有效期设置
    $.ajax({
      url : '/Setting/SettingRepairValidDate/Edit/'+repairType,
      success : function(data){
        $("input[name='workStartTime']").val(data.workStartTime);
        $("input[name='workEndTime']").val(data.workEndTime);
        $("input[name='nonWorkStartTime']").val(data.nonWorkStartTime);
        $("input[name='nonWorkEndTime']").val(data.nonWorkEndTime);
        $('#YXalertInfo').val(data.alertInfo);
      }
    });
    //自动评价设置
    $.ajax({
      url : '/Setting/SettingRepairComment/Edit/'+repairType,
      success : function(data){
        function pushData(target,length,name){
          var arr = [];
          for(var i = 0;i<length;i++){
            target.append('<option value="'+i+'">'+i+ name +'</option>');
          }
        }
        var arr = ['autoCommentSpeed','autoCommentAttitude', 'autoCommentQuality'];
        $(arr).each(function(ind,val){
          $("#"+val).raty('score', data[val]);
        });
        $("#autoCommentInfo").val(data.autoCommentInfo);
        var dayTime = $("#dayTime");
        var hourTime = $("#hourTime");
        var minTime = $("#minTime");
        pushData(dayTime,30,'天');
        pushData(hourTime,24,'时');
        pushData(minTime,60,'分');
        var min = data.autoCommentDeadline % 60;
        var hour = (data.autoCommentDeadline-min) % 1440 / 60;
        var day = (data.autoCommentDeadline-min - (hour*60)) % 86400 / 24 / 60;
        dayTime.val(day);
        hourTime.val(hour);
        minTime.val(min);
      }
    });
    
    //获取所有工种
    function getJobType(selector,id){
      $.ajax({
        type:"GET",
        url: "/Setting/SettingDict/0/0/?type=worktype",
        dataType:'json',
        success: function(data){
          var options = [];
          var List = data.result;
          for(var i=0,len=List.length; i<len; i++){
          options.push("<option value=\'"+ List[i].objectid +"\'>"+List[i].name+"</option>");
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

    //维修工程师设置
    var aToption = {
      "bAutoWidth": true, //自动宽度
      "dom": '<"top"if>rt<"bottom"lp><"clear">',
      "serverSide": true,
      "bDestory": true,
      "info": false,
      "ordering": false,
      "lengthChange": false,
      "sPaginationType": "full_numbers",
      "ajax": {
        url: '/Setting/SettingMaintainer/List',
	      queryString: {
		      repairType: 2
	      },
        dataSrc: "result"
      },
      "aoColumns": [{
        "sTitle": "姓名",
        "data": "name"
      }, {
        "sTitle": "手机号",
        "data": "mobile"
      }, {
        "sTitle": '操作',
        "data": 'objectid'
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
          var html = [];
          html.push('<a href="javascript:void(0)" class="editTable" data-id="'+data+'">编辑 </a>');
          html.push('<a class="operate disableBtn" data-id="' + data + '">删除</a>');
          return html.join('');
        },
        targets: 2
      }],
      //初始化结束
      "initComplete": function() {
        $("#engineer").width("100%");
      }
    };
    var at = $("#engineer").DataTable(aToption);
    getJobType($("#jobType"));
    getRoles($('#roleType'));
    //删除
    $("#engineer").on('click','.disableBtn',function(){
      var id = $(this).attr('data-id');
      $.ajax({
        type: "GET",
        url: "/Setting/SettingMaintainer/Delete/" + id ,
        dataType: "json",
        success: function(data) {
          if(data.success){
            showAlert(data.msg);
          }else
            showAlert(data.msg,'danger');
            at.ajax.reload(null,false);
        }
      });

    });

    // 验证字段
    var fieldsList = {
      name: {
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
      mobile: {
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
      jobType : {
        validators:{
          notEmpty: {
            message: '不能为空'
          }
        }
      },
      department : {
        validators:{
          notEmpty: {
            message: '不能为空'
          }
        }
      }

    }
    //新增

    $('#addEngineerForm').attr('action','/Setting/SettingMaintainer/Add/');
    $('#editEngineerForm').attr('action','/Setting/SettingMaintainer/Update');

    // 初始化表单验证
    initBootstrapValidator(fieldsList);
    at.ajax.reload(null,false);
    $("#addModal").on('hide.bs.modal',function(){
      $('#addEngineerForm').bootstrapValidator('resetForm',true);
      $("#jobType").select2().val('');
      getRoles($('#roleType'));
    })
    $("#editModal").on('hide.bs.modal',function(){
      $('#editEngineerForm').bootstrapValidator('resetForm',true);
      at.ajax.reload(null,false);
    })
    //编辑
    $("#engineer").on('click', '.editTable', function() {
      var id = $(this).attr('data-id');
      //更改模态框
      $('#editModal').modal('show');
      if(id != undefined){
        $.ajax({
              url : '/Setting/SettingMaintainer/Edit/' + id,
              method : 'GET',
              success : function(data){
                $("input[name='objectid']").val(data.objectid);
                $("input[name='repairType']").val(data.repairType);
                $("input[name='name']").val(data.name);
                $("input[name='mobile']").val(data.mobile);
                getJobType($("#jobType2"),data.jobType);
                getRoles($('#roleType2'),data.department);
              }
        });
      }
    });
  });


  // 基本设置-----------------

  selectRich("#selectRich");

  $("#saveRich").on('click', function(){
    var id = $('#serviceNeed').attr('data-id');
    var status = $('input[name="baseEnable"]:checked ').val();
    if(!id){
      showAlert('请选择富文本','warn');
      return;
    }
    $.ajax({
      url : '/Setting/SettingRepairBase/Update',
      method : "POST",
      data : {
        repairType : repairType,
        objectid : repairType,
        baseEnable : status,
        baseTerm : id
      },
      success : function(data){
        if(data.success == true){
          showAlert(data.msg);
        }else{
          showAlert(data.msg,'warn');
        }
      }
    })
  });

  //有效期设置-----------------------------
  $(".form_daytime").datetimepicker({
    format: "hh:ii",
    language : 'cn',
    autoclose: true,
    startView : 1,
    maxView: 1
  });

  $('#tabpanelYX').bootstrapValidator({
        fields: {
            workStartTime: {
                validators: {
                  notEmpty: {
                      message: '该字段不能为空'
                  }
                }
            },
            workEndTime: {
                validators: {
                  notEmpty: {
                      message: '该字段不能为空'
                  }
                }
            },
            nonWorkStartTime: {
                validators: {
                  notEmpty: {
                      message: '该字段不能为空'
                  }
                }
            },
            nonWorkEndTime: {
                validators: {
                  notEmpty: {
                      message: '该字段不能为空'
                  }
                }
            }
        }
    }).on('success.form.bv', function(e){
      e.preventDefault();
      var $target = $(e.target)
      if($target.is(':visible')){
        $.ajax({
          url : '/Setting/SettingRepairValidDate/Update',
          method:'POST',
          data : {
            alertInfo: $("#YXalertInfo").val(),
            nonWorkStartTime: $('input[name="nonWorkStartTime"]').val(),
            nonWorkEndTime: $('input[name="nonWorkEndTime"]').val(),
            workStartTime: $('input[name="workStartTime"]').val(),
            workEndTime: $('input[name="workEndTime"]').val(),
            objectid: repairType
          },
          success: function(data){
            if(data.success == true){
              showAlert(data.msg);
            }else{
              showAlert(data.msg,'warn');
            }
          }
        })
      }else{
        return false;
      }
    });

  $(".form_daytime").on('changeDate', function (e) {
    $('#tabpanelYX')
        .data('bootstrapValidator')
        //.updateStatus(e.target.name, 'VALID', null)
        .validateField(e.target.name);
    $('#saveEffective').removeAttr('disabled');
  });


// 评价设置--------------------------------------
  var stararr = ['autoCommentSpeed','autoCommentAttitude', 'autoCommentQuality'];
  var starind = 0;

  $('.ratyRating').each(function(ind,val){
    $(val).raty({
      path: '../../lib/images',
      scoreName: stararr[starind++],
      score: 5
    });
  });

  $("#saveEvaluate").on('click', function(){
    var form =$('#ratyForm');
    var dayTime = parseInt($('#dayTime').val());
    var hourTime = parseInt($('#hourTime').val());
    var minTime = parseInt($('#minTime').val());
    dayTime = isNaN(dayTime) ? 0 : dayTime;
    hourTime = isNaN(hourTime) ? 0 : hourTime;
    minTime = isNaN(minTime) ? 0 : minTime;
    var min = ((dayTime * 24) + hourTime) * 60 + minTime;
    $.ajax({
      url : '/Setting/SettingRepairComment/Update',
      method : 'POST',
      data : {
        objectid: repairType,
        autoCommentAttitude: $('input[name="autoCommentAttitude"]').val(),
        autoCommentDeadline: min,
        autoCommentInfo: $("#autoCommentInfo").val(),
        autoCommentQuality: $('input[name="autoCommentQuality"]').val(),
        autoCommentSpeed: $('input[name="autoCommentSpeed"]').val()
      },
      success : function(data){
        if(data.success == true){
          showAlert(data.msg);
        }else{
          showAlert(data.msg,'warn');
        }
      }
    })
  });


});
