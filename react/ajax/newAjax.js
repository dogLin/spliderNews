import $ from 'jquery';

 var doGet = function(url){
 	return new Promise(function(rej,res){
 		$.ajax({
 			url:url,
 			type:'GET',
 			dataType:'json',
 			success:function(data){
 				rej(data);
 			},
 			error:function(req){
 				res(req);
 			}
 		});
 	});
 }

 var doPost = function(url,data){
 	return new Promise(function(rej,res){
 		$.ajax({
 			url:url,
 			type:'POST',
 			dataType:'json',
 			data:data,
 			success:function(result){
 				rej(result);
 			},
 			error:function(req){
 				res(req);
 			}
 		});
 	});
 }

module.exports={
	getNewById:function(id,callback){
		doGet('/api/news/'+id).then(callback);
	},
	showNewsByPage:function(pageNum,type,callback){
		if(!type){
			doGet('/api/all?page='+pageNum).then(callback);
		}else{
			doGet('/api/all?page='+pageNum+"&type="+type).then(callback);
		}
	},
	reg:function(user,call){
		doPost("/api/reg",user).then(call);
	},
	ifUserNameExist:function(userName,call){
		doGet('/api/user/ifUserNameExist?userName='+userName).then(call);
	},
	ifEmailExist:function(email,call){
		doGet('/api/user/ifEmailExist?email='+email).then(call);
	},
	login:function(user){
		return doPost("/api/login",user);
	},
	ifLogin:function(){
		return doGet("/api/ifLogin");
	},
	logOff:function(){
		return doGet("/api/logOff")
	},
	updateUser:function(user){
		return doPost("/api/user/updateUser",user);
	},
	addComment:function(comment){
		return doPost('/api/news/addComment',comment);
	},
	ifLike:function(newId,userId){
		return doGet("/api/ifLike?newId="+newId+"&userId="+userId);
	},
	likeNew:function(newId,userId){
		return doGet("/api/likeNew?newId="+newId+"&userId="+userId);
	},
	removeLike:function(newId,userId){
		return doGet("/api/removeLike?newId="+newId+"&userId="+userId);
	},
	ifDisLike:function(newId,userId){
		return doGet("/api/ifDisLike?newId="+newId+"&userId="+userId);
	},
	disLikeNew:function(newId,userId){
		return doGet("/api/disLikeNew?newId="+newId+"&userId="+userId);
	},
	removeDisLike:function(newId,userId){
		return doGet("/api/removeLike?newId="+newId+"&userId="+userId);
	},
	findAllVariety:function(){
		return doGet('/api/findAllVariety');
	},
	findFollowTag:function(userId){
		return doGet('/api/findFollowTag?userId='+userId);
	},
	addFollowTag:function(userId,tag){
		return doGet('/api/addFollowTag?userId='+userId+"&tag="+tag);
	},
	removeTag:function(userId,tag){
		return doGet('/api/removeTag?userId='+userId+"&tag="+tag);
	},
	getAllNews:function(){
		return doGet('/api/getAllNews');
	},
	deleteNewById:function(id){
		return doGet("/api/deleteNewById?id="+id);
	},
	getNewByName:function(name){
		return doGet('/api/getNewByName?name='+name);
	},
	getLikes:function(){
		return doGet("/api/getLikes");
	},
	getCommentNews:function(){
		return doGet("/api/getCommentNews");
	}
	

}