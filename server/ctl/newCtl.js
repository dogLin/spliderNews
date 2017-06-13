var News = require("../model/news");
var User = require("../model/user");
var eventproxy = require("eventproxy");
var ep = new eventproxy();
function changeToType(type){
	switch(type){
				case "Politic": type = "时事";break;
				case "Fiance":type = "财经";break;
				case "Thought":type = "思想";break;
				case "Life":type = "生活";break;
				case "Jike":type = "极客";break;
				case "PersonLike":type = "订阅";break;
				case "Video":type = "video";break;
				default:type = null;
			}
	console.log(type);
	return type;
}

var NewsCtl = {
	showNewsByPage:function(req,res){
		var page = req.query.page || 1;
		var type = req.query.type;
		type = changeToType(type);
		var pro;
		if(type == "订阅"){
			User.findOne({_id:req.session.user._id})
				.exec(function(err,doc){
					if(err){
						console.log(err);
						res.json({success:false,message:err});
					}else{
						pro = News.find({variety:{$in:doc.followTag}});
						pro.sort({date:-1})
						.limit(20)
						.skip((page-1)*20)
						.exec(function(err,result){
							if(err){
								console.log(err);
								res.json({success:false,err:err});
							}
							else if(result.length == 0){
								res.json({success:false,message:"到达底部!"})
							}else{
								res.json({success:true,data:result});
							}
						})
					}
				})
		}else if(type == "video"){
			pro = News.find({ifVideo:true});
						pro.sort({date:-1})
						.limit(20)
						.skip((page-1)*20)
						.exec(function(err,result){
							if(err){
								console.log(err);
								res.json({success:false,err:err});
							}
							else if(result.length == 0){
								res.json({success:false,message:"到达底部!"})
							}else{
								res.json({success:true,data:result});
							}
						})
		}else{
			if(type){
				pro = News.find({variety:type});
			}else{
				pro = News.find();
			}
				pro.sort({date:-1})
				.limit(20)
				.skip((page-1)*20)
				.exec(function(err,result){
					if(err){
						console.log(err);
						res.json({success:false,err:err});
					}
					else if(result.length == 0){
						res.json({success:false,message:"到达底部!"})
					}else{
						res.json({success:true,data:result});
					}
				});
		}

		
	},
	getNewById:function(req,res){
		News.find({_id:req.params.id},function(err,news){
			if(err){
				console.log("查询新闻错误！"+err);
			}
			res.json(news);
		})
	},
	addComment:function(req,res){
		// console.log(req.body);
		News.update({_id:req.body.newId},{"$push":{'commentList':req.body}},function(err,news){
			if(err){
				console.log(err);
				res.json({success:false,message:err});
			}else{
				res.json({success:true});
				console.log(news);
			}
		});
	},
	ifLike:function(req,res){
		News.
			findOne({_id:req.query.newId}).
			populate({
				path:'likes',match:{_id:req.query.userId}
			}).
			exec(function(err,doc){
				if(err)
				{ 
					console.log(err);
					res.json({success:false,message:"服务器异常"});
				}
				if(doc.likes.length == 1){
					res.json({success:true});
				}else{
					res.json({success:false});
				}
			})
	},
	likeNew:function(req,res){
		News.update({_id:req.query.newId},{"$addToSet":{likes:req.query.userId}}).
			exec(function(err,doc){
				if(err){ 
					console.log(err);
					res.json({success:false,message:"服务器异常"});
				}else{
					res.json({success:true});
				}
				console.log(doc);
			});
	},
	removeLike:function(req,res){
		News.update({_id:req.query.newId},{"$pull":{likes:req.query.userId}}).
			exec(function(err,doc){
				if(err){ 
					console.log(err);
					res.json({success:false,message:"服务器异常"});
				}else{
					res.json({success:true});
				}
			})
	},
	ifDisLike:function(req,res){
		News.
			findOne({_id:req.query.newId}).
			populate({
				path:'dislikes',match:{_id:req.query.userId}
			}).
			exec(function(err,doc){
				if(err)
				{ 
					console.log(err);
					res.json({success:false,message:"服务器异常"});
				}
				if(doc.dislikes.length == 1){
					res.json({success:true});
				}else{
					res.json({success:false});
				}
			})
	},
	disLikeNew:function(req,res){
		News.update({_id:req.query.newId},{"$addToSet":{dislikes:req.query.userId}}).
			exec(function(err,doc){
				if(err){ 
					console.log(err);
					res.json({success:false,message:"服务器异常"});
				}else{
					res.json({success:true});
				}
				console.log(doc);
			});
	},
	removeDisLike:function(req,res){
		News.update({_id:req.query.newId},{"$pull":{dislikes:req.query.userId}}).
			exec(function(err,doc){
				if(err){ 
					console.log(err);
					res.json({success:false,message:"服务器异常"});
				}else{
					res.json({success:true});
				}
			})
	},
	findAllVariety:function(req,res){
		News.distinct("variety").exec(function(err,result){
			res.json({success:true,data:result});
		})
	},
	findTagByVariety:function(req,res){
		News.distinct("tag",{"variety":"生活"}).exec(function(err,result){
			console.log(result);
		})
	},
	getAllNews:function(req,res){
		News.find().sort({date:-1})
			.exec(function(err,result){
				if(err){ 
					console.log(err);
					res.json({success:false,message:err});
				}else{
					res.json({success:true,data:result});
				}
			})
	},
	deleteNewById:function(req,res){
		News.remove({_id:req.query.id})
			.exec(function(err,doc){
				if(err){ 
					console.log(err);
					res.json({success:false,message:err});
				}else{
					res.json({success:true});
				}
			})
	},
	getNewByName:function(req,res){
		console.log(req.query.name);
		var result= [];
		var keys = req.query.name.split(" ");
		for(var i = 0;i<keys.length;i++){
			if(keys[i]){
				result.push({"title":new RegExp(keys[i])})
			}
		}
		console.log(result);
		News.find({"$or":result})
			.sort({date:-1})
			.exec(function(err,doc){
				if(err){ 
					console.log(err);
					res.json({success:false,message:err});
				}else{
					res.json({success:true,data:doc});
				}

			})
	},

	// getNewByName:function(req,res){
	// 	console.log(req.query.name);
	// 	var result= [];
	// 	var keys = req.query.name.split(" ");
	// 	News.find({title:new RegExp(req.query.name)})
	// 		.sort({date:-1})
	// 		.exec(function(err,doc){
	// 			if(err){ 
	// 				console.log(err);
	// 				res.json({success:false,message:err});
	// 			}else{
	// 				res.json({success:true,data:doc});
	// 			}

	// 		})
	// },
	getLikes:function(req,res){
		News.find({likes:{$elemMatch:{$in:[req.session.user._id]}}})
			.exec(function(err,doc){
				if(err){ 
					console.log(err);
					res.json({success:false,message:err});
				}else{
					res.json({success:true,data:doc});
				}
			})
	},
	getCommentNews:function(req,res){
		News.find({commentList:{$elemMatch:{userId:req.session.user._id}}})
			.exec(function(err,doc){
					if(err){ 
						console.log(err);
						res.json({success:false,message:err});
					}else{
						res.json({success:true,data:doc});
					}
				})
	}

}

module.exports = NewsCtl;