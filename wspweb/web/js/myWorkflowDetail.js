require(['jquery', 'pm'], function () {
    $(function () {
        //获取url中的参数
        function getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg); //匹配目标参数
            if (r != null) return unescape(r[2]);
            return null; //返回参数值
        }

        //格式化时间,接收一个时间数字或者时间对象,转化成 YY-MM-DD HH:MM:SS 格式
        function formatTime(now){
            if(typeof now != 'object'){
                now = new Date(now.replace(/\-/g,"/"));
            }
            var year = now.getFullYear(),
                month = now.getMonth() > 9 ? now.getMonth() + 1 : '0' + (now.getMonth() + 1),
                day = now.getDate() > 9 ? now.getDate() : '0' + now.getDate(),
                hour = now.getHours() > 9 ? now.getHours() : '0' + now.getHours(),
                minute = now.getMinutes() > 9 ? now.getMinutes() : '0' + now.getMinutes(),
                second = now.getSeconds() > 9 ? now.getSeconds() : '0' + now.getSeconds();
            return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
        }

        var serialNumber = getUrlParam('sn'); //流水号
        var repairId = getUrlParam('repairId'); //报修Id
        var userRepairAssign; //派工信息
        var recorde; //维修信息
        var comment; //评价

        //获取报修基本信息
        $.ajax({
            type: 'GET',
            url: '/UserRepair/Edit/' + repairId,
            dataType: 'json',
            async: true,
            success: function (result) {
                if (result) {
                    if(result.serialNumber.substring(0,2)=='WY'){
                        $('#appointDate').append(result.appointDate);
                    }else if(result.serialNumber.substring(0,2)=='IT'){
                        $('#appointDate').parent().parent().parent().hide();

                    }
                    $('#serialNumber').append( serialNumber);
                    $('#applicant').append(result.applicant);

                    $('#contact').append(result.contact);
                    $('#mobile').append(result.mobile);
                    $('#createDate').append(result.createDate);
                    $('#company').append(result.company);
                    $('#parkId').append(result.park.name);
                    $('#buildingId').append(result.building.name);
                    $('#repairType').append(result.repairTypeDetail.settingDict.name + ' - ' + result.repairTypeDetail.name);
                    $('#address').append(result.address);

                    if (result.photoUrl != '') {
                        var photos = result.photoUrl.split(',');
                        var html = [];
                        photos.map(function(v,i){
                            html.push("<img class='repairImg' src='/"+v+"'>");
                        });
                        $('#photoUrl').empty().append(html.join(''));
                    }else{
                        $('#photoUrl').empty();
                    }
                    $('#description').append(result.description);
                    $('#memo').append(result.memo);
                    if (result.repairTypeConfmDetail != null) {
                        $('#repairTypeConfm').append(result.repairTypeConfmDetail.settingDict.name + ' - ' + result.repairTypeConfmDetail.name);
                    }
                    $('#descriptionConfm').append(result.descriptionConfm);
                    if (result.buildingConfmDetail != null){
                        $('#repairBuilding').append(result.buildingConfmDetail.name)
                    }

                }
            }
        });

        //获取派工信息
        $.ajax({
            type: 'GET',
            url: '/UserRepairAssign/0/0?repairId=' + repairId,
            dataType: 'json',
            async: false,
            success: function (result) {
                if (result.total != 0) {
                    userRepairAssign = result.result[0];
                    //绑定工程师信息
                    // if (userRepairAssign['engineerDetail'] != null) {
                    //     $('#engineerName').append(userRepairAssign['engineerDetail']['name']);
                    //     $('#engineerMobile').append(userRepairAssign['engineerDetail']['mobile']);
                    // }
                    if (userRepairAssign['assignTime'] != null) {
                        $('#assignTime').append(formatTime(userRepairAssign['assignTime']));
                    }
                    if (userRepairAssign['arriveTime'] != null) {
                        $('#arriveTime').append(formatTime(userRepairAssign['arriveTime']));
                    }
                }

            }
        });

        //获取维修信息
        $.ajax({
            type: 'GET',
            url: '/UserRepairRecode/0/0?repairId=' + repairId,
            dataType: 'json',
            async: false,
            success: function (result) {
                console.log(result);
                if (result.total != 0) {
                    var createTime;
                    $.each(result.result, function (index, element) {
                        var data=formatTime(element.createTime).substring(0,10)
                        var time=formatTime(element.createTime).substring(10)
                        //if (element.createTime != null) {
                        //    createTime = formatDate(new Date(element.createTime));
                        //}
                        if (index == 0) {
                            var option = '<li><time class="cbp_tmtime" datetime="' + createTime + '"><span>'  + data+'<br/>'+time+'</span></time><div class="cbp_tmicon"></div><div class="cbp_tmlabel"><p>' + element.memo + '</p></div></li>';
                            $('ul.cbp_tmtimeline').append(option);
                        } else {
                            var option = '<li><time class="cbp_tmtime" datetime="' + createTime + '"><span>'  + data+'<br/>'+time+'</span></time><div class="cbp_tmicon cbp_tmicon-screen"></div><div class="cbp_tmlabel"><p>' + element.memo + '</p></div></li>';
                            $('ul.cbp_tmtimeline').append(option);
                        }
                    });
                }
            }
        });

        //获取评价信息
        if (serialNumber != undefined) {
            $.ajax({
                type: 'GET',
                url: '/Comment/Info/?id='+repairId+'&type=' + serialNumber.substring(0,2),
                dataType: 'json',
                async: false,
                success: function (result) {
                    console.log(result);
                    if (result.msg == "未评价") {
                        $('#comment').append("尚未评价"); //评价内容
                    } else {
                        comment = result;
                        $('#comment').append(comment['content']); //评价内容
                        $('#duration').parent().css('background', 'url(/web/images/duration-' + comment['duration'] + '.png) no-repeat center');
                        $('#duration').append(comment['duration'] + '分'); //响应速度
                        $('#attitude').parent().css('background', 'url(/web/images/attitude-' + comment['attitude'] + '.png) no-repeat center');
                        $('#attitude').append(comment['attitude'] + '分'); //服务态度
                        $('#quality').parent().css('background', 'url(/web/images/quality-' + comment['quality'] + '.png) no-repeat center');
                        $('#quality').append(comment['quality'] + '分'); //服务质量
                    }
                }
            });
        }
    })
})
