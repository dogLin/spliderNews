var tool = {
	decode:function(text){
		return text&&unescape(text.replace(/&#x/g,"%u").replace(/;/g,'').replace(/%uA0/g,' '));
	}
};
module.exports = tool;
