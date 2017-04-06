require(["jquery","pm"], function(){
  $(function(){
    var tables = initList('.richtextList',{search : '#searchBox'});
    window.wspList = tables;

    //禁用
    $(document).on('click','.disableBtn',function(){
      var id = $(this).attr('id');
      var flag = 0;
        $.ajax({
          type: "GET",
          url: "/Setting/RichText/EnableRichText/" + id +'/'+ flag,
          dataType: "json",
          success: function(data) {
            tables.refresh();
            showAlert(data.msg);
          }
        });


    });
    

    //解禁
    $(document).on('click','.enableBtn',function(){
      var id = $(this).attr('id');
      var flag = 1;

      $.ajax({
        type: "GET",
        url: "/Setting/RichText/EnableRichText/" + id +'/'+ flag,
        dataType: "json",
        success: function(data) {
          tables.refresh();
          showAlert(data.msg);
        }
      });

    });


  })


});
