var topics = {};
var subUid = -1;
module.exports = {
	//订阅
	sub:function(topic,fn){
		if(!topics[topic]){
			topics[topic] = [];
		}
		var token = (++subUid).toString();
		topics[topic].push({
			token:token,
			fn:fn
		});
		return token;
	},
	//退订
	unSub:function(token){
		for(var m in topics){
			if(topics[m]){
				for(var i = 0,j = topics[m].length;i<j;i++){
					if(topics[m][i].token === token){
						topics[m].splice(i,1);
						return token;
					}
				}
			}
		}
		return false;
	},
	//发布
	pub:function(topic,args){
		if(!topics[topic]){
			return false;
		}
		var subs = topics[topic];
		subs.map((sub)=>{
			sub.fn(args);
		})

	}

}