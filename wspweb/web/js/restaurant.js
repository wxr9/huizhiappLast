/**
 * Created by z on 2016/12/1.
 */
require(['jquery','hls'], function($,Hls){

    if(Hls.isSupported()){
        var url1 = 'http://222.73.202.233:8008/video/01dd46753ef172b2f01fce5d61cc1f5c83572ded.m3u8';
        var url4 = "http://222.73.202.233:8008/video/8fef53f75e68820cd2719bb383b65f251ce9e787.m3u8";
        var url6 = "http://222.73.202.233:8008/video/117fff1575b5bfc4d6b7d39d3187a01dae3baabc.m3u8";

        // init('video', url4);
        init('video5', url1);
        // init('video6', url6);
        function init(id,url){

            $.get(url).done(function(data,textStatus,jqXHR){
                console.log(jqXHR);
                if(jqXHR.status == 200 || jqXHR.status == 304){
                    var video = document.getElementById(id);
                    var hls = new Hls();
                    hls.loadSource(url);
                    hls.attachMedia(video);
                    hls.on(Hls.Events.MANIFEST_PARSED,function() {
                        video.play();
                    });
                }
            }).error(function(){
                setTimeout(function(){
                    window.location.reload();
                },500)
            });

        }

    }

});


