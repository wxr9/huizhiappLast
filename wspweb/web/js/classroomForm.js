/**
 * Created by Administrator on 2016/3/29.
 */
require(['jquery','datepicker', 'bootstrap','pm','bootstrapvalidator','select2'], function(){
    $(function(){
        var id=queryString("id");
        if(id!=undefined){
            var sn;
            //获取值
            $.ajax({
                type: 'GET',
                url: ' /Classroom/UserClassroom/Edit/' + id,
                dataType: 'json',
                success: function (data) {

                    $.each(data,function(ind,val){
                        var tar = $('input[name="'+ind+'"]');
                        if(tar.attr('type') != 'radio'){
                            tar.val(val)
                        }
                    });
                    $.each(data,function(ind,val){
                        var tar = $('textarea[name="'+ind+'"]');
                        if(tar.attr('type') != 'radio'){
                            tar.val(val)
                        }
                    });
                    sn=data.serialNumber;
                }
            })
            //获取职位值
            $.ajax({
                type: 'GET',
                url: '/Classroom/UserClassroomApply/UserClassroom/Edit/' + id,
                dataType: 'json',
                success: function (data) {
                    data=data.result;
                    $("#notice").html(data[0].classroom.readme);
                    $('input[name=classroomName]').val(data[0].classroom.name);
                    if(data[0].classroom.isRead==-1){
                        $('#notice').hide();
                        $('.read').remove();
                    }
                    $('#cont').empty();

                    //自己填的时间
                    var html=[];
                    html.push('<p>自己选择的时间:</p>');
                    $.each(data,function(ind,val) {
                        var str = data[ind].applyDate.substr(0,10).split('-');
                        str = str.join('/');
                        var radio=data[ind].halfDay;
                        html.push('<div class="clearfix bg_gray1 radios"><div class="input-append date form_datetime fl"><input type="text" size="16"  name="dateTimeArray" value="' + str + '" readOnly />' +
                            '<span class="add-on"><i class="icon-th fa fa-table blue"></i></span></div>');
                        html.push('<label class="fl ml20">');
                        if (radio == 'a') {
                            html.push('<input type="radio" name="halfDayArray' + ind + '" value="a" checked="checked"/>')
                        } else {
                            html.push('<input type="radio" name="halfDayArray' + ind + '" value="a"/>')
                        }
                        html.push('<span class="week"> 上午9:00-12:00</span></label>');
                        html.push('<label class="fl">')
                        if (radio == 'p') {
                            html.push('<input type="radio" name="halfDayArray' + ind + '" value="p" checked="checked"/>');
                        } else {
                            html.push('<input type="radio" name="halfDayArray' + ind + '" value="p"/>');
                        }
                        html.push('<span class="week"> 下午13:00-15:00</span></label></div>');
                    })
                    var num=data.length;
                    //是否显示后台确定的时间
                    $.ajax({
                        type: 'Post',
                        url: '/Setting/MainBusiness/IsComplete/Edit',
                        dataType: 'json',
                        data: {
                            sn:  sn
                        },
                        success: function (data) {
                            if (data.success == true) {
                                //后台确定的时间
                                $.ajax({
                                    type: 'GET',
                                    url: '/Classroom/UserClassroomVerify/UserClassroom/Edit/' + id,
                                    dataType: 'json',
                                    success: function (data) {
                                        if (data.length > 0) {
                                            html.push('<p>后台最后确定的时间:</p>');
                                            $.each(data, function (ind, val) {
                                                var str = data[ind].applyDate.substr(0, 10).split('-');
                                                str = str.join('/');
                                                var radio = data[ind].halfDay;
                                                html.push('<div class="clearfix bg_gray1 radios"><div class="input-append date form_datetime fl"><input type="text" size="16"  name="dateTimeArray" value="' + str + '" readOnly />' +
                                                    '<span class="add-on"><i class="icon-th fa fa-table blue"></i></span></div>');
                                                html.push('<label class="fl ml20">');
                                                if (radio == 'a') {
                                                    html.push('<input type="radio" name="halfDayArray' + (ind + num) + '" value="a" checked="checked"/>')
                                                } else {
                                                    html.push('<input type="radio" name="halfDayArray' + (ind + num) + '" value="a"/>')
                                                }
                                                html.push('<span class="week"> 上午9:00-12:00</span></label>');
                                                html.push('<label class="fl">')
                                                if (radio == 'p') {
                                                    html.push('<input type="radio" name="halfDayArray' + (ind + num) + '" value="p" checked="checked"/>');
                                                } else {
                                                    html.push('<input type="radio" name="halfDayArray' + (ind + num) + '" value="p"/>');
                                                }
                                                html.push('<span class="week"> 下午13:00-15:00</span></label></div>');
                                            })
                                        }
                                        $('#cont').append(html.join(''))
                                    }
                                })
                            }
                            else{
                                $('#cont').append(html.join(''))
                            }
                        }
                    })
                    $('input').attr('readonly',true);
                    $('textarea').attr('readonly',true);
                    $('button').attr('disabled','disabled');
                    $('input[type=checkbox]').attr('checked','checked');
                    $('#cont').parent().removeClass('col-sm-9').addClass('col-sm-8');
                }
            })
            //评价
            getCommentInfo(id,'userClassroom');
            $('#notice').hide();
            $('.read').hide();
        }else {
            checkInfo();
            var objectid = queryString("objectid")
            var name = queryString("name")
            getUserInfo(function(user){
                //姓名
                $("input[name='chineseName']").val(user.realName);
                //邮箱
                $("input[name='email']").val(user.email);

                //公司
                if (user.enterprise == null) {
                    $('input[name="company"]').val(user.enterpriseInput || "");
                } else {
                    $('input[name="company"]').val(user.enterprise.name || "");
                }
                //联系方式
                $("input[name='phone']").val(user.phone);
                $("input[name='classroomName']").val(name);
                $("input[name='classroomId']").val(objectid);
            })
            //显示当天的时间
            var data=formatDate(new Date());
            var arr=data.split('/');
            arr[1]=arr[1]>9?arr[1]:'0'+arr[1];
            arr[2]=arr[2]>9?arr[2]:'0'+arr[2];
            data=arr.join('/');
            $('input[name=dateTimeArray]').val(data);
            //须知
            $.ajax({
                type: 'GET',
                url: '/Classroom/Classroom/Edit/' + objectid,
                dataType: 'json',
                //async: false,
                success: function (result) {
                    //须知
                    $("#notice").html(result.readme);
                    if(result.isRead==-1){
                        $('.read').remove();
                    }
                }
            });
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
                },
                //classroomId:  {
                //    validators: {
                //        callback: {
                //            callback: function (value, validator) {
                //                if (value == 0) {
                //                    return {
                //                        valid: false,
                //                        message: '请选择教室id'
                //                    }
                //                }
                //                return true;
                //            }
                //        }
                //    }
                //},
                //dateTimeArray: {
                //    validators: {
                //        notEmpty: {
                //            message: '时间不能为空'
                //        }
                //    }
                //},
                //halfDayArray: {
                //    validators: {
                //        notEmpty: {
                //            message: '选择上、下午不能为空'
                //        }
                //    }
                //},
                //content: {
                //    validators: {
                //        notEmpty: {
                //            message: '备注不能为空'
                //        }
                //    }
                //},
                //memo: {
                //    validators: {
                //        notEmpty: {
                //            message: '备注不能为空'
                //        }
                //    }
                //}

            }
            $("#form").attr('action', '/Classroom/UserClassroom/Add');
            // 初始化表单验证
            initBootstrapValidator(validatorFields, {
                end:function(result){
                    $('button.submit').attr('disabled','disabled');
                    if(result.success == true){
                        setTimeout(function(){
                            window.location.href = '/web/myWiz.html';
                        },3000)
                    }
                },
                replaceData: function (data) {
                    return data.replace(/halfDayArray\d+/g, 'halfDayArray');
                }
            });
            $("#form").data('bootstrapValidator');

            var dopt = {
                format: "yyyy/mm/dd",
                autoclose: true,
                todayBtn: true,
                pickerPosition: "bottom-left",
                startView: 2,
                minView: 2,
                startDate: new Date()
            }
            //选择营业时间
            $(".form_datetime")
                .datetimepicker(dopt)

            //新增时，读取所有教室id
            getCompanys($("#classroomId"));
            //获取所有培训项目id
            function getCompanys(selector, id) {
                $.ajax({
                    type: "GET",
                    url: "/Classroom/Classroom/Enable/List/0/0",
                    dataType: 'json',
                    success: function (data) {

                        var target = $("#classroomId");
                        $(data.result).each(function (ind, val) {
                            target.append('<option value="' + val.objectid + '">' + val.name + '</option>');
                        })
                    }
                })
            }

            $('#selectTitle').click(function () {
                $('#selectShow').toggle();
            })
            var dateTimeArray = $('input[name=dateTimeArray]').val();
            var radio = $('input[name=halfDayArray0]').val();
            var radios = [];
            //批量生产时间
            var num = 1,showNum=1;
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
                console.log('num'+num +' shownum'+showNum);
                return false;
            });
            $("#cont").on('click', '.delete1', function () {
                console.log('num'+num +' shownum'+showNum);
                var formGroup = $(this).parent();
                formGroup.remove();
                showNum--;
                $('#contNum').text('共' + showNum + '条预约');
            })
        }
    })
})

