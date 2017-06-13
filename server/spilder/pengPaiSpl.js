var superagent = require('superagent');
var cheerio = require("cheerio");
var eventproxy = require("eventproxy");
var async = require("async");
var tool = require("./tool");
var News = require("../model/news");

var ep = new eventproxy();

var pengPaiUrl = "http://www.thepaper.cn/";
var phoneUrl = "http://m.thepaper.cn/";

var politicsIds = "25462,25488,25489,25490,25423,25426,25424,25463,25491,25428,25464,25425,25429,25481,25430,25678,25427,25422,25487,25634,25635,25600,"
var financeIds = "25434,25436,25433,25438,25435,25437,27234,25485,25432,";
var thoughtIds = "25444,27224,26525,26878,25483,25457,25574,25455,26937,25450,25482,25445,25456,25446,25536,26506,";
var lifeIds = "25448,26609,25942,26015,25599,25842,26862,25769,25990,26173,26202,26404,26490,26491";
var pageArray = [];
for(var i = 1;i<=1000;i++){
	pageArray.push(i);
}
function getUrl(ids){
	return pengPaiUrl+"load_index.jsp?nodeids="+ids+"&pageidx=";
}


var PoliticsUrl = getUrl(politicsIds); //时事
var FianceUrl = getUrl(financeIds);  //财经
var ThoughtUrl = getUrl(thoughtIds);  //思想
var LifeUrl = getUrl(lifeIds);    //生活
var JiKeUrl = "http://www.geekpark.net/articles_list?page="; //极客
var BeginDate = new Date();
var EndDate;

function doError(err,url,res){
	console.log(err+url);
	console.log(url+"===>Error Info:=======> ");
	console.log(res);
}
function filterByTime(news,beginDate,endDate,callback){
	console.log("beginDate"+beginDate.toLocaleString())
		if(!beginDate){
			beginDate = BeginDate;
		}
		console.log("+++"+news.date);
		if(news.date >= new Date(beginDate)  ){
			console.log("....."+news.date);
			callback("时间比参数beginDate大"+news.date.toLocaleString() + " // " + beginDate.toLocaleString());
		}else if(new Date(news.date) <= new Date(endDate) ){
			console.log("______________________");
			callback(news.title + news.date.toLocaleString());
		}else{
			console.log(news.date.toLocaleString()+news.title);
			callback(null,news);
		}
}

function getPengPai(url,variety,call,beginDate,endDate){
	console.log("url"+url);
		superagent.get(url)
		.end(function(err,res){
			if(err){
				doError(err,url,res);
			}
			if(res && res.text){
				var $ = cheerio.load(res.text);
				async.mapLimit($(".news_li"),5,function(element,callback){
					var element = $(element);
					var news = new News();
					// var news = {};
					news.variety = variety;
					news.title = $(element.find("a")[1]).text();
					news.imgSrc = element.find("img").attr("src");
					news.des = element.find("p").text();
					news.tag = $(element.find("a")[2]).text();
					news.url = pengPaiUrl+$(element.find("a")[0]).attr("href");
					var url = phoneUrl+$(element.find("a")[0]).attr("href");
					if(element.find('.p_time').length == 1){
						news.ifVideo = true;
						news.video = {};
						news.video.videoTime = element.find('.p_time').text();

					}
					if(element.find(".newAtlas").text()){
						url = pengPaiUrl+$(element.find("a")[0]).attr("href");+"#p1";
					}
					superagent.get(url)
						.end(function(err,res){
							if(err) doError(err,url,res);
							if(res && res.text){
								var $ = cheerio.load(res.text);
								if(news.ifVideo){
									news.video.videoSrc = $('source').attr('src');
									news.video.des = $(".news_video_name").text();
								}
								var date = $($(".about_news")[1]).text().trim() || $(".picct_time").text();
								news.date = new Date(date.split("\n\n")[0].trim());
								news.content = tool.decode($(".news_part").html());
								news.zan = parseInt($("#news_praise").text().trim());
								news.pinL = parseInt($('font').text().split(/[()]/)[1]);
								// if(new Date(news.date) >= new Date(beginDate)  ){
								// 	callback("时间比参数beginDate大"+news.date.toLocaleString());
								// }else if(new Date(news.date) <= new Date(endDate) ){
								// 	callback(news.title + news.date.toLocaleString());
								// }else{
								// 	console.log(news.date.toLocaleString()+news.title);
								// 	callback(null,news);
								// }
								filterByTime(news,beginDate,endDate,callback);
							}
						})
				},function(err,result){
					if(!err){
						call(null,result);
					}else{
						call(err,result);
					}
				})
			}
		});
}

