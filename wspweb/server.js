var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer();
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'template'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
function proxyHandle(req,res){
	proxy.web(req,res,{
		target : "http://222.73.203.71:8080/"
	}, function(e){
		console.log(e);
	});
}

app.use(function(request,response, next){
	if(request.headers["x-requested-with"] === "XMLHttpRequest" || request.method === "POST"){
		console.log('--------------------');
		proxyHandle(request, response);
	}else{
		next();
	}
});
app.use(function(req,res,next){
	if(req.path == '/'){
		res.sendfile('./web/index.html')
	}else if(/\/static\/uploads\/images/.test(req.path)){
		proxyHandle(req, res);
	}else{
		next();
	}
})
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;

app.listen(3000);
