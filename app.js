var express = require("express");
var path = require('path');
var http =require('http');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var NewCtl = require('./server/ctl/newCtl');
var UserCtl = require('./server/ctl/userCtl');
var craw = require('./server/spilder/pengPaiSpl');
var app = express();
var multer = require("multer");
 var storage = multer.diskStorage({
     //设置上传后文件路径，uploads文件夹会自动创建。
        destination: function (req, file, cb) {
            cb(null, './build/uploads')
       }, 
     //给上传文件重命名，获取添加后缀名
      filename: function (req, file, cb) {
          var fileFormat = (file.originalname).split(".");
          cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
      }
 });  
var upload = multer({storage: storage});

app.set('port',process.env.PORT ||3000);

// 设置中间件
app.use(cookieParser());
app.use(session({
	secret:'test dogLin',
	cookie:{maxAge:24*60*60*1000}
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname,'build')));

// app.get('*.js', function (req, res, next) {
//   req.url = req.url + '.gz';
//   res.set('Content-Encoding', 'gzip');
//   console.log(".jsssss");
//   next();
// });

app.get('*', function (request, response,next){
	if(request.url.indexOf('/api') == 0 ){
		next();
	}else{
		response.sendFile(path.resolve(__dirname, 'build', 'index.html'));
	}
  
});

app.get('/api/all/',NewCtl.showNewsByPage);
app.get('/api/news/:id',NewCtl.getNewById);
app.post('/api/reg',UserCtl.reg);
app.get('/api/user/ifUserNameExist',UserCtl.ifUserNameExist);
app.get('/api/user/ifEmailExist',UserCtl.ifEmailExist);
app.post("/api/login",UserCtl.login);
app.get("/api/ifLogin",UserCtl.ifLogin);
app.get("/api/logOff",UserCtl.logOff);
app.post("/api/user/updateUser",UserCtl.updateUser);
app.post("/api/news/addComment",NewCtl.addComment);
app.get("/api/ifLike",NewCtl.ifLike);
app.get("/api/likeNew",NewCtl.likeNew);
app.get("/api/removeLike",NewCtl.removeLike);
app.get("/api/ifDisLike",NewCtl.ifDisLike);
app.get("/api/disLikeNew",NewCtl.disLikeNew);
app.get("/api/findAllVariety",NewCtl.findAllVariety);
app.get("/api/findFollowTag",UserCtl.findFollowTag);
app.get("/api/addFollowTag",UserCtl.addFollowTag);
app.get("/api/removeTag",UserCtl.removeTag);

app.post("/api/removeDisLike",NewCtl.removeDisLike);
app.post("/api/postImg/:id",upload.single('avatar'),UserCtl.changeHead);
app.get("/api/getAllNews",NewCtl.getAllNews);
app.get("/api/deleteNewById",NewCtl.deleteNewById);
app.get("/api/getNewByName",NewCtl.getNewByName);
app.get('/api/getLikes',NewCtl.getLikes);
app.get('/api/getCommentNews',NewCtl.getCommentNews);

// NewCtl.showAll();
app.listen(app.get("port"),function(){
	console.log('Express server listening on port ' + app.get('port'));
  
  setInterval(function(){
    console.log("爬虫开始---------"+new Date().toLocaleString());
    craw(1);
    craw(2);
    craw(3);
    craw(4);
    craw(5);
  },1000*60*60);
  // 定时抓取新闻
});
