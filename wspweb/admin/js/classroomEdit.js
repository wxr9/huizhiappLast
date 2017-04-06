/**
 * Created by Administrator on 2016/3/30.
 */


require(['jquery','datepicker', 'bootstrap','pm','bootstrapvalidator','select2'], function(){
    $(function(){
        var objectid=queryString("objectid")
        var name=queryString('name')
        $('input[name=classroomName]').val(name)
        $('input[name=classroomId]').val(objectid)
        var data=new Date();
        var mouse=(data.getMonth()+1)<9?'0'+(data.getMonth()+1):(data.getMonth()+1);
        var day=data.getDate()<9?'0'+data.getDate():data.getDate()
        $('input[name=dateTimeArray]').val(data.getFullYear()+'/'+mouse+'/'+day );
        // 验证字段
        var validatorFields = {
            chineseName:{
                validators: {
                    notEmpty: {
                        message: '姓名不能为空'
                    },
                    stringLength: {
                        min: 0,
                        max: 20,
                        message: '限20字以内'
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
            company: {
                validators: {
                    notEmpty: {
                        message: '公司名称不能为空'
                    },
                    stringLength: {
                        min: 0,
                        max: 100,
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
                        regexp:/^[0-9]{11}$/g,
                        message:  '请输入11位手机号'
                    }
                }
            },
            count: {
                validators: {
                    regexp: {
                        regexp: /(^[1-9]$)|(^[1-4][0-9]$)|50/,
                        message: '请输入1~50的整数'
                    }

                }
            }
        }
        $("#form").attr('action','/Classroom/UserClassroom/Admin/Add');
        // 初始化表单验证
        initBootstrapValidator(validatorFields,{
            end:function(){
                $('button').attr('disabled', 'disabled');
                setTimeout(function () {
                    window.location.href = '/admin/classroomMan.html';
                }, 3000);
            },
            replaceData: function(data){
                return data.replace(/halfDayArray\d+/g,'halfDayArray');
            }
        });

        $("#form").data('bootstrapValidator');

        var dopt={
            format: "yyyy/mm/dd",
            autoclose: true,
            todayBtn: true,
            pickerPosition: "bottom-left",
            startView:2,
            minView:2,
            startDate: new Date()
        }
        //选择营业时间
        $(".form_datetime")
            .datetimepicker(dopt)

        $('#selectTitle').click(function () {
            $('#selectShow').toggle();
        })
        var dateTimeArray = $('input[name=dateTimeArray]').val();
        var radio = $('input[name=halfDayArray0]').val();


        $("#cont").on('click', '.delete1', function () {
            var formGroup = $(this).parent();
            formGroup.remove();
        })

        var radios = [];
        //批量生产时间
        var num=1,showNum=1;
        $("#create").click(function () {

            $('#cont').empty();
            var arr=[];
            $('#selectShow input[type=checkbox]').each(function(){
                if($(this).is(':checked')==true){
                    arr.push($(this).val());
                }
            })
            var data = getDateList({
                begin: $("input[time=startTime]").val(),
                end: $("input[time=endTime]").val(),
                inDay: arr
            });
            var html = [];
            var count = $('#count').val();
            var times =  data.length > count ? count : data.length;
            for (var i = 0; i < times; i++) {
                var str = data[i].format.split('-');
                str[1] < 10 ? str[1] = '0' + str[1] : str[1];
                str[2] < 10 ? str[2] = '0' + str[2] : str[2];
                str = str.join('/');
                html.push('<div class="clearfix bg_gray1 radios"><div class="input-append date form_datetime fl"><input type="text" size="16"  name="dateTimeArray" value="' + str + '" readOnly />' +
                    '<span class="add-on"><i class="icon-th fa fa-table blue"></i></span></div>');
                html.push('<label class="fl ml20">');
                if ($('input[name="asdf"]')[0].checked==true) {
                    html.push('<input type="radio" name="halfDayArray' + i + '" value="a" checked="checked"/>')
                } else {
                    html.push('<input type="radio" name="halfDayArray' + i + '" value="a"/>')
                }
                html.push('<span class="week"> 上午9:00-12:00</span></label>');
                html.push('<label class="fl">')
                if ($('input[name="asdf"]')[1].checked==true) {
                    html.push('<input type="radio" name="halfDayArray' + i + '" value="p" checked="checked"/>');
                } else {
                    html.push('<input type="radio" name="halfDayArray' + i + '" value="p"/>');
                }
                html.push('<span class="week"> 下午13:00-15:00</span></label>');
                html.push('<a class="add3 fl" click="clicked" href="javascript:;"><i class="fa fa-plus-circle" aria-hidden="true"></i></a>' +
                    '<a class="delete1 fl" href="javascript:;"><i class="fa fa-minus-circle" aria-hidden="true"></i></a></div>')
            }
            num = times;
            showNum = times;
            if (data.length == 0 || arr.length == 0) {
                $("#cont").append('<p style="color:red">请选择时间</p>');
            } else {
                $('#contNum').text('共' + showNum + '条预约');
                $("#cont").append(html.join('')).find(".form_datetime").datetimepicker(dopt);
            }
            if (count=='') {
                $("#cont").append('<p style="color:red">请选择预约次数</p>');
            }

        })
        $("#cont").on('click', '.add3', function () {
            var timeValue = $(this).siblings().children('input')[0].value;
            var html = [];
            html.push('<div class="clearfix bg_gray1 radios"><div class="input-append date form_datetime fl"><input type="text" size="16"  name="dateTimeArray" value="' + timeValue + '" readOnly />' +
                '<span class="add-on"><i class="icon-th fa fa-table blue"></i></span></div>');
            html.push('<label class="fl ml20">');
            if ($(this).siblings().children('input')[1].checked == true) {
                html.push('<input type="radio" name="halfDayArray' + num + '" value="a" checked="checked"/>')
            } else {
                html.push('<input type="radio" name="halfDayArray' + num + '" value="a"/>')
            }
            html.push('<span class="week"> 上午9:00-12:00</span></label>');
            html.push('<label class="fl">')
            if ($(this).siblings().children('input')[2].checked == true) {
                html.push('<input type="radio" name="halfDayArray' + num + '" value="p" checked="checked"/>');
            } else {
                html.push('<input type="radio" name="halfDayArray' + num + '" value="p"/>');
            }
            html.push('<span class="week"> 下午13:00-15:00</span></label>');
            html.push('<a class="add3 fl"  click="clicked" href="javascript:;"><i class="fa fa-plus-circle" aria-hidden="true"></i></a>' +
                '<a class="delete1 fl" href="javascript:;"><i class="fa fa-minus-circle" aria-hidden="true"></i></a></div>')
            $(this).parent().after(html.join(""));
            num++;
            showNum++;
            $('#cont').find(".form_datetime").datetimepicker(dopt);
            $('#contNum').text('共' + showNum + '条预约');
            return false;
        });
        $("#cont").on('click', '.delete1', function () {
            var formGroup = $(this).parent();
            formGroup.remove();
            showNum--;
            $('#contNum').text('共' + showNum + '条预约');
        })
    })
})

