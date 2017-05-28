var crypto = require('crypto');
var NewAjax = require("../ajax/newAjax");
import { notification, Button} from 'antd';

var DogLin = {
		leftBackImg:"http://ppe.oss-cn-shenzhen.aliyuncs.com/collections/43/1/thumb.jpg",//左边菜单图片地址
		defaultHead:"http://ppe.oss-cn-shenzhen.aliyuncs.com/collections/42/4/thumb.jpg",//默认头像地址
		Varietys:["思想", "生活", "财经", "时事"],
		getSalt:function(){
		var a='zxcvbnmasdfghjklqwertyuiop1234567890';
		var salt = '';
		for(var i = 0 ; i<16;i++){
			var index = Math.floor(Math.random() * a.length);
			salt += a[index];
		}
		return salt;
		},
		getMd5:function(pass,salt){
			var md5 = crypto.createHash('md5');
			if(!salt){
				return md5.update(pass).digest('hex');
			}
			return md5.update(pass).digest('hex')+salt;
		},
		Notify:function(option){
			const openNotificationWithIcon = (type) => {
			  notification[type]({
			    message: option.message|| "忘记起标题了...",
			    description: option.des||'忘记写描述了',
			  });
			};
			openNotificationWithIcon(option.type||"error");
		},
		ifLogin:function(call1,call2){
			if(!DogLin.userInfo){
				if(call1){
					call1();
				}else{
					DogLin.showLogin();					
				}
			}else{
				call2();
			}
		}
	};
var all = {
	init:function(){
		window.DogLin = DogLin;
		NewAjax.findAllVariety().then(function(result){
			if(result.success){
				window.DogLin.Varietys = result.data;
			}
			
		});
	}
	
}

module.exports = all;