require(['jquery', 'hideseek','pm'], function () {
    $(function () {
        var enterpriseId; //企业Id
        checkMust();
        //获取所有企业
        $.ajax({
            type: 'GET',
            url: '/Setting/Enterprise/Available/List/0/0',
            dataType: 'json',
            async: false,
            success: function (result) {
                if (result.total > 0) {
                    $.each(result.result, function (index, element) {
                        var option = '<li><div class="col-sm-10"><span>' + element.name + '</span></div><div class="col-sm-2"><a id="' + element.objectid + '" href="#"  data-toggle="modal" data-target="#myModal">申请加入</a></div><div class="col-sm-12"><hr></div></li>';
                        $('.hidden_mode_list').append(option);
                    });
                }
            }
        });

        //初始化hideseek
        $('#search-hidden-mode').hideseek({
            highlight: false,
            hidden_mode: true
        });



        //点击申请加入后弹出模态框
        $('ul[class="hidden_mode_list"] a').click(function () {
            //设置要加入的企业id
            enterpriseId = this.id;

            var temp = $('a[id="' + this.id + '"]').parent().prev().find('span').html();
            $('div[class="modal-body"] p').append('您确认申请加入“' + temp + '”吗？');
        });

        //点击模态框确认按钮后调用绑定企业接口
        $('#confirmEnterprise').click(function () {
            $.ajax({
                type: 'POST',
                url: '/Setting/UserEnterpriseApplyInfo/Add?enterpriseId=' + enterpriseId,
                dataType: 'json',
                async: false,
                success: function (result) {
                    enterpriseId = null;
                    $('#myModal').modal('hide');
                    window.location.href = "/web/user/enterpriseReviewing.html";
                }
            });
        });

        //模态框消失事件
        $('.modal').on('hidden.bs.modal', function (e) {
            //清空模态框内容
            $('div[class="modal-body"] p').html('');
        })
    })
})
