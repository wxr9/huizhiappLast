require(["jquery","pm"], function(){
  $("#send").on('click', function(){
    showAlert('success');
  });
  $("#post").on('click', function(){
    showAlert('post');
  });
  $("#return").on('click', function(){
    showAlert('return','warn');
  });
  $("#print").on('click', function(){
    showAlert('print','info');
  });
  $("#pause").on('click', function(){
    showAlert('pause','info');
  });
  $("#end").on('click', function(){
    showAlert('end','warn');
  });





});