function getJiKe(url,variety,call,beginDate,endDate){
	superagent.get(url)
		.end(function(err,res){
			console.log(url);
			if(err){
				console.log("出错啦");
				doError(err,url,res);
			}
			if(res && res.text){
				var $ = cheerio.load(res.text);
				async.mapLimit($(".article-item"),5,function(element,callback){
					var element = $(element);
					var news = new News();
					// var news = {};
					news.variety = variety;
					news.title = $(element.find("img")[0]).attr("alt");
					news.imgSrc = $(element.find("img")[0]).attr("data-src");
					console.log(news.imgSrc)
					news.des = element.find("p").text();
					news.tag = $(element.find("a")[1]).text();
					news.url = "http://www.geekpark.net"+$(element.find("a")[0]).attr("href");
					var url = "http://www.geekpark.net"+$(element.find("a")[0]).attr("href");
					superagent.get(url)
						.end(function(err,res){
							if(err) doError(err,url,res);
							if(res && res.text){
								var $ = cheerio.load(res.text);
								news.date = new Date($(".js-relative-time").attr("data-time")*1000);
								news.content = tool.decode($("#article-body").html());
								news.zan = 0;
								news.pinL = 0;
								filterByTime(news,beginDate,endDate,callback);
							}
						})
				},function(err,result){
					if(!err){
						call(null,result);
					}else{
						call(err,result);
					}
				})
			}
		});
}


function get(url,variety,call,beginDate,endDate){
	if(!beginDate){
		beginDate = BeginDate;
	}
	News.findOne({variety:variety}).sort({date:-1})
		.exec(function(err,doc){
			if(err){
				console.log(err)
			}else{
				if(doc.length){
					EndDate = doc.date;
					if(!endDate){
						endDate = EndDate;
					}
				}else{
					if(!endDate){
						endDate = new Date("2017-05-20 00:00");
					}
				}
			}
			// ep.emit("upEndDate");
			if(variety == "极客"){
				console.log(url);
				getJiKe.call(null,url,variety,call,beginDate,endDate); 
			}else{
				getPengPai.call(null,url,variety,call,beginDate,endDate);  
			}
			 
	});
	// if(variety == "极客"){
	// 	ep.after("upEndDate",1,getJiKe.call(url,variety,call)); 
	// }
	// ep.after("upEndDate",1,getPengPai.call(url,variety,call));                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
	
}

var craw = function(type,beginDate,endDate){
	var url = '';
	var variety='';
	switch(type){
		case 1:
			url = PoliticsUrl;
			variety='时事';
			break;
		case 2:
			url = FianceUrl;
			variety='财经';
			break;
		case 3:
			url = ThoughtUrl;
			variety='思想';
			break;
		case 4:
			url = LifeUrl
			variety='生活';
			break;
		case 5:
			url = JiKeUrl
			variety='极客';
			break;
		default:
			break;
	}
	if(url){
		async.mapLimit(pageArray,1,function(data,call){
			get(url+data,variety,call,beginDate,endDate);
		},function(err,result){
			var newList = [];
			console.log(result.length);
			result.map(function(res,index){
				newList = newList.concat(res);
			});
			newList.pop();
			// newList.pop();
			console.log(newList.length);
			console.log(newList[newList.length-1]);
			console.log(err);
			setTimeout(function(){
				News.insertMany(newList,function(err,docs){
					if(err){console.log(err+"===================")}
					console.log(docs.length+"..............")
				})
			},5000);//5秒后持久化
		});
	}else{
		console.log("参数错误");
	}
	
}

// craw(1); //爬时事
// craw(2); //爬财经
// craw(3); //爬思想
// craw(4); //爬生活
// craw(5);  //爬极客
// craw(5,null,new Date("2017-05-20 00:00")); //爬极客

module.exports = craw;