define([],function(){
    function doCook(name, val){
        if(val == undefined){
            try{
                return JSON.parse(sessionStorage.getItem(name));
            }catch (e){
            }
            return false;
        }else{
            try{
                sessionStorage.setItem(JSON.stringify(val));
            }catch (e){
            }
        }
    }

    function getInfo(fn){
        var userInfo = doCook('userInfo');
        if(userInfo == false){
            getUrl();
            return;
        }
        var lastQuery =userInfo.createTime - new Date().getTime();
        if(lastQuery<1800e3){
            delete user.createTime;
            fn(userInfo)
        }else{
            getUrl();
        }

        function getUrl(){
            $.ajax({
                url: '/Setting/User/MyInfo',
                success: function(data){
                    var user = data;
                    user.createTime = new Date();
                    doCook('userInfo',JSON.stringify(user));
                    getInfo(fn);
                }
            })
        }
    }

    exports.getInfo = {}
})