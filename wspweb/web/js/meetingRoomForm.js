/**
 * Created by Administrator on 2016/3/29.
 */

require(['jquery','datepicker', 'bootstrap','pm','bootstrapvalidator','select2'], function(){
    $(function() {
        //详情
        var id=queryString('id');
        if(id!=undefined){
            var sn;
            //获取普通值
            $.ajax({
                type: 'GET',
                url: '/Mettingroom/UserMeetingroom/Edit/' + id,
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
                    //$('input[name=teaReak]').removeAttr('checked')
                    function setRadio(name,val){
                        var inputs=$('input[name='+name+']');
                        var radio=val;
                        inputs.each(function(){
                            if($(this).val()==radio){
                                $(this).attr('checked','checked');
                            }
                        })
                    }
                    setRadio('teaReak',data.teaReak);
                    if(data.teaReak==1){
                        $('#teaReak').show();
                    }
                    //设备选择
                    if(data.microphone==1){
                        $('input[name=microphone]').attr('checked','checked');
                    }
                    if(data.projector==1){
                        $('input[name=projector]').attr('checked','checked');
                    }
                    if(data.vsx==1){
                        $('input[name=vsx]').attr('checked','checked');
                    }
                    sn=data.serialNumber;
                }
            })
            //获取时间值
            $.ajax({
                type: 'GET',
                url: '/Mettingroom/UserMeetingroomApply/UserMeetingroom/Edit/' + id,
                dataType: 'json',
                success: function (data) {

                    data=data.result;
                    $("#notice").html(data[0].mettingroom.readme);
                    if(data[0].mettingroom.isRead==-1){
                        $('#notice').hide();
                        $('.read').remove();
                    }

                    $('input[name=meetingRoomName]').val(data[0].mettingroom.name);
                    $('#cont').empty()

                    //自己填的时间
                    var html=[];

                    html.push('<p>自己选择的时间:</p>');
                    $.each(data,function(ind,val) {
                        var str = data[ind].applyDate.substr(0,10).split('-');
                        str = str.join('/');
                        var radio=data[ind].halfDay;
                        html.push('<div class="time clearfix bg_gray1"><div class="fl"><span>日期:</span><div class="input-append date form_datetime dataPickerDay"><input size="14", type="text", name="dateTimeArray" value="' + str + '" readOnly />' +
                            '<span class="add-on"><i class="icon-th fa fa-table blue"></i></span></div></div>');
                        html.push('<div class="fl"><span>开始时间:</span><div class="input-append date form_datetime dataPickerTime"><input size="10", type="text", name="beginTimeArray" value="' + val.beginTime + '" readOnly />' +
                            '<span class="add-on"><i class="icon-th fa fa-table blue"></i></span></div></div>');
                        html.push('<div class="fl"><span>结束时间:</span><div class="input-append date form_datetime dataPickerTime"><input size="10", type="text", name="endTimeArray" value="' + val.endTime + '" readOnly />' +
                            '<span class="add-on"><i class="icon-th fa fa-table blue"></i></span></div></div></div>');
                    })
                    //是否显示后台确定的时间
                    $.ajax({
                        type: 'Post',
                        url: '/Setting/MainBusiness/IsComplete/Edit',
                        dataType: 'json',
                        data:{
                            sn:sn
                        },
                        success: function (data) {
                            if(data.success==true){
                                //后台确定的时间
                                $.ajax({
                                    type: 'GET',
                                    url: '/Mettingroom/UserMeetingroomVerify/UserMeetingroom/Edit/' + id,
                                    dataType: 'json',
                                    success: function (data) {
                                        html.push('<p>后台最后确定的时间:</p>');
                                        $.each(data,function(ind,val) {
                                            var str = data[ind].applyDate.substr(0,10).split('-');
                                            str = str.join('/');
                                            html.push('<div class="time clearfix bg_gray1"><div class="fl"><span>日期:</span><div class="input-append date form_datetime dataPickerDay"><input size="14", type="text", name="dateTimeArray" value="' + str + '" readOnly />' +
                                                '<span class="add-on"><i class="icon-th fa fa-table blue"></i></span></div></div>');
                                            html.push('<div class="fl"><span>开始时间:</span><div class="input-append date form_datetime dataPickerTime"><input size="10", type="text", name="beginTimeArray" value="' + val.beginTime + '" readOnly />' +
                                                '<span class="add-on"><i class="icon-th fa fa-table blue"></i></span></div></div>');
                                            html.push('<div class="fl"><span>结束时间:</span><div class="input-append date form_datetime dataPickerTime"><input size="10", type="text", name="endTimeArray" value="' + val.endTime + '" readOnly />' +
                                                '<span class="add-on"><i class="icon-th fa fa-table blue"></i></span></div></div></div>');
                                            $('#cont').append(html.join(''))
                                        })
                                    }
                                })
                            }else{
                                $('#cont').append(html.join(''))
                            }
                        }
                    })

                    //设备
                    var html1=[];
                    var data1=data[0].mettingroom;
                    if(data1.projector==0){
                        $('input[name="projector"]').parent().hide();
                    }
                    if(data1.microphone==0){
                        $('input[name="microphone"]').parent().hide();
                    }
                    if(data1.vsx==0){
                        $('input[name="vsx"]').parent().hide();
                    }
                    if(data1.projector==0&&data1.microphone==0&&data1.vsx==0){
                        html1.push('暂无设备可用！')
                    }
                    $('#cont1').append(html1.join(''));
                    $('input').attr('readonly',true);
                    $('textarea').attr('readonly',true);
                    $('button').attr('disabled','disabled');
                    $('#mustRead').attr('checked','checked');
                    $('#notice').hide();
                    $('.read').hide();
                }
            })
            $('input[name=teaReak]').attr('disabled','disabled')
            $('input[type=checkbox]').attr('disabled','disabled')

            //评价
            getCommentInfo(id,'userMeetingroom');
        }else{
            checkInfo();
            var objectid=queryString("objectid")
            var name=queryString("name")
            //获取个人信息
            getUserInfo(function(user){
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
                $("input[name='meetingRoomName']").val(name);
                $("input[name='meetingroomId']").val(objectid);
            })

            if(objectid!=undefined){
                //须知
                var device;
                $.ajax({
                    type: 'GET',
                    url: ' /Mettingroom/Mettingroom/Edit/'+objectid,
                    dataType: 'json',
                    async: false,
                    success: function (result) {
                        $("#notice").html(result.readme);
                        device=result;
                        if(result.isRead==-1){
                            $('.read').remove();
                        }
                    }
                });

                $("input[type='checkbox']").click(function () {
                    if ($(this).is(':checked') == true) {
                        $(this).val(1);
                    } else {
                        $(this).val(-1);
                    }
                })
                //设备
                var html=[];
                if(device.projector!=1){
                    $('input[name="projector"]').parent().hide();
                }
                if(device.microphone!=1){
                    $('input[name="microphone"]').parent().hide();
                }
                if(device.vsx!=1){
                    $('input[name="vsx"]').parent().hide();
                }
                if(device.projector==0&&device.microphone==0&&device.vsx==0){
                    html.push('暂无设备可用！');
                }
                $('#cont1').append(html.join(''));

                $("#form").on('click', 'input[type=checkbox]',function(){
                    if ($(this).is(':checked') == true) {
                        $(this).val(1);
                    } else {
                        $(this).val(-1);
                    }
                })
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
            }
            //添加茶歇标准
            $("input[name='teaReakMoney']").val("0");
            $('input[name=teaReak]').change(function(){

                if($('input[name=teaReak]')[0].checked==true){
                    $("input[name='teaReakMoney']").val('0');
                    $('#teaReak').show();
                }else{
                    $("input[name='teaReakMoney']").val("0");
                    $('#teaReak').hide();
                }
                $('#form').data('bootstrapValidator').updateStatus('teaReakMoney','NOT_VALIDATED');
            })
            //主动添加当天日期
            var data=new Date();
            var mouse=(data.getMonth()+1)<9?'0'+(data.getMonth()+1):(data.getMonth()+1);
            var day=data.getDate()<9?'0'+data.getDate():data.getDate()
            $("input[name='dateTimeArray']").val(data.getFullYear()+'/'+mouse+'/'+day );
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
                company:{
                    validators: {
                        notEmpty: {
                            message: '公司名称不能为空'
                        },
                        stringLength: {
                            min: 0,
                            max: 50,
                            message: '限50字以内'
                        }
                    }
                },
                phone:{
                    validators: {
                        notEmpty: {
                            message: '联系方式不能为空'
                        }
                    }
                },
                peoples: {
                    validators: {
                        notEmpty: {
                            message: '参会人数不能为空'
                        },
                        callback:{
                            message:"参会人数需为0～1000内的整数值",
                            callback:function(value,vlidator){
                                var num = parseInt(value);
                                return (num > 0 && num <= 1000) && (num == value)
                            }
                        }

                    }
                },
                company: {
                    validators: {
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
                        regexp: {
                            regexp: /^[0-9]{11}$/,
                            message: '请输入11位手机号'
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
                        regexp: {
                            regexp:/^([0]|([1-9][0-9]{0,3})|[1][0]{4})$/,
                            message:  '茶歇标准请输入0~10000的整数'
                        },
                        callback:{
                            message: '茶歇人均标准不能为空',
                            callback:function(fieldvalue,validator){
                                    if (($('input[name=teaReak]')[0].checked == true && fieldvalue != '') || ($('input[name=teaReak]')[0].checked == false)) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                            }
                        }
                    }
                }
            }
            $("#form").attr('action','/Mettingroom/UserMeetingroom/Add')
            // 初始化表单验证
            initBootstrapValidator(validatorFields,{
                end:function(result){
                    $('button.submit').attr('disabled','disabled');
                    if(result.success == true){
                        setTimeout(function(){
                            window.location.href = '/web/myWiz.html';
                        },3000)
                    }
                }
            });
            //新增时，读取所有教室id
            getCompanys($("#meetingroomId"));
            //获取所有培训项目id
            function getCompanys(selector, id) {
                $.ajax({
                    type: "GET",
                    url: "/Classroom/Classroom/Enable/List/0/0",
                    dataType: 'json',
                    success: function (data) {

                        var target = $("#meetingroomId");
                        $(data.result).each(function (ind, val) {
                            target.append('<option value="' + val.objectid + '">' + val.name + '</option>');
                        })
                    }
                })
            }
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
        }
    })
})
