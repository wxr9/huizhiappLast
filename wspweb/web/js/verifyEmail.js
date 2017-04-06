require(['jquery', 'pm'], function () {
    $(function(){
        var email = queryString('email');
        var status = queryString('status');
        var msg = queryString('msg');
        $('.verify-email').html(email);

        if(status == 'true'){
            //验证成功
            $('#successBox').css('display','block');
            $('.verify-title').html(msg);
            count(5,'/web/myWiz.html');

        }else{
            $('#faileBox').css('display','block');
            $('.verify-title').html(msg);
            count(5,'/web/user/bindEmail.html');
        }

        function count(t,url){
            var value = t + "秒后将跳转页面,若未跳转成功可点击按钮直接跳转";
            $('.time').empty().append(value);
            setTimeout(function(){
                t--;
                if(t>0)
                    count(t,url);
                else {
                    $('.time').empty();
                    window.location.href = url;
                    return false;
                }
            },1000)
        }

    })
});

