var User = require("../model/user");
// var tool = require("../util/tool");
var UserCtl = {
	reg:function(req,res){
		var user = new User({
			userName:req.body.userName,
			pass:req.body.pass,
			salt:req.body.salt,
			email:req.body.email
		});
		user.save(function(err,result){
			if(err){
				res.json({result:false,message:'注册数据持久化失败',code:500});
			}
			res.json({result:true,message:'持久化成功'});
			console.log("持久化完成！");
		})
	},
	ifUserNameExist:function(req,res){
		User.find({userName:req.query.userName},function(err,result){
			if(err){
				res.json({error:true,message:"数据库异常！"});
			}
			if(result.length > 0){
				res.json({result:false,message:'用户名已存在！'});
			}else{
				res.json({result:true,message:"该用户名可用！"});
			}
		});
	},
	ifEmailExist:function(req,res){
		User.find({email:req.query.email},function(err,result){
			if(err){
				res.json({error:true,message:"数据库异常！"});
			}
			if(result.length > 0){
				res.json({result:false,message:'邮箱已存在！'});
			}else{
				res.json({result:true,message:"该邮箱可用！"});
			}
		})
	},
	login:function(req,res){
		User.find({userName:req.body.userName},function(err,result){
			if(err){
				res.json({err:true,message:'数据库异常'});
			}
			if(result.length = 1){
				console.log(req.body.pass+result[0].salt)
				if(req.body.pass+result[0].salt == result[0].pass){
					var ifFirtLogin = result[0].ifFirtLogin;
					if(ifFirtLogin){
						User.update({userName:req.body.userName},{ifFirtLogin:false},function(err,result){
							if(err){console.log(err)}
							console.log('更新')
						});
					}
					req.session.user = result[0];
					res.json({result:true,ifFirtLogin:ifFirtLogin,user:result[0]});
				}else{
					res.json({result:false,message:"密码错误"});
				}
			}else{
				res.json({result:false,message:"账号错误"});
			}
		});
	},
	ifLogin:function(req,res){
		if(req.session&& req.session.user){
			res.json({result:true,user:req.session.user});
		}else{
			res.json({result:false});
		}
	},
	logOff:function(req,res){
		req.session.user = undefined;
		res.json({result:true});
	},
	updateUser:function(req,res){
		var user = req.body;
		console.log(user.sex);
		console.log(user);
		User.findOneAndUpdate({_id:user._id},user,function(err,result){
			if(err){res.json({success:false})}
			User.findOne({_id:user._id},function(err,result){
				if(err){console.log(err)};
				req.session.user = result;
				res.json({success:true});
			})	
			
		})
	},
	changeHead:function(req,res){
		var url = req.file.path.split("\\");
		url.shift();
		url = "\\"+url.join("\\");
		User.update({_id:req.params.id},{headPic:url},function(err,result){
			if(err){console.log(err)}
			User.findOne({_id:req.params.id},function(err,result){
				if(err){console.log(err)};
				req.session.user = result;
				res.json({url:url});
			})
		})
	},
	findFollowTag:function(req,res){
		User.find({_id:req.query.userId},function(err,result){
			if(err){
				console.log(err);
				res.json({success:false,message:err});
			}else{
				res.json({success:true,data:result});
			}
		});
	},
	addFollowTag:function(req,res){
		User.update({_id:req.query.userId},{"$addToSet":{followTag:req.query.tag}})
			.exec(function(err,doc){
				if(err){ 
					console.log(err);
					res.json({success:false,message:"服务器异常"});
				}else{
					User.findOne({_id:req.query.userId})
						.exec(function(err,result){
							req.session.user = result;
							console.log(req.session.user);
							res.json({success:true});
					})
				}
			})
	},
	removeTag:function(req,res){
		User.update({_id:req.query.userId},{"$pull":{followTag:req.query.tag}})
			.exec(function(err,doc){
				if(err){ 
					console.log(err);
					res.json({success:false,message:"服务器异常"});
				}else{
					// res.json({success:true});
					// console.log(doc);
					User.findOne({_id:req.query.userId})
						.exec(function(err,result){
							req.session.user = result;
							console.log(req.session.user);
							res.json({success:true});
						})
				}
			})
	}
}

module.exports = UserCtl;
