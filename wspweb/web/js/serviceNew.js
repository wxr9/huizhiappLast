/**
 * Created by Administrator on 2016/5/10.
 */
require(['jquery', 'bootstrap','nicescroll','pm'], function(){
    //动画
    $(function() {
        //checkInfo();
        var isPropertyRepairEnable = false; // 物业报修是否处于有效期
        var isITRepairEnable = false; // IT报修是否处于有效期
        var isBind=false;//IT报修是否绑定企业
        var mssssg = "";
        var baseEnable;//IT报修是否停止服务
        var baseEnableWY;
        //申请物业报修

        //判断物业报修是否停止
        $.ajax({
            type: 'GET',
            url: '/Setting/SettingRepairComment/Edit/1',
            //dataType: 'json',
            async: false,
            success: function (result) {
                baseEnableWY=result.baseEnable;
            }
        });
        // if(baseEnableWY==1){
        //     $('#decideWY').click(function () {
        //         //如果非有效时间，弹出提示
        //         $.ajax({
        //             type: 'GET',
        //             url: '/Setting/CheerDay/IsRepairEnable/1',
        //             //dataType: 'json',
        //             async: false,
        //             success: function (result) {
        //                 mssssg = result.msg;
        //                 if (result.success) {
        //                     $('#decideWY').attr('href','/web/applyForPropertyRepair.html');
        //                     document.getElementById("decideWY").click();
        //                 }else{
        //                     showAlert('非工作时间不能申请物业报修')
        //                 }
        //             }
        //         });
        //     });
        // }else{
        //     $('#decideWY').parent().remove();
        // }
        //申请IT网络报修
        //如果非有效时间，弹出提示

        // //判断IT报修是否停止
        // $.ajax({
        //     type: 'GET',
        //     url: '/Setting/SettingRepairComment/Edit/2',
        //     //dataType: 'json',
        //     async: false,
        //     success: function (result) {
        //         baseEnable=result.baseEnable;
        //     }
        // });
        // if(baseEnable==1){
        //     $('#decideIT').click(function () {
        //         //是否是企业用户，进入IT报修页面
        //         $.ajax({
        //             url:'/Setting/User/IsBindEnterprise',
        //             //dataType:'json',
        //             async: false,
        //             success:function(result){
        //                 if(result.msg=='已绑定'){
        //                     isBind=true;
        //                 }else if(result.msg=='审核中'){
        //                     showAlert('您绑定的企业正在审核中！');
        //                 }else{
        //                     showAlert('您尚未绑定企业！');
        //                 }
        //             }
        //         })
        //         //获取IT报修是否处于申请有效期
        //         $.ajax({
        //             type: 'GET',
        //             url: '/Setting/CheerDay/IsRepairEnable/2',
        //             //dataType: 'json',
        //             async: false,
        //             success: function (result) {
        //                 mssssg = result.msg;
        //                 if (result.success) {
        //                     isITRepairEnable = true;
        //                 }else{
        //                     showAlert('非工作时间不能申请IT报修')
        //                 }
        //             }
        //         });
        //         if(isBind==true&&isITRepairEnable == true){
        //             $('#decideIT').attr('href','/web/applyForITRepair.html');
        //             document.getElementById("decideIT").click();
        //         }
        //     });
        //
        // }else{
        //     $('#decideIT').parent().remove();
        // }


        $('.simplefilter').on('click','li', function(){
            var filter = $(this).attr('data-filter');
            $(this).addClass('active').siblings().removeClass('active');
            $('.filter-item').each(function(ind,val){
                var self = $(this);
                if(filter === 'all'){
                    self.show(500);
                    return true;
                }
                if(self.attr('data-category') !== filter){
                    self.hide(500);
                }else{
                    self.show(500);
                }
            })
        });
        $('.filter-search').on('input', function(e){
            var inputVal = this.value;
            $('.item-desc').each(function(){
                var self= $(this);
                var val = self.html();
                var par = self.parent().parent();
                if(val.indexOf(inputVal) == -1){
                    par.hide(500);
                }else{
                    par.show(500);
                }
            });
        });

        $('#card').bind('click',function(){
            if($('#loginStatus').attr('loginstatus')){
                $(this).attr('href','/web/user/cardDetail.html')
            }else{
                checkInfo();
            }
        })
    });
});