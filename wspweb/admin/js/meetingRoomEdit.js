/**
 * Created by Administrator on 2016/4/15.
 */
require(['jquery','datepicker', 'bootstrap','pm','bootstrapvalidator','select2'], function(){
    $(function() {

        var objectid=queryString("objectid")
        var name=queryString('name')
        $("input[name='meetingroomId']").val(objectid);
        $("input[name='meetingroomName']").val(name);
        $("input[type='checkbox']").click(function () {
            if ($(this).is(':checked') == true) {
                $(this).val(1);
            } else {
                $(this).val(-1);
            }
        })

        //设备
        $.ajax({
            type: 'GET',
            url: '/Mettingroom/Mettingroom/Edit/' + objectid,
            dataType: 'json',
            success: function (data) {
                var html=[];
                if(data.projector==1){
                    html.push('<label><input type="checkbox",name="projector",value="-1"/><span class="week"> 投影仪</span></label>');
                }
                if(data.microphone==1){
                    html.push('<label><input type="checkbox",name="microphone",value="-1"/><span class="week"> 麦克风</span></label>');
                }
                if(data.vsx==1){
                    html.push('<label><input type="checkbox",name="microphone",value="-1"/><span class="week"> 视频会议</span></label>');
                }
                if(data.projector==0&&data.microphone==0&&data.vsx==0){
                    html.push('暂无设备可用！');
                }
                $('#cont1').append(html.join(''));
            }
        })

        //添加茶歇标准
        $("input[name='teaReakMoney']").val("0");
        $('input[name=teaReak]').change(function(){
            if($('input[name=teaReak]')[0].checked==true){
                $("input[name='teaReakMoney']").val('');
                $('#teaReak').show();
                $('button.submit').attr('disabled','disabled');
            }else{
                $("input[name='teaReakMoney']").val("0");
                $('#teaReak').hide();
                $('button.submit').removeAttr('disabled');
            }
        })

        // 验证字段
        var validatorFields = {
            chineseName:{
                validators: {
                    notEmpty: {
                        message: '姓名不能为空'
                    },
                    stringLength: {
                        min: 0,
                        max: 50,
                        message: '限50字以内'
                    },
                    regexp: {
                        regexp:/^(([\u4e00-\u9fa5]|[a-zA-Z0-9])+)$/,
                        message:  '请勿输入特殊字符'
                    }
                }
            },
            email: {
                validators: {
                    notEmpty: {
                        message: '邮箱不能为空'
                    },
                    stringLength: {
                        min:0,
                        max:50,
                        message: '邮箱总长度请不要超过50字符'
                    },
                    regexp: {
                        regexp:/^[a-zA-Z0-9][a-zA-Z0-9_]{2,16}@([a-zA-Z0-9-.])*[a-zA-Z0-9]{2,3}$/,
                        message:  '请输入正确格式的邮箱'
                    }
                }
            },
            peoples: {
                validators: {
                    notEmpty: {
                        message: '参会人数不能为空'
                    },
                    callback:{
                        message:"参会人数为0~1000内的整数值",
                        callback:function(value,vlidator){
                            var num = parseInt(value);
                            return (num > 0 && num < 1000) && (num == value)
                        }
                    }

                }
            },
            company: {
                validators: {
                    notEmpty: {
                        message: '公司名称不能为空'
                    },
                    stringLength: {
                        min:0,
                        max:100,
                        message: '限100字以内'
                    },
                    regexp: {
                        regexp:/^(([\u4e00-\u9fa5]|[a-zA-Z0-9\(\)\（\）])+)$/,
                        message:  '请勿输入特殊字符'
                    }
                }
            },
            phone: {
                validators: {
                    notEmpty: {
                        message: '联系方式不能为空'
                    },
                    regexp: {
                        regexp: /^\d{11}$/,
                        message: '请输入11位手机号'
                    }
                }
            },
            meetingroomId: {
                validators: {
                    notEmpty: {
                        message: '会议室不能为空'
                    }
                }
            },
            beginTimeArray: {
                validators: {
                    notEmpty: {
                        message: '开始时间不能为空'
                    }
                }
            },
            endTimeArray: {
                validators: {
                    notEmpty: {
                        message: '结束时间不能为空'
                    }
                },
                callback:{
                    message:'结束时间必须不小于开始时间',
                    callback:function(fieldValue, validator){
                        var time = validator.getFieldElements('beginTimeArray').val();
                        var start = time.split(':').join('');
                        var end = fieldValue.split(':').join('');
                        return end >= start;
                    }
                }
            },
            topics: {
                validators: {
                    notEmpty: {
                        message: '会议主题不能为空'
                    },
                    stringLength: {
                        min:0,
                        max:50,
                        message: '限50字以内'
                    }
                }
            },
            teaReakMoney: {
                validators: {
                    notEmpty: {
                        message: '茶歇人均标准不能为空'
                    },
                    callback:{
                        message:"茶歇标准为大于零并且不超过1万的整数值",
                        callback:function(value,vlidator){
                            var num = parseInt(value);
                            return (num >= 0 && num <= 10000) && (num == value)
                        }
                    }
                }
            }
        }
        $("#form").attr('action','/Mettingroom/UserMeetingroom/Admin/Add')
        // 初始化表单验证
        initBootstrapValidator(validatorFields,{
            end: function() {
                $('button').attr('disabled', 'disabled');
                setTimeout(function () {
                    window.location.href = '/admin/meetingRoomMan.html';
                }, 3000);
            }
        });
        //主动添加当天日期
        var data=new Date();
        var mouse=(data.getMonth()+1)<9?'0'+(data.getMonth()+1):(data.getMonth()+1);
        var day=data.getDate()<9?'0'+data.getDate():data.getDate();
        $("input[name='dateTimeArray']").val(data.getFullYear()+'/'+mouse+'/'+day );
        //选择营业时间
        var start = new Date();
        start.setHours(0,0,0,0);
        var end = new Date();
        end.setHours(23,59,59,999);
        var  topt = {
            format: "hh:ii",
            autoclose: true,
            pickerPosition: "bottom-left",
            startView: "day",
            maxView:"day",
            startDate: start,
            endDate: end,
            formatViewType:'time'
        }
        var dopt = {
            format: "yyyy/mm/dd",
            autoclose: true,
            todayBtn: true,
            pickerPosition: "bottom-left",
            startView:2,
            minView:2,
            startDate: new Date()
        };
        $(".dataPickerTime")
            .datetimepicker(topt)
       
        $(".dataPickerDay")
            .datetimepicker(dopt)
        $("#form").on('click', '.add2',function(){
            var formGroup=$(this).parent();
            var target = formGroup.clone();
            target.find(".dataPickerDay").datetimepicker(dopt)
            target.find(".dataPickerTime").datetimepicker(topt)
            formGroup.after(target);
        });
        $("#form").on('click', '.delete',function(){
            var formGroup=$(this).parent();
            formGroup.remove();
        })
        //时间更改验证
        $('.dataPickerTime')
            .on('change', function(e) {
                $('#form')
                // Get the bootstrapValidator instance
                    .data('bootstrapValidator')
                    // Mark the field as not validated, so it'll be re-validated when the user change date
                    .updateStatus('beginTimeArray', 'NOT_VALIDATED', null)
                    .updateStatus('endTimeArray', 'NOT_VALIDATED', null)
                    // Validate the field
                    .validateField('beginTimeArray')
                    .validateField('endTimeArray');
            });
    })
})
