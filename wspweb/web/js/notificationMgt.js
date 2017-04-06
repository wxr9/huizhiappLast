require(['jquery','datatables','pm', 'bootstrap','pagination'], function() {
    //通知
    checkMust();
    function getNoticeTemp(data) {
        var len = data.length;
        var content = [];
        var flag;
        for (var i = 0; i < len; i++) {
            var re = data[i];
            content.push('<div class="alert alert-dismissable respond" id=' + re.objectid + '>');
            content.push('<button class="close mr20" type="button"><span class="ft20">&times;</span></button>');
            if(data[i].readStatus==1){ //1 not read; 2 readed;
                content.push('<h5 class="jiacu" readstatus='+data[i].readStatus+'>' + re.title + '</h5>');
                content.push('<span class="disline">' + re.createTime + '</span>');
                content.push('<div class="respondDetail" style="display:none;"><p class="respondContent">'+ re.content + '</p></div>');
            }else{
                content.push('<h5 readstatus='+data[i].readStatus+'>' + re.title + '</h5>');
                content.push('<span class="disline">' + re.createTime + '</span>');
                content.push('<div class="respondDetail"><p class="respondContent">'+ re.content + '</p></div>');
            }

            content.push('</div>')
        }
        return content.join('');
    }

    var initNoticePagination = function () {
        $.ajax({
            type: 'GET',
            url: '/Notification/1/10?timer='+new Date().getTime(),
            dataType: 'json',
            async: true,
            success: function (data) {
                // 创建分页
                if (data.result.length > 0) {
                    var num_entries = data.total;
                    var page_index = 0;
                    var init_flag = false;
                    if (page_index == 0 && !init_flag && data.result != "") {
                        $("#noticePagination").pagination(num_entries, {
                            num_edge_entries: 1, //边缘页数
                            num_display_entries: 4, //主体页数
                            callback: pageselectCallback,
                            items_per_page: 10, //每页显示1项
                            prev_text: "«",
                            next_text: "»"
                        });
                    }
                }else {
                    $('#noticeContent').empty().append(
                        "<div class='empty-tip'>暂无通知!</div>")
                }
                function pageselectCallback(page_index, panel) {
                    if(page_index == 0 && !init_flag){
                        init_flag = true;
                        $('#noticeContent').empty().append(getNoticeTemp(data.result));
                    }else
                        getListDate(page_index + 1, 10);
                    return false;
                }

            },
            error: function (data) {

            }
        });



        function getListDate(page_index, size) {
            $.ajax({
                type: 'GET',
                url: '/Notification/' + page_index  + '/' + size,
                dataType: 'json',
                async: true,
                success: function (data) {
                    if (data.result.length > 0) {
                        $('#noticeContent').empty().append(getNoticeTemp(data.result));
                    } else {
                        $('#noticeContent').empty().append("<div class='empty-tip'>暂无通知!</div>")
                    }
                },
                error: function (data) {

                }
            })
        }

    };

    initNoticePagination();
    //回应列表
    function getRespond(data){
        var len = data.length;
        var content = [];
        for (var i = 0; i < len; i++) {
            var re = data[i]
            content.push('<div class="respond" id=' + re.objectid + '>');
            if(data[i].readStatus==1){
                content.push('<h5 class="jiacu" readstatus='+data[i].readStatus+'>' + re.title + '</h5>');
                content.push('<span>' + re.createTime + '</span>');
                content.push('<div class="respondDetail" style="display:none;"><p class="respondContent">' + re.content + '</p></div>');
            }else{
                content.push('<h5 readstatus='+data[i].readStatus+'>' + re.title + '</h5>');
                content.push('<span>' + re.createTime + '</span>');
                content.push('<div class="respondDetail"><p class="respondContent">' + re.content + '</p></div>');
            }
            content.push('</div>')

        }
        return content.join('');
    }

    $(function(){
        //通知
        $('#noticeContent').on('click','h5', function () {
            var that = $(this);
            var objectid = that.parent().attr('id');
            var readStatus = that.attr('readstatus'); //not read 1; read 2;

            if(readStatus == 1){
                //更新状态
                $.ajax({
                    type: 'GET',
                    url: '/Notification/SetReadStatus/' + objectid,
                    dataType: 'json',
                    success: function (data) {
                        if(data.success){
                            that.attr('readstatus',2);
                            //更新未读条数
                            $.ajax({
                                type: "get",
                                url: "/Notification/GetUnReadCount?timer="+new Date().getTime(),
                                dataType: "json",
                                success: function(data) {
                                    if(data.success){
                                        if(data.msg == 0){
                                            $('#notRead').hide();
                                        }else{
                                            $('#notRead').text(data.msg);
                                        }
                                    }
                                }
                            });
                        }
                    }
                })
                that.removeClass('jiacu');

            }
            that.siblings('.respondDetail').toggle();
        })

        $(document).on('click', '.close', function () {
            var objectId = $(this).parent('.alert').attr('id');
            $.ajax({
                type: 'GET',
                url: '/Notification/Delete/' + objectId,
                dataType: 'json',
                success: function (data) {
                    initNoticePagination();
                }
            })
        });
        //通知未读条数
        $.ajax({
            type: "get",
            url: "/Notification/GetUnReadCount?timer="+new Date().getTime(),
            dataType: "json",
            success: function(data) {
                if(data.success){
                    if(data.msg == 0){
                        $('#notRead').hide();
                    }else{
                        $('#notRead').text(data.msg);
                    }
                }
            }
        });
        //回应未读条数
        $.ajax({
            type: "get",
            url: "/Notification/ReplyList/GetUnReadCount?timer="+new Date().getTime(),
            dataType: "json",
            success: function(data) {
                if(data.success){
                    if(data.msg == 0){
                        $('#notRead1').hide();
                    }else{
                        $('#notRead1').text(data.msg);
                    }
                }
            }
        });
        //
        $('#respond-list').on('click','h5', function () {
            var that = $(this);
            var objectid=$(this).parent().attr('id');
            var readStatus = $(this).attr('readstatus'); //not read 1; read 2;
            if(readStatus == 1){
                //更新状态
                $.ajax({
                    type: 'GET',
                    url: '/Notification/SetReadStatus/' + objectid,
                    dataType: 'json',
                    success: function (data) {
                        if(data.success){
                            that.attr('readstatus',2);
                            //更新未读条数
                            $.ajax({
                                type: "get",
                                url: "/Notification/ReplyList/GetUnReadCount?timer="+new Date().getTime(),
                                dataType: "json",
                                success: function(data) {
                                    if(data.success){
                                        if(data.msg == 0){
                                            $('#notRead1').hide();
                                        }else{
                                            $('#notRead1').text(data.msg);
                                        }
                                    }

                                }
                            });
                        }

                    }
                })
                $(this).removeClass('jiacu');

            }
            $(this).siblings('.respondDetail').toggle();
        })
    })

    var initRespondPagination = function () {
        $.ajax({
            type: 'GET',
            url: '/Notification/ReplyList/1/10',
            dataType: 'json',
            async: true,
            success: function (data) {
                // 创建分页
                if (data.result.length > 0) {
                    var num_entries = data.total;
                    var page_index = 0;
                    var init_flag = false;
                    if(page_index == 0 && !init_flag) {
                        $("#pagination").pagination(num_entries, {
                            num_edge_entries: 1, //边缘页数
                            num_display_entries: 4, //主体页数
                            callback: pageselectCallback,
                            items_per_page: 10, //每页显示1项
                            prev_text: "«",
                            next_text: "»"
                        });
                    }
                }else{
                    $('#respond-list').empty().append("<div class='empty-tip'>暂无回应!</div>");
                }
                function pageselectCallback(page_index, panel) {
                    if(page_index == 0 && !init_flag){
                        init_flag = true;
                        $('#respond-list').empty().append(getRespond(data.result));
                    }else
                        getListDate(page_index + 1, 10);
                    return false;
                }
            },
            error: function (data) {

            }
        });

        function getListDate(page_index, size) {
            $.ajax({
                type: 'GET',
                url: '/Notification/ReplyList/' + page_index + '/' + size,
                dataType: 'json',
                async: true,
                success: function (data) {
                    if (data.result.length > 0) {
                        $('#respond-list').empty().append(getRespond(data.result));
                    } else {
                        $('#respond-list').empty().append(
                            "<div class='empty-tip'>暂无回应!</div>")
                    }
                },
                error: function (data) {

                }
            })
        }

    };
    initRespondPagination();
});


