 require(['jquery', 'bootstrap','pm','select2','bootstrapvalidator'], function() {


$(document).ready(function () {

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
        select2 : {
            validators:{
                notEmpty: {
                    message: '不能为空'
                }
            }
        }

    }

$('#addEngineerForm').attr('action','/Setting/SettingMaintainer/Add/');

// 初始化表单验证
initBootstrapValidator(fieldsList);



$("#addModal").on('show.bs.modal',function(){
        $('#addEngineerForm').bootstrapValidator('resetForm',true);
    })

});


});


