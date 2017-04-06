 require(['jquery', 'bootstrap','pm','bootstrapvalidator','dropify','select2', 'ckeditor'], function() {
  $(function() {
	  var initSample = (function() {
		  var wysiwygareaAvailable = isWysiwygareaAvailable(),
			  isBBCodeBuiltIn = !!CKEDITOR.plugins.get('bbcode');
		  return function() {
			  var editorElement = CKEDITOR.document.getById('editor');
			  if (isBBCodeBuiltIn) {
				  editorElement.setHtml(
					  'Hello world!\n\n'
				  );
			  }
			  if (wysiwygareaAvailable) {
				  CKEDITOR.replace('editor');
			  } else {
				  editorElement.setAttribute('contenteditable', 'true');
				  CKEDITOR.inline('editor');
			  }
		  };

		  function isWysiwygareaAvailable() {

			  if (CKEDITOR.revision == ('%RE' + 'V%')) {
				  return true;
			  }
			  return !!CKEDITOR.plugins.get('wysiwygarea');
		  }
	  })();
	  initSample();
		CKEDITOR.lang.load('zh-cn','zh-cn',function(){
		})


    //编辑
    var id = queryString('id');
    if (id != 'undefined'){
      $.ajax({
          type:'GET',
          url: '/Setting/RichText/Edit/' + id,
          dataType:'json',
          success: function(data){
              console.log(data);
              //读取表单数据
              $("input[name='title']").val(data.title);
              $(".previewBox").append("<img src='/"+data.pic+"'>");
              $("input[name='memo']").val(data.memo);
              CKEDITOR.instances.editor.setData(data.content);
          },
          error: function(){
          }
      }); //编辑结束
    }
	  if(id){
		  $('form').append("<input type='hidden' name='objectid' value='"+id+"'/>");
	  }
      //图片上传
      require(['jqueryUpload'], function(UploadImg) {
         UploadImg({
              file: 'photoUrl',
              url: '/FileUpload/SimpleUploadFile',
              extData: {
                  type: 'png'
              },
              fileName: 'file',
              name:'pic',
              loadingImg: '/lib/images/loading.gif',
              validatorImg: '/lib/images/validator.png',
              path: 'response path data',
              statusName: 'success',
              preview: {
                  prevUrl: '/'
              },
              success: function (data) {
                  showAlert('上传成功');
              },
              error: function (data) {
                  showAlert('上传失败');
              }
          })
      })
    // 表单验证
    var fieldsList = {
      title: {
          validators:{
              notEmpty: {
                  message:'标题不能为空'
              },
              stringLength: {
                  min: 1,
                  max: 50,
                  message: '限50字以内'
              }
          }
      },
      memo: {
          validators:{
              notEmpty: {
                  message:'摘要不能为空'
              }
          }
      }
    };

    $('#editForm').attr('action','/Setting/RichText/Update');
    $('#addForm').attr('action','/Setting/RichText/Add');
    //清空表格
    //初始化表格
    initValidator(fieldsList);
    function initValidator(fieldsList) {
    $('form')
        .bootstrapValidator({
            message: 'This value is not valid',
            excluded: [':disabled'],
            feedbackIcons: {
                valid: 'fa fa-smile-o',
                invalid: 'fa fa-frown-o',
                validating: 'fa fa-refresh'
            },
            fields: fieldsList
        })
        .on('success.form.bv', function (e) {
            // Prevent form submission
            e.preventDefault();
	          $('form').find('textarea[name="content"]').val(CKEDITOR.instances.editor.getData());
            // Get the form instance
            var $form = $(e.target),
                validator = $form.data('bootstrapValidator'),
                submitButton = validator.getSubmitButton();

            // 转义特殊字符，防止js注入
            checkJsInject();
	        var aa = $form.serializeObj();
	        aa.content = CKEDITOR.instances.editor.getData();
            // Use Ajax to submit form data
            $.ajax({
                type: "POST",
                url: $form.attr('action'),
                data:aa,
                dataType: "json",
                success: function (result){
                },
	              complete: function(e,status){
		              var data = JSON.parse(e.responseText);
		              if(status === 'success' && data.success === true){
			              if(status.success === false){
				              showAlert(data.msg, 'warn');
			              }else{
				              var target = window.opener;
				              if(target){
					              target.showAlert(data.msg);
					              target.wspList.refresh();
				              }
				              showAlert(data.msg);
                              setTimeout(function(){
                                  window.close();
                              },3000)
			              }
		              }else{
                          showAlert(data.msg);
                      }
	              },
                error: function(){
                    showAlert(result.msg);
                }
            });
        })
        .on('click', 'button[type="reset"]', function () {
            $('form').bootstrapValidator('resetForm',true);
            CKEDITOR.instances.editor.setData('')
        });
}
  }); //$
});
