require.config({
    baseUrl: "/",
    waitSeconds: 0,
    paths: {
        echarts: '/admin/js/echarts/',
        workflow:'/admin/js/workflowUtil',
        fullpage: '/lib/js/jquery.fullpage',
        cookie: "./lib/js/jquery.cookie",
        jstree: "./lib/js/jstree.min",
        simplecropper: "./lib/js/simplecropper",
        jquerySrc: "./lib/js/jquery-1.11.1.min",
        jquery: "./lib/js/jqueryHack",
        bootstrap: "./lib/js/bootstrap.min",
        bootstrapvalidator: "./lib/js/bootstrapValidator",
        select2: "./lib/js/select2.min",
        datatables: "./lib/js/jquery.dataTables",
        moment: './lib/js/moment.min',
        ckeditor: './lib/js/ckeditor',
        datepicker: './lib/js/bootstrap-datetimepicker',
        raty: './lib/js/jquery.raty.min',
        datepickercn: './lib/js/local/datepickercn',
        pm: './admin/js/public',
        instantclick: './lib/js/instantclick',
        dropify: './lib/js/dropify',
        cropper: './lib/js/cropper.min',
        canvastoblob: '/lib/js/canvas-to-blob.min',
        nicescroll: './lib/js/jquery.nicescroll.min',
        scrollit: './lib/js/scrollit.min',
        hideseek: './lib/js/jquery.hideseek.min',
        philter: './lib/js/philter.min',
        nprogress: './lib/js/nprogress',
        md5: './lib/js/md5.min',
        jqueryUpload: '/lib/js/jqueryUpload',
        pagination: '/lib/js/jquery.pagination',
        filterizr: '/lib/js/jquery.filterizr',
        carousel: '/lib/js/carousel',
        hls:'/lib/js/hls.min'
    },

    map: {
        '*': {
            'css': './lib/require-css/css' // or whatever the path to require-css is
        }
    },
    shim: {
        workflow:{
            deps:['jquery']
        },
        filterizr: {
            deps: ['jquery']
        },
        fullpage: {
            deps: ['css!./lib/js/jquery.fullpage.min.css', 'jquery']
        },
        simplecropper: {
            deps: ['css!./lib/css/simplecropper.css']
        },
        raty: {
            deps: ['jquery']
        },
        pm: {
            deps: ['css!./lib/css/public.css']
        },
        select2: {
            deps: ['jquery', 'css!./lib/css/select2.css'],
        },
        datepickercn: {
            deps: ['jquery', 'datepicker']
        },
        datepicker: {
            deps: ['bootstrap', 'css!./lib/css/bootstrap-datetimepicker.css']
        },
        bootstrap: {
            deps: ['jquery']
        },
        bootstrapvalidator: {
            deps: ['jquery']
        },
        dropify: {
            deps: ['jquery', 'css!./lib/css/dropify.css']
        },
        cropper: {
            deps: ['css!./lib/css/cropper.min.css','canvastoblob']
        },
        scrollit: {
            deps: ['jquery']
        },
        hideseek: {
            deps: ['jquery']
        },
        jquery: {
            deps: ['jquerySrc']
        },
        philter: {
            deps: ['jquery']
        },
        nprogress: {
            deps: ['css!./lib/css/nprogress.css']
        },
        pagination: {
            deps: ['jquery']
        },
        carousel: {
            deps: ['jquery']
        }
    }
});

