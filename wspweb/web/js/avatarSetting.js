require(['jquery', 'bootstrap', 'simplecropper','pm'], function() {
  $(function() {
    checkMust();
    var cropper = new Cropper({
      element: document.getElementById('cropper-target'),
      previews: [
        document.getElementById('preview-large'),
        document.getElementById('preview-medium'),
        document.getElementById('preview-small')
      ],
      onCroppedRectChange: function(rect) {
        var x = $("input[name='x']").val(rect.left);
        var y = $("input[name='y']").val(rect.top);
        var w = $("input[name='w']").val(rect.width);
        var h = $("input[name='h']").val(rect.height);
      }
    });
    var input = document.getElementById('cropper-input');

    input.onchange = function() {
      if (typeof FileReader !== 'undefined') {
        var reader = new FileReader();
        reader.onload = function(event) {
          cropper.setImage(event.target.result);
        };
        if (input.files && input.files[0]) {
          reader.readAsDataURL(input.files[0]);
        }
      } else { // IE10-
        input.select();
        input.blur();
        var src = document.selection.createRange().text;
        cropper.setImage(src);
      }
    };
  })
	$('#photoUp').on('load', function(){
		// var result = this.contentDocument.body.innerText;
        var result = $(this).contents().find("body").text();
        console.log(result);
		try{
			result = JSON.parse(result);
			if(result.success == true){
				showAlert(result.msg);
                setTimeout(function(){
                   window.location.reload();
                },3000)
			}else{
				showAlert(result.msg, 'warn')
			}
		}catch(e){
			showAlert('上传失败');
		}
	})

});
