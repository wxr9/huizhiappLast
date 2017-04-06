/**
 * Created by z on 2016/12/1.
 */
require(['jquery','pm'], function(){
    $(function(){
        var form = document.forms['applyForm'];
        $('#btn').on('click',function(){

            if(form.name.value == ""){
                showAlert('请填写姓名','danger');
            }else
                showAlert('提交成功！');
        });
    })








});